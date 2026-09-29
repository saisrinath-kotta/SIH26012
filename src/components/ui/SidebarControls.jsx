import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sun,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';

export default function SidebarControls({
  parcels,
  selectedParcel,
  onSelectParcel,
  viewMode,
  onChangeViewMode,
  showSubsurface,
  onToggleSubsurface,
  showSetbacks,
  onToggleSetbacks,
  showLabels,
  onToggleLabels,
  timeOfDay,
  onChangeTimeOfDay,
  onSelectCameraPreset
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParcels = parcels.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.surveyNumber.toLowerCase().includes(q) ||
      p.ulpin.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q)
    );
  });

  // Format time of day display (e.g. 14.5 -> "2:30 PM")
  const formatTime = (hourFloat) => {
    const hours = Math.floor(hourFloat);
    const minutes = Math.round((hourFloat - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMin = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHour}:${displayMin} ${period}`;
  };

  return (
    <div className="absolute top-20 left-4 z-10 flex items-start select-none">
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 max-h-[calc(100vh-6.5rem)] glass-panel rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Cadastral Controls</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                {parcels.length} Parcels
              </span>
            </div>

            {/* View Modes */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Visualization Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'thematic', label: 'Zoning' },
                  { id: 'wireframe', label: 'Survey Wire' },
                  { id: 'valuation', label: 'Tax Heatmap' },
                  { id: 'strata', label: '3D Strata' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onChangeViewMode(mode.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left flex items-center justify-between ${
                      viewMode === mode.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <span>{mode.label}</span>
                    {viewMode === mode.id && <Check className="w-3 h-3 text-sky-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* GIS Layers & Toggles */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Cadastral Layers
              </label>
              <div className="flex flex-col gap-1.5">
                {/* Subsurface Utilities */}
                <button
                  onClick={onToggleSubsurface}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                    showSubsurface
                      ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🚇</span>
                    Sub-surface Strata (Metro/Pipes)
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      showSubsurface ? 'bg-cyan-500 border-cyan-400' : 'border-slate-600'
                    }`}
                  >
                    {showSubsurface && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  </div>
                </button>

                {/* Setbacks Buffer */}
                <button
                  onClick={onToggleSetbacks}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                    showSetbacks
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">📏</span>
                    Turf.js Setback Buffers
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      showSetbacks ? 'bg-amber-500 border-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {showSetbacks && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  </div>
                </button>

                {/* 3D Floating Labels */}
                <button
                  onClick={onToggleLabels}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                    showLabels
                      ? 'bg-sky-950/40 text-sky-300 border border-sky-500/40'
                      : 'bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">🏷️</span>
                    Cadastral Survey Labels
                  </span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border ${
                      showLabels ? 'bg-sky-500 border-sky-400' : 'border-slate-600'
                    }`}
                  >
                    {showLabels && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Sun Simulation (Time of Day) */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Sun Angle / Shadows
                </span>
                <span className="font-mono text-sky-300 text-[11px] font-semibold">
                  {formatTime(timeOfDay)}
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="20"
                step="0.25"
                value={timeOfDay}
                onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>06:00 (Dawn)</span>
                <span>13:00 (Noon)</span>
                <span>20:00 (Dusk)</span>
              </div>
            </div>

            {/* GSAP Camera Presets */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Camera Presets (GSAP)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'oblique', label: 'Oblique 45°' },
                  { id: 'street', label: 'Street' },
                  { id: 'subsurface', label: 'Sub-surface' },
                  { id: 'ortho', label: '2D Ortho' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectCameraPreset(preset.id)}
                    className="px-2 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 transition-all text-center"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Parcel Directory */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Parcel Directory
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Sy. No, Owner, Zone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                {filteredParcels.map((parcel) => (
                  <button
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel)}
                    className={`p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                      selectedParcel?.id === parcel.id
                        ? 'bg-sky-950/60 border-sky-400 text-sky-200'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-sky-400 font-bold">
                          {parcel.surveyNumber}
                        </span>
                        <span className="text-[10px] px-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {parcel.zone}
                        </span>
                      </div>
                      <span className="text-xs font-medium truncate text-slate-200">
                        {parcel.name}
                      </span>
                    </div>
                    <div className="text-right flex flex-col shrink-0">
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {parcel.valuation}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {parcel.floors} Fl • {parcel.height}m
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse/Expand Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 p-2 rounded-r-xl glass-panel text-slate-300 hover:text-white border-l-0 shadow-lg"
        title={isOpen ? 'Collapse panel' : 'Expand panel'}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
