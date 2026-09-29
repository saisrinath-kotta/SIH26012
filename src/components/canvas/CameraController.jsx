import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { getPolygonCenter } from '../../utils/gisUtils';

export default function CameraController({
  selectedParcel,
  cameraPreset,
  onPresetCompleted
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Handle Preset Camera Animations with GSAP
  useEffect(() => {
    if (!cameraPreset || !controlsRef.current) return;

    let targetPos = [60, 80, 100];
    let targetLook = [0, 0, 0];
    let duration = 1.6;

    switch (cameraPreset) {
      case 'overview':
        targetPos = [0, 130, 150];
        targetLook = [0, 0, 0];
        break;
      case 'oblique':
        targetPos = [85, 65, 85];
        targetLook = [0, 8, 0];
        break;
      case 'street':
        targetPos = [-15, 6, 35];
        targetLook = [0, 12, -10];
        break;
      case 'subsurface':
        targetPos = [40, -10, 50];
        targetLook = [0, -10, 0];
        break;
      case 'ortho':
        targetPos = [0, 170, 0.1];
        targetLook = [0, 0, 0];
        break;
      default:
        return;
    }

    const controls = controlsRef.current;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    gsap.to(camera.position, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration,
      ease: 'power3.inOut',
      onUpdate: () => controls.update()
    });

    gsap.to(controls.target, {
      x: targetLook[0],
      y: targetLook[1],
      z: targetLook[2],
      duration,
      ease: 'power3.inOut',
      onUpdate: () => controls.update(),
      onComplete: () => {
        if (onPresetCompleted) onPresetCompleted();
      }
    });
  }, [cameraPreset, camera, onPresetCompleted]);

  // Handle "Fly to Parcel" when selectedParcel changes
  useEffect(() => {
    if (!selectedParcel || !controlsRef.current) return;

    const [cx, cz] = getPolygonCenter(selectedParcel.polygon);
    const height = selectedParcel.height || 10;
    const distanceOffset = Math.max(height * 1.2, 35);

    const controls = controlsRef.current;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    gsap.to(camera.position, {
      x: cx + distanceOffset,
      y: height + distanceOffset * 0.75,
      z: cz + distanceOffset,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => controls.update()
    });

    gsap.to(controls.target, {
      x: cx,
      y: height * 0.4,
      z: cz,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => controls.update()
    });
  }, [selectedParcel, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 + 0.35} // Allows peeking slightly underneath for subsurface strata
      minDistance={5}
      maxDistance={350}
    />
  );
}
