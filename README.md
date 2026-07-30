# 🚀 Gemma 4 Studio: Autonomous Multi-Step Reasoning Agent & Fact-Grounded RAG Platform

**Build with Gemma: GDG VIT Chennai AI Buildathon 2026**  
**Selected Track:** Track 1: Agents on a Mission (with Track 4 AI Shield Integration)

---

## 📄 Overview

**Gemma 4 Studio** is a full-stack, enterprise-grade agentic workspace powered by **Google Gemma 4** and a **Python FastAPI backend**. It enables Gemma 4 to autonomously plan, execute tools, retain 768-dimensional RAG vector memory, audit claims for hallucinations, and export session reports as compiled PDFs.

---

## 🛠️ Stack & Architecture

- **Backend**: Python 3.13, FastAPI, Uvicorn, Pandas, PyPDF, ReportLab, SentenceTransformers
- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide Icons
- **LLM Engine**: Gemma 4 via API with native function-calling & structured JSON output (`{"thought": str, "action": str, "action_input": obj}`)
- **Python Subprocess Sandbox**: Restricted execution environment with AST import checker blocking `os`, `sys`, `subprocess`, `socket`, and `shutil`
- **Vector RAG Store**: In-memory dense vector index with ~500 token chunking and 50 token overlap for PDFs, plus Pandas `.describe()` profiling for CSV files
- **PDF Report Exporter**: ReportLab PDF generator compiling session goal, ReAct trajectory, cited sources, per-claim grounding scores, and final answer

---

## 🚀 Running the Project

### 1. Start the Python FastAPI Backend (Port 8000)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*The FastAPI backend will start live on `http://localhost:8000` (Health Check: `http://localhost:8000/api/health`).*

### 2. Start the React Vite Frontend (Port 3000)
```bash
npm install
npm run dev
```
*The frontend will open live at `http://localhost:3000`.*

---

## 🔑 Environment Variables (`.env.example`)

Copy `.env.example` to `.env` to configure API keys:
- `GEMMA_API_KEY`: Google AI Studio API key for Gemma 4 models
- `SERPER_API_KEY` / `TAVILY_API_KEY`: Live web search keys (falls back to DuckDuckGo live search)
- `VITE_BACKEND_URL`: FastAPI backend endpoint URL (`http://localhost:8000/api`)

---

## 📊 Fact-Grounding & Hallucination Mitigation

The Fact-Grounding layer extracts discrete factual claims from the final answer and evaluates each against session sources:
- **Grounded**: 100% of numeric figures and facts verified in RAG memory or tool outputs.
- **Partially Grounded**: General concept supported, but specific figures lack explicit citation.
- **Ungrounded**: Claims or extreme entities missing from session context.

---
*Submitted for Build with Gemma AI Buildathon – GDG VIT Chennai 2026.*
