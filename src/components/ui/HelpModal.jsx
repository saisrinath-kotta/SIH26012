import React from 'react';
import { motion } from 'framer-motion';
import { X, MousePointer, Move, ZoomIn, Layers } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-xl rounded-2xl p-6 flex flex-col gap-5 border border-slate-700/80 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              GeoCadastre 3D Guide & Controls
            </h3>
            <p className="text-xs text-slate-400">
              Navigation controls and 3D Cadastral Land Administration features
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Navigation Controls */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
            3D Navigation Shortcuts
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-1.5">
              <MousePointer className="w-5 h-5 text-sky-400" />
              <span className="font-semibold text-slate-200">Orbit / Rotate</span>
              <span className="text-[11px] text-slate-400">Left Click + Drag</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-1.5">
              <Move className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-slate-200">Pan View</span>
              <span className="text-[11px] text-slate-400">Right Click + Drag</span>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col items-center text-center gap-1.5">
              <ZoomIn className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-slate-200">Zoom In/Out</span>
              <span className="text-[11px] text-slate-400">Scroll Wheel</span>
            </div>
          </div>
        </div>

        {/* 3D Cadastre Key Pillars */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Key 3D Cadastral Capabilities
          </h4>
          <div className="flex flex-col gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded bg-sky-950 text-sky-400">🏢</div>
              <div>
                <strong className="text-slate-200">3D Strata Unit Modeling:</strong>
                <p className="text-slate-400 text-[11px]">
                  Visualizes multi-storey condominiums and commercial spaces as distinct 3D strata volumetric parcel units for prototype demonstration.
                </p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded bg-cyan-950 text-cyan-400">🚇</div>
              <div>
                <strong className="text-slate-200">Subsurface Strata & Easements:</strong>
                <p className="text-slate-400 text-[11px]">
                  Depicts underground metro corridors and high-voltage transmission lines beneath ground plots to visualize 3D vertical spatial rights.
                </p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded bg-amber-950 text-amber-400">📏</div>
              <div>
                <strong className="text-slate-200">Turf.js Geodetic Validation:</strong>
                <p className="text-slate-400 text-[11px]">
                  Computes true WGS84 polygon area, perimeter, and setback buffers in real time to detect spatial boundary discrepancies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-lg shadow-sky-600/20 transition-all"
          >
            Got it, let's explore!
          </button>
        </div>
      </motion.div>
    </div>
  );
}
