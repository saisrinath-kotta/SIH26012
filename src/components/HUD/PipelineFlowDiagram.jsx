import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Award } from 'lucide-react';

export default function PipelineFlowDiagram() {
  // Canonical Technical Flow from Section 14
  const steps = [
    { label: 'DRONE IMAGERY', sub: 'Aerial Photogrammetry' },
    { label: 'ORTHOMOSAIC', sub: 'High-Res Orthophoto' },
    { label: 'AI FEATURE EXTRACTION', sub: 'Multi-Class Vision' },
    { label: 'BUILDINGS / ROADS / ACCESS', sub: 'Footprints & Lanes' },
    { label: 'BOUNDARY EVIDENCE', sub: 'Physical Vectors' },
    { label: 'PRELIMINARY PARCELS', sub: 'Candidate Polygons' },
    { label: 'TOPOLOGY VALIDATION', sub: 'Planar Rules Enforced' },
    { label: 'SURVEYOR REVIEW', sub: 'Field Verification' },
    { label: 'GIS-READY PRELIMINARY OUTPUT', sub: 'Exportable GeoJSON' }
  ];

  return (
    <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-4 rounded-2xl border border-sky-500/40 shadow-2xl flex flex-col items-center gap-3 max-w-6xl w-full text-slate-100"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold tracking-widest uppercase">
          <Award className="w-4 h-4 text-sky-400" />
          <span>PS12 End-to-End Cadastral Pipeline Completed</span>
        </div>

        {/* Linear Sequence Nodes */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full text-center">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1.5 rounded-xl flex flex-col items-center min-w-[85px] shadow-lg">
                <span className="font-mono text-[10px] font-bold text-sky-300">
                  {step.label}
                </span>
                <span className="text-[8px] text-slate-400 font-mono">
                  {step.sub}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-sky-400/70 shrink-0 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1 w-full border-t border-slate-800 pt-2 text-center">
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Valid Planar Topology • Geodetic WGS84 Accuracy • GIS-Ready Preliminary Dataset</span>
          </div>
          <div className="text-[10px] font-bold text-amber-300 font-mono tracking-wide">
            AI-ASSISTED PRELIMINARY RESULTS • REQUIRES SURVEYOR VALIDATION
          </div>
          <div className="text-[8px] text-slate-400 font-mono">
            NOT AN OFFICIAL CADASTRAL RECORD OR STATUTORY LEGAL PROPERTY TITLE
          </div>
        </div>
      </motion.div>
    </div>
  );
}
