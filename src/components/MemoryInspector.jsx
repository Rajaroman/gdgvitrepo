import React, { useState } from 'react';
import { Database, Plus, Search, Layers, ShieldAlert, Sparkles, Trash2 } from 'lucide-react';

export const INITIAL_MEMORY_CHUNKS = [
  {
    id: 'mem-1',
    content: 'Google Gemma 2 architecture incorporates Interleaved Multi-Query Attention (MQA) and Grouped-Query Attention (GQA) for 2.4x inference speedups on consumer hardware.',
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
  const [newChunkCategory, setNewChunkCategory] = useState('Domain Dataset');

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
          <h2 className="text-sm font-bold text-slate-900">Vector & Episodic Memory Store</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <span>Embedding Engine: <span className="text-emerald-700 font-bold">Gemma-Embed-768d</span></span>
          <span className="text-slate-300">|</span>
          <span>Indexed Chunks: <span className="text-blue-700 font-bold">{memoryChunks.length}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Add Memory Chunk Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-blue-600" /> Index New Memory Chunk
          </h3>
          
          <textarea
            value={newChunkText}
            onChange={(e) => setNewChunkText(e.target.value)}
            placeholder="Paste raw text, domain knowledge, or user preferences to vectorize into Gemma memory..."
            rows={4}
            className="w-full glass-input p-3 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-mono resize-none"
          />

          <div className="flex items-center gap-2">
            <select
              value={newChunkCategory}
              onChange={(e) => setNewChunkCategory(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-xl p-2 text-xs focus:outline-none"
            >
              <option value="Domain Dataset">Domain Dataset</option>
              <option value="Agent Specs">Agent Specs</option>
              <option value="User Preference">User Preference</option>
              <option value="System Prompt">System Prompt</option>
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

        {/* Vector Memory Browser */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vectorized memory chunks by keyword or semantic similarity..."
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200 font-bold">
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
