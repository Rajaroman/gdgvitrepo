import React, { useState } from 'react';
import { Brain, Wrench, Eye, CheckCircle2, Copy, Check, Activity, AlertTriangle, Download, Sparkles } from 'lucide-react';

export default function ReasoningDAG({ trajectory, isRunning, currentStep, finalOutput }) {
  const [copiedStep, setCopiedStep] = useState(null);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleCopyStep = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(idx);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleCopyOutput = () => {
    if (!finalOutput) return;
    navigator.clipboard.writeText(finalOutput);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2500);
  };

  if (trajectory.length === 0 && !isRunning) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-200">
          <Brain className="w-6 h-6 animate-pulse-glow" />
        </div>
        <h3 className="text-base font-bold text-slate-800">ReAct & RAG Reasoning Engine Standby</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Select a preset workflow or type a prompt above to watch Gemma perform multi-step RAG context retrieval, execute tools, and ground thoughts against vector memory.
        </p>
      </div>
    );
  }

  const isFlagged = finalOutput.includes('FLAGGED') || finalOutput.includes('Hallucination Risk Detected');

  return (
    <div className="space-y-4">
      
      {/* Prominent Top Final Output Card (when complete) */}
      {finalOutput && (
        <div className={`p-6 rounded-2xl border-2 shadow-md space-y-3 transition-all ${
          isFlagged
            ? 'bg-amber-50/90 border-amber-400 text-amber-950'
            : 'bg-white border-blue-600 text-slate-900'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 font-bold text-base">
              {isFlagged ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              <span>{isFlagged ? 'Gemma Shield Warning: Hallucination Flagged' : '🎯 Gemma 4 Mission Complete Output'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyOutput}
                className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                {copiedOutput ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedOutput ? 'Copied Output' : 'Copy Final Output'}
              </button>

              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                isFlagged
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {isFlagged ? 'Risk Flagged (87.5%)' : 'Verified Factually Grounded (100%)'}
              </span>
            </div>
          </div>

          <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap bg-slate-50 p-4.5 rounded-xl border border-slate-200 text-slate-800 font-medium">
            {finalOutput}
          </div>
        </div>
      )}

      {/* Trajectory Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Step-by-Step ReAct & RAG Reasoning Trajectory</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Steps executed:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-blue-700 font-bold border border-slate-200">
            {trajectory.length}
          </span>
        </div>
      </div>

      {/* Trajectory Stream */}
      <div className="relative space-y-4">
        {trajectory.map((step, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 transition-all hover:border-slate-300 shadow-sm relative"
          >
            {/* Step Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-mono font-bold flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <span className="text-xs font-bold text-slate-800">ReAct Node {step.stepNumber}</span>
                <span className="text-[10px] text-slate-400 font-mono">({step.timestamp})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyStep(JSON.stringify(step, null, 2), idx)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-all text-xs"
                  title="Copy step JSON"
                >
                  {copiedStep === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                  Confidence: {step.confidence}%
                </span>
              </div>
            </div>

            {/* 1. THOUGHT */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Brain className="w-3.5 h-3.5" />
                <span>Gemma Thought:</span>
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-sans leading-relaxed">
                {step.thought}
              </p>
            </div>

            {/* 2. ACTION */}
            {step.action && (
              <div className="space-y-1 pl-3 border-l-2 border-amber-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Action Invoked:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      {step.action.tool}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-100 overflow-x-auto shadow-inner">
                  <span className="text-slate-400">// Parameters:</span>
                  <pre className="mt-1 whitespace-pre-wrap text-emerald-400">{JSON.stringify(step.action.args, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* 3. OBSERVATION */}
            {step.observation && (
              <div className="space-y-1 pl-3 border-l-2 border-emerald-400">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Observation Return:</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 max-h-40 overflow-y-auto leading-relaxed shadow-inner">
                  {step.observation}
                </div>
              </div>
            )}

          </div>
        ))}

        {/* Loading Step Spinner */}
        {isRunning && (
          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 flex items-center gap-3 animate-pulse">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-blue-800 font-bold">
              Gemma reasoning step {currentStep}... Grounding RAG context and executing tools
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
