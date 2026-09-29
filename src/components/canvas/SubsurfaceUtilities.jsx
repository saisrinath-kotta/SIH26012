import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { SUBSURFACE_STRATA } from '../../data/cadastralData';

function SubsurfaceTubeItem({ strata, isSelected, onSelectStrata }) {
  const curve = useMemo(() => {
    const points = strata.path.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.CatmullRomCurve3(points);
  }, [strata.path]);

  return (
    <group>
      {/* 3D Tube for Tunnel/Conduit */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (onSelectStrata) onSelectStrata(strata);
        }}
      >
        <tubeGeometry args={[curve, 64, strata.radius, 16, false]} />
        <meshStandardMaterial
          color={strata.color}
          transparent
          opacity={isSelected ? 0.75 : 0.45}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
          emissive={strata.color}
          emissiveIntensity={isSelected ? 0.6 : 0.25}
        />
      </mesh>

      {/* Inner Wireframe Cage */}
      <mesh>
        <tubeGeometry args={[curve, 32, strata.radius + 0.1, 8, false]} />
        <meshBasicMaterial
          color={strata.color}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Subsurface 3D Label Tag */}
      <Html
        position={[strata.path[2][0], strata.path[2][1] - 2, strata.path[2][2]]}
        center
        distanceFactor={70}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectStrata) onSelectStrata(strata);
          }}
          className={`cursor-pointer px-2 py-1 rounded border text-[11px] font-mono whitespace-nowrap backdrop-blur-md transition-all ${
            isSelected
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/40'
              : 'bg-slate-950/80 border-cyan-600/40 text-cyan-300 hover:border-cyan-400'
          }`}
        >
          🚇 {strata.name} ({strata.depth}m)
        </div>
      </Html>
    </group>
  );
}

export default function SubsurfaceUtilities({
  visible = true,
  onSelectStrata,
  selectedStrataId
}) {
  if (!visible) return null;

  return (
    <group>
      {SUBSURFACE_STRATA.map((strata) => (
        <SubsurfaceTubeItem
          key={strata.id}
          strata={strata}
          isSelected={selectedStrataId === strata.id}
          onSelectStrata={onSelectStrata}
        />
      ))}
    </group>
  );
}
