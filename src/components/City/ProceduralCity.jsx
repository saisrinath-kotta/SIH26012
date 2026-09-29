import React, { useMemo } from 'react';
import * as THREE from 'three';

function BuildingBlock({ bldg, isFocus }) {
  const floors = bldg.floors || Math.max(2, Math.round(bldg.h / 3.4));
  const floorH = bldg.h / floors;

  // Window band vertical intervals
  const windowBands = useMemo(() => {
    const list = [];
    for (let f = 1; f < floors; f++) {
      list.push(f * floorH);
    }
    return list;
  }, [floors, floorH]);

  const isPitched = bldg.roofStyle === 'pitched_terracotta';
  const roofH = isPitched ? Math.min(3.5, bldg.w * 0.3) : 0;
  const bodyH = isPitched ? bldg.h - roofH : bldg.h;

  return (
    <group position={[bldg.x, 0, bldg.z]}>
      {/* 1. Main Facade Mass */}
      <mesh position={[0, bodyH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bldg.w, bodyH, bldg.d]} />
        <meshStandardMaterial
          color={bldg.facadeColor || '#f1f5f9'}
          roughness={0.7}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Ground Floor Commercial Base / Shopfront */}
      {bldg.hasShopFront ? (
        <group position={[0, Math.min(1.8, floorH * 0.5), 0]}>
          <mesh>
            <boxGeometry args={[bldg.w * 1.02, Math.min(3.6, floorH * 1.0), bldg.d * 1.02]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          {/* Glass display windows */}
          <mesh position={[0, -0.2, bldg.d / 2 + 0.03]}>
            <planeGeometry args={[bldg.w * 0.85, 2.2]} />
            <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} transparent opacity={0.65} />
          </mesh>
          {/* Entrance Canopy / Storefront Signage */}
          <mesh position={[0, 1.2, bldg.d / 2 + 0.8]}>
            <boxGeometry args={[bldg.w * 0.7, 0.15, 1.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, Math.min(1.4, floorH * 0.4), 0]}>
          <boxGeometry args={[bldg.w * 1.01, Math.min(2.8, floorH * 0.8), bldg.d * 1.01]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      )}

      {/* 3. Window Grid Strips on Facade */}
      <group position={[0, 0, 0]}>
        {windowBands.map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            {/* Front & Back Window Slits */}
            <mesh position={[0, 0, bldg.d / 2 + 0.02]}>
              <planeGeometry args={[bldg.w * 0.82, floorH * 0.42]} />
              <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
            </mesh>
            <mesh position={[0, 0, -bldg.d / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[bldg.w * 0.82, floorH * 0.42]} />
              <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
            </mesh>

            {/* Left & Right Window Slits */}
            <mesh position={[bldg.w / 2 + 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[bldg.d * 0.76, floorH * 0.42]} />
              <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
            </mesh>
            <mesh position={[-bldg.w / 2 - 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <planeGeometry args={[bldg.d * 0.76, floorH * 0.42]} />
              <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Varied Urban Roof Architecture */}
      {isPitched ? (
        /* Pitched Terracotta Roof (residential house) */
        <group position={[0, bodyH, 0]}>
          <mesh position={[0, roofH * 0.5, 0]} castShadow>
            <coneGeometry args={[Math.max(bldg.w, bldg.d) * 0.65, roofH, 4]} />
            <meshStandardMaterial
              color={bldg.roofColor || '#b45309'}
              roughness={0.65}
              metalness={0.15}
            />
          </mesh>
        </group>
      ) : bldg.roofStyle === 'stepped_commercial' ? (
        /* Modern Commercial Complex Roof: HVAC Chillers, Penthouse, Ducts, Communication Mast */
        <group position={[0, bodyH, 0]}>
          {/* Parapet border */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[bldg.w, 0.9, bldg.d]} />
            <meshStandardMaterial color={bldg.facadeColor || '#e2e8f0'} roughness={0.7} />
          </mesh>
          {/* Inner gravel roof deck */}
          <mesh position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bldg.w * 0.94, bldg.d * 0.94]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>
          {/* Central Elevator Penthouse */}
          <mesh position={[bldg.w * 0.12, 1.4, bldg.d * 0.1]} castShadow>
            <boxGeometry args={[bldg.w * 0.38, 2.0, bldg.d * 0.38]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.5} />
          </mesh>
          {/* Dual HVAC Industrial Chiller Units with fans */}
          <mesh position={[-bldg.w * 0.22, 1.1, -bldg.d * 0.18]} castShadow>
            <boxGeometry args={[bldg.w * 0.28, 1.3, bldg.d * 0.24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[-bldg.w * 0.22, 1.1, bldg.d * 0.18]} castShadow>
            <boxGeometry args={[bldg.w * 0.28, 1.3, bldg.d * 0.24]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Communication mast on roof */}
          <mesh position={[bldg.w * 0.25, 2.8, -bldg.d * 0.25]}>
            <cylinderGeometry args={[0.08, 0.12, 3.8, 8]} />
            <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ) : bldg.roofStyle === 'terrace_pergola' ? (
        /* Urban Mixed-Use Rooftop Garden Terrace with Pergola & Planters */
        <group position={[0, bodyH, 0]}>
          {/* Parapet border */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[bldg.w, 0.8, bldg.d]} />
            <meshStandardMaterial color={bldg.facadeColor || '#fed7aa'} roughness={0.7} />
          </mesh>
          {/* Rooftop timber deck */}
          <mesh position={[0, 0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bldg.w * 0.94, bldg.d * 0.94]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Rooftop Stair Enclosure */}
          <mesh position={[-bldg.w * 0.2, 1.2, -bldg.d * 0.2]} castShadow>
            <boxGeometry args={[bldg.w * 0.3, 1.6, bldg.d * 0.3]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.7} />
          </mesh>
          {/* Timber Pergola Slats */}
          {[-1.5, -0.5, 0.5, 1.5].map((off, pIdx) => (
            <mesh key={pIdx} position={[bldg.w * 0.18 + off * 0.7, 2.2, bldg.d * 0.15]}>
              <boxGeometry args={[0.15, 0.2, bldg.d * 0.45]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
          ))}
          {/* Green rooftop planter box */}
          <mesh position={[bldg.w * 0.18, 1.0, -bldg.d * 0.28]} castShadow>
            <boxGeometry args={[bldg.w * 0.45, 0.6, 0.8]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
        </group>
      ) : bldg.roofStyle === 'stepped_terrace' ? (
        /* High-Rise Stepped Terrace & Penthouse Suite */
        <group position={[0, bodyH, 0]}>
          {/* Parapet border */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[bldg.w, 0.8, bldg.d]} />
            <meshStandardMaterial color={bldg.facadeColor || '#e2e8f0'} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bldg.w * 0.94, bldg.d * 0.94]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
          {/* Stepped Upper Penthouse Suite */}
          <mesh position={[bldg.w * 0.05, 1.4, 0]} castShadow>
            <boxGeometry args={[bldg.w * 0.55, 2.2, bldg.d * 0.55]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Glass Balustrade on Penthouse Terrace */}
          <mesh position={[-bldg.w * 0.24, 1.2, 0]}>
            <boxGeometry args={[0.06, 0.8, bldg.d * 0.6]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
          </mesh>
          {/* Elevator Machine Tower */}
          <mesh position={[bldg.w * 0.18, 2.8, -bldg.d * 0.1]} castShadow>
            <boxGeometry args={[bldg.w * 0.24, 1.2, bldg.d * 0.24]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
          {/* Water storage tower */}
          <mesh position={[-bldg.w * 0.28, 1.2, -bldg.d * 0.28]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 1.4, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      ) : (
        /* Standard Flat Roof with Solar Panels & Parapet */
        <group position={[0, bodyH, 0]}>
          {/* Parapet border */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[bldg.w, 0.8, bldg.d]} />
            <meshStandardMaterial color={bldg.facadeColor || '#e2e8f0'} roughness={0.8} />
          </mesh>
          {/* Inner roof gravel deck */}
          <mesh position={[0, 0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bldg.w * 0.94, bldg.d * 0.94]} />
            <meshStandardMaterial color={bldg.roofColor || '#64748b'} roughness={0.9} />
          </mesh>
          {/* Slanted Solar Panel Array */}
          <group position={[-bldg.w * 0.15, 1.1, 0]} rotation={[-0.3, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[bldg.w * 0.5, 0.08, bldg.d * 0.4]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.8} />
            </mesh>
          </group>
          {/* Elevator penthouse structure */}
          <mesh position={[bldg.w * 0.2, 1.2, bldg.d * 0.1]} castShadow>
            <boxGeometry args={[bldg.w * 0.32, 1.6, bldg.d * 0.32]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          </mesh>
          {/* Blue rooftop water storage tank */}
          <mesh position={[bldg.w * 0.2, 1.1, -bldg.d * 0.22]} castShadow>
            <cylinderGeometry args={[0.7, 0.7, 1.2, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      )}

      {/* 5. Residential Balconies */}
      {bldg.hasBalconies && (
        <group position={[0, 0, bldg.d / 2 + 0.5]}>
          {windowBands.slice(1, -1).map((y, idx) => (
            <group key={idx} position={[0, y - floorH * 0.2, 0]}>
              {/* Balcony slab */}
              <mesh>
                <boxGeometry args={[bldg.w * 0.65, 0.2, 1.0]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
              </mesh>
              {/* Balcony railing with glass styling */}
              <mesh position={[0, 0.4, 0.45]}>
                <boxGeometry args={[bldg.w * 0.63, 0.6, 0.05]} />
                <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} transparent opacity={0.65} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 6. Subtle architectural edge contour for visual clarity */}
      <lineSegments position={[0, bodyH / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(bldg.w, bodyH, bldg.d)]} />
        <lineBasicMaterial
          color={isFocus ? '#64748b' : '#94a3b8'}
          transparent
          opacity={isFocus ? 0.45 : 0.25}
        />
      </lineSegments>
    </group>
  );
}

export default function ProceduralCity({ buildings }) {
  if (!buildings || buildings.length === 0) return null;

  return (
    <group>
      {buildings.map((bldg) => {
        const isFocus = Boolean(bldg.parcelId);
        return <BuildingBlock key={bldg.id} bldg={bldg} isFocus={isFocus} />;
      })}
    </group>
  );
}
