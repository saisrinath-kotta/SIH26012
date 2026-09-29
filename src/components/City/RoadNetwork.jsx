import React from 'react';

export default function RoadNetwork({ roads }) {
  if (!roads || roads.length === 0) return null;

  return (
    <group position={[0, 0.02, 0]}>
      {roads.map((road) => {
        const dx = road.end[0] - road.start[0];
        const dz = road.end[2] - road.start[2];
        const length = Math.sqrt(dx * dx + dz * dz);
        const midX = (road.start[0] + road.end[0]) / 2;
        const midZ = (road.start[2] + road.end[2]) / 2;
        const angle = Math.atan2(dz, dx);

        const isArterial = road.type === 'arterial';
        const isAccess = road.type === 'access';

        // Realistic asphalt tones
        const asphaltColor = isAccess ? '#2a3447' : (isArterial ? '#1e293b' : '#243044');
        const sidewalkWidth = isArterial ? 2.2 : (isAccess ? 0.8 : 1.4);

        return (
          <group key={road.id} position={[midX, 0, midZ]} rotation={[0, -angle, 0]}>
            {/* 1. Main Asphalt Surface */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, road.width]} />
              <meshStandardMaterial
                color={asphaltColor}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>

            {/* 2. Concrete Sidewalks on Both Sides */}
            {/* Left Sidewalk */}
            <mesh
              position={[0, 0.06, -road.width / 2 - sidewalkWidth / 2]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[length, sidewalkWidth]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
            </mesh>
            {/* Left Curb bevel */}
            <mesh position={[0, 0.08, -road.width / 2]}>
              <boxGeometry args={[length, 0.12, 0.2]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>

            {/* Right Sidewalk */}
            <mesh
              position={[0, 0.06, road.width / 2 + sidewalkWidth / 2]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[length, sidewalkWidth]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
            </mesh>
            {/* Right Curb bevel */}
            <mesh position={[0, 0.08, road.width / 2]}>
              <boxGeometry args={[length, 0.12, 0.2]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>

            {/* 3. Outer Solid White Lane Boundary Stripes */}
            {isArterial && (
              <>
                <mesh position={[0, 0.03, -road.width / 2 + 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[length, 0.18]} />
                  <meshBasicMaterial color="#f8fafc" />
                </mesh>
                <mesh position={[0, 0.03, road.width / 2 - 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[length, 0.18]} />
                  <meshBasicMaterial color="#f8fafc" />
                </mesh>
              </>
            )}

            {/* 4. Broken Center Markings (Yellow/White) */}
            {road.hasMarkings && (
              <group position={[0, 0.035, 0]}>
                {Array.from({ length: Math.floor(length / 7) }, (_, i) => {
                  const dashX = -length / 2 + 3.5 + i * 7;
                  return (
                    <mesh key={i} position={[dashX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                      <planeGeometry args={[3.5, 0.22]} />
                      <meshBasicMaterial color="#fbbf24" />
                    </mesh>
                  );
                })}
              </group>
            )}

            {/* 5. Pedestrian Zebra Crossings near road intersections */}
            {isArterial && length > 60 && (
              <group position={[15, 0.038, 0]}>
                {Array.from({ length: 8 }, (_, zi) => (
                  <mesh
                    key={zi}
                    position={[0, 0, -road.width / 2 + 1.2 + zi * ((road.width - 2.4) / 7)]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <planeGeometry args={[3.2, 0.55]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
