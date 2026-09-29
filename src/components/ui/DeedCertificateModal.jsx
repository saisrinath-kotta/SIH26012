import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Printer, Download, ShieldCheck, CheckCircle2, QrCode, Award, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateParcelMetrics } from '../../utils/gisUtils';

export default function DeedCertificateModal({
  isOpen,
  onClose,
  parcel
}) {
  const metrics = useMemo(() => {
    if (!parcel) return null;
    return calculateParcelMetrics(parcel.geoJsonCoordinates);
  }, [parcel]);

  useEffect(() => {
    if (isOpen && parcel) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, parcel]);

  if (!isOpen || !parcel) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const deedData = {
      recordTitle: 'PRELIMINARY 3D CADASTRAL DOSSIER RECORD',
      prototypeSystem: 'PS12 AI-BASED CADASTRAL EXTRACTION SYSTEM',
      illustrativeParcelId: parcel.ulpin,
      surveyNumber: parcel.surveyNumber,
      khasraNumber: parcel.khasraNumber,
      zone: parcel.zone,
      spatialMetrics: metrics,
      registryReference: parcel.owner,
      valuation: parcel.valuation,
      strataUnits: parcel.strataUnits,
      verificationHash: `SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`,
      issuedTimestamp: new Date().toISOString(),
      disclaimer: 'AI-ASSISTED PRELIMINARY RESULTS — REQUIRES SURVEYOR VALIDATION. NOT AN OFFICIAL CADASTRAL RECORD.'
    };

    const blob = new Blob([JSON.stringify(deedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `3d_cadastral_dossier_${parcel.ulpin}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl relative text-slate-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Decorative Border Header */}
        <div className="text-center flex flex-col items-center gap-1.5 pb-3 border-b-2 border-amber-500/30">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-bold">
            PS12 PROTOTYPE 3D CADASTRAL REGISTRY SIMULATOR
          </span>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white uppercase">
            3D Cadastral Dossier & Preliminary Record
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Spatial Geometry formatted under LADM ISO 19152 Prototype Specifications
          </span>
        </div>

        {/* Mandatory Statutory Disclaimer Ribbon */}
        <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] text-amber-200/90 font-mono">
            AI-ASSISTED PRELIMINARY RESULTS — REQUIRES SURVEYOR VALIDATION. NOT AN OFFICIAL CADASTRAL RECORD OR LEGAL PROPERTY TITLE.
          </span>
        </div>

        {/* Illustrative ID and Survey Ribbon */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">
              Illustrative Parcel ID (Demo)
            </span>
            <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
              {parcel.ulpin}
            </span>
          </div>
          <div className="flex gap-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Survey No.</span>
              <span className="font-mono font-bold text-sky-300">{parcel.surveyNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Khasra / Khata</span>
              <span className="font-mono font-bold text-sky-300">{parcel.khasraNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Land Zoning</span>
              <span className="font-bold text-emerald-400">{parcel.zone}</span>
            </div>
          </div>
        </div>

        {/* Main Certificate Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Ownership Details */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <h4 className="font-bold text-sky-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <ShieldCheck className="w-4 h-4" />
              Registry Reference Record
            </h4>
            <div className="flex flex-col gap-1.5 text-xs mt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Reference Entity / Occupant:</span>
                <span className="font-bold text-slate-100">{parcel.owner.primary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax / ID Code:</span>
                <span className="font-mono text-slate-300">{parcel.owner.panOrId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registry Reference:</span>
                <span className="font-mono text-slate-300">{parcel.owner.deedBook}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Record Date:</span>
                <span className="text-slate-300">{parcel.owner.registrationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Encumbrance Status:</span>
                <span className="text-emerald-400 font-semibold">{parcel.owner.encumbrance}</span>
              </div>
            </div>
          </div>

          {/* Spatial Metrics (Turf.js) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Geodetic Survey & 3D Extent
            </h4>
            <div className="flex flex-col gap-1.5 text-xs mt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Ground Plot Area:</span>
                <span className="font-mono font-bold text-slate-100">
                  {metrics?.areaSqM.toLocaleString()} m² ({metrics?.areaSqFt.toLocaleString()} sq.ft)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Boundary Perimeter:</span>
                <span className="font-mono text-slate-300">{metrics?.perimeterM} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vertical Height Rights:</span>
                <span className="font-mono text-sky-400 font-bold">{parcel.height}m ({parcel.floors} Storeys)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assessed Value:</span>
                <span className="font-mono text-amber-300 font-bold">{parcel.valuation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Centroid WGS84:</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {metrics?.centroid.latitude}, {metrics?.centroid.longitude}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strata Titling Units (3D Condo Breakdown) */}
        {parcel.strataUnits && parcel.strataUnits.length > 0 && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-indigo-400 uppercase tracking-wider text-[11px] mb-2">
              Modeled 3D Strata Parcel Units ({parcel.strataUnits.length} Vertical Units)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {parcel.strataUnits.map((u, i) => (
                <div key={i} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center font-mono text-[11px]">
                  <div>
                    <span className="text-sky-300 font-bold">{u.unit}</span>
                    <span className="text-slate-400 ml-1">({u.floor})</span>
                  </div>
                  <span className="text-slate-300 truncate max-w-[140px]">{u.owner}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Seal, Digital Hash and QR */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white p-1 rounded-lg flex items-center justify-center text-slate-950">
              <QrCode className="w-9 h-9" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-slate-400">PROTOTYPE CRYPTOGRAPHIC RECORD</span>
              <span className="font-mono text-[9px] text-emerald-400">SHA256: 7f83b16...126d9069</span>
              <span className="text-[9px] text-slate-500">Turf.js EPSG:4326 Geodetic Calculation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
