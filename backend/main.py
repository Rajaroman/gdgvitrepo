import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from sandbox import execute_sandboxed_python
from vector_store import global_vector_store
from tools import tool_run_python, tool_profile_csv, tool_query_documents, tool_web_search
from fact_grounding import evaluate_fact_grounding
from pdf_exporter import generate_session_pdf_report
from agent_engine import run_react_agent_loop

app = FastAPI(
    title="Gemma 4 Agentic Workspace Backend",
    description="Python FastAPI backend powering ReAct agent loops, Python subprocess sandboxing, RAG vector search, live web search, and PDF exports.",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite dev server http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RunAgentRequest(BaseModel):
    user_goal: str
    selected_model: Optional[str] = "gemma-4-9b-it"
    max_steps: Optional[int] = 8

class PythonToolRequest(BaseModel):
    code: str

class ProfileCsvRequest(BaseModel):
    file_id: str

class FactGroundingRequest(BaseModel):
    answer_text: str
    rag_chunks: Optional[List[str]] = []
    search_results: Optional[List[str]] = []
    python_outputs: Optional[List[str]] = []

class ExportPdfRequest(BaseModel):
    user_goal: str
    trajectory: List[Dict[str, Any]]
    rag_sources: Optional[List[Dict[str, Any]]] = []
    fact_grounding: Dict[str, Any]
    final_answer: str
    selected_model: Optional[str] = "gemma-4-9b-it"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Gemma 4 Agentic Workspace API",
        "vector_chunks_indexed": len(global_vector_store.documents),
        "csv_tables_indexed": len(global_vector_store.csv_tables)
    }

@app.post("/api/agent/run")
def run_agent(req: RunAgentRequest):
    if not req.user_goal.strip():
        raise HTTPException(status_code=400, detail="User goal cannot be empty.")
    result = run_react_agent_loop(
        user_goal=req.user_goal,
        selected_model=req.selected_model or "gemma-4-9b-it",
        max_steps=req.max_steps or 8
    )
    return result

@app.post("/api/tools/python")
def run_python_endpoint(req: PythonToolRequest):
    return tool_run_python(req.code)

@app.post("/api/tools/profile-csv")
def profile_csv_endpoint(req: ProfileCsvRequest):
    return tool_profile_csv(req.file_id)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    filename = file.filename or "uploaded_file"
    
    if filename.endswith(".csv"):
        res = global_vector_store.ingest_csv(contents, filename)
    else:
        res = global_vector_store.ingest_pdf(contents, filename)
        
    return res

@app.post("/api/fact-grounding")
def evaluate_grounding_endpoint(req: FactGroundingRequest):
    return evaluate_fact_grounding(
        answer_text=req.answer_text,
        RAG_chunks=req.rag_chunks or [],
        search_results=req.search_results or [],
        python_outputs=req.python_outputs or []
    )

@app.post("/api/export-pdf")
def export_pdf_endpoint(req: ExportPdfRequest):
    pdf_bytes = generate_session_pdf_report(
        user_goal=req.user_goal,
        trajectory=req.trajectory,
        rag_sources=req.rag_sources or [],
        fact_grounding=req.fact_grounding,
        final_answer=req.final_answer,
        selected_model=req.selected_model or "Gemma 4-9B Instruct"
    )
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=Gemma4_Agent_Session_Report.pdf"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
