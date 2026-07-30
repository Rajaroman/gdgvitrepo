import os
import re
import json
import uuid
import math
from typing import List, Dict, Any, Optional

try:
    import pandas as pd
except ImportError:
    pd = None

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

PERSISTENT_MEMORY_FILE = os.path.join(os.path.dirname(__file__), "memory_db.json")

class InMemoryVectorStore:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = [] # [{session_id, file_id, chunk_id, text, metadata, embedding}]
        self.session_summaries: List[Dict[str, Any]] = [] # [{session_id, goal, summary, timestamp, embedding}]
        self.csv_tables: Dict[str, Any] = {} # {file_id: DataFrame}
        self.encoder = None
        self._init_encoder()
        self._load_persistent_memory()

    def _init_encoder(self):
        """Initializes sentence-transformers or fallback TF-IDF vectorizer."""
        try:
            from sentence_transformers import SentenceTransformer
            self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
            print("Loaded SentenceTransformer ('all-MiniLM-L6-v2') for 384d/768d embeddings.")
        except Exception as e:
            print(f"SentenceTransformer not available ({e}). Using normalized word-term vectorizer fallback.")
            self.encoder = None

    def _compute_embedding(self, text: str) -> List[float]:
        if self.encoder:
            return self.encoder.encode(text).tolist()
        
        words = re.findall(r'\w+', text.lower())
        freqMap = {}
        for w in words:
            freqMap[w] = freqMap.get(w, 0) + 1
        
        norm = math.sqrt(sum(v*v for v in freqMap.values())) or 1.0
        return [round(v / norm, 4) for v in list(freqMap.values())[:384]]

    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        if not vec1 or not vec2:
            return 0.0
        min_len = min(len(vec1), len(vec2))
        dot_product = sum(vec1[i] * vec2[i] for i in range(min_len))
        norm1 = math.sqrt(sum(x * x for x in vec1[:min_len])) or 1.0
        norm2 = math.sqrt(sum(x * x for x in vec2[:min_len])) or 1.0
        return dot_product / (norm1 * norm2)

    def _save_persistent_memory(self):
        """Persists cross-session vector embeddings to local JSON file for retrieval across sessions."""
        try:
            data = {
                "documents": self.documents,
                "session_summaries": self.session_summaries
            }
            with open(PERSISTENT_MEMORY_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving persistent memory: {e}")

    def _load_persistent_memory(self):
        """Loads cross-session vector embeddings from local JSON file."""
        if os.path.exists(PERSISTENT_MEMORY_FILE):
            try:
                with open(PERSISTENT_MEMORY_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.documents = data.get("documents", [])
                    self.session_summaries = data.get("session_summaries", [])
                    print(f"Loaded {len(self.documents)} persistent document chunks and {len(self.session_summaries)} cross-session memory summaries.")
            except Exception as e:
                print(f"Error loading persistent memory: {e}")

    def chunk_text(self, text: str, chunk_size_words: int = 400, overlap_words: int = 50) -> List[str]:
        words = text.split()
        if len(words) <= chunk_size_words:
            return [text]
        
        chunks = []
        start = 0
        while start < len(words):
            end = start + chunk_size_words
            chunk = " ".join(words[start:end])
            chunks.append(chunk)
            start += (chunk_size_words - overlap_words)
        return chunks

    def ingest_pdf(self, file_bytes: bytes, filename: str, session_id: str = "default") -> Dict[str, Any]:
        file_id = f"doc_{uuid.uuid4().hex[:8]}"
        extracted_text = ""

        if PdfReader:
            try:
                import io
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    extracted_text += (page.extract_text() or "") + "\n"
            except Exception as e:
                extracted_text = f"Error reading PDF: {str(e)}"
        else:
            extracted_text = file_bytes.decode('utf-8', errors='ignore')

        chunks = self.chunk_text(extracted_text)

        for idx, chunk_text in enumerate(chunks):
            chunk_id = f"{file_id}_c{idx+1}"
            emb = self._compute_embedding(chunk_text)
            doc_entry = {
                "session_id": session_id,
                "file_id": file_id,
                "chunk_id": chunk_id,
                "filename": filename,
                "text": chunk_text,
                "embedding": emb
            }
            self.documents.append(doc_entry)

        self._save_persistent_memory()

        return {
            "file_id": file_id,
            "filename": filename,
            "chunks_count": len(chunks),
            "file_type": "pdf"
        }

    def ingest_csv(self, file_bytes: bytes, filename: str, session_id: str = "default") -> Dict[str, Any]:
        file_id = f"csv_{uuid.uuid4().hex[:8]}"
        import io

        if pd:
            try:
                df = pd.read_csv(io.BytesIO(file_bytes))
                self.csv_tables[file_id] = df
                
                summary_text = f"CSV File '{filename}' (Session: {session_id}): {len(df)} rows, {len(df.columns)} columns: {list(df.columns)}"
                emb = self._compute_embedding(summary_text)
                self.documents.append({
                    "session_id": session_id,
                    "file_id": file_id,
                    "chunk_id": f"{file_id}_summary",
                    "filename": filename,
                    "text": summary_text,
                    "embedding": emb
                })

                self._save_persistent_memory()

                return {
                    "file_id": file_id,
                    "filename": filename,
                    "rows_count": len(df),
                    "columns_count": len(df.columns),
                    "file_type": "csv"
                }
            except Exception as e:
                return {"file_id": file_id, "error": f"Failed to parse CSV: {str(e)}"}
        else:
            return {"file_id": file_id, "error": "Pandas library not installed on server."}

    def save_session_memory(self, session_id: str, goal: str, summary: str):
        """Persists session goal and summary for cross-session memory retrieval."""
        emb = self._compute_embedding(f"Session Goal: {goal} | Summary: {summary}")
        entry = {
            "session_id": session_id,
            "goal": goal,
            "summary": summary,
            "timestamp": pd.Timestamp.now().isoformat() if pd else "2026-07-30",
            "embedding": emb
        }
        self.session_summaries.append(entry)
        self._save_persistent_memory()

    def query_cross_session_memory(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Retrieves prior session summaries keyed by user/session across historical tasks."""
        if not self.session_summaries:
            return []
        
        query_emb = self._compute_embedding(query)
        scored = []
        for s in self.session_summaries:
            sim = self._cosine_similarity(query_emb, s["embedding"])
            scored.append({
                "session_id": s["session_id"],
                "goal": s["goal"],
                "summary": s["summary"],
                "similarity_score": round(sim, 4)
            })
        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:top_k]

    def query_documents(self, query: str, file_id: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.documents:
            return []

        query_emb = self._compute_embedding(query)
        scored = []

        for doc in self.documents:
            if file_id and doc["file_id"] != file_id:
                continue
            sim = self._cosine_similarity(query_emb, doc["embedding"])
            scored.append({
                "chunk_id": doc["chunk_id"],
                "file_id": doc["file_id"],
                "filename": doc["filename"],
                "text": doc["text"],
                "similarity_score": round(sim, 4)
            })

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:top_k]

global_vector_store = InMemoryVectorStore()
