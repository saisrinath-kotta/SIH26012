import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { INFERENCE_STAGE_CONFIG, getInferenceStateForScene } from '../../ai';

export default function AIVisionHUD({
  currentScene,
  mode,
  interactiveStage,
  onStageChange,
  isAnalyzing,
  onToggleAnalysis,
  onResetAnalysis
}) {
  // Determine current active stage index:
  // In Cinematic mode, derive from currentScene.
  // In Explore mode, use interactiveStage.
  const activeStageKey = mode === 'CINEMATIC'
    ? getInferenceStateForScene(currentScene)
    : (INFERENCE_STAGE_CONFIG[interactiveStage]?.key || INFERENCE_STAGE_CONFIG[0].key);

  const activeIndex = INFERENCE_STAGE_CONFIG.findIndex(s => s.key === activeStageKey);
  const currentStageInfo = INFERENCE_STAGE_CONFIG[Math.max(0, activeIndex)] || INFERENCE_STAGE_CONFIG[0];

  // Only show the AI Vision HUD during AI-relevant scenes (Scenes 04 through 12) or in Explore mode
  const isVisible = mode === 'EXPLORE' || (currentScene >= 4 && currentScene <= 12);

  if (!isVisible) return null;

  return (
    <div className="absolute top-20 left-4 z-30 w-80 max-w-[calc(100vw-2rem)] select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-2xl p-4 flex flex-col gap-3 border border-slate-700/80 shadow-2xl text-slate-100 backdrop-blur-md"
      >
        {/* HUD Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Vision Pipeline
              </h3>
              <span className="text-[9px] text-slate-400 font-mono">
                Multi-Class Feature Extraction
              </span>
            </div>
          </div>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30 uppercase font-semibold">
            {mode} MODE
          </span>
        </div>

        {/* Live Active Stage Status Bar */}
        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-slate-400">ACTIVE STAGE:</span>
            <span
              className="font-bold flex items-center gap-1"
              style={{ color: currentStageInfo.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentStageInfo.color }} />
              {currentStageInfo.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 font-sans leading-tight">
            {currentStageInfo.description}
          </p>
        </div>

        {/* Sequential Pipeline Stages List */}
        <div className="flex flex-col gap-1 font-mono text-[10px]">
          {INFERENCE_STAGE_CONFIG.map((stage, idx) => {
            const isCompleted = activeIndex > idx;
            const isCurrent = activeIndex === idx;
            const isPending = activeIndex < idx;

            return (
              <div
                key={stage.key}
                onClick={() => {
                  if (mode === 'EXPLORE' && onStageChange) {
                    onStageChange(idx);
                  }
                }}
                className={`flex items-center justify-between px-2 py-1 rounded-md transition-all ${
                  mode === 'EXPLORE' ? 'cursor-pointer hover:bg-slate-800/60' : ''
                } ${
                  isCurrent
                    ? 'bg-sky-950/80 text-white font-bold border border-sky-500/40 shadow-sm'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-slate-900/40'
                    : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="truncate max-w-[170px]">{stage.label}</span>
                </div>

                <div className="shrink-0 flex items-center font-bold">
                  {isCompleted && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-sky-400 flex items-center gap-1 animate-pulse">
                      <span>◉</span>
                    </span>
                  )}
                  {isPending && (
                    <span className="text-slate-700">○</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore Mode Interactive Controls (Section 14 Requirement) */}
        {mode === 'EXPLORE' && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onToggleAnalysis}
                className={`py-1.5 px-2 rounded-xl font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  isAnalyzing
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>PAUSE AI</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>RUN AI ANALYSIS</span>
                  </>
                )}
              </button>

              <button
                onClick={onResetAnalysis}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center gap-1 border border-slate-700/60 transition-all"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>RESET</span>
              </button>
            </div>
          </div>
        )}

        {/* Technical Transparency Note (Section 16 Requirement) */}
        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[8px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-sky-400" />
            <span>Prototype AI Inference — Illustrative Output</span>
          </div>
          <span className="text-slate-500">v3.0</span>
        </div>
      </motion.div>
    </div>
  );
}
