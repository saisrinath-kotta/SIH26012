import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Check,
  Edit3,
  CheckCircle2,
  Download,
  Upload,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { INITIAL_PARCELS_PS12 } from '../../data/parcelData';
import { exportGeoJsonFile, parseImportedGeoJson } from '../../utils/gisUtils';

export default function WebGISInterface({
  selectedParcelId,
  onSelectParcel,
  onVerifyParcel
}) {
  // Layer Controls (Section 9):
  // ☑ Orthomosaic, ☑ Buildings, ☑ Roads, ☑ Access Corridors, ☑ Boundary Evidence, ☑ Preliminary Parcels, ☑ Topology Errors
  const [activeLayers, setActiveLayers] = useState({
    ortho: true,
    buildings: true,
    roads: true,
    accessCorridors: true,
    boundaryEvidence: true,
    parcels: true,
    topologyErrors: false
  });

  const [verifiedMap, setVerifiedMap] = useState({
    P001: false,
    P002: true,
    P003: false,
    P004: true,
    P005: false
  });

  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const selectedParcel =
    INITIAL_PARCELS_PS12.find((p) => p.id === selectedParcelId) ||
    INITIAL_PARCELS_PS12[0];

  const isVerified = verifiedMap[selectedParcel.id];

  const handleVerify = () => {
    setVerifiedMap((prev) => ({ ...prev, [selectedParcel.id]: true }));
    if (onVerifyParcel) onVerifyParcel(selectedParcel.id);
  };

  const toggleLayer = (key) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    exportGeoJsonFile(INITIAL_PARCELS_PS12, 'ps12_preliminary_parcels.geojson');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      const res = parseImportedGeoJson(content);
      if (res.success) {
        setImportStatus({
          type: 'success',
          msg: `Imported ${res.count} parcel polygon(s) successfully.`
        });
        if (res.parcels.length > 0 && onSelectParcel) {
          onSelectParcel(res.parcels[0]);
        }
      } else {
        setImportStatus({
          type: 'error',
          msg: `Import Failed: ${res.error}`
        });
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="absolute top-20 right-4 z-30 w-92 max-w-[calc(100vw-2rem)] flex flex-col gap-3 select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-2xl p-4 flex flex-col gap-3 border border-slate-700/80 shadow-2xl text-slate-100 max-h-[calc(100vh-6rem)] overflow-y-auto"
      >
        {/* WebGIS Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Web-GIS Cadastral Desk
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">
                Ward 14 • Kengeri Sector (WGS 84)
              </span>
            </div>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
            LADM ISO 19152
          </span>
        </div>

        {/* Layer Visibility Quick Toggles (7 Layers) */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 block">
            GIS Layer Stack Controls
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            {[
              { key: 'ortho', label: 'Orthomosaic' },
              { key: 'buildings', label: 'Buildings' },
              { key: 'roads', label: 'Roads' },
              { key: 'accessCorridors', label: 'Access Corridors' },
              { key: 'boundaryEvidence', label: 'Boundary Evidence' },
              { key: 'parcels', label: 'Preliminary Parcels' },
              { key: 'topologyErrors', label: 'Topology Errors' }
            ].map((layer) => (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                className={`px-2 py-1 rounded-lg text-left flex items-center justify-between transition-all border ${
                  activeLayers[layer.key]
                    ? 'bg-slate-800/90 text-sky-300 border-sky-500/40'
                    : 'bg-slate-900/40 text-slate-500 border-transparent hover:bg-slate-800/50'
                }`}
              >
                <span className="truncate pr-1">{layer.label}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    activeLayers[layer.key] ? 'bg-sky-400' : 'bg-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Parcel Information Dossier (Section 9 Requirement) */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-mono font-bold text-sky-400 text-sm">
              {selectedParcel.id}
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                isVerified
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isVerified ? 'VERIFIED' : 'AI-ASSISTED PRELIMINARY'}
            </span>
          </div>

          <div className="flex flex-col gap-1 text-[11px] font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Area:</span>
              <span className="font-bold text-slate-100">
                {selectedParcel.areaSqM.toLocaleString()} m²
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="text-sky-300">{selectedParcel.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Boundary Confidence:</span>
              <span className="text-emerald-400 font-bold">
                {selectedParcel.confidenceLabel || 'Illustrative (94%)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Source:</span>
              <span className="text-slate-200">{selectedParcel.source || 'AI-assisted'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Validation:</span>
              <span className={isVerified ? 'text-emerald-300' : 'text-amber-300'}>
                {isVerified ? 'Surveyor Field Verified' : selectedParcel.validation || 'Requires Surveyor Review'}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1 text-[10px]">
              <span className="text-slate-500">Illustrative ID:</span>
              <span className="text-slate-400">{selectedParcel.ulpin}</span>
            </div>
          </div>
        </div>

        {/* Parcel Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {INITIAL_PARCELS_PS12.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectParcel(p)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition-all border ${
                selectedParcel.id === p.id
                  ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        {/* Section 10: GeoJSON Import / Export Workflow */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-800">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            GeoJSON Pipeline Operations
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              className="px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 border border-sky-500/40 transition-all shadow-sm"
              title="Export canonical GeoJSON dataset"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>EXPORT GEOJSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[10px] font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-all shadow-sm"
              title="Import GeoJSON parcel file"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>IMPORT GEOJSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".geojson,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {importStatus && (
            <div
              className={`p-2 rounded-lg text-[10px] font-mono flex items-center gap-1.5 border ${
                importStatus.type === 'success'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
              }`}
            >
              {importStatus.type === 'success' ? (
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>{importStatus.msg}</span>
            </div>
          )}
        </div>

        {/* Action Buttons: [EDIT] [VERIFY] [ACCEPT] */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={() => alert(`Editing vertex nodes for ${selectedParcel.id}`)}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] flex items-center justify-center gap-1 border border-slate-700/60 transition-all"
          >
            <Edit3 className="w-3 h-3 text-sky-400" />
            <span>EDIT</span>
          </button>

          <button
            onClick={handleVerify}
            className={`px-2 py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all ${
              isVerified
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>{isVerified ? 'VERIFIED' : 'VERIFY'}</span>
          </button>

          <button
            onClick={() => alert(`Parcel ${selectedParcel.id} draft submitted for surveyor field sign-off.`)}
            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 font-semibold text-[11px] flex items-center justify-center gap-1 border border-slate-700/60 transition-all"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>ACCEPT</span>
          </button>
        </div>

        {/* Statutory Legal Disclaimer */}
        <div className="text-[8px] text-slate-400 font-mono pt-1 border-t border-slate-800 leading-tight">
          AI-ASSISTED PRELIMINARY RESULTS — REQUIRES SURVEYOR VALIDATION. Prototype Visualization Dataset.
        </div>
      </motion.div>
    </div>
  );
}
