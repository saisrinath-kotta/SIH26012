import React, { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { createShapeFromPolygon, getPolygonCenter } from '../../utils/gisUtils';

export default function CadastralParcelMesh({
  parcel,
  isSelected,
  onSelect,
  viewMode = 'thematic', // 'thematic' | 'wireframe' | 'valuation' | 'strata'
  showSetbacks = false,
  showLabels = true
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  // Create THREE.Shape from polygon coordinates
  const shape = useMemo(() => {
    return createShapeFromPolygon(parcel.polygon);
  }, [parcel.polygon]);

  // Compute 2D center for floating label and camera framing
  const [centerX, centerZ] = useMemo(() => {
    return getPolygonCenter(parcel.polygon);
  }, [parcel.polygon]);

  // Generate ExtrudeGeometry settings
  const extrudeSettings = useMemo(() => {
    return {
      depth: Math.max(parcel.height, 0.5),
      bevelEnabled: parcel.height > 2,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.2,
      bevelThickness: 0.2
    };
  }, [parcel.height]);

  // Ground boundary line points
  const boundaryPoints = useMemo(() => {
    return parcel.polygon.map(([x, z]) => new THREE.Vector3(x, 0.15, z));
  }, [parcel.polygon]);

  // Internal setback line points (inset towards center by setback meters)
  const setbackPoints = useMemo(() => {
    if (!showSetbacks || !parcel.setback) return null;
    const factor = 0.82; // approximate inset factor
    return parcel.polygon.map(([x, z]) => {
      const dx = x - centerX;
      const dz = z - centerZ;
      return new THREE.Vector3(centerX + dx * factor, 0.2, centerZ + dz * factor);
    });
  }, [parcel.polygon, parcel.setback, centerX, centerZ, showSetbacks]);

  // Determine material color & properties based on active view mode
  const { color, opacity, transparent, wireframe, roughness, metalness, emissive } = useMemo(() => {
    let baseColor = parcel.color || '#0ea5e9';

    if (viewMode === 'valuation') {
      if (parcel.taxStatus === 'Overdue') {
        baseColor = '#ef4444'; // Red for tax default
      } else if (parcel.taxStatus === 'Exempt') {
        baseColor = '#a855f7'; // Purple for govt exempt
      } else {
        baseColor = '#10b981'; // Green for paid
      }
    }

    if (viewMode === 'wireframe') {
      return {
        color: baseColor,
        opacity: isSelected ? 0.7 : (hovered ? 0.5 : 0.25),
        transparent: true,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        emissive: isSelected ? baseColor : (hovered ? '#38bdf8' : '#000000')
      };
    }

    if (viewMode === 'strata') {
      // Semi-transparent frosted glass exterior shell to reveal interior 3D strata units
      return {
        color: baseColor,
        opacity: isSelected ? 0.4 : 0.22,
        transparent: true,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.1,
        emissive: isSelected ? baseColor : '#000000'
      };
    }

    // Default 'thematic' mode
    return {
      color: baseColor,
      opacity: isSelected ? 0.95 : (hovered ? 0.9 : 0.82),
      transparent: true,
      wireframe: false,
      roughness: 0.35,
      metalness: 0.25,
      emissive: isSelected ? '#38bdf8' : (hovered ? '#1e293b' : '#000000')
    };
  }, [viewMode, parcel, isSelected, hovered]);

  // Subtle floating pulsation for selected parcel
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 3) * 0.2;
    } else if (meshRef.current) {
      meshRef.current.position.y = 0;
    }
  });

  // Calculate floor heights for strata mode
  const strataFloorPlates = useMemo(() => {
    if (viewMode !== 'strata' || parcel.floors <= 1) return [];
    const floorCount = Math.min(parcel.floors, 14);
    const floorHeight = parcel.height / parcel.floors;
    const plates = [];
    for (let i = 1; i <= floorCount; i++) {
      plates.push({
        level: i,
        elevation: i * floorHeight,
        unit: parcel.strataUnits?.[i - 1] || null
      });
    }
    return plates;
  }, [viewMode, parcel.floors, parcel.height, parcel.strataUnits]);

  return (
    <group ref={meshRef}>
      {/* 3D Extruded Parcel Mesh */}
      <mesh
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(parcel);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
          transparent={transparent}
          opacity={opacity}
          wireframe={wireframe}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.45 : (hovered ? 0.25 : 0)}
        />
      </mesh>

      {/* Cadastral Boundary Line on ground level */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={boundaryPoints.length}
            array={new Float32Array(boundaryPoints.flatMap((p) => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isSelected ? '#38bdf8' : (hovered ? '#ffffff' : parcel.wireColor || '#0284c7')}
          linewidth={isSelected ? 3 : 2}
        />
      </line>

      {/* Setback Compliance Inset Line */}
      {setbackPoints && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={setbackPoints.length}
              array={new Float32Array(setbackPoints.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineDashedMaterial
            color="#f59e0b"
            dashSize={1}
            gapSize={0.5}
            linewidth={2}
          />
        </line>
      )}

      {/* Strata Units: 3D Interior Floor Slabs when in 'strata' view */}
      {viewMode === 'strata' && strataFloorPlates.map((slab) => (
        <group key={slab.level} position={[0, slab.elevation, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial
              color={isSelected ? '#38bdf8' : '#0ea5e9'}
              roughness={0.2}
              metalness={0.5}
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Selection Beacon / Ring on top of building */}
      {isSelected && (
        <group position={[centerX, parcel.height + 2, centerZ]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.2, 32]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* Floating 3D Cadastral Label (visible on hover, selection, or when labels are toggled on) */}
      {(hovered || isSelected || showLabels) && (
        <Html
          position={[centerX, parcel.height + 3.5, centerZ]}
          center
          distanceFactor={60}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(parcel);
            }}
            className={`cursor-pointer transition-all duration-300 pointer-events-auto rounded-lg px-2.5 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap border ${
              isSelected
                ? 'bg-sky-950/90 border-sky-400 text-sky-200 ring-2 ring-sky-400/40 scale-105'
                : hovered
                ? 'bg-slate-900/90 border-slate-500 text-slate-100 scale-100'
                : 'bg-slate-950/75 border-slate-700/60 text-slate-300 scale-90'
            }`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: parcel.color }}
            />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[11px] font-bold text-sky-400 tracking-wider">
                {parcel.surveyNumber}
              </span>
              <span className="text-[12px] font-semibold text-slate-200 leading-tight">
                {parcel.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {parcel.floors > 0 ? `${parcel.floors} Fl • ${parcel.height}m` : 'Ground Plot'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
