import React from 'react';
import { Bot, Sparkles, Cpu, Database, Layers, ShieldCheck, Zap, Eye, GitBranch, WifiOff } from 'lucide-react';

export default function Header({ selectedModel, setSelectedModel, agentStatus, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 border-b border-slate-200 px-4 lg:px-8 py-2.5 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-blue-500/20 text-white font-bold">
            <Bot className="w-5 h-5 animate-pulse-glow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Gemma 4 Studio <span className="text-xs font-normal text-slate-500">GDG VIT Chennai</span>
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" /> Gemma 4 Frontier
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Autonomous Agent • Tree-of-Thought • Multimodal Vision • WebGPU Off-Grid • Anti-Hallucination Shield
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('mission')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'mission'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> ReAct Flow
          </button>

          <button
            onClick={() => setActiveTab('tot')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'tot'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Tree-of-Thought
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'vision'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Multimodal
          </button>

          <button
            onClick={() => setActiveTab('edge')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'edge'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" /> WebGPU Edge
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'memory'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> RAG Store
          </button>

          <button
            onClick={() => setActiveTab('shield')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'shield'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Shield
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'tools'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Tools
          </button>
        </nav>

        {/* Gemma 4 Model Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="gemma-4-9b-it" className="bg-white text-slate-800">Gemma 4-9B Instruct</option>
              <option value="gemma-4-27b-it" className="bg-white text-slate-800">Gemma 4-27B Heavy</option>
              <option value="gemma-4-e2e-agent" className="bg-white text-slate-800">Gemma 4 Native Agent</option>
              <option value="gemma-4-4b-mobile" className="bg-white text-slate-800">Gemma 4-4B Edge</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
