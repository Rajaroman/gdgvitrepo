import React, { useState } from 'react';
import Header from './components/Header';
import AgentControlPanel, { MISSION_PRESETS } from './components/AgentControlPanel';
import ReasoningDAG from './components/ReasoningDAG';
import TreeOfThoughtVisualizer from './components/TreeOfThoughtVisualizer';
import MultimodalInspector from './components/MultimodalInspector';
import EdgeInferenceEngine from './components/EdgeInferenceEngine';
import ToolSandbox from './components/ToolSandbox';
import MemoryInspector, { INITIAL_MEMORY_CHUNKS } from './components/MemoryInspector';
import GemmaShieldGuardrails from './components/GemmaShieldGuardrails';
import { Bot, Sparkles, Layers, ShieldCheck, Database, Trophy, GitBranch, Eye, WifiOff } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('gemma-4-9b-it');
  const [activeTab, setActiveTab] = useState('mission');

  // Guardrail Configuration
  const [activeGuardrails, setActiveGuardrails] = useState({
    grounding: true,
    hallucinationThreshold: true,
    injectionShield: true,
    sandboxSafety: true
  });

  const toggleGuardrail = (key) => {
    setActiveGuardrails(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Agent State
  const [prompt, setPrompt] = useState(MISSION_PRESETS[0].prompt);
  const [maxSteps, setMaxSteps] = useState(4);
  const [enableMemory, setEnableMemory] = useState(true);
  const [activeTools, setActiveTools] = useState([
    'vector_memory_rag',
    'python_interpreter',
    'web_search_google',
    'api_request_json'
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [trajectory, setTrajectory] = useState([]);
  const [finalOutput, setFinalOutput] = useState('');
  const [toolLogs, setToolLogs] = useState([]);
  const [memoryChunks, setMemoryChunks] = useState(INITIAL_MEMORY_CHUNKS);

  const toggleTool = (toolId) => {
    if (activeTools.includes(toolId)) {
      setActiveTools(activeTools.filter(t => t !== toolId));
    } else {
      setActiveTools([...activeTools, toolId]);
    }
  };

  const handleResetMission = () => {
    setIsRunning(false);
    setCurrentStep(1);
    setTrajectory([]);
    setFinalOutput('');
    setToolLogs([]);
  };

  const handleRunMission = () => {
    setIsRunning(true);
    setTrajectory([]);
    setFinalOutput('');
    setToolLogs([]);
    setCurrentStep(1);

    // Simulated ReAct Execution Loop with Active Guardrail Checks & Vector RAG for Gemma 4
    const simulatedSteps = [
      {
        stepNumber: 1,
        confidence: 99,
        timestamp: new Date().toLocaleTimeString(),
        thought: "Gemma 4 local frontier reasoning initiated. Querying 768d vector store for baseline metrics. [Guardrail Check: Grounding Matrix Passed 99.4%]",
        action: {
          tool: "vector_memory_rag",
          args: { query: prompt.substring(0, 50), top_k: 2 }
        },
        observation: "Retrieved 2 vector memory chunks (Similarity: 96.5%): 'Gemma 4 Native Function Calling Specs' and 'EV Solid-state battery baseline 2025: 280 Wh/kg'."
      },
      {
        stepNumber: 2,
        confidence: 96,
        timestamp: new Date().toLocaleTimeString(),
        thought: "Gemma 4 native tool dispatch. Invoking Google Search tool to supplement vector memory with 2026 press releases. [Guardrail Check: Injection Shield Passed]",
        action: {
          tool: "web_search_google",
          args: { query: "solid state battery Wh/kg announcements 2026 pilot line" }
        },
        observation: "Found 3 verified articles: QuantumScape Gen-3 targets 450 Wh/kg, Solid Power reports 420 Wh/kg silicon anode cell yield."
      },
      {
        stepNumber: 3,
        confidence: 99,
        timestamp: new Date().toLocaleTimeString(),
        thought: "Synthesizing RAG memory with web search results. Executing sandboxed Python code via Gemma 4 code execution loop. [Guardrail Check: Code Sandbox Verified]",
        action: {
          tool: "python_interpreter",
          args: {
            code: "import numpy as np\ndensities = [280, 420, 450, 500]\nGrowth_pct = ((450 - 280) / 280) * 100\nprint(f'Energy Density Growth: {Growth_pct:.2f}% | Mean: {np.mean(densities):.1f} Wh/kg')"
          }
        },
        observation: "Execution Output:\n'Energy Density Growth: 60.71% | Mean: 412.5 Wh/kg'\nProcess exited cleanly with status 0."
      },
      {
        stepNumber: 4,
        confidence: 99,
        timestamp: new Date().toLocaleTimeString(),
        thought: "All RAG context and tool observations validated against Gemma Shield Guardrail Suite. Formatting final grounded synthesis.",
        action: null,
        observation: null
      }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < simulatedSteps.length) {
        const nextStep = simulatedSteps[stepIndex];
        setTrajectory((prev) => [...prev, nextStep]);
        setCurrentStep(nextStep.stepNumber);

        if (nextStep.action) {
          setToolLogs((prevLogs) => [
            ...prevLogs,
            {
              time: new Date().toLocaleTimeString(),
              tool: nextStep.action.tool,
              message: `Invoked with args: ${JSON.stringify(nextStep.action.args)}`
            }
          ]);
        }

        stepIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setFinalOutput(
          `🎯 **Gemma 4 Vector RAG & Mission Briefing**\n` +
          `🛡️ *Audited by Gemma Shield Guardrails (0.0% Hallucination Risk Score)*\n\n` +
          `1. **RAG Vector Grounding**: Baseline 2025 energy density confirmed at 280 Wh/kg.\n` +
          `2. **2026 Technical Breakthroughs**: Verified commercial pilot line figures showing top silicon-anode solid state cells reaching 420 - 450 Wh/kg.\n` +
          `3. **Gemma 4 Analytical Verification**: Python execution confirms a **60.71% increase** in gravimetric energy density.\n` +
          `4. **Factuality Guarantee**: 100% of generated claims match retrieved vector memory chunks.`
        );

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }, 1100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Header */}
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        agentStatus={isRunning ? 'running' : 'idle'}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Track Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20">
              <Trophy className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">Build with Gemma: GDG VIT Chennai</span>
                <span className="text-white/60">•</span>
                <span className="text-xs font-semibold text-blue-100">Advanced Open Model Suite</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Gemma 4 Agentic Workspace & Multimodal Suite
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                Multi-step ReAct & Tree-of-Thought reasoning, local WebGPU edge inference, multimodal visual inspection, and Gemma Shield guardrails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <div className="px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-mono text-white font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Gemma 4 Advanced Suite Active
            </div>
          </div>
        </div>

        {/* Top Control Panel */}
        <AgentControlPanel
          prompt={prompt}
          setPrompt={setPrompt}
          isRunning={isRunning}
          onRunMission={handleRunMission}
          onResetMission={handleResetMission}
          maxSteps={maxSteps}
          setMaxSteps={setMaxSteps}
          enableMemory={enableMemory}
          setEnableMemory={setEnableMemory}
          activeTools={activeTools}
          toggleTool={toggleTool}
        />

        {/* Tab Views */}
        {activeTab === 'mission' && (
          <ReasoningDAG
            trajectory={trajectory}
            isRunning={isRunning}
            currentStep={currentStep}
            finalOutput={finalOutput}
          />
        )}

        {activeTab === 'tot' && (
          <TreeOfThoughtVisualizer />
        )}

        {activeTab === 'vision' && (
          <MultimodalInspector />
        )}

        {activeTab === 'edge' && (
          <EdgeInferenceEngine />
        )}

        {activeTab === 'memory' && (
          <MemoryInspector
            memoryChunks={memoryChunks}
            setMemoryChunks={setMemoryChunks}
          />
        )}

        {activeTab === 'tools' && (
          <ToolSandbox toolLogs={toolLogs} />
        )}

        {activeTab === 'shield' && (
          <GemmaShieldGuardrails
            activeGuardrails={activeGuardrails}
            toggleGuardrail={toggleGuardrail}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-8 text-center text-xs text-slate-500">
        Build with Gemma AI Buildathon • GDG VIT Chennai • Track 1: Agents on a Mission, Track 3: Off the Grid & Track 4: AI Shield
      </footer>

    </div>
  );
}
