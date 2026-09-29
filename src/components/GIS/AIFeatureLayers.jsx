import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  getBuildingFeatures,
  getRoadFeatures,
  getAccessCorridorFeatures,
  getBoundaryEvidenceFeatures
} from '../../data/gis';
import { LAND_USE_REGIONS } from '../../ai';

export default function AIFeatureLayers({
  showBuildings = true,
  showRoads = true,
  showAccess = true,
  showLandUse = true,
  showBoundaryEvidence = true,
  isProgressive = true
}) {
  // Progressive reveal stages for Scene 05 (5 Steps):
  // 1: Buildings -> 2: Roads -> 3: Access Corridors -> 4: Land-Use -> 5: Boundary Evidence
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (!isProgressive) return;
    const t1 = setTimeout(() => setStage(2), 1200);
    const t2 = setTimeout(() => setStage(3), 2400);
    const t3 = setTimeout(() => setStage(4), 3600);
    const t4 = setTimeout(() => setStage(5), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isProgressive]);

  const effectiveStage = isProgressive ? stage : 5;

  const buildings = getBuildingFeatures();
  const roads = getRoadFeatures();
  const accessCorridors = getAccessCorridorFeatures();
  const boundaryEvidence = getBoundaryEvidenceFeatures();

  const showBldgs = showBuildings && effectiveStage >= 1;
  const showRds = showRoads && effectiveStage >= 2;
  const showAcc = showAccess && effectiveStage >= 3;
  const showLU = showLandUse && effectiveStage >= 4;
  const showEvid = showBoundaryEvidence && effectiveStage >= 5;

  return (
    <group position={[0, 0.12, 0]}>
      {/* STEP 1: Buildings (Cyan vector outlines with B-001, B-002, B-003 labels) */}
      {showBldgs && (
        <group>
          {buildings.map((b) => {
            const [w, d] = b.localDimensions;
            const [x, z] = b.localCenter;
            return (
              <group key={b.id} position={[x, 0, z]}>
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(w + 0.3, 0.05, d + 0.3)]} />
                  <lineBasicMaterial color="#38bdf8" linewidth={2} />
                </lineSegments>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                  <planeGeometry args={[w + 0.3, d + 0.3]} />
                  <meshBasicMaterial color="#0284c7" transparent opacity={0.28} />
                </mesh>

                {/* Floating Building identifier tag */}
                {['B-001', 'B-002', 'B-003'].includes(b.id) && (
                  <Html position={[0, 4, 0]} center distanceFactor={45}>
                    <div className="bg-sky-950/95 border border-sky-400 text-sky-200 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{b.id} Detected</span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* STEP 2: Main Roads & Arterials (Amber Centerlines with "Road detected") */}
      {showRds && (
        <group>
          {roads.map((r) => {
            const [p1, p2] = r.pointsLocal;
            const isArterial = r.roadClass === 'arterial';
            const midX = (p1[0] + p2[0]) / 2;
            const midZ = (p1[1] + p2[1]) / 2;

            return (
              <group key={r.id}>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([p1[0], 0.05, p1[1], p2[0], 0.05, p2[1]])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial
                    color={isArterial ? '#f59e0b' : '#fbbf24'}
                    linewidth={isArterial ? 4 : 2}
                  />
                </line>
                {/* Amber ribbon buffer */}
                <mesh
                  position={[midX, 0.03, midZ]}
                  rotation={[-Math.PI / 2, 0, p1[0] === p2[0] ? 0 : Math.PI / 2]}
                >
                  <planeGeometry
                    args={[
                      r.width * 0.9,
                      Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
                    ]}
                  />
                  <meshBasicMaterial color="#f59e0b" transparent opacity={0.18} />
                </mesh>

                {/* Road detected tag on main artery */}
                {r.id === 'road-art-01' && (
                  <Html position={[0, 1.8, -15]} center distanceFactor={45}>
                    <div className="bg-amber-950/95 border border-amber-400 text-amber-200 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Road detected ({r.roadClass})</span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* STEP 3: Access Corridors & Pathways (Violet Lanes with "Access corridor detected") */}
      {showAcc && (
        <group>
          {accessCorridors.map((a) => {
            const [p1, p2] = a.pointsLocal;
            const midX = (p1[0] + p2[0]) / 2;
            const midZ = (p1[1] + p2[1]) / 2;

            return (
              <group key={a.id}>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([p1[0], 0.06, p1[1], p2[0], 0.06, p2[1]])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#a855f7" linewidth={2} />
                </line>
                <mesh
                  position={[midX, 0.04, midZ]}
                  rotation={[-Math.PI / 2, 0, p1[0] === p2[0] ? 0 : Math.PI / 2]}
                >
                  <planeGeometry
                    args={[
                      a.width * 0.8,
                      Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
                    ]}
                  />
                  <meshBasicMaterial color="#c084fc" transparent opacity={0.22} />
                </mesh>

                {a.id === 'acc-01' && (
                  <Html position={[-45, 1.8, 15]} center distanceFactor={45}>
                    <div className="bg-purple-950/95 border border-purple-400 text-purple-200 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-xl flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>Access corridor detected</span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* STEP 4: Land-Use Classification Regions (Subtle illustrative zoning overlays) */}
      {showLU && (
        <group>
          {LAND_USE_REGIONS.map((lu) => (
            <group key={lu.id} position={[lu.center[0], 0.02, lu.center[1]]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[lu.dimensions[0], lu.dimensions[1]]} />
                <meshBasicMaterial color={lu.color} transparent opacity={0.14} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(lu.dimensions[0], 0.04, lu.dimensions[1])]} />
                <lineBasicMaterial color={lu.color} transparent opacity={0.4} />
              </lineSegments>
              <Html position={[0, 0.5, 0]} center distanceFactor={60}>
                <div className="bg-slate-950/80 border border-slate-700/60 px-2 py-0.5 rounded text-[8px] font-mono text-slate-300 pointer-events-none whitespace-nowrap shadow-md">
                  <span>{lu.classification}</span>
                  <span className="text-slate-500 ml-1">(Illustrative AI)</span>
                </div>
              </Html>
            </group>
          ))}
        </group>
      )}

      {/* STEP 5: Boundary Evidence Layer (Green = High Confidence, Yellow = Uncertain) */}
      {/* Principle: A visible physical feature is NOT automatically a legal cadastral boundary */}
      {showEvid && (
        <group>
          {boundaryEvidence.map((seg) => {
            const isHigh = seg.confidence === 'HIGH';
            const col = isHigh ? '#10b981' : '#eab308';

            return (
              <group key={seg.id}>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([
                        seg.from[0], 0.1, seg.from[1],
                        seg.to[0], 0.1, seg.to[1]
                      ])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color={col} linewidth={isHigh ? 3 : 2} />
                </line>

                {/* Warning beacon on uncertain boundary features */}
                {!isHigh && (
                  <Html
                    position={[
                      (seg.from[0] + seg.to[0]) / 2,
                      1.6,
                      (seg.from[1] + seg.to[1]) / 2
                    ]}
                    center
                    distanceFactor={45}
                  >
                    <div className="bg-amber-950/95 border border-amber-400 text-amber-300 px-2 py-0.5 rounded shadow-xl text-[9px] font-mono whitespace-nowrap flex items-center gap-1 animate-pulse">
                      <span>⚠️</span>
                      <span>UNCERTAIN: {seg.label}</span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}

      {/* Interactive 3D Status Legend Overlay */}
      <Html position={[-45, 5.5, -40]} distanceFactor={60}>
        <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-xl text-[10px] font-mono shadow-2xl flex flex-col gap-1.5 text-slate-300 backdrop-blur-md min-w-[220px] pointer-events-none select-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-bold text-sky-400 uppercase">
              AI Multi-Class Vectors
            </span>
            <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/30">
              Step {effectiveStage}/5
            </span>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${showBldgs ? 'text-cyan-300 opacity-100' : 'text-slate-600 opacity-40'}`}>
            <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
            <span>1. Buildings (Cyan Footprints)</span>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${showRds ? 'text-amber-300 opacity-100' : 'text-slate-600 opacity-40'}`}>
            <span className="w-2.5 h-2.5 rounded bg-amber-400" />
            <span>2. Roads (Amber Centerlines)</span>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${showAcc ? 'text-purple-300 opacity-100' : 'text-slate-600 opacity-40'}`}>
            <span className="w-2.5 h-2.5 rounded bg-purple-400" />
            <span>3. Access Corridors (Violet)</span>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${showLU ? 'text-indigo-300 opacity-100' : 'text-slate-600 opacity-40'}`}>
            <span className="w-2.5 h-2.5 rounded bg-indigo-400" />
            <span>4. Land-Use (Illustrative Zoning)</span>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${showEvid ? 'text-emerald-300 opacity-100' : 'text-slate-600 opacity-40'}`}>
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>5. Boundary Evidence (Green / Yellow)</span>
          </div>

          <div className="text-[8px] text-slate-400 pt-1 border-t border-slate-800 leading-tight">
            * Visible physical feature ≠ Legal boundary. Requires ground surveyor validation.
          </div>
        </div>
      </Html>
    </group>
  );
}
