import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateCityLayout, SCENE_CONFIG } from './data/cityData';
import { INITIAL_PARCELS_PS12 } from './data/parcelData';
import { INFERENCE_STAGE_CONFIG } from './ai';
import CinematicCanvas from './components/Scene/CinematicCanvas';
import SceneLayerManager from './components/Scene/SceneLayerManager';
import ProjectBanner from './components/HUD/ProjectBanner';
import CinematicTitles from './components/HUD/CinematicTitles';
import CinematicController from './components/HUD/CinematicController';
import WebGISInterface from './components/HUD/WebGISInterface';
import SurveyorVerificationWidget from './components/HUD/SurveyorVerificationWidget';
import TopologyValidatorWidget from './components/HUD/TopologyValidatorWidget';
import PipelineFlowDiagram from './components/HUD/PipelineFlowDiagram';
import AIVisionHUD from './components/HUD/AIVisionHUD';

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState('CINEMATIC'); // 'CINEMATIC' | 'EXPLORE'
  const [, setCanvasElement] = useState(null);

  // Selected parcel state for Web-GIS inspection
  const [selectedParcel, setSelectedParcel] = useState(INITIAL_PARCELS_PS12[0]);

  // Surveyor verification state for Scene 11
  const [surveyorAdjusted, setSurveyorAdjusted] = useState(false);

  // Interactive AI Pipeline state in Explore mode
  const [interactiveStage, setInteractiveStage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate procedural city layout once
  const cityData = useMemo(() => {
    return generateCityLayout();
  }, []);

  // Handle scene navigation
  const handleSceneChange = useCallback((sceneId) => {
    setCurrentScene(sceneId);
  }, []);

  // Handle Play/Pause in Cinematic mode
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle Mode Toggle (Cinematic vs Explore)
  const handleToggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'CINEMATIC' ? 'EXPLORE' : 'CINEMATIC';
      if (next === 'CINEMATIC') {
        setIsAnalyzing(false);
      }
      return next;
    });
  }, []);

  // Reset to Scene 01
  const handleReset = useCallback(() => {
    setCurrentScene(1);
    setIsPlaying(false);
    setMode('CINEMATIC');
    setSurveyorAdjusted(false);
    setIsAnalyzing(false);
    setInteractiveStage(0);
  }, []);

  // Interactive AI Analysis triggers for Explore Mode (Section 14)
  const handleToggleAnalysis = useCallback(() => {
    setIsAnalyzing((prev) => {
      const next = !prev;
      if (next && interactiveStage >= INFERENCE_STAGE_CONFIG.length - 1) {
        setInteractiveStage(0);
      }
      return next;
    });
  }, [interactiveStage]);

  const handleResetAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setInteractiveStage(0);
  }, []);

  // Automated stage progression when AI Analysis is active in Explore mode
  useEffect(() => {
    if (!isAnalyzing || mode !== 'EXPLORE') return;

    const timer = setInterval(() => {
      setInteractiveStage((prev) => {
        if (prev >= INFERENCE_STAGE_CONFIG.length - 1) {
          setIsAnalyzing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [isAnalyzing, mode]);

  // Automated scene playback progression when isPlaying is active in Cinematic mode
  useEffect(() => {
    if (!isPlaying || mode !== 'CINEMATIC') return;

    const sceneDuration = currentScene === 6 ? 9500 : 7500;

    const timer = setTimeout(() => {
      setCurrentScene((prev) => {
        if (prev >= SCENE_CONFIG.length) {
          setIsPlaying(false);
          return 1;
        }
        return prev + 1;
      });
    }, sceneDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, mode]);

  return (
    <div className="w-screen h-screen bg-[#030712] overflow-hidden relative select-none font-sans">
      {/* 3D Cinematic Viewport */}
      <main className="w-full h-full absolute inset-0">
        <CinematicCanvas
          cityData={cityData}
          currentScene={currentScene}
          mode={mode}
          onCanvasReady={setCanvasElement}
        >
          {/* Dynamic 3D Scene Layer Elements */}
          <SceneLayerManager
            currentScene={currentScene}
            selectedParcelId={selectedParcel.id}
            onSelectParcel={setSelectedParcel}
            surveyorAdjusted={surveyorAdjusted}
            mode={mode}
            interactiveStage={interactiveStage}
            isAnalyzing={isAnalyzing}
          />
        </CinematicCanvas>
      </main>

      {/* Top Branding & Legal Cadastral Disclaimer Banner */}
      <ProjectBanner />

      {/* Dynamic Cinematic Titles Overlay */}
      <CinematicTitles currentScene={currentScene} />

      {/* Section 6: AI Vision Pipeline HUD Overlay */}
      <AIVisionHUD
        currentScene={currentScene}
        mode={mode}
        interactiveStage={interactiveStage}
        onStageChange={setInteractiveStage}
        isAnalyzing={isAnalyzing}
        onToggleAnalysis={handleToggleAnalysis}
        onResetAnalysis={handleResetAnalysis}
      />

      {/* Scene 09: Topology Error Detection & Repair HUD Widget */}
      {currentScene === 9 && mode === 'CINEMATIC' && <TopologyValidatorWidget />}

      {/* Scene 10: Web-GIS Cadastral Command Platform Overlay */}
      {currentScene === 10 && mode === 'CINEMATIC' && (
        <WebGISInterface
          selectedParcelId={selectedParcel.id}
          onSelectParcel={setSelectedParcel}
          onVerifyParcel={(id) => {
            if (id === 'P001') setSurveyorAdjusted(true);
          }}
        />
      )}

      {/* Scene 11: Human-in-the-Loop Surveyor Verification HUD Widget */}
      {currentScene === 11 && mode === 'CINEMATIC' && (
        <SurveyorVerificationWidget
          onConfirmVerification={() => setSurveyorAdjusted(true)}
          isVerified={surveyorAdjusted}
        />
      )}

      {/* Scene 12: End-to-End Pipeline Summary Flowchart */}
      {currentScene === 12 && mode === 'CINEMATIC' && <PipelineFlowDiagram />}

      {/* Bottom Cinematic Control Deck */}
      <CinematicController
        currentScene={currentScene}
        onSceneChange={handleSceneChange}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        mode={mode}
        onToggleMode={handleToggleMode}
        onReset={handleReset}
      />
    </div>
  );
}
