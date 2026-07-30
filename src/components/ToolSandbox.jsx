import React, { useState } from 'react';
import { Terminal, Code2, Search, Database, Globe, Play, CheckCircle, RefreshCw } from 'lucide-react';

export default function ToolSandbox({ toolLogs }) {
  const [selectedTool, setSelectedTool] = useState('python_interpreter');
  const [customPythonCode, setCustomPythonCode] = useState(`import numpy as np\n# Calculate EV Battery Density Metrics\nenergy_wh_kg = [280, 320, 450, 500]\nmean_density = np.mean(energy_wh_kg)\nprint(f"Projected 2026 Mean Solid State Density: {mean_density} Wh/kg")`);
  const [testResult, setTestResult] = useState(null);
  const [isExecutingTest, setIsExecutingTest] = useState(false);

  const handleRunCustomTest = () => {
    setIsExecutingTest(true);
    setTestResult(null);
    setTimeout(() => {
      setIsExecutingTest(false);
      if (selectedTool === 'python_interpreter') {
        setTestResult({
          stdout: "Projected 2026 Mean Solid State Density: 387.5 Wh/kg\nExecution finished in 0.042s with exit code 0.",
          status: 'success'
        });
      } else if (selectedTool === 'web_search_google') {
        setTestResult({
          stdout: "Found 3 results:\n1. QuantumScape Solid State Gen-3 Specs (2026)\n2. Toyota Solid Battery Patent Filing Wh/kg Benchmark\n3. Solid Power Commercial Pilot Line Updates",
          status: 'success'
        });
      } else if (selectedTool === 'vector_memory_rag') {
        setTestResult({
          stdout: "Top Chunk Match (Cosine Sim: 0.942):\n'Historical battery baseline data recorded indicated standard NMC cell densities reached 290 Wh/kg limit.'",
          status: 'success'
        });
      } else {
        setTestResult({
          stdout: "HTTP/1.1 200 OK\n{\n  'status': 'healthy',\n  'endpoint': 'https://api.gemma.internal/v1/telemetry',\n  'latency_ms': 14\n}",
          status: 'success'
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm font-bold text-slate-900">Gemma Dynamic Tool Sandbox</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">Sandbox Environment: Isolated WebAssembly / Mock Server</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Tool Select Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Agent Tools</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTool('python_interpreter')}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                selectedTool === 'python_interpreter'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-bold">python_interpreter</div>
                <div className="text-[10px] text-slate-500">Executes arbitrary Python 3 code in sandbox</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool('web_search_google')}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                selectedTool === 'web_search_google'
                  ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-bold">web_search_google</div>
                <div className="text-[10px] text-slate-500">Retrieves real-time Google search snippets</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool('vector_memory_rag')}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                selectedTool === 'vector_memory_rag'
                  ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4 text-purple-600" />
              <div>
                <div className="font-bold">vector_memory_rag</div>
                <div className="text-[10px] text-slate-500">Queries local semantic vector embeddings</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedTool('api_request_json')}
              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${
                selectedTool === 'api_request_json'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4 text-amber-600" />
              <div>
                <div className="font-bold">api_request_json</div>
                <div className="text-[10px] text-slate-500">Dispatches structured HTTP REST calls</div>
              </div>
            </button>
          </div>
        </div>

        {/* Live Execution Panel */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Tool Playground: <span className="font-mono text-emerald-700 font-bold">{selectedTool}</span>
            </span>

            <button
              onClick={handleRunCustomTest}
              disabled={isExecutingTest}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              {isExecutingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Test Tool Directly
            </button>
          </div>

          {selectedTool === 'python_interpreter' && (
            <textarea
              value={customPythonCode}
              onChange={(e) => setCustomPythonCode(e.target.value)}
              className="w-full bg-slate-900 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 resize-none h-32 focus:outline-none focus:border-emerald-500"
            />
          )}

          {selectedTool !== 'python_interpreter' && (
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-slate-500">// Schema Definition for {selectedTool}</span>
              <pre className="mt-2 text-emerald-400">{JSON.stringify({ tool: selectedTool, type: "function", parameters: { query: "string", top_k: 3 } }, null, 2)}</pre>
            </div>
          )}

          {/* Test Execution Output */}
          {testResult && (
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Execution Console Output:
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap">
                {testResult.stdout}
              </div>
            </div>
          )}

          {/* Active Tool Logs Stream */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-[11px] font-bold text-slate-600 mb-2">Real-Time Agent Execution Logs</h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1.5">
              {toolLogs.length === 0 ? (
                <div className="text-slate-400 italic">No tool execution logs in this session yet. Launch a mission above.</div>
              ) : (
                toolLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-800 border-b border-slate-200 pb-1">
                    <span className="text-slate-400">[{log.time}]</span>
                    <span className="text-amber-700 font-bold">{log.tool}</span>
                    <span className="text-slate-600">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
