import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  FileText,
  ShieldCheck,
  Send,
  Layers,
  CheckCircle,
  Copy,
  Download,
  Info
} from 'lucide-react';
import { calculateParcelMetrics } from '../../utils/gisUtils';

export default function CadastralInspector({
  selectedParcel,
  selectedStrata,
  onClose,
  onFlyToParcel,
  onOpenDeedModal,
  onExportSingleParcel
}) {
  // Calculate spatial metrics dynamically using Turf.js
  const metrics = useMemo(() => {
    if (!selectedParcel) return null;
    return calculateParcelMetrics(selectedParcel.geoJsonCoordinates);
  }, [selectedParcel]);

  if (!selectedParcel && !selectedStrata) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.25 }}
        className="absolute top-20 right-4 z-10 w-96 max-h-[calc(100vh-6.5rem)] glass-panel rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto shadow-2xl select-none"
      >
        {/* Subsurface Easement Inspector */}
        {selectedStrata && !selectedParcel && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚇</span>
                <div>
                  <h3 className="text-sm font-bold text-cyan-300">
                    {selectedStrata.name}
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    3D Subsurface Strata Right
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-cyan-950/30 p-3 rounded-xl border border-cyan-800/40 flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Strata Type:</span>
                <span className="text-cyan-200 font-medium">{selectedStrata.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation Depth:</span>
                <span className="font-mono text-cyan-300 font-bold">{selectedStrata.depth} meters AGL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tunnel Radius:</span>
                <span className="font-mono text-slate-200">{selectedStrata.radius} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Managing Authority:</span>
                <span className="text-slate-200 font-medium">{selectedStrata.authority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Statutory Rights:</span>
                <span className="text-slate-300 font-mono text-[11px]">{selectedStrata.legalDeed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Cadastral Parcel Inspector */}
        {selectedParcel && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/30">
                    {selectedParcel.surveyNumber}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: `${selectedParcel.color}66` }}
                  >
                    {selectedParcel.zone}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  {selectedParcel.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    Illustrative ID: {selectedParcel.ulpin}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedParcel.ulpin)}
                    title="Copy Illustrative ID"
                    className="text-slate-500 hover:text-sky-400"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (Fly to & Digital Deed & Export) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onFlyToParcel}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 flex items-center justify-center gap-1.5 border border-slate-700/60 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Fly to Parcel</span>
              </button>
              <button
                onClick={onOpenDeedModal}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>3D Title Deed</span>
              </button>
            </div>
            {onExportSingleParcel && (
              <button
                onClick={onExportSingleParcel}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-medium text-slate-300 flex items-center justify-center gap-1.5 border border-slate-700/60 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Parcel GeoJSON</span>
              </button>
            )}

            {/* Live Turf.js Spatial Metrics */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Layers className="w-3.5 h-3.5" />
                  Turf.js Spatial Analytics
                </span>
                <span className="text-[10px] font-mono text-slate-400">Geodetic WGS84</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Polygon Area</span>
                  <span className="font-mono text-slate-100 font-bold">
                    {metrics?.areaSqM.toLocaleString()} m²
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    ({metrics?.areaSqFt.toLocaleString()} sq.ft)
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Boundary Perimeter</span>
                  <span className="font-mono text-slate-100 font-bold">
                    {metrics?.perimeterM} m
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {metrics?.areaHectares} Ha
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Height / Floors</span>
                  <span className="font-mono text-sky-400 font-bold">
                    {selectedParcel.height}m ({selectedParcel.floors} Fl)
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Built Vol: ~{Math.round((metrics?.areaSqM || 1) * selectedParcel.height)} m³
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Setback Buffer</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedParcel.setback}m Inset
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-mono flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>

              {/* Centroid coordinates */}
              <div className="text-[10px] font-mono text-slate-400 bg-slate-950/40 px-2 py-1 rounded flex justify-between">
                <span>Centroid Lat/Lon:</span>
                <span className="text-slate-300">
                  {metrics?.centroid.latitude}, {metrics?.centroid.longitude}
                </span>
              </div>
            </div>

            {/* Cadastral Registry Dossier (Prototype) */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cadastral Registry Record (Prototype)
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    selectedParcel.taxStatus === 'Paid'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : selectedParcel.taxStatus === 'Overdue'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                  }`}
                >
                  Tax: {selectedParcel.taxStatus}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Registry Reference:</span>
                  <span className="text-slate-100 font-semibold text-right max-w-[200px] truncate">
                    {selectedParcel.owner.primary}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assessed Valuation:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {selectedParcel.valuation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deed Registry Reference:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {selectedParcel.owner.deedBook}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Encumbrance Status:</span>
                  <span className="text-slate-300 text-[11px] font-medium">
                    {selectedParcel.owner.encumbrance}
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Strata Units Breakdown */}
            {selectedParcel.strataUnits && selectedParcel.strataUnits.length > 0 && (
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <Building2 className="w-3.5 h-3.5" />
                    3D Strata Titling Units ({selectedParcel.strataUnits.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Vertical Rights</span>
                </div>

                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {selectedParcel.strataUnits.map((unit, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-sky-300 font-bold">{unit.unit} ({unit.floor})</span>
                        <span className="text-[10px] text-slate-400">{unit.area}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 truncate max-w-[170px]">{unit.owner}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {unit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statutory Restrictions & Zoning Covenant */}
            <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong className="text-slate-300">Covenant:</strong> {selectedParcel.restrictions}
              </span>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
