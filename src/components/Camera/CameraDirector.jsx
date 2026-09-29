import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';

export default function CameraDirector({
  currentScene,
  mode = 'CINEMATIC', // 'CINEMATIC' | 'EXPLORE'
  onCameraTransitionComplete
}) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    // Define Camera Choreography per Scene
    let targetPos = [40, 150, 180];
    let targetLook = [-5, 0, 0];
    let duration = 3.5;
    let ease = 'power2.inOut';

    switch (currentScene) {
      case 1:
        // Scene 01: Establishing -> Descend toward focus neighborhood
        // Initial setup
        camera.position.set(50, 140, 170);
        controls.target.set(-5, 0, 0);
        controls.update();

        targetPos = [-22, 45, 62];
        targetLook = [-8, 6, 2];
        duration = 5.0;
        ease = 'power2.out';
        break;

      case 2:
        // Scene 02: Cadastral Problem - Closer inspection angle of irregular lanes
        targetPos = [-26, 28, 42];
        targetLook = [-10, 5, 5];
        duration = 2.5;
        break;

      case 3:
        // Scene 03: Drone Follow - Elevated angle matching drone altitude
        targetPos = [-35, 38, 30];
        targetLook = [-10, 18, 0];
        duration = 2.8;
        break;

      case 4:
      case 5:
        // Scene 04 & 05: Top-Down GIS / Orthomosaic plane
        targetPos = [-5, 110, 0.1];
        targetLook = [-5, 0, 0];
        duration = 3.0;
        break;

      case 6:
        // Scene 06: Dedicated 4-stage camera choreography handled via timeline below
        break;

      case 7:
        // Scene 07: Parcel & Building Extraction close-up oblique
        targetPos = [-12, 32, 44];
        targetLook = [-10, 6, 6];
        duration = 2.4;
        break;

      case 8:
      case 9:
        // Scene 08 & 09: Uncertainty & Topology Focus
        targetPos = [-18, 26, 36];
        targetLook = [-12, 4, 8];
        duration = 2.2;
        break;

      case 10:
      case 11:
        // Scene 10 & 11: WebGIS & Surveyor split perspective
        targetPos = [-15, 30, 48];
        targetLook = [-8, 6, 4];
        duration = 2.2;
        break;

      case 12:
        // Scene 12: Final Digital City aerial panorama
        targetPos = [45, 120, 140];
        targetLook = [-5, 0, 0];
        duration = 4.0;
        break;

      default:
        targetPos = [-22, 45, 62];
        targetLook = [-8, 6, 2];
        duration = 2.5;
    }

    if (mode === 'CINEMATIC') {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);

      if (currentScene === 6) {
        // Scene 06 Multi-Stage Choreography:
        // 1. Start with cinematic aerial/oblique view -> move smoothly toward cluster
        // 2. Slowly orbit/track around the buildings
        // 3. Transition toward more top-down perspective & pull upward
        camera.position.set(-36, 42, 50);
        controls.target.set(-12, 10, 4);
        controls.update();

        const tl = gsap.timeline({
          onUpdate: () => controls.update(),
          onComplete: () => {
            if (onCameraTransitionComplete) onCameraTransitionComplete();
          }
        });

        // Stage 1: Approach smoothly toward building cluster (inspection of B-001)
        tl.to(camera.position, {
          x: -24,
          y: 22,
          z: 32,
          duration: 2.8,
          ease: 'power2.inOut'
        }, 0);
        tl.to(controls.target, {
          x: -16,
          y: 8,
          z: 2,
          duration: 2.8,
          ease: 'power2.inOut'
        }, 0);

        // Stage 2: Slowly orbit/track around buildings (tracking past B-002 toward B-003)
        tl.to(camera.position, {
          x: 12,
          y: 26,
          z: 30,
          duration: 3.2,
          ease: 'sine.inOut'
        }, 2.8);
        tl.to(controls.target, {
          x: 2,
          y: 10,
          z: 6,
          duration: 3.2,
          ease: 'sine.inOut'
        }, 2.8);

        // Stage 3: Transition toward top-down perspective & pull upward over cluster
        tl.to(camera.position, {
          x: -8,
          y: 62,
          z: 16,
          duration: 3.0,
          ease: 'power2.out'
        }, 6.0);
        tl.to(controls.target, {
          x: -8,
          y: 0,
          z: 8,
          duration: 3.0,
          ease: 'power2.out'
        }, 6.0);

        return () => {
          tl.kill();
        };
      }

      gsap.to(camera.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration,
        ease,
        onUpdate: () => controls.update(),
        onComplete: () => {
          if (onCameraTransitionComplete) onCameraTransitionComplete();
        }
      });

      gsap.to(controls.target, {
        x: targetLook[0],
        y: targetLook[1],
        z: targetLook[2],
        duration,
        ease,
        onUpdate: () => controls.update()
      });
    }
  }, [currentScene, mode, camera, onCameraTransitionComplete]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above ground
      minDistance={6}
      maxDistance={350}
      enabled={mode === 'EXPLORE'} // Only enable manual orbit dragging in EXPLORE mode
    />
  );
}
