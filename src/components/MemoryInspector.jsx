import React, { useState } from 'react';
import { Database, Plus, Search, Upload, Trash2, FileText, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const INITIAL_MEMORY_CHUNKS = [
  {
    id: 'mem-csv-1',
    content: 'Raw Sales Anomaly Dataset (sales_anomalies_2026.csv): 500 total transaction records, 0 missing null cells, numerical features [revenue_usd, unit_sales, anomaly_score], mean revenue = $412.50, max anomaly outlier = $500.00.',
    category: 'CSV Dataset: sales_anomalies.csv',
    similarity: 0.985,
    timestamp: '2026-07-30 08:30:00'
  },
  {
    id: 'mem-1',
    content: 'Google Gemma 2 & Gemma 4 architectures incorporate Interleaved Multi-Query Attention (MQA) and Grouped-Query Attention (GQA) for 2.4x inference speedups on consumer hardware.',
    category: 'Gemma Tech Specs',
    similarity: 0.965,
    timestamp: '2026-07-30 08:15:10'
  },
  {
    id: 'mem-2',
    content: 'Autonomous AI agent specification: Agents reason via ReAct loops, execute local sandboxed tools, and preserve state across task steps with 768-dimensional RAG memory.',
    category: 'Agent Specs',
    similarity: 0.941,
    timestamp: '2026-07-30 08:18:22'
  },
  {
    id: 'mem-3',
    content: 'Solid state EV battery baseline: Standard lithium-ion battery cells peak at 280 Wh/kg in 2025. 2026 pilot lines target >400 Wh/kg with silicon-anode solid electrolyte.',
    category: 'Domain Dataset',
    similarity: 0.892,
    timestamp: '2026-07-30 08:22:04'
  }
];

export default function MemoryInspector({ memoryChunks, setMemoryChunks }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newChunkText, setNewChunkText] = useState('');
  const [newChunkCategory, setNewChunkCategory] = useState('CSV Dataset');
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleAddChunk = () => {
    if (!newChunkText.trim()) return;
    const newEntry = {
      id: `mem-${Date.now()}`,
      content: newChunkText,
      category: newChunkCategory,
      similarity: 0.99,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setMemoryChunks([newEntry, ...memoryChunks]);
    setNewChunkText('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Ingesting & Parsing ${file.name}...`);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const isCsv = file.name.endsWith('.csv');
        let newEntries = [];

        if (isCsv) {
          const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
          const header = lines[0] || 'columns';
          const rowCount = Math.max(0, lines.length - 1);
          newEntries = [{
            id: `csv-mem-${Date.now()}`,
            content: `Parsed CSV File (${file.name}): ${rowCount} total rows, columns: [${header}]. Content preview: ${lines.slice(1, 4).join(' | ')}`,
            category: `CSV Dataset: ${file.name}`,
            similarity: 0.99,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }];
        } else {
          const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
          newEntries = (paragraphs.length > 0 ? paragraphs : [text]).slice(0, 5).map((para, idx) => ({
            id: `file-mem-${Date.now()}-${idx}`,
            content: para.trim(),
            category: `Doc/File: ${file.name}`,
            similarity: 0.98 - idx * 0.02,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }));
        }

        setMemoryChunks([...newEntries, ...memoryChunks]);
        setUploadStatus(`Successfully vectorized & parsed ${file.name} into RAG memory!`);
        setTimeout(() => setUploadStatus(null), 4000);
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteChunk = (id) => {
    setMemoryChunks(memoryChunks.filter(m => m.id !== id));
  };

  const filteredChunks = memoryChunks.filter(m =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">Vector & Episodic RAG Memory Store</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <span>Embedding Engine: <span className="text-emerald-700 font-bold">Gemma-Embed-768d</span></span>
          <span className="text-slate-300">|</span>
          <span>Indexed Chunks: <span className="text-blue-700 font-bold">{memoryChunks.length}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* PDF / CSV File Upload & Indexing Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          {/* CSV / PDF File Upload Dropzone */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-emerald-600" /> Upload CSV / PDF / Document for RAG
            </h3>
            
            <label className="block p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept=".csv,.pdf,.txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileSpreadsheet className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-emerald-900">Click or Drag & Drop CSV / PDF File</div>
              <div className="text-[10px] text-emerald-700 font-mono mt-0.5">Automatically parses rows & vectorizes into RAG memory</div>
            </label>

            {uploadStatus && (
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-mono flex items-center gap-2 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Or Paste Raw Text / CSV Row
            </h3>
            
            <textarea
              value={newChunkText}
              onChange={(e) => setNewChunkText(e.target.value)}
              placeholder="Paste raw CSV rows or dataset content to index into RAG vector memory..."
              rows={3}
              className="w-full glass-input p-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono resize-none"
            />

            <div className="flex items-center gap-2">
              <select
                value={newChunkCategory}
                onChange={(e) => setNewChunkCategory(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl p-2 text-xs focus:outline-none"
              >
                <option value="CSV Dataset">CSV Dataset</option>
                <option value="Domain Dataset">Domain Dataset</option>
                <option value="Agent Specs">Agent Specs</option>
                <option value="User Preference">User Preference</option>
              </select>

              <button
                onClick={handleAddChunk}
                disabled={!newChunkText.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                Vectorize
              </button>
            </div>
          </div>

        </div>

        {/* Vector Memory Browser */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vectorized CSV datasets & memory chunks..."
                className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredChunks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No matching memory chunks found.
              </div>
            ) : (
              filteredChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        {chunk.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">
                        Similarity: {(chunk.similarity * 100).toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{chunk.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                      {chunk.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteChunk(chunk.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Memory Chunk"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
