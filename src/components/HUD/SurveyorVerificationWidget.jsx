import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { SURVEYOR_VERIFICATION_DEMO } from '../../data/parcelData';

export default function SurveyorVerificationWidget({
  onConfirmVerification,
  isVerified
}) {
  const [stage, setStage] = useState(isVerified ? 'verified' : 'comparison');

  const handleAdjustAndVerify = () => {
    setStage('verified');
    if (onConfirmVerification) onConfirmVerification();
  };

  return (
    <div className="absolute top-20 right-4 z-30 w-96 max-w-[calc(100vw-2rem)] select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-2xl p-4 flex flex-col gap-3 border border-slate-700/80 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Human-in-the-Loop Surveyor Verification
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                Boundary Segment #3 • Parcel P001
              </span>
            </div>
          </div>
        </div>

        {/* Section 12: Technical Flow Ribbon */}
        <div className="flex items-center justify-between gap-1 text-[8px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-sky-400">AI Output</span>
          <span>→</span>
          <span className="text-amber-400">Uncertainty</span>
          <span>→</span>
          <span className="text-purple-300">Surveyor</span>
          <span>→</span>
          <span className="text-sky-300">Field Evidence</span>
          <span>→</span>
          <span className={stage === 'verified' || isVerified ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
            Verified
          </span>
        </div>

        {/* Step 1: AI Suggestion (Yellow Uncertain) */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/40 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              AI Suggestion (Preliminary)
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
              Illustrative: UNCERTAIN
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            {SURVEYOR_VERIFICATION_DEMO.originalAI.reason}
          </p>
        </div>

        {/* Step 2: Field / Survey Verification Ground Truth */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-sky-500/40 flex flex-col gap-1.5 text-xs">
          <span className="font-mono text-[10px] font-bold text-sky-400 uppercase flex items-center gap-1">
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            Ground Survey Monumentation
          </span>
          <p className="text-[11px] text-slate-200 leading-tight">
            {SURVEYOR_VERIFICATION_DEMO.fieldTruth.surveyorNote}
          </p>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
            <span>Physical Marker: Stone Monument</span>
            <span className="text-sky-300 font-semibold">Survey Offset: +0.80m</span>
          </div>
        </div>

        {/* Verification Action / Confirmation Banner */}
        <AnimatePresence mode="wait">
          {stage === 'verified' || isVerified ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-300">
                      SURVEYOR VERIFIED
                    </span>
                    <span className="text-[8px] font-mono bg-emerald-900 text-emerald-200 px-1 py-0.2 rounded">
                      YELLOW → GREEN
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80">
                    Physical boundary verified against stone monument pillar
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={handleAdjustAndVerify}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ALIGN WITH GROUND TRUTH & VERIFY</span>
            </button>
          )}
        </AnimatePresence>

        <div className="text-[8px] text-slate-400 font-mono pt-1 border-t border-slate-800 leading-tight">
          * AI-Assisted Preliminary Results — Requires Surveyor Field Validation. Establishes physical verification, not final statutory ownership.
        </div>
      </motion.div>
    </div>
  );
}
