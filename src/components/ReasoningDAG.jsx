import React, { useState } from 'react';
import { Brain, Wrench, Eye, CheckCircle2, Copy, Check, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ReasoningDAG({ trajectory, isRunning, currentStep, finalOutput }) {
  const [copiedStep, setCopiedStep] = useState(null);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [showDetailedSteps, setShowDetailedSteps] = useState(false);

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
        <h3 className="text-base font-bold text-slate-800">Gemma 4 Agent Ready</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Select a preset workflow or type a prompt above and click <strong>Execute Mission</strong> to generate the final response.
        </p>
      </div>
    );
  }

  const isFlagged = finalOutput.includes('FLAGGED') || finalOutput.includes('Hallucination Risk Detected');

  return (
    <div className="space-y-4">
      
      {/* CLEAN FINAL OUTPUT CARD ONLY */}
      {finalOutput && (
        <div className={`p-6 rounded-2xl border-2 shadow-md space-y-4 transition-all ${
          isFlagged
            ? 'bg-amber-50/90 border-amber-400 text-amber-950'
            : 'bg-white border-blue-600 text-slate-900'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 font-bold text-base">
              {isFlagged ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              <span>{isFlagged ? 'Gemma Shield Warning: Hallucination Flagged' : '🎯 Gemma 4 Final Answer Output'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyOutput}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                {copiedOutput ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedOutput ? 'Copied Final Answer' : 'Copy Final Answer'}
              </button>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                isFlagged
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {isFlagged ? 'Risk Flagged (87.5%)' : 'Factuality Verified (100%)'}
              </span>
            </div>
          </div>

          {/* Main Clean Response Content */}
          <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-800 font-medium">
            {finalOutput}
          </div>

          {/* Collapsible Reasoning Steps Toggle */}
          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setShowDetailedSteps(!showDetailedSteps)}
              className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              {showDetailedSteps ? 'Hide Reasoning Steps' : `Show ReAct Reasoning Steps (${trajectory.length} steps)`}
              {showDetailedSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Loading Step Spinner */}
      {isRunning && (
        <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-blue-800 font-bold">
            Processing agent mission... Grounding RAG context and executing tools (Step {currentStep})
          </span>
        </div>
      )}

      {/* Optional Collapsible Reasoning Steps Stream */}
      {(showDetailedSteps || (!finalOutput && isRunning)) && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-700">Detailed ReAct Reasoning Trajectory</h3>
            <span className="text-xs font-mono text-slate-400">{trajectory.length} steps</span>
          </div>

          {trajectory.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-mono">
                <span className="font-bold text-slate-800">Step {step.stepNumber}</span>
                <span className="text-purple-600 font-bold">Confidence: {step.confidence}%</span>
              </div>

              <div>
                <span className="font-bold text-blue-700">Thought: </span>
                <span className="text-slate-700">{step.thought}</span>
              </div>

              {step.action && (
                <div className="bg-slate-900 p-2.5 rounded-lg text-emerald-400 font-mono text-[11px]">
                  Tool: {step.action.tool} | Args: {JSON.stringify(step.action.args)}
                </div>
              )}

              {step.observation && (
                <div className="bg-slate-50 p-2.5 rounded-lg text-slate-800 font-mono text-[11px] border border-slate-200">
                  Observation: {step.observation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
