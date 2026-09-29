import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { FOCUS_AREA } from '../../data/cityData';

export default function GISGridOverlay() {
  const { bounds } = FOCUS_AREA;
  const focusW = bounds.maxX - bounds.minX;
  const focusD = bounds.maxZ - bounds.minZ;
  const focusCenterX = (bounds.minX + bounds.maxX) / 2;
  const focusCenterZ = (bounds.minZ + bounds.maxZ) / 2;

  return (
    <group>
      {/* 1. Base Urban Terrain Ground (Natural Earth & Grass Tone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[450, 450]} />
        <meshStandardMaterial
          color="#3f6212" // Rich natural olive/grass green terrain
          roughness={0.92}
          metalness={0.04}
        />
      </mesh>

      {/* 2. Urban Paved Ground Plots under City Blocks (Light Warm Gray Concrete/Soil) */}
      {/* Central Focus District Ground Pad */}
      <mesh position={[focusCenterX, 0.01, focusCenterZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[focusW + 12, focusD + 12]} />
        <meshStandardMaterial
          color="#e2e8f0" // Light concrete / paved parcel ground
          roughness={0.88}
        />
      </mesh>

      {/* Surrounding Urban Block Pads */}
      {[
        { cx: -100, cz: -80, sx: 60, sz: 55 },
        { cx: -20, cz: -80, sx: 70, sz: 55 },
        { cx: 70, cz: -80, sx: 75, sz: 55 },
        { cx: -105, cz: 15, sx: 65, sz: 50 },
        { cx: -105, cz: 80, sx: 65, sz: 60 },
        { cx: 75, cz: 15, sx: 80, sz: 50 },
        { cx: 75, cz: 80, sx: 80, sz: 60 },
        { cx: -20, cz: 90, sx: 70, sz: 65 }
      ].map((pad, i) => (
        <mesh key={i} position={[pad.cx, 0.01, pad.cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[pad.sx, pad.sz]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.88} />
        </mesh>
      ))}

      {/* 3. Subtle Professional GIS Coordinate Grid (Light Gray, Not Neon) */}
      <gridHelper
        args={[320, 32, '#94a3b8', '#cbd5e1']}
        position={[0, 0.025, 0]}
      />

      {/* 4. Focus Area Demarcation Outline (Clean Professional Cyan GIS Boundary) */}
      <group position={[focusCenterX, 0.07, focusCenterZ]}>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(focusW, 0.04, focusD)]} />
          <lineBasicMaterial color="#0284c7" linewidth={2} />
        </lineSegments>

        {/* Survey Area Label Marker */}
        <Html position={[-focusW / 2, 1.5, -focusD / 2]} distanceFactor={80}>
          <div className="bg-slate-900/90 border border-sky-400 text-sky-300 font-mono text-[10px] px-2.5 py-1 rounded shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-bold">AOI: {FOCUS_AREA.name}</span>
          </div>
        </Html>
      </group>

      {/* 5. Cardinal North Compass on Ground */}
      <group position={[120, 0.08, -120]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.4, 32]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]}>
          <coneGeometry args={[1.5, 5.5, 3]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0, 3]}>
          <coneGeometry args={[1.5, 5.5, 3]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <Html position={[0, 1.2, -7.5]} center distanceFactor={70}>
          <span className="font-mono text-xs font-bold text-slate-700 bg-white/90 px-1.5 py-0.5 rounded shadow">
            N
          </span>
        </Html>
      </group>
    </group>
  );
}
