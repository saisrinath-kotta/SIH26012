import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows } from '@react-three/drei';
import GroundGrid from './GroundGrid';
import CadastralParcelMesh from './CadastralParcelMesh';
import SubsurfaceUtilities from './SubsurfaceUtilities';
import MeasurementTool3D from './MeasurementTool3D';
import CameraController from './CameraController';

export default function CadastralScene({
  parcels,
  selectedParcel,
  onSelectParcel,
  viewMode,
  showSubsurface,
  showSetbacks,
  showLabels,
  timeOfDay, // hours 6 to 20
  measureMode,
  measurePoints,
  onAddMeasurePoint,
  onResetMeasure,
  cameraPreset,
  onPresetCompleted,
  onCanvasReady,
  selectedStrata,
  onSelectStrata
}) {
  // Calculate dynamic sun position based on time of day (6:00 to 20:00)
  const sunPosition = useMemo(() => {
    // 6am is east, 13:00 is high noon, 19:00 is sunset west
    const angle = ((timeOfDay - 6) / 14) * Math.PI;
    const x = Math.cos(angle) * 120;
    const y = Math.sin(angle) * 90;
    const z = 40;
    return [x, Math.max(y, 2), z];
  }, [timeOfDay]);

  const sunIntensity = useMemo(() => {
    if (timeOfDay < 7 || timeOfDay > 18.5) return 0.4;
    return 1.4;
  }, [timeOfDay]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{
          preserveDrawingBuffer: true, // Necessary for HD snapshots and canvas video stream recording
          antialias: true,
          alpha: false
        }}
        camera={{ position: [65, 85, 110], fov: 45, near: 0.5, far: 1000 }}
        onCreated={({ gl }) => {
          if (onCanvasReady) onCanvasReady(gl.domElement);
        }}
      >
        {/* Atmospheric Sky */}
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={0.49}
          azimuth={0.25}
          turbidity={8}
          rayleigh={timeOfDay < 7 || timeOfDay > 17.5 ? 4 : 1.2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        {/* Ambient & Hemisphere Lighting */}
        <ambientLight intensity={timeOfDay > 18 || timeOfDay < 7 ? 0.35 : 0.65} />
        <hemisphereLight
          skyColor="#bae6fd"
          groundColor="#0f172a"
          intensity={0.4}
        />

        {/* Dynamic Directional Sun with crisp shadows */}
        <directionalLight
          position={sunPosition}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={300}
          shadow-camera-left={-120}
          shadow-camera-right={120}
          shadow-camera-top={120}
          shadow-camera-bottom={-120}
          shadow-bias={-0.0005}
        />

        {/* Soft Contact Shadows on ground */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.65}
          scale={240}
          blur={1.8}
          far={30}
        />

        {/* Cadastral Base Grid & Coordinates */}
        <GroundGrid showSubsurface={showSubsurface} />

        {/* 3D Extruded Cadastral Parcels */}
        <group>
          {parcels.map((parcel) => (
            <CadastralParcelMesh
              key={parcel.id}
              parcel={parcel}
              isSelected={selectedParcel?.id === parcel.id}
              onSelect={onSelectParcel}
              viewMode={viewMode}
              showSetbacks={showSetbacks}
              showLabels={showLabels}
            />
          ))}
        </group>

        {/* Subsurface 3D Utilities / Metro Tunnels */}
        <SubsurfaceUtilities
          visible={showSubsurface}
          selectedStrataId={selectedStrata?.id}
          onSelectStrata={onSelectStrata}
        />

        {/* Interactive 3D Measurement Laser */}
        <MeasurementTool3D
          active={measureMode}
          points={measurePoints}
          onAddPoint={onAddMeasurePoint}
          onReset={onResetMeasure}
        />

        {/* GSAP Camera Controller and OrbitControls */}
        <CameraController
          selectedParcel={selectedParcel}
          cameraPreset={cameraPreset}
          onPresetCompleted={onPresetCompleted}
        />
      </Canvas>
    </div>
  );
}
