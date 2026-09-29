import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function SurveyDrone({
  showScanBeam = true,
  isFlying = true
}) {
  const droneGroupRef = useRef();
  const rotorRefs = [useRef(), useRef(), useRef(), useRef()];
  const scanRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate propellers
    rotorRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.y += 0.55;
      }
    });

    if (droneGroupRef.current) {
      if (isFlying) {
        // Lawnmower flight pattern over focus parcels
        const cycle = (t * 0.35) % 4;
        let targetX = -20;
        let targetZ = 0;

        if (cycle < 1) {
          const p = cycle;
          targetX = -35 + p * 45;
          targetZ = -15;
        } else if (cycle < 2) {
          const p = cycle - 1;
          targetX = 10;
          targetZ = -15 + p * 20;
        } else if (cycle < 3) {
          const p = cycle - 2;
          targetX = 10 - p * 45;
          targetZ = 5;
        } else {
          const p = cycle - 3;
          targetX = -35;
          targetZ = 5 - p * 20;
        }

        const bank = Math.sin(t * 1.5) * 0.05;
        const pitch = Math.cos(t * 2) * 0.03;
        const hoverY = 32 + Math.sin(t * 2) * 0.35;

        droneGroupRef.current.position.x = THREE.MathUtils.lerp(droneGroupRef.current.position.x, targetX, 0.08);
        droneGroupRef.current.position.z = THREE.MathUtils.lerp(droneGroupRef.current.position.z, targetZ, 0.08);
        droneGroupRef.current.position.y = hoverY;
        droneGroupRef.current.rotation.z = bank;
        droneGroupRef.current.rotation.x = pitch;
      } else {
        droneGroupRef.current.position.set(-15, 30 + Math.sin(t * 1.5) * 0.25, 5);
      }
    }

    // Pulse scan ring on ground
    if (scanRingRef.current) {
      scanRingRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
    }
  });

  return (
    <group>
      {/* Subtle Photogrammetric Survey Flight Path Grid Overlay in 3D */}
      <group position={[-12, 32, -5]}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={5}
              array={new Float32Array([
                -35, 0, -15,
                 10, 0, -15,
                 10, 0,   5,
                -35, 0,   5,
                -35, 0, -15
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial color="#0284c7" dashSize={1.2} gapSize={0.6} transparent opacity={0.6} />
        </line>
      </group>

      {/* Hero UAV Drone */}
      <group ref={droneGroupRef} position={[-20, 32, 0]}>
        {/* Aerodynamic White Carbon Composite Fuselage */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.45, 1.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.6} />
        </mesh>

        {/* Orange Safety Decal Strip */}
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[1.82, 0.04, 0.35]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>

        {/* Top RTK GNSS Dome Antenna */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.38, 0.3, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* 4 Carbon Motor Arms & Rotors */}
        {[
          { x: 1.3, z: 1.3, angle: Math.PI / 4, navColor: '#ef4444' }, // Port Red
          { x: -1.3, z: 1.3, angle: -Math.PI / 4, navColor: '#22c55e' }, // Stbd Green
          { x: 1.3, z: -1.3, angle: -Math.PI / 4, navColor: '#ffffff' },
          { x: -1.3, z: -1.3, angle: Math.PI / 4, navColor: '#ffffff' }
        ].map((arm, i) => (
          <group key={i} position={[0, 0, 0]}>
            {/* Carbon Tube Arm */}
            <mesh position={[arm.x * 0.5, 0, arm.z * 0.5]} rotation={[0, arm.angle, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.9, 8]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
            </mesh>

            {/* Brushless Motor Housing */}
            <mesh position={[arm.x, 0.12, arm.z]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.28, 14]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Navigation Strobe LED */}
            <mesh position={[arm.x, -0.1, arm.z]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color={arm.navColor} />
            </mesh>

            {/* Rapidly Spinning Carbon Propeller Blades */}
            <group ref={rotorRefs[i]} position={[arm.x, 0.3, arm.z]}>
              <mesh>
                <boxGeometry args={[2.2, 0.02, 0.22]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[2.2, 0.02, 0.22]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
              </mesh>
            </group>
          </group>
        ))}

        {/* 3-Axis Camera Gimbal Underneath */}
        <group position={[0, -0.42, 0.25]}>
          <mesh castShadow>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* High-Resolution Photogrammetry Lens */}
          <mesh position={[0, -0.16, 0.22]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.22, 16]} />
            <meshStandardMaterial color="#090d16" metalness={1.0} roughness={0.05} />
          </mesh>
        </group>

        {/* Downward Volumetric Scanning Cone (Translucent Cyan over Daylight) */}
        {showScanBeam && (
          <group position={[0, -16, 0]}>
            {/* Volumetric Light Cone */}
            <mesh rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[14, 32, 32, 1, true]} />
              <meshBasicMaterial
                color="#06b6d4"
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Scanning Footprint on Daylight Ground */}
            <group ref={scanRingRef} position={[0, -15.9, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[12, 12.6, 32]} />
                <meshBasicMaterial color="#0284c7" transparent opacity={0.75} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[12, 32]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.08} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </group>
        )}

        {/* Professional UAV Status Tag */}
        <Html position={[0, 2.0, 0]} center distanceFactor={45}>
          <div className="bg-slate-900/90 border border-sky-400 text-slate-100 font-mono text-[10px] px-3 py-1.5 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sky-300">UAV PHOTOGRAMMETRY SURVEY</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-300 font-semibold">GSD 2.4 cm/px</span>
          </div>
        </Html>
      </group>
    </group>
  );
}
