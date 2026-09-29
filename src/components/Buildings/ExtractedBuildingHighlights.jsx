import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RotateCcw } from 'lucide-react';
import { getBuildingFeatures } from '../../data/gis';
import { getBuildingCategoricalConfidence } from '../../ai';

// Helper to compute progressive perimeter points and head position
function computePerimeterTrace(w, d, progress) {
  const halfW = w / 2;
  const halfD = d / 2;

  // 4 corners of rectangular footprint
  const c0 = [-halfW, -halfD];
  const c1 = [halfW, -halfD];
  const c2 = [halfW, halfD];
  const c3 = [-halfW, halfD];
  const c4 = [-halfW, -halfD];

  const totalLength = 2 * (w + d);
  const p = Math.min(1, Math.max(0, progress));
  const s = p * totalLength;

  if (p <= 0) {
    return { points: [], tracerPos: null };
  }

  const y = 0.12;
  const pts = [[c0[0], y, c0[1]]];
  let head = [c0[0], y, c0[1]];

  if (s <= w) {
    const ratio = s / w;
    head = [c0[0] + ratio * w, y, c0[1]];
    pts.push(head);
  } else if (s <= w + d) {
    pts.push([c1[0], y, c1[1]]);
    const ratio = (s - w) / d;
    head = [c1[0], y, c1[1] + ratio * d];
    pts.push(head);
  } else if (s <= 2 * w + d) {
    pts.push([c1[0], y, c1[1]]);
    pts.push([c2[0], y, c2[1]]);
    const ratio = (s - w - d) / w;
    head = [c2[0] - ratio * w, y, c2[1]];
    pts.push(head);
  } else {
    pts.push([c1[0], y, c1[1]]);
    pts.push([c2[0], y, c2[1]]);
    pts.push([c3[0], y, c3[1]]);
    const ratio = (s - 2 * w - d) / d;
    head = [c3[0], y, c3[1] - ratio * d];
    pts.push(head);
  }

  if (p >= 1) {
    pts.push([c4[0], y, c4[1]]);
    head = null;
  }

  return { points: pts, tracerPos: head };
}

// Subcomponent: Live dynamic outline tracing line
function ProgressiveTraceLine({ points }) {
  const lineGeom = useMemo(() => new THREE.BufferGeometry(), []);

  useEffect(() => {
    if (!points || points.length < 2) {
      lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
      return;
    }
    const flat = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      flat[i * 3] = points[i][0];
      flat[i * 3 + 1] = points[i][1];
      flat[i * 3 + 2] = points[i][2];
    }
    lineGeom.setAttribute('position', new THREE.BufferAttribute(flat, 3));
    lineGeom.computeBoundingSphere();
  }, [points, lineGeom]);

  if (!points || points.length < 2) return null;

  return (
    <line geometry={lineGeom}>
      <lineBasicMaterial color="#00ffff" linewidth={3} />
    </line>
  );
}

// Subcomponent: Single Building Extraction Flow
function BuildingExtractionUnit({
  building,
  time,
  traceStart,
  traceDuration,
  liftDelay
}) {
  const [w, d, h] = building.localDimensions;
  const [x, z] = building.localCenter;

  const traceEnd = traceStart + traceDuration;
  const isDetected = time >= traceStart - 0.2;
  const traceProgress = Math.min(1, Math.max(0, (time - traceStart) / traceDuration));
  const isTraceComplete = traceProgress >= 1;

  // Polygon lift transition from 0.08 to 0.32m
  const liftStart = traceEnd;
  const liftDuration = 0.6;
  const liftProgress = Math.min(1, Math.max(0, (time - liftStart) / liftDuration));
  const liftY = 0.08 + liftProgress * 0.24;

  const showLabel = time >= liftStart + (liftDelay || 0.1);

  const { points, tracerPos } = useMemo(() => {
    return computePerimeterTrace(w, d, traceProgress);
  }, [w, d, traceProgress]);

  const catConf = getBuildingCategoricalConfidence(building.id);

  return (
    <group position={[x, 0, z]}>
      {/* 1. Building Detection Wireframe (Appears when AI detection locks) */}
      {isDetected && (
        <lineSegments position={[0, h / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(w + 0.3, h + 0.3, d + 0.3)]} />
          <lineBasicMaterial
            color="#38bdf8"
            transparent
            opacity={isTraceComplete ? 0.45 : 0.75}
            linewidth={2}
          />
        </lineSegments>
      )}

      {/* 2. Progressive Footprint Outline Tracer */}
      {isDetected && !isTraceComplete && (
        <group>
          <ProgressiveTraceLine points={points} />
          {tracerPos && (
            <group position={tracerPos}>
              <mesh>
                <sphereGeometry args={[0.32, 16, 16]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
              <pointLight color="#00ffff" intensity={2.2} distance={5} decay={2} />
              {/* Vertical laser tracer line pointing down */}
              <lineSegments position={[0, 0.45, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(0.05, 0.9, 0.05)]} />
                <lineBasicMaterial color="#ffffff" />
              </lineSegments>
            </group>
          )}
        </group>
      )}

      {/* 3. Visually Separated Clean Vector Polygon (Emerges and lifts when trace finishes) */}
      {isTraceComplete && (
        <group>
          {/* Vector Footprint Polygon Plane */}
          <mesh position={[0, liftY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[w + 0.35, d + 0.35]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#0284c7"
              emissiveIntensity={0.3}
              transparent
              opacity={0.38}
              roughness={0.2}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Cyan Footprint Edge Perimeter */}
          <lineSegments position={[0, liftY, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(w + 0.35, 0.03, d + 0.35)]} />
            <lineBasicMaterial color="#00ffff" linewidth={3} />
          </lineSegments>

          {/* Vertical Extruded Skirt connecting lifted polygon to physical ground */}
          {liftProgress > 0.05 && (
            <mesh position={[0, liftY / 2, 0]}>
              <boxGeometry args={[w + 0.32, liftY, d + 0.32]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.16} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      )}

      {/* 4. Prominent 3D Feature Label (Appears when vector polygon separates) */}
      {showLabel && (
        <Html position={[0, h + 3.4, 0]} center distanceFactor={48}>
          <div className="bg-slate-950/95 border-2 border-cyan-400 text-slate-100 p-3 rounded-2xl text-left shadow-[0_0_35px_rgba(6,182,212,0.45)] backdrop-blur-md flex flex-col gap-1.5 whitespace-nowrap min-w-[195px] pointer-events-none select-none animate-in fade-in zoom-in-95 duration-500">
            {/* Building ID & High Confidence Badge */}
            <div className="flex items-center justify-between font-mono border-b border-cyan-500/40 pb-1.5 gap-2">
              <span className="font-extrabold text-cyan-300 text-sm tracking-wider">
                {building.id}
              </span>
              <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-400/90 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                HIGH CONFIDENCE
              </span>
            </div>

            {/* Building Title */}
            <div className="text-[11px] font-bold text-slate-100">
              {building.name}
            </div>

            {/* GIS Footprint Attributes */}
            <div className="flex flex-col text-[10px] text-slate-300 gap-0.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Footprint Area:</span>
                <span className="text-cyan-300 font-bold">{building.area} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class:</span>
                <span className="text-slate-200 capitalize">
                  {building.type} ({building.floors} Fl • {h}m)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geometry:</span>
                <span className="text-cyan-400 font-semibold">Vectorized Polygon</span>
              </div>
            </div>

            {/* Statutory Disclaimer / Methodology */}
            <div className="text-[9px] text-amber-300/90 font-mono pt-1 border-t border-slate-800/80 flex items-center justify-between">
              <span>Illustrative Confidence: {catConf.key}</span>
              <span className="text-cyan-400 font-semibold">AI-assisted</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ExtractedBuildingHighlights() {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Consume building features directly from canonical GIS data layer
  const buildingFeatures = getBuildingFeatures();

  // Focus urban cluster specifically requested for Scene 06
  const clusterBuildings = useMemo(() => {
    return buildingFeatures.filter((b) =>
      ['B-001', 'B-002', 'B-003', 'B-004'].includes(b.id)
    );
  }, [buildingFeatures]);

  // Animation clock loop capped at 9.5s
  useFrame((_, delta) => {
    setElapsedTime((prev) => {
      if (prev >= 9.5) return 9.5;
      return prev + delta;
    });
  });

  const handleReplay = (e) => {
    e.stopPropagation();
    setElapsedTime(0);
  };

  // AI Scanner plane movement (west to east across cluster: x = -44 to +26)
  const scanProgress = Math.min(1, Math.max(0, elapsedTime / 1.3));
  const scanX = -44 + scanProgress * 70;
  const isScanActive = elapsedTime <= 1.4;

  const isClusterComplete = elapsedTime >= 6.8;

  return (
    <group>
      {/* 1. Subtle AI Scanning Laser Sweep (Passes across real buildings naturally) */}
      {isScanActive && (
        <group position={[scanX, 0, 8]}>
          {/* Vertical scanning sheet curtain */}
          <mesh position={[0, 16, 0]}>
            <planeGeometry args={[0.3, 34]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={0.28 * (1 - scanProgress * 0.3)}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Ground laser line */}
          <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 52]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          {/* Soft trailing cyan glow */}
          <mesh position={[-2.0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.0, 52]} />
            <meshBasicMaterial color="#0284c7" transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* 2. Step-by-Step Urban Building Footprint Extraction Units */}
      {clusterBuildings.map((bldg) => {
        // Choreographed sequential timing:
        // B-001: trace 1.3s -> 2.5s, polygon lifts & label 2.5s
        // B-002: trace 3.2s -> 4.4s, polygon lifts & label 4.4s
        // B-003: trace 5.0s -> 6.2s, polygon lifts & label 6.2s
        // B-004: trace 6.2s -> 6.8s, polygon lifts & label 6.8s
        let traceStart = 1.3;
        let traceDuration = 1.2;

        if (bldg.id === 'B-001') {
          traceStart = 1.3;
          traceDuration = 1.2;
        } else if (bldg.id === 'B-002') {
          traceStart = 3.2;
          traceDuration = 1.2;
        } else if (bldg.id === 'B-003') {
          traceStart = 5.0;
          traceDuration = 1.2;
        } else if (bldg.id === 'B-004') {
          traceStart = 6.2;
          traceDuration = 0.6;
        }

        return (
          <BuildingExtractionUnit
            key={bldg.id}
            building={bldg}
            time={elapsedTime}
            traceStart={traceStart}
            traceDuration={traceDuration}
            liftDelay={0.05}
          />
        );
      })}

      {/* 3. Top Overhead 3D Status HUD & Statutory Disclaimer */}
      <Html position={[-8, 38, 6]} center distanceFactor={55}>
        <div className="bg-slate-950/95 border border-cyan-400/80 px-5 py-2.5 rounded-2xl text-[12px] text-slate-200 font-mono shadow-[0_0_35px_rgba(6,182,212,0.35)] backdrop-blur-md flex flex-col items-center gap-1.5 select-none pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-extrabold text-cyan-300 tracking-wider">
              SCENE 06 • VECTOR FEATURE EXTRACTION
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">Building Footprint Polygonization</span>
            {isClusterComplete && (
              <button
                onClick={handleReplay}
                className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/70 text-cyan-300 hover:bg-cyan-900/80 transition-colors text-[10px] font-bold cursor-pointer"
                title="Replay Extraction Animation"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay</span>
              </button>
            )}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-2">
            <span>Physical Buildings Retained</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-semibold">Cyan Vector Footprints Extracted</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300/90 font-medium">Prototype AI Inference — Illustrative Output</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
