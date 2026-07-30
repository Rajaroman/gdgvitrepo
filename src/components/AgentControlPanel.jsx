import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, Code2, Search, Database, Globe, Command, FileSpreadsheet, Paperclip, CheckCircle2 } from 'lucide-react';

export const MISSION_PRESETS = [
  {
    id: 'data-science-automation',
    title: '⚡ Automated Python Data Cleaning & Profiling Pipeline',
    category: 'Multi-Step Data Science',
    prompt: 'Load raw sales anomaly CSV dataset from vector RAG memory, write a Python Pandas script to identify missing values and outliers, execute code in sandbox, calculate summary stats, and format clean output.',
    toolsNeeded: ['vector_memory_rag', 'python_interpreter', 'api_request_json'],
    estimatedSteps: 4
  },
  {
    id: 'renewable-energy',
    title: '🌐 Autonomous Tech Research & Competitor Benchmark',
    category: 'Multi-Tool Web Synthesis',
    prompt: 'Perform multi-step RAG retrieval on solid-state EV battery advancements. Ingest verified vector memory chunks, execute Google search for 2026 press releases, run Python density calculations, and generate a non-hallucinating report.',
    toolsNeeded: ['vector_memory_rag', 'web_search_google', 'python_interpreter'],
    estimatedSteps: 4
  },
  {
    id: 'api-aggregator',
    title: '📡 Real-Time Microservice & API Orchestrator',
    category: 'REST API & RAG Automation',
    prompt: 'Perform multi-stage API integration to check current global weather anomaly alerts for agricultural zones, cross-reference RAG vector database, compute risk matrix in Python sandbox, and dispatch notification payload.',
    toolsNeeded: ['api_request_json', 'database_query', 'python_interpreter'],
    estimatedSteps: 4
  },
  {
    id: 'security-auditor',
    title: '🛡️ Automated Code Vulnerability & Guardrails Audit',
    category: 'Security Remediation',
    prompt: 'Inspect target repository code snippet for SQL injection vulnerabilities and prompt leakage vulnerabilities. Execute static analysis tool, test edge case inputs in python sandbox, and formulate remediation diff.',
    toolsNeeded: ['python_interpreter', 'vector_memory_rag'],
    estimatedSteps: 3
  }
];

export default function AgentControlPanel({
  prompt,
  setPrompt,
  isRunning,
  onRunMission,
  onResetMission,
  maxSteps,
  setMaxSteps,
  enableMemory,
  setEnableMemory,
  activeTools,
  toggleTool
}) {
  const [attachedCsvName, setAttachedCsvName] = useState(null);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning && prompt.trim()) {
        onRunMission();
      }
    }
  };

  const handleCsvAttachment = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedCsvName(file.name);
    setPrompt(`Analyze attached CSV dataset "${file.name}" from RAG memory, write a Python Pandas script to inspect columns, clean missing values, identify numerical outliers, and compute summary statistics.`);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Automated Multi-Step Task Control</h2>
            <p className="text-xs text-slate-500">Instruct Gemma 4 to autonomously plan, execute tools, and automate complex workflows</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setAttachedCsvName(null);
              onResetMission();
            }}
            disabled={isRunning}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-200 disabled:opacity-50 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>

          <button
            onClick={onRunMission}
            disabled={isRunning || !prompt.trim()}
            className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            {isRunning ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Automating Task...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Execute Automated Mission
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Automated Multi-Step Workflows:</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Command className="w-3 h-3" /> Press Ctrl + Enter to run
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {MISSION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setAttachedCsvName(null);
                setPrompt(preset.prompt);
              }}
              disabled={isRunning}
              className={`p-3 text-left rounded-xl border text-xs transition-all flex flex-col justify-between gap-2 ${
                prompt === preset.prompt
                  ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="font-bold text-slate-800 line-clamp-1">{preset.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{preset.category}</div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-indigo-600 font-mono">
                <span>{preset.estimatedSteps} ReAct Steps</span>
                <span className="text-emerald-600 font-bold">Automated</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea & CSV Attachment Row */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            placeholder="Describe your complex multi-step task for Gemma 4 to automate (e.g. 'Load dataset from RAG, clean null values with Python, and format summary statistics')..."
            rows={3}
            className="w-full glass-input p-3.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 resize-none font-mono focus:ring-2 focus:ring-blue-500 leading-relaxed"
          />
        </div>

        {/* CSV Attachment Bar */}
        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-all">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleCsvAttachment}
              className="hidden"
            />
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{attachedCsvName ? `Replace CSV: ${attachedCsvName}` : '📎 Attach CSV / Dataset File'}</span>
          </label>

          {attachedCsvName && (
            <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attached: {attachedCsvName}
            </span>
          )}
        </div>
      </div>

      {/* Tool & Config Checklist */}
      <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Active Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-semibold">Automated Tools:</span>

          <button
            onClick={() => toggleTool('vector_memory_rag')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
              activeTools.includes('vector_memory_rag')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <Database className="w-3 h-3" /> Vector RAG
          </button>

          <button
            onClick={() => toggleTool('python_interpreter')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
              activeTools.includes('python_interpreter')
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <Code2 className="w-3 h-3" /> Python Sandbox
          </button>

          <button
            onClick={() => toggleTool('web_search_google')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
              activeTools.includes('web_search_google')
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <Search className="w-3 h-3" /> Google Search
          </button>

          <button
            onClick={() => toggleTool('api_request_json')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all ${
              activeTools.includes('api_request_json')
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            <Globe className="w-3 h-3" /> REST Client
          </button>
        </div>

        {/* Sliders & Memory */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold">Max ReAct Steps: <strong className="text-blue-600 font-mono">{maxSteps}</strong></span>
            <input
              type="range"
              min={1}
              max={8}
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="w-16 accent-blue-600 cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-semibold">
            <input
              type="checkbox"
              checked={enableMemory}
              onChange={(e) => setEnableMemory(e.target.checked)}
              className="rounded accent-emerald-600 bg-slate-100 border-slate-300"
            />
            <span className="text-[11px] text-emerald-700 font-bold">RAG Memory Recall</span>
          </label>
        </div>

      </div>

    </div>
  );
}
