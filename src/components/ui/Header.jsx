import React from 'react';
import {
  Camera,
  Video,
  Ruler,
  Upload,
  Download,
  FileText,
  MapPin,
  Layers,
  HelpCircle
} from 'lucide-react';
import { CADASTRAL_METRIC_ORIGIN } from '../../data/cadastralData';

export default function Header({
  onTakeSnapshot,
  onOpenVideoRecorder,
  isRecording,
  recordingTime,
  measureMode,
  onToggleMeasure,
  onOpenImportModal,
  onExportGeoJson,
  selectedParcel,
  onOpenDeedModal,
  onOpenHelp
}) {
  return (
    <header className="h-16 px-4 py-2 border-b border-slate-800/80 glass-panel flex items-center justify-between z-20 select-none">
      {/* Left: Branding & GIS Datum info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              GeoCadastre <span className="text-sky-400 font-mono text-sm px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-500/30">3D</span>
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LADM ISO 19152
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-sky-400" />
              {CADASTRAL_METRIC_ORIGIN.zoneName}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">EPSG:4326</span>
          </div>
        </div>
      </div>

      {/* Right: Actions and Tools */}
      <div className="flex items-center gap-2">
        {/* Measurement Tool Toggle */}
        <button
          onClick={onToggleMeasure}
          title="3D Laser Measurement Tool"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            measureMode
              ? 'bg-sky-500 text-slate-950 font-semibold ring-2 ring-sky-400/50 shadow-lg shadow-sky-500/25'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Measure</span>
        </button>

        {/* Snapshot PNG */}
        <button
          onClick={onTakeSnapshot}
          title="Capture High-Res 3D Canvas Snapshot"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all hover:border-slate-500"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Snapshot</span>
        </button>

        {/* Video Recorder */}
        <button
          onClick={onOpenVideoRecorder}
          title="Record 3D Flight / Screen Video"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isRecording
              ? 'bg-rose-500 text-white font-semibold animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-rose-500/50'
          }`}
        >
          <Video className={`w-3.5 h-3.5 ${isRecording ? 'text-white' : 'text-rose-400'}`} />
          <span className="hidden sm:inline">
            {isRecording ? `Rec ${recordingTime}s` : 'Record 3D'}
          </span>
        </button>

        {/* Import GeoJSON */}
        <button
          onClick={onOpenImportModal}
          title="Import Custom GeoJSON Parcels"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all hover:border-slate-500"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Import</span>
        </button>

        {/* Export GeoJSON */}
        <button
          onClick={onExportGeoJson}
          title="Export Cadastral Parcels to GeoJSON"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-all hover:border-slate-500"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Digital Title Deed (Enabled when parcel selected) */}
        {selectedParcel && (
          <button
            onClick={onOpenDeedModal}
            title="Generate Digital 3D Title Deed Certificate"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-md shadow-sky-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Digital Deed</span>
          </button>
        )}

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          title="Controls & Help"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
