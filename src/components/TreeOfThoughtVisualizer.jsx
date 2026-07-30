import React, { useState } from 'react';
import { GitBranch, Brain, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Play, RefreshCw } from 'lucide-react';

export const TREE_BRANCHES = [
  {
    id: 'branch-a',
    name: 'Branch A: Direct Calculation',
    score: 98,
    status: 'OPTIMAL_PATH',
    steps: [
      'Thought: Query Python sandbox directly to parse numerical array.',
      'Action: python_interpreter([280, 420, 450, 500])',
      'Evaluation: 98/100 (Direct empirical proof, zero hallucination risk).'
    ]
  },
  {
    id: 'branch-b',
    name: 'Branch B: Web Search Exploration',
    score: 84,
    status: 'ACCEPTED',
    steps: [
      'Thought: Query Google Search for 2026 press releases.',
      'Action: web_search_google("solid state battery 2026")',
      'Evaluation: 84/100 (Found 3 valid articles, secondary verification).'
    ]
  },
  {
    id: 'branch-c',
    name: 'Branch C: Unanchored Parametric Fallback',
    score: 41,
    status: 'PRUNED',
    steps: [
      'Thought: Generate summary purely from model weights.',
      'Action: Skip vector RAG and sandbox tools.',
      'Evaluation: 41/100 (PRUNED by Gemma Shield: High hallucination risk).'
    ]
  }
];

export default function TreeOfThoughtVisualizer() {
  const [selectedBranch, setSelectedBranch] = useState(TREE_BRANCHES[0]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Tree-of-Thought (ToT) Multi-Branch Reasoning Engine</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Reasoning Mode:</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
            Monte Carlo Tree Search (MCTS)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Branch Selector Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-blue-600" /> Explored Reasoning Branches
          </h3>

          <div className="space-y-2">
            {TREE_BRANCHES.map((branch) => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col gap-1.5 ${
                  selectedBranch.id === branch.id
                    ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{branch.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    branch.status === 'OPTIMAL_PATH'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : branch.status === 'ACCEPTED'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    Score: {branch.score}/100
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Status: <strong className={branch.status === 'PRUNED' ? 'text-red-600' : 'text-emerald-600'}>{branch.status}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Branch Path Inspector */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">
                Active Tree Trajectory: <strong className="text-blue-700 font-mono">{selectedBranch.name}</strong>
              </span>
            </div>

            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              selectedBranch.status === 'PRUNED'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {selectedBranch.status}
            </span>
          </div>

          <div className="space-y-3">
            {selectedBranch.steps.map((stepText, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                <div className="text-slate-400 font-bold text-[10px]">Node Step {idx + 1}</div>
                <div className="text-slate-800 font-medium">{stepText}</div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
