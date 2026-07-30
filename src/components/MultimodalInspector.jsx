import React, { useState } from 'react';
import { Eye, Image, FileText, Sparkles, CheckCircle2, Cpu, Upload, Layers } from 'lucide-react';

export const SAMPLE_IMAGES = [
  {
    id: 'sample-battery-diagram',
    title: '🔋 Solid State EV Cell Architecture Diagram',
    category: 'Technical Schematic',
    description: 'Silicon-anode cell layer breakdown showing electrolyte interface and 450 Wh/kg density specs.',
    extractedSummary: 'Gemma 4 Multimodal Analysis:\n• Identified 4 distinct cell layers: Anode (Silicon-dominant), Solid Electrolyte, NMC Cathode, Current Collector.\n• Quantitative Specs Found: Cell Thickness = 1.2mm, Gravimetric Density = 450 Wh/kg.\n• Safety Rating: Zero dendrite formation risk detected at room temperature operating conditions.'
  },
  {
    id: 'sample-chart',
    title: '📊 Q2 Renewable Energy Anomaly Chart',
    category: 'Data Visualization',
    description: 'Line chart comparing solar grid generation vs storage discharge across 5 regions.',
    extractedSummary: 'Gemma 4 Multimodal Analysis:\n• Trend Detection: Peak solar generation anomaly occurs at 13:45 UTC in Region 3 (+18.4% above mean).\n• Outlier Found: Storage discharge in Region 1 dropped by 34% due to inverter throttle.\n• Recommended Action: Trigger automated load balancing script via Python sandbox.'
  },
  {
    id: 'sample-ui',
    title: '🖥️ Dashboard Mockup UI Inspection',
    category: 'UI/UX Analysis',
    description: 'Interface mockup of enterprise telemetry control panel.',
    extractedSummary: 'Gemma 4 Multimodal Analysis:\n• Accessibility Audit: Text contrast ratio = 7.4:1 (WCAG AAA compliant).\n• Element Detection: 4 KPI metric cards, 1 real-time graph, 1 main navigation sidebar.\n• Code Gen: Automatically generated clean React + Tailwind component boilerplate.'
  }
];

export default function MultimodalInspector() {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_IMAGES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(SAMPLE_IMAGES[0].extractedSummary);

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setIsAnalyzing(true);
    setAnalysisResult('');
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(sample.extractedSummary);
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900">Gemma 4 Multimodal Vision & Diagram Inspector</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 font-semibold">Vision Architecture:</span>
          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
            Gemma 4 Multimodal 768px Encoder
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Sample Image Selection Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-purple-600" /> Sample Multimodal Assets
          </h3>

          <div className="space-y-2">
            {SAMPLE_IMAGES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex flex-col gap-1 ${
                  selectedSample.id === sample.id
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{sample.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-purple-700 border border-purple-200 font-mono">
                    {sample.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-1 bg-slate-50">
            <Upload className="w-5 h-5 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Drop Custom Image or Diagram</div>
            <div className="text-[10px] text-slate-400">PNG, JPG, SVG up to 10MB (Simulated)</div>
          </div>
        </div>

        {/* Multimodal Analysis Preview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-slate-900">
                Active Asset: <strong className="text-purple-700 font-mono">{selectedSample.title}</strong>
              </span>
            </div>

            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Gemma 4 Vision Processing: Ready
            </span>
          </div>

          {/* Asset Details Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">// Visual Feature Map Details:</span>
              <span className="text-purple-400">{selectedSample.category}</span>
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">{selectedSample.description}</p>
          </div>

          {/* Gemma 4 Vision Extraction Output */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>Gemma 4 Multimodal Reasoning Output:</span>
            </div>

            {isAnalyzing ? (
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 text-center space-y-2 animate-pulse">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-xs font-mono text-purple-800 font-bold">
                  Gemma 4 Vision Encoder extracting visual tokens and structured JSON schemas...
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap shadow-inner">
                {analysisResult}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
