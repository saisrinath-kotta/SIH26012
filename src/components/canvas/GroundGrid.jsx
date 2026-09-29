import React from 'react';

export default function GroundGrid({ showSubsurface = true }) {
  return (
    <group>
      {/* Ground plane for casting shadows */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial
          color="#080e1a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Cadastral Coordinate Grid Lines */}
      <gridHelper
        args={[240, 48, '#0284c7', '#1e293b']}
        position={[0, 0.02, 0]}
      />

      {/* Fine inner cadastral precision grid */}
      <gridHelper
        args={[120, 120, '#38bdf8', '#0f172a']}
        position={[0, 0.04, 0]}
      />

      {/* Cardinal North Indicator on Ground */}
      <group position={[105, 0.08, -105]}>
        {/* Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.5, 6, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Compass Pointer Arrow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.5]}>
          <coneGeometry args={[1.5, 5, 4]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0, 2.5]}>
          <coneGeometry args={[1.5, 5, 4]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
      </group>

      {/* Subsurface Stratum Datum Grid (when subsurface view is active) */}
      {showSubsurface && (
        <group position={[0, -18, 0]}>
          <gridHelper
            args={[220, 22, '#06b6d4', '#152538']}
            position={[0, 0, 0]}
          />
        </group>
      )}
    </group>
  );
}
