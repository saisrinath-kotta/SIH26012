import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileCode, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { CADASTRAL_METRIC_ORIGIN } from '../../data/cadastralData';

export default function GeoJsonImportModal({
  isOpen,
  onClose,
  onImportParcels
}) {
  const [jsonText, setJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonText(event.target.result);
      setErrorMsg(null);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    const sample = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'PAR-CUSTOM-01',
            ulpin: '14092400999999',
            surveyNumber: 'Sy. No. 99/A',
            khasraNumber: 'KH-999',
            name: 'Solar Horizon Research Center',
            zone: 'Commercial',
            height: 36,
            floors: 8,
            setback: 4.0,
            valuation: '₹ 18.50 Cr',
            taxStatus: 'Paid',
            ownerPrimary: 'Horizon Renewable Energy Consortium',
            color: '#06b6d4'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [77.5932, 12.9710],
                [77.5935, 12.9710],
                [77.5935, 12.9714],
                [77.5932, 12.9714],
                [77.5932, 12.9710]
              ]
            ]
          }
        }
      ]
    };
    setJsonText(JSON.stringify(sample, null, 2));
    setErrorMsg(null);
    setSuccessMsg('Sample GeoJSON loaded. Click "Import into 3D Scene" to visualize.');
  };

  const handleProcessImport = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!jsonText.trim()) {
        throw new Error('Please paste GeoJSON content or upload a file.');
      }

      const parsed = JSON.parse(jsonText);
      let features = [];

      if (parsed.type === 'FeatureCollection' && Array.isArray(parsed.features)) {
        features = parsed.features;
      } else if (parsed.type === 'Feature') {
        features = [parsed];
      } else {
        throw new Error('Invalid GeoJSON: must be a Feature or FeatureCollection.');
      }

      if (features.length === 0) {
        throw new Error('No features found in GeoJSON.');
      }

      // Convert GeoJSON features into 3D cadastral parcel format
      const newParcels = features.map((feat, idx) => {
        if (!feat.geometry || feat.geometry.type !== 'Polygon') {
          throw new Error(`Feature ${idx + 1} is not a Polygon geometry.`);
        }

        const coords = feat.geometry.coordinates[0]; // Exterior ring
        const props = feat.properties || {};

        // Convert WGS84 lon/lat relative to origin to metric space (approx 1 deg lat ~ 111,000m, 1 deg lon ~ 111,000m * cos(lat))
        const originLon = CADASTRAL_METRIC_ORIGIN.longitude;
        const originLat = CADASTRAL_METRIC_ORIGIN.latitude;
        const latRad = (originLat * Math.PI) / 180;
        const metersPerDegLat = 111000;
        const metersPerDegLon = 111000 * Math.cos(latRad);

        const localPolygon = coords.map(([lon, lat]) => {
          const x = (lon - originLon) * metersPerDegLon;
          const z = (lat - originLat) * metersPerDegLat;
          return [Math.round(x * 10) / 10, Math.round(z * 10) / 10];
        });

        return {
          id: props.id || `PAR-IMP-${Date.now()}-${idx}`,
          ulpin: props.ulpin || `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
          surveyNumber: props.surveyNumber || `Sy. No. ${100 + idx}/Imp`,
          khasraNumber: props.khasraNumber || `KH-${200 + idx}`,
          name: props.name || `Imported Cadastral Parcel ${idx + 1}`,
          zone: props.zone || 'Commercial',
          color: props.color || '#38bdf8',
          wireColor: props.wireColor || '#7dd3fc',
          height: props.height || props.height_meters || 20,
          floors: props.floors || Math.max(1, Math.round((props.height || 20) / 3.5)),
          setback: props.setback || 3.0,
          taxStatus: props.taxStatus || 'Paid',
          valuation: props.valuation || '₹ 15.00 Cr',
          owner: {
            primary: props.ownerPrimary || 'Registered Landholder',
            panOrId: props.panOrId || 'IMP-REG-2024',
            registrationDate: props.registrationDate || new Date().toLocaleDateString(),
            deedBook: 'Imported Record V-1',
            encumbrance: 'Clear Title'
          },
          polygon: localPolygon,
          geoJsonCoordinates: feat.geometry.coordinates,
          strataUnits: [
            { unit: 'U-01', floor: 'Ground', type: 'Office / Facility', area: '450 sq.m', owner: 'Primary Landholder', status: 'Active' }
          ],
          restrictions: props.restrictions || 'Standard Municipal Building Code'
        };
      });

      onImportParcels(newParcels);
      setSuccessMsg(`Successfully imported ${newParcels.length} parcel(s) into 3D Cadastre!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to parse GeoJSON.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-xl rounded-2xl p-6 flex flex-col gap-4 border border-slate-700/80 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import Cadastral GeoJSON</h3>
              <p className="text-xs text-slate-400">
                Upload polygon parcels or paste standard GeoJSON
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* File Dropzone */}
        <div className="flex flex-col gap-2">
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-400/60 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all text-center">
            <FileCode className="w-8 h-8 text-indigo-400" />
            <div>
              <span className="text-xs font-semibold text-slate-200">
                Click to upload .geojson / .json file
              </span>
              <p className="text-[11px] text-slate-500">Supports Polygon and MultiPolygon features</p>
            </div>
            <input
              type="file"
              accept=".geojson,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Or paste raw GeoJSON payload:</span>
            <button
              onClick={handleLoadSample}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Load Sample Parcel
            </button>
          </div>
          <textarea
            rows={6}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{"type": "FeatureCollection", "features": [...]}'
            className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessImport}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            Import into 3D Scene
          </button>
        </div>
      </motion.div>
    </div>
  );
}
