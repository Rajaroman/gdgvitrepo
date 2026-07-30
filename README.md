# 🚀 Gemma 4 Mission Control – Autonomous Agent & Vector RAG Platform

> **Build with Gemma: GDG VIT Chennai AI Buildathon 2026 Submission**  
> **Track 1: Agents on a Mission** (with integrated **Track 4: AI Shield Guardrails**)  
> **Target Model Family:** Google DeepMind Open Model – **Gemma 4** (`gemma-4-9b-it`, `gemma-4-27b-it`)

---

## 🌟 Overview
**Gemma 4 Mission Control** is a production-ready, open-source autonomous agent workspace engineered for **Google DeepMind's Gemma 4**. The application enables Gemma 4 models to perform multi-step ReAct (*Reasoning ➔ Action ➔ Observation ➔ Reflection*) cycles, query local 768-dimensional RAG vector memory stores, invoke sandboxed execution tools, and audit outputs in real time via an Anti-Hallucination Shield.

---

## ✨ Key Features & Technical Innovations

1. **ReAct & RAG Reasoning Control**:
   - Visual chain-of-thought DAG graph detailing Gemma 4 thoughts, parameters, and observations.
   - Throttled step budget control with live confidence scoring.

2. **Vector RAG Memory Engine**:
   - Ingests domain knowledge into 768-dimensional dense vector embeddings.
   - Cosine-similarity retrieval for factual grounding.

3. **Gemma Anti-Hallucination Guardrail Shield**:
   - **Fact-Grounding Cross-Check**: Audits generated statements against RAG memory chunks.
   - **Real-Time Hallucination Auditor**: Emits a 0–100% risk index per output.
   - **Prompt Injection & Sandboxed Execution Defense**.

4. **Multi-Tool Sandbox**:
   - `python_interpreter`: Isolated Python 3 data analysis and Pandas sandbox.
   - `web_search_google`: Live search retrieval tool.
   - `vector_memory_rag`: Semantic vector store query interface.
   - `api_request_json`: Structured REST client.

---

## 🛠️ Quick Start & Installation

```bash
# 1. Clone repository
git clone https://github.com/Rajaroman/gemma-4-mission-control.git
cd gemma-4-mission-control

# 2. Install dependencies
npm install

# 3. Launch local dev server
npm run dev
```

Visit `http://localhost:3000/` in your browser.

---

## 📄 Submission Verification Checklist

- [x] **Kaggle Technical Writeup** (&lt;1,500 words formatted to GDG VIT Chennai rubric)
- [x] **Public Code Repository**
- [x] **Live Demo Prototype**

*Built for GDG VIT Chennai AI Buildathon.*
