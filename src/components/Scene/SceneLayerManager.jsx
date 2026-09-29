import React from 'react';
import ManualSurveyIndicators from '../Parcels/ManualSurveyIndicators';
import SurveyDrone from '../Drone/SurveyDrone';
import AerialImageryPlane from '../GIS/AerialImageryPlane';
import AIFeatureLayers from '../GIS/AIFeatureLayers';
import ExtractedBuildingHighlights from '../Buildings/ExtractedBuildingHighlights';
import ParcelPolygons3D from '../Parcels/ParcelPolygons3D';

export default function SceneLayerManager({
  currentScene,
  selectedParcelId,
  onSelectParcel,
  surveyorAdjusted,
  mode = 'CINEMATIC',
  interactiveStage = 0,
  isAnalyzing = false
}) {
  // If in Explore mode and running AI analysis, dynamically synchronize 3D viewport layers
  if (mode === 'EXPLORE' && isAnalyzing) {
    switch (interactiveStage) {
      case 0: // Image Ingestion
      case 1: // Spatial Preprocessing
        return <AerialImageryPlane showScanner={true} activeLayer="Radiometric Orthophoto" />;
      case 2: // AI Inference
      case 3: // Multi-Class Segmentation
        return (
          <group>
            <AerialImageryPlane showScanner={true} activeLayer="Semantic Multi-Class" />
            <AIFeatureLayers />
          </group>
        );
      case 4: // Vector Feature Extraction
        return <ExtractedBuildingHighlights />;
      case 5: // Boundary Evidence Analysis
        return <ParcelPolygons3D mode="uncertainty" />;
      case 6: // Preliminary Parcel Generation
        return <ParcelPolygons3D mode="preliminary" />;
      case 7: // Planar Topology Validation
        return <ParcelPolygons3D mode="topology" />;
      case 8: // Ready for Surveyor Field Sign-off
        return (
          <group>
            <ParcelPolygons3D mode="verified" />
            <AIFeatureLayers
              showBuildings={false}
              showRoads={true}
              showAccess={true}
              showLandUse={false}
              showBoundaryEvidence={true}
              isProgressive={false}
            />
          </group>
        );
      default:
        break;
    }
  }

  // Standard scene-based layer rendering for Cinematic Mode
  switch (currentScene) {
    case 1:
      // Scene 01: Physical Urban Landscape (no cadastral features yet)
      return null;

    case 2:
      // Scene 02: Cadastral Problem & Manual Survey lines
      return <ManualSurveyIndicators />;

    case 3:
      // Scene 03: Survey Drone in flight with downward scanning beam
      return <SurveyDrone isFlying={true} showScanBeam={true} />;

    case 4:
      // Scene 04: High-Resolution Aerial Imagery Plane
      return <AerialImageryPlane showScanner={false} activeLayer="Radiometric Orthophoto" />;

    case 5:
      // Scene 05: AI Vision Feature Extraction (Sweeping laser + semantic masks)
      return (
        <group>
          <AerialImageryPlane showScanner={true} activeLayer="Semantic Multi-Class" />
          <AIFeatureLayers />
        </group>
      );

    case 6:
      // Scene 06: Building Footprint Detection & Confidence Badges
      return <ExtractedBuildingHighlights />;

    case 7:
      // Scene 07: Preliminary Parcel Polygons (Hero Scene)
      return <ParcelPolygons3D mode="preliminary" />;

    case 8:
      // Scene 08: Uncertainty Detection (Green vs Yellow features)
      return <ParcelPolygons3D mode="uncertainty" />;

    case 9:
      // Scene 09: Topology Validation & Repair (Overlaps & Gaps)
      return <ParcelPolygons3D mode="topology" />;

    case 10:
      // Scene 10: Web-GIS Cadastral Command Platform
      return (
        <ParcelPolygons3D
          mode="webgis"
          selectedParcelId={selectedParcelId}
          onSelectParcel={onSelectParcel}
        />
      );

    case 11:
      // Scene 11: Surveyor Verification (Interactive alignment)
      return (
        <ParcelPolygons3D
          mode="uncertainty"
          selectedParcelId="P001"
          surveyorAdjusted={surveyorAdjusted}
        />
      );

    case 12:
      // Scene 12: Final Digital Cadastral City
      return (
        <group>
          <ParcelPolygons3D mode="verified" />
          <AIFeatureLayers
            showBuildings={false}
            showRoads={true}
            showAccess={true}
            showLandUse={false}
            showBoundaryEvidence={true}
            isProgressive={false}
          />
        </group>
      );

    default:
      return null;
  }
}
