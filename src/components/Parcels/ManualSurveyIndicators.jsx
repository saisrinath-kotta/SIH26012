import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export default function ManualSurveyIndicators() {
  const lineRef1 = useRef();
  const lineRef2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lineRef1.current) {
      lineRef1.current.material.dashOffset = -t * 2;
    }
    if (lineRef2.current) {
      lineRef2.current.material.dashOffset = -t * 2;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Manual Measuring Line 1 across narrow corridor */}
      <line ref={lineRef1}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-14, 0.4, 2, -2, 0.4, 2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineDashedMaterial color="#f59e0b" dashSize={0.8} gapSize={0.4} />
      </line>

      {/* Manual Measuring Line 2 along irregular rear boundary */}
      <line ref={lineRef2}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-36, 0.4, 16, -3, 0.4, 16])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineDashedMaterial color="#f59e0b" dashSize={0.8} gapSize={0.4} />
      </line>

      {/* Surveyor Tripod / Total Station Marker */}
      <group position={[-18, 0, -5]}>
        {/* Tripod Legs */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 2.0, 0, -1, 0, -1])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e2e8f0" />
        </line>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 2.0, 0, 1, 0, -1])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e2e8f0" />
        </line>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 2.0, 0, 0, 0, 1.2])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e2e8f0" />
        </line>

        {/* Total Station Instrument */}
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>

        <Html position={[0, 3.4, 0]} center distanceFactor={45}>
          <div className="bg-amber-950/90 border border-amber-400 text-amber-300 font-mono text-[9px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
            📐 Total Station Station-01
          </div>
        </Html>
      </group>

      {/* Field Inquiry Query Markers on Complex Boundaries */}
      <Html position={[-20, 2.2, 16]} center distanceFactor={45}>
        <div className="bg-slate-950/90 border border-amber-500 text-amber-300 text-[10px] font-mono px-2.5 py-1 rounded shadow-xl backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
          <span>⚠️</span>
          <span>COMPLEX BOUNDARY: Inconclusive compound wall junction</span>
        </div>
      </Html>

      <Html position={[-8, 1.8, 2]} center distanceFactor={45}>
        <div className="bg-slate-950/90 border border-slate-700 text-slate-300 text-[9px] font-mono px-2 py-0.5 rounded shadow">
          Manual Offset: 3.2m Access Lane
        </div>
      </Html>
    </group>
  );
}
