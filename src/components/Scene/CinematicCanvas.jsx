import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import GISGridOverlay from '../GIS/GISGridOverlay';
import RoadNetwork from '../City/RoadNetwork';
import ProceduralCity from '../City/ProceduralCity';
import UrbanVegetation from '../City/UrbanVegetation';
import CameraDirector from '../Camera/CameraDirector';

export default function CinematicCanvas({
  cityData,
  currentScene,
  mode,
  onCanvasReady,
  children
}) {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        }}
        camera={{ position: [50, 140, 170], fov: 42, near: 0.5, far: 950 }}
        onCreated={({ gl }) => {
          if (onCanvasReady) onCanvasReady(gl.domElement);
        }}
      >
        {/* Realistic Daytime Blue Sky with Sun */}
        <Sky
          distance={450000}
          sunPosition={[85, 110, 65]}
          inclination={0.52}
          azimuth={0.28}
          turbidity={5}
          rayleigh={0.65}
          mieCoefficient={0.003}
          mieDirectionalG={0.8}
        />

        {/* Soft Daytime Atmospheric Haze (light bluish-gray, far distance) */}
        <fog attach="fog" args={['#dbeafe', 90, 420]} />

        {/* Natural Daytime Ambient & Fill Lighting */}
        <ambientLight intensity={0.65} color="#ffffff" />
        <hemisphereLight
          skyColor="#bae6fd"
          groundColor="#86efac"
          intensity={0.45}
        />

        {/* Key Directional Sunlight casting crisp shadows */}
        <directionalLight
          position={[85, 120, 65]}
          intensity={1.75}
          color="#fffdf5"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={350}
          shadow-camera-left={-140}
          shadow-camera-right={140}
          shadow-camera-top={140}
          shadow-camera-bottom={-140}
          shadow-bias={-0.0004}
        />

        {/* Urban Terrain and Spatial Grid */}
        <GISGridOverlay />

        {/* Road Infrastructure & Sidewalks */}
        <RoadNetwork roads={cityData.roadSegments} />

        {/* Colorful Procedural Architecture */}
        <ProceduralCity buildings={cityData.buildings} />

        {/* Lush Urban Greenery & Gardens */}
        <UrbanVegetation trees={cityData.trees} />

        {/* Scene-specific dynamic 3D elements (Drone, Polygons, Imagery, etc.) */}
        {children}

        {/* GSAP Camera Director */}
        <CameraDirector
          currentScene={currentScene}
          mode={mode}
        />
      </Canvas>
    </div>
  );
}
