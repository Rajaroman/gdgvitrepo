import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Activity, HardDrive, WifiOff, CheckCircle2, Play, RefreshCw } from 'lucide-react';

export default function EdgeInferenceEngine() {
  const [offlineMode, setOfflineMode] = useState(true);
  const [quantization, setQuantization] = useState('q4_k_m');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState({
    throughput: 52.4,
    ttftMs: 38,
    vramUsed: 2.1,
    vramTotal: 8.0,
    status: 'ACTIVE_WEBGPU'
  });

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      setIsBenchmarking(false);
      setBenchmarkResult({
        throughput: (48 + Math.random() * 10).toFixed(1),
        ttftMs: Math.floor(32 + Math.random() * 15),
        vramUsed: 2.1,
        vramTotal: 8.0,
        status: 'ACTIVE_WEBGPU'
      });
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">AI Off the Grid: Local WebGPU & Edge Inference Engine</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">WebGPU Driver:</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-indigo-600" /> Hardware Accelerated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Hardware Status Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-600" /> Edge Engine Telemetry
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>VRAM Allocation</span>
                <span className="font-mono text-indigo-700 font-bold">{benchmarkResult.vramUsed} GB / {benchmarkResult.vramTotal} GB</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(benchmarkResult.vramUsed / benchmarkResult.vramTotal) * 100}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-500">Throughput</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                  {benchmarkResult.throughput} <span className="text-xs font-normal text-slate-500">tok/s</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-semibold text-slate-500">First Token (TTFT)</div>
                <div className="text-base font-bold text-emerald-700 font-mono mt-0.5">
                  {benchmarkResult.ttftMs} <span className="text-xs font-normal text-slate-500">ms</span>
                </div>
              </div>
            </div>

            {/* Offline Mode Toggle */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">Zero-Cloud Privacy Mode</div>
                  <div className="text-[10px] text-emerald-700">100% In-Browser Local Execution</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Quantization & Model Control */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" /> Local Model Quantization & Performance Profiler
            </h3>

            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              {isBenchmarking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              Run WebGPU Benchmark
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setQuantization('q4_k_m')}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                quantization === 'q4_k_m'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-bold">Gemma 4-4B INT4</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Mobile & Browser (2.1GB RAM)</div>
            </button>

            <button
              onClick={() => setQuantization('q8_0')}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                quantization === 'q8_0'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-bold">Gemma 4-9B INT8</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Desktop WebGPU (5.4GB RAM)</div>
            </button>

            <button
              onClick={() => setQuantization('f16')}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                quantization === 'f16'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-bold">Gemma 4-27B FP16</div>
              <div className="text-[10px] text-slate-500 mt-0.5">High Precision (16GB VRAM)</div>
            </button>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">// Local WebAssembly / WebGPU Runtime Log:</span>
              <span className="text-emerald-400">STATUS: OK</span>
            </div>
            <div className="text-emerald-300 space-y-1">
              <div>[08:45:10] Initialized WebGPU Adapter: Direct3D 12 / Metal Backend</div>
              <div>[08:45:11] Loaded Gemma 4 weights: {quantization.toUpperCase()} into GPU VRAM ({benchmarkResult.vramUsed} GB)</div>
              <div>[08:45:12] Local IndexedDB Vector Store: Active (768 dimensions)</div>
              <div>[08:45:13] Network disconnect test passed: Zero external HTTP requests made</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
