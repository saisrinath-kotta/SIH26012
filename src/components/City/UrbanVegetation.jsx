import React from 'react';

export default function UrbanVegetation({ trees }) {
  if (!trees || trees.length === 0) return null;

  return (
    <group>
      {trees.map((tree, idx) => {
        const isDeciduous = idx % 2 === 0;
        const trunkH = tree.height * 0.45;
        const foliageH = tree.height * 0.55;

        // Varied foliage green tones
        const greenTones = ['#15803d', '#16a34a', '#22c55e', '#14532d', '#2e7d32'];
        const leafColor = greenTones[idx % greenTones.length];
        const highlightColor = greenTones[(idx + 1) % greenTones.length];

        return (
          <group key={tree.id} position={[tree.x, 0, tree.z]}>
            {/* Tree Trunk */}
            <mesh position={[0, trunkH / 2, 0]} castShadow>
              <cylinderGeometry
                args={[tree.radius * 0.16, tree.radius * 0.26, trunkH, 7]}
              />
              <meshStandardMaterial color="#5c3d2e" roughness={0.9} />
            </mesh>

            {isDeciduous ? (
              /* Deciduous Spherical Canopy Tree */
              <group position={[0, trunkH + foliageH * 0.45, 0]}>
                {/* Main Crown */}
                <mesh castShadow>
                  <sphereGeometry args={[tree.radius * 1.15, 8, 8]} />
                  <meshStandardMaterial
                    color={leafColor}
                    roughness={0.75}
                    metalness={0.05}
                  />
                </mesh>
                {/* Secondary Offset Canopy Puff */}
                <mesh position={[tree.radius * 0.35, tree.radius * 0.4, 0]} castShadow>
                  <sphereGeometry args={[tree.radius * 0.8, 7, 7]} />
                  <meshStandardMaterial
                    color={highlightColor}
                    roughness={0.7}
                    metalness={0.05}
                  />
                </mesh>
              </group>
            ) : (
              /* Conical / Pine Layered Tree */
              <group position={[0, trunkH, 0]}>
                <mesh position={[0, foliageH * 0.35, 0]} castShadow>
                  <coneGeometry args={[tree.radius * 1.1, foliageH * 0.65, 7]} />
                  <meshStandardMaterial color={leafColor} roughness={0.75} />
                </mesh>
                <mesh position={[0, foliageH * 0.75, 0]} castShadow>
                  <coneGeometry args={[tree.radius * 0.8, foliageH * 0.55, 6]} />
                  <meshStandardMaterial color={highlightColor} roughness={0.7} />
                </mesh>
              </group>
            )}

            {/* Small Landscaped Mulch / Flower Bed Ring under tree */}
            <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[tree.radius * 1.3, 10]} />
              <meshStandardMaterial color="#3e2723" roughness={0.95} />
            </mesh>
          </group>
        );
      })}

      {/* Landscaped Grass Patches in Courtyards and Open Spaces */}
      <group position={[0, 0.03, 0]}>
        {/* Focus Neighborhood Courtyard Garden */}
        <mesh position={[-15, 0, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 14]} />
          <meshStandardMaterial color="#4ade80" roughness={0.9} />
        </mesh>
        {/* Open Park Reserve Grass */}
        <mesh position={[-50, 0, 70]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[26, 22]} />
          <meshStandardMaterial color="#22c55e" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
