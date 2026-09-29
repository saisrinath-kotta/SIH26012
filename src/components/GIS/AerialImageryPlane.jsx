import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { FOCUS_AREA } from '../../data/cityData';

export default function AerialImageryPlane({
  showScanner = false,
  activeLayer = 'all'
}) {
  const scanLineRef = useRef();
  const { bounds } = FOCUS_AREA;
  const width = bounds.maxX - bounds.minX;
  const depth = bounds.maxZ - bounds.minZ;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minZ + bounds.maxZ) / 2;

  useFrame((state) => {
    if (showScanner && scanLineRef.current) {
      const t = state.clock.getElapsedTime();
      const progress = (Math.sin(t * 1.2) + 1) / 2;
      scanLineRef.current.position.z = -depth / 2 + progress * depth;
    }
  });

  return (
    <group position={[centerX, 0.09, centerZ]}>
      {/* 1. Base Orthomosaic Plane (Natural Aerial Imagery Tone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color="#3f6212" // Natural aerial land vegetation tone
          roughness={0.9}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Stylized Aerial Rooftops visible in True-Ortho Imagery */}
      <group position={[0, 0.02, 0]}>
        {/* P001 Commercial Complex Roof in Orthophoto */}
        <mesh position={[-20, 0, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.7} />
        </mesh>
        <mesh position={[-9, 0, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 10]} />
          <meshStandardMaterial color="#c2410c" roughness={0.6} />
        </mesh>

        {/* P002 Residential Block Roofs in Orthophoto */}
        <mesh position={[7, 0, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        <mesh position={[7, 0, 22]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 14]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>

        {/* P003 Terracotta Pitched Roofs in Orthophoto */}
        <mesh position={[-23, 0, 28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.65} />
        </mesh>
        <mesh position={[-11, 0, 32]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 8]} />
          <meshStandardMaterial color="#9a3412" roughness={0.65} />
        </mesh>

        {/* P004 Civic Center Roof */}
        <mesh position={[-21, 0, -32]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 14]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>

        {/* Roads visible in Orthomosaic */}
        <mesh position={[0, -0.005, -15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, 10]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[25, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, depth]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* Access Corridors visible in Orthomosaic */}
        <mesh position={[-40, -0.004, 15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.5, 60]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
      </group>

      {/* 2. Geodetic Pixel Grid Matrix Lines */}
      <gridHelper
        args={[width, 24, '#0284c7', '#94a3b8']}
        position={[0, 0.03, 0]}
      />

      {/* 3. Outer Georeferenced Frame Border */}
      <lineSegments position={[0, 0.04, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(width, 0.02, depth)]} />
        <lineBasicMaterial color="#0284c7" linewidth={2} />
      </lineSegments>

      {/* Geodetic Corner Coordinates */}
      <Html position={[-width / 2 + 5, 0.8, -depth / 2 + 4]} distanceFactor={65}>
        <div className="bg-slate-900/90 border border-sky-400 text-sky-300 font-mono text-[9px] px-2 py-0.5 rounded shadow">
          TL: 77.5941°E, 12.9712°N • EPSG:4326
        </div>
      </Html>
      <Html position={[width / 2 - 18, 0.8, depth / 2 - 4]} distanceFactor={65}>
        <div className="bg-slate-900/90 border border-sky-400 text-sky-300 font-mono text-[9px] px-2 py-0.5 rounded shadow">
          BR: 77.5952°E, 12.9721°N • WGS84
        </div>
      </Html>

      {/* Orthomosaic Metadata Stamp */}
      <Html position={[0, 1.4, 0]} center distanceFactor={70}>
        <div className="bg-slate-900/95 border border-sky-500 text-slate-100 px-4 py-2 rounded-xl font-mono text-[10px] shadow-2xl flex flex-col items-center gap-0.5 whitespace-nowrap">
          <span className="font-bold text-sky-300 text-xs">
            TRUE-ORTHOMOSAIC TILE 07-KENGERI
          </span>
          <span className="text-slate-300">
            Calibrated Photogrammetric Surface • GSD 2.4 cm/px • Altitude 120m AGL
          </span>
          {activeLayer !== 'all' && (
            <span className="text-emerald-400 font-semibold uppercase mt-0.5">
              Active Layer: {activeLayer}
            </span>
          )}
        </div>
      </Html>

      {/* Animated AI Sweeping Scan Laser Line */}
      {showScanner && (
        <group ref={scanLineRef} position={[0, 0.06, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, 1.8]} />
            <meshBasicMaterial
              color="#06b6d4"
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, 0.3]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
}
