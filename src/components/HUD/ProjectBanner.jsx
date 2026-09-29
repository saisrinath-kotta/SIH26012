import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

export default function ProjectBanner() {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none select-none">
      {/* Top Left: SIH PS12 Branding */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-extrabold px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/30">
              SIH 2026 • PS12
            </span>
            <span className="text-sm font-bold text-white tracking-tight">
              AI Urban Cadastre 3D
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Automated Parcel Mapping & Cadastral Feature Extraction from Drone Imagery
          </p>
        </div>
      </div>

      {/* Top Right: Strict Cadastral Disclaimer Badge */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-1.5 shadow-xl backdrop-blur-md">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="hidden md:inline">AI-Assisted Preliminary Results • </span>
          <span>Requires Surveyor Validation</span>
        </div>
      </div>
    </div>
  );
}
