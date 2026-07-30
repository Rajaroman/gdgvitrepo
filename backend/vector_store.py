import os
import re
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

class InMemoryVectorStore:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = [] # [{file_id, chunk_id, text, metadata, embedding}]
        self.csv_tables: Dict[str, Any] = {} # {file_id: DataFrame}
        self.encoder = None
        self._init_encoder()

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
        
        # Word frequency term-vector fallback
        words = re.findall(r'\w+', text.lower())
        freqMap = {}
        for w in words:
            freqMap[w] = freqMap.get(w, 0) + 1
        
        # Normalize pseudo-vector
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

    def chunk_text(self, text: str, chunk_size_words: int = 400, overlap_words: int = 50) -> List[str]:
        """Chunks text into ~500 token blocks with ~50 token overlap."""
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

    def ingest_pdf(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Extracts text from PDF, chunks (~500 tokens, 50 overlap), embeds, and stores in vector index."""
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
        added_chunks = []

        for idx, chunk_text in enumerate(chunks):
            chunk_id = f"{file_id}_c{idx+1}"
            emb = self._compute_embedding(chunk_text)
            doc_entry = {
                "file_id": file_id,
                "chunk_id": chunk_id,
                "filename": filename,
                "text": chunk_text,
                "embedding": emb
            }
            self.documents.append(doc_entry)
            added_chunks.append(doc_entry)

        return {
            "file_id": file_id,
            "filename": filename,
            "chunks_count": len(chunks),
            "file_type": "pdf"
        }

    def ingest_csv(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Stores DataFrame keyed by file_id for profile_csv to use directly."""
        file_id = f"csv_{uuid.uuid4().hex[:8]}"
        import io

        if pd:
            try:
                df = pd.read_csv(io.BytesIO(file_bytes))
                self.csv_tables[file_id] = df
                
                # Also store summary chunk in vector store for semantic queries
                summary_text = f"CSV File '{filename}': {len(df)} rows, {len(df.columns)} columns: {list(df.columns)}"
                emb = self._compute_embedding(summary_text)
                self.documents.append({
                    "file_id": file_id,
                    "chunk_id": f"{file_id}_summary",
                    "filename": filename,
                    "text": summary_text,
                    "embedding": emb
                })

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

    def query_documents(self, query: str, file_id: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Retrieves top-k relevant chunks via cosine similarity."""
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

# Global singleton vector store instance
global_vector_store = InMemoryVectorStore()
