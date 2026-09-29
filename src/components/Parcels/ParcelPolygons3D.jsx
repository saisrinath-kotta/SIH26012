import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  INITIAL_PARCELS_PS12,
  VALIDATED_PARCELS_PS12,
  TOPOLOGY_ERROR_DEMO
} from '../../data/parcelData';

function createShape(points) {
  const shape = new THREE.Shape();
  if (!points || points.length === 0) return shape;
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  return shape;
}

function ParcelItem({
  parcel,
  mode,
  isSelected,
  onSelectParcel,
  surveyorAdjusted,
  generationStage = 4
}) {
  const shape = useMemo(() => createShape(parcel.polygon), [parcel.polygon]);

  const linePoints = useMemo(() => {
    return parcel.polygon.map(([x, z]) => new THREE.Vector3(x, 0.15, z));
  }, [parcel.polygon]);

  // In Scene 07 preliminary generation:
  // stage 1: evidence lines only
  // stage 2: feature relationships / graph
  // stage 3: candidate perimeter
  // stage 4: full preliminary parcel polygon
  const showFill = mode !== 'preliminary' || generationStage >= 3;
  const showPerimeter = mode !== 'preliminary' || generationStage >= 2;
  const showEvidenceLines = mode === 'preliminary' && generationStage === 1;

  // Elevation based on scene mode
  const elevY = mode === 'preliminary' ? 0.6 : (mode === 'topology' ? 0.3 : 0.2);

  return (
    <group position={[0, elevY, 0]}>
      {/* 3D Translucent Parcel Fill */}
      {showFill && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectParcel) onSelectParcel(parcel);
          }}
        >
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial
            color={
              mode === 'verified'
                ? '#10b981'
                : isSelected
                ? '#0284c7'
                : parcel.color
            }
            transparent
            opacity={mode === 'verified' ? 0.26 : (isSelected ? 0.38 : (generationStage === 3 ? 0.12 : 0.22))}
            roughness={0.2}
            metalness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Perimeter Boundary Line */}
      {mode !== 'uncertainty' && showPerimeter && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePoints.length}
              array={new Float32Array(linePoints.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={
              mode === 'verified'
                ? '#34d399'
                : isSelected
                ? '#38bdf8'
                : (generationStage === 2 ? '#a855f7' : '#0284c7')
            }
            linewidth={isSelected ? 3 : 2}
          />
        </line>
      )}

      {/* Mode: PRELIMINARY Stage 1 Boundary Evidence vectors before polygonization */}
      {showEvidenceLines && (
        <group>
          {parcel.boundarySegments.map((seg) => (
            <line key={seg.id}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    seg.from[0], 0.18, seg.from[1],
                    seg.to[0], 0.18, seg.to[1]
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={seg.confidence === 'HIGH' ? '#10b981' : '#eab308'} linewidth={2} />
            </line>
          ))}
        </group>
      )}

      {/* Mode: UNCERTAINTY - Color coded boundary segments (Green = High Confidence, Yellow = Uncertain) */}
      {mode === 'uncertainty' && (
        <group>
          {parcel.boundarySegments.map((seg, sIdx) => {
            const isHigh = seg.confidence === 'HIGH';
            const isAdjustedGreen = surveyorAdjusted && parcel.id === 'P001' && sIdx === 2;
            const segColor = (isHigh || isAdjustedGreen) ? '#10b981' : '#eab308';

            return (
              <group key={seg.id}>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([
                        seg.from[0], 0.2, seg.from[1],
                        seg.to[0], 0.2, seg.to[1]
                      ])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color={segColor} linewidth={isHigh ? 3 : 4} />
                </line>

                {/* Warning beacon on uncertain lines (Scene 08 Requirement) */}
                {!isHigh && !isAdjustedGreen && (
                  <Html
                    position={[
                      (seg.from[0] + seg.to[0]) / 2,
                      2.2,
                      (seg.from[1] + seg.to[1]) / 2
                    ]}
                    center
                    distanceFactor={45}
                  >
                    <div className="bg-amber-950/95 border-2 border-amber-400 text-amber-200 px-3 py-1.5 rounded-xl shadow-2xl text-[10px] font-mono whitespace-nowrap flex flex-col gap-0.5 items-center animate-pulse">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <span>⚠️</span>
                        <span>FLAGGED UNCERTAIN FEATURE</span>
                      </div>
                      <span className="text-[9px] text-amber-200/90 font-sans">
                        Hedge / broken fence — Surveyor field review required
                      </span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Floating Parcel Identifier Tag */}
      {(mode !== 'preliminary' || generationStage >= 3) && (
        <Html
          position={[parcel.centroid[0], 2.2, parcel.centroid[1]]}
          center
          distanceFactor={55}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectParcel) onSelectParcel(parcel);
            }}
            className={`cursor-pointer px-2.5 py-1.5 rounded-lg text-[10px] font-mono shadow-2xl backdrop-blur-md flex flex-col gap-0.5 border transition-all ${
              isSelected
                ? 'bg-sky-950/95 border-sky-400 text-sky-200 ring-2 ring-sky-400/40 scale-105 font-bold'
                : mode === 'verified'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 font-semibold'
                : 'bg-slate-950/90 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  mode === 'verified'
                    ? 'bg-emerald-400'
                    : isSelected
                    ? 'bg-sky-400'
                    : 'bg-cyan-400'
                }`}
              />
              <span className="font-bold text-white">{parcel.id}</span>
              <span className="text-slate-400 font-normal">({parcel.areaSqM.toLocaleString()} m²)</span>
            </div>

            {mode === 'preliminary' && (
              <div className="flex items-center justify-between text-[8px] text-cyan-300/80 border-t border-slate-800 pt-0.5">
                <span>{parcel.confidenceLabel || 'Illustrative (94%)'}</span>
                <span className="text-amber-300 font-bold">PRELIMINARY</span>
              </div>
            )}

            {mode === 'verified' && (
              <div className="text-[8px] text-emerald-300 border-t border-emerald-900/60 pt-0.5">
                Verified by Surveyor
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ParcelPolygons3D({
  mode = 'preliminary',
  selectedParcelId = 'P001',
  onSelectParcel,
  surveyorAdjusted = false
}) {
  const overlapShape = useMemo(() => createShape(TOPOLOGY_ERROR_DEMO.overlapPolygon), []);
  const gapShape = useMemo(() => createShape(TOPOLOGY_ERROR_DEMO.gapPoints), []);

  // In Scene 07: sequential animation stages:
  // 1: Boundary Evidence -> 2: Feature Relationships -> 3: Candidate Polygons -> 4: Preliminary Parcel Map
  const [genStage, setGenStage] = useState(mode === 'preliminary' ? 1 : 4);

  useEffect(() => {
    if (mode !== 'preliminary') {
      return;
    }
    const t1 = setTimeout(() => setGenStage(2), 1100);
    const t2 = setTimeout(() => setGenStage(3), 2200);
    const t3 = setTimeout(() => setGenStage(4), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [mode]);

  const effectiveGenStage = mode === 'preliminary' ? genStage : 4;
  const parcelsList = mode === 'verified' ? VALIDATED_PARCELS_PS12 : INITIAL_PARCELS_PS12;

  return (
    <group position={[0, 0.15, 0]}>
      {parcelsList.map((parcel) => (
        <ParcelItem
          key={parcel.id}
          parcel={parcel}
          mode={mode}
          isSelected={selectedParcelId === parcel.id}
          onSelectParcel={onSelectParcel}
          surveyorAdjusted={surveyorAdjusted}
          generationStage={effectiveGenStage}
        />
      ))}

      {/* Mode: TOPOLOGY ERROR HIGHLIGHTS (Overlaps in Red, Gaps in Amber) */}
      {mode === 'topology' && (
        <group>
          {/* Overlapping Polygon in RED */}
          <group position={[0, 0.45, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <shapeGeometry args={[overlapShape]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            <Html position={[-20, 3.2, 16]} center distanceFactor={45}>
              <div className="bg-rose-950/95 border-2 border-rose-500 text-rose-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-2xl animate-pulse flex items-center gap-2">
                <span>⛔</span>
                <span>OVERLAPPING GEOMETRY DETECTED (38.4 m²)</span>
              </div>
            </Html>
          </group>

          {/* Void Gap in AMBER */}
          <group position={[0, 0.35, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <shapeGeometry args={[gapShape]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
            <Html position={[-2, 2.8, 0]} center distanceFactor={45}>
              <div className="bg-amber-950/95 border border-amber-500 text-amber-200 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shadow-2xl flex items-center gap-1.5">
                <span>⚠️</span>
                <span>GAP DETECTED (2.4m VOID)</span>
              </div>
            </Html>
          </group>

          {/* Geometric Notice */}
          <Html position={[-12, 14, -10]} center distanceFactor={55}>
            <div className="bg-slate-950/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[10px] text-slate-400 font-mono shadow-xl backdrop-blur-md text-center max-w-sm">
              Note: Topology repair establishes planar geometric validity for the prototype. It does not replace cadastral surveyor sanction.
            </div>
          </Html>
        </group>
      )}

      {/* Hero Scene 07 Title & Transformation Pipeline in 3D Viewport */}
      {mode === 'preliminary' && (
        <Html position={[-10, 16, -10]} center distanceFactor={60}>
          <div className="bg-slate-950/95 border border-sky-400 text-sky-300 px-5 py-3 rounded-2xl text-xs font-mono font-bold shadow-2xl backdrop-blur-md flex flex-col items-center gap-2 text-center ring-2 ring-sky-400/30">
            <span className="text-white text-sm tracking-wide">AI-ASSISTED PRELIMINARY PARCEL MAP</span>
            <div className="flex items-center gap-1.5 text-[9px] font-mono border-t border-slate-800 pt-1.5">
              <span className={effectiveGenStage >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-600'}>
                1. Boundary Evidence
              </span>
              <span className="text-sky-400">→</span>
              <span className={effectiveGenStage >= 2 ? 'text-purple-300 font-semibold' : 'text-slate-600'}>
                2. Feature Graph
              </span>
              <span className="text-sky-400">→</span>
              <span className={effectiveGenStage >= 3 ? 'text-cyan-300 font-semibold' : 'text-slate-600'}>
                3. Candidate Polygons
              </span>
              <span className="text-sky-400">→</span>
              <span className={effectiveGenStage >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                4. Preliminary Map
              </span>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
              REQUIRES SURVEYOR VALIDATION
            </span>
          </div>
        </Html>
      )}

      {/* Scene 08: Uncertainty Differentiation Banner in 3D Viewport (Section 10 Requirement) */}
      {mode === 'uncertainty' && (
        <Html position={[-12, 15, 0]} center distanceFactor={60}>
          <div className="bg-slate-950/95 border border-amber-500/80 text-amber-200 px-5 py-3 rounded-2xl text-xs font-mono shadow-2xl backdrop-blur-md flex flex-col items-center gap-1.5 text-center ring-1 ring-amber-500/30">
            <span className="text-white text-sm font-bold tracking-wide">
              AI DOES NOT GUESS
            </span>
            <span className="text-[11px] text-amber-300 font-medium">
              UNCERTAIN FEATURES ARE FLAGGED FOR SURVEYOR REVIEW
            </span>
            <div className="flex items-center gap-3 text-[9px] text-slate-300 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded bg-emerald-500" />
                <span>Compound Wall = HIGH CONFIDENCE</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded bg-amber-500" />
                <span>Hedge / Fence = UNCERTAIN</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
