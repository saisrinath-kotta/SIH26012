import React, { useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function MeasurementTool3D({
  active,
  points,
  onAddPoint
}) {
  const [hoverPoint, setHoverPoint] = useState(null);

  if (!active && points.length === 0) return null;

  const distance = points.length === 2
    ? new THREE.Vector3(...points[0]).distanceTo(new THREE.Vector3(...points[1]))
    : (points.length === 1 && hoverPoint
        ? new THREE.Vector3(...points[0]).distanceTo(hoverPoint)
        : null);

  const midPoint = points.length === 2
    ? [
        (points[0][0] + points[1][0]) / 2,
        (points[0][1] + points[1][1]) / 2 + 1.2,
        (points[0][2] + points[1][2]) / 2
      ]
    : (points.length === 1 && hoverPoint
        ? [
            (points[0][0] + hoverPoint.x) / 2,
            (points[0][1] + hoverPoint.y) / 2 + 1.2,
            (points[0][2] + hoverPoint.z) / 2
          ]
        : null);

  const linePoints = points.length === 2
    ? [new THREE.Vector3(...points[0]), new THREE.Vector3(...points[1])]
    : (points.length === 1 && hoverPoint
        ? [new THREE.Vector3(...points[0]), hoverPoint]
        : []);

  return (
    <group>
      {/* Invisible raycast interceptor plane when active */}
      {active && points.length < 2 && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.05, 0]}
          visible={false}
          onPointerMove={(e) => {
            setHoverPoint(e.point);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddPoint([e.point.x, e.point.y, e.point.z]);
          }}
        >
          <planeGeometry args={[600, 600]} />
        </mesh>
      )}

      {/* Point 1 Marker */}
      {points[0] && (
        <group position={points[0]}>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#ec4899" emissive="#f43f5e" emissiveIntensity={0.8} />
          </mesh>
          <Html center distanceFactor={50}>
            <div className="bg-pink-950/80 border border-pink-400 text-pink-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
              Point A
            </div>
          </Html>
        </group>
      )}

      {/* Point 2 Marker */}
      {points[1] && (
        <group position={points[1]}>
          <mesh>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0ea5e9" emissiveIntensity={0.8} />
          </mesh>
          <Html center distanceFactor={50}>
            <div className="bg-cyan-950/80 border border-cyan-400 text-cyan-200 text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
              Point B
            </div>
          </Html>
        </group>
      )}

      {/* Laser Measurement Line */}
      {linePoints.length === 2 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                linePoints[0].x, linePoints[0].y + 0.1, linePoints[0].z,
                linePoints[1].x, linePoints[1].y + 0.1, linePoints[1].z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#38bdf8" linewidth={3} />
        </line>
      )}

      {/* Dynamic Distance Label at Midpoint */}
      {distance !== null && midPoint && (
        <Html position={midPoint} center distanceFactor={50}>
          <div className="bg-slate-950/90 border border-sky-400 text-sky-300 px-2.5 py-1 rounded-md text-xs font-mono font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 ring-2 ring-sky-400/20">
            <span>📏</span>
            <span>{distance.toFixed(2)} m</span>
            <span className="text-[10px] text-slate-400">({(distance * 3.28084).toFixed(1)} ft)</span>
          </div>
        </Html>
      )}
    </group>
  );
}
