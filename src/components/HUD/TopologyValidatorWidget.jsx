import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { TOPOLOGY_ERROR_DEMO } from '../../data/parcelData';

export default function TopologyValidatorWidget() {
  // Visual Lifecycle Stages:
  // 0: INVALID -> 1: DETECTED -> 2: FLAGGED -> 3: CORRECTED/REVIEWED -> 4: VALID
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => setStage(3), 3200);
    const t4 = setTimeout(() => setStage(4), 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const resetPipeline = () => {
    setStage(0);
    setTimeout(() => setStage(1), 600);
    setTimeout(() => setStage(2), 1400);
    setTimeout(() => setStage(3), 2600);
    setTimeout(() => setStage(4), 3800);
  };

  const stageLabels = [
    { num: 0, label: 'INVALID', color: 'text-rose-400 bg-rose-950/80 border-rose-500/40' },
    { num: 1, label: 'DETECTED', color: 'text-amber-400 bg-amber-950/80 border-amber-500/40' },
    { num: 2, label: 'FLAGGED', color: 'text-rose-400 bg-rose-950/80 border-rose-500/40' },
    { num: 3, label: 'CORRECTED', color: 'text-sky-400 bg-sky-950/80 border-sky-500/40' },
    { num: 4, label: 'VALID', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' }
  ];

  return (
    <div className="absolute top-20 right-4 z-30 w-92 max-w-[calc(100vw-2rem)] select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-2xl p-4 flex flex-col gap-3.5 border border-slate-700/80 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Topology Validation Engine
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Planar Geometry Ruleset (Turf.js)
              </span>
            </div>
          </div>
          <button
            onClick={resetPipeline}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-300 transition-colors"
            title="Replay Validation Sequence"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Progression Bar: INVALID -> DETECTED -> FLAGGED -> CORRECTED -> VALID */}
        <div className="flex items-center justify-between gap-1 text-[9px] font-mono border-b border-slate-800/80 pb-2">
          {stageLabels.map((s, idx) => {
            const isActive = stage === idx;
            const isPassed = stage > idx;
            return (
              <React.Fragment key={s.label}>
                <div
                  className={`px-1.5 py-0.5 rounded border text-center font-bold transition-all ${
                    isActive
                      ? `${s.color} ring-1 ring-sky-400/50 scale-105`
                      : isPassed
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-900/40 text-slate-600 border-slate-800'
                  }`}
                >
                  {s.label}
                </div>
                {idx < stageLabels.length - 1 && (
                  <span className={`text-[8px] ${stage > idx ? 'text-sky-400' : 'text-slate-700'}`}>
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Checks Table & Status */}
        <div className="flex flex-col gap-1.5 text-[11px] font-mono">
          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/40 text-slate-300">
            <span>1. Polygon Closure</span>
            <span className="text-emerald-400 font-bold">✓ PASS</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/40 text-slate-300">
            <span>2. Self-Intersection</span>
            <span className="text-emerald-400 font-bold">✓ PASS</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/40 text-slate-300">
            <span>3. Overlap Detection</span>
            {stage < 3 ? (
              <span className="text-rose-400 font-bold animate-pulse">⛔ 38.4 m² OVERLAP</span>
            ) : (
              <span className="text-emerald-400 font-bold">✓ RESOLVED</span>
            )}
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-slate-800/40 text-slate-300">
            <span>4. Gap / Sliver Detection</span>
            {stage < 3 ? (
              <span className="text-amber-400 font-bold animate-pulse">⚠️ 2.4 m GAP</span>
            ) : (
              <span className="text-emerald-400 font-bold">✓ SNAPPED</span>
            )}
          </div>
          <div className="flex justify-between items-center py-0.5 text-slate-300">
            <span>5. Duplicate Boundaries</span>
            <span className="text-emerald-400 font-bold">✓ PASS</span>
          </div>
        </div>

        {/* Detailed Issue Feedback */}
        <AnimatePresence mode="wait">
          {stage < 3 ? (
            <motion.div
              key="errors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2 pt-1"
            >
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/60 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-rose-200">
                    FLAGGED: Spatial Overlap P001 & P003
                  </span>
                  <span className="text-[10px] text-rose-300/80">
                    {TOPOLOGY_ERROR_DEMO.overlapDescription}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/60 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-amber-200">
                    FLAGGED: Unassigned Boundary Gap
                  </span>
                  <span className="text-[10px] text-amber-300/80">
                    {TOPOLOGY_ERROR_DEMO.gapDescription}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cleaned"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-mono text-xs font-bold text-emerald-200">
                    TOPOLOGY REPAIRED (0.05m SNAP)
                  </h4>
                  <span className="text-[10px] text-emerald-300/80 font-mono">
                    Planar graph consistency verified
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer Note */}
        <div className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-800 leading-tight">
          * Notice: Topology repair establishes geometric/topological validity for the prototype. It does not replace human cadastral surveyor sanction.
        </div>
      </motion.div>
    </div>
  );
}
