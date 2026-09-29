// Parcel Data Model for PS12 3D Cadastre Prototype
// Connected directly to canonical GeoJSON data layer (src/data/gis/)
// Single source of truth for 3D visualization, WebGIS, and topology analysis

import {
  parcelsPreliminaryGeoJson,
  parcelsValidatedGeoJson,
  boundaryEvidenceGeoJson
} from './gis';

// Map boundary evidence features to their respective parcels
function getBoundarySegmentsForParcel(parcelId) {
  return boundaryEvidenceGeoJson.features
    .filter(f => f.properties.parcelId === parcelId)
    .map(f => ({
      id: f.properties.id,
      from: f.properties.fromLocal,
      to: f.properties.toLocal,
      type: f.properties.evidenceType,
      confidence: f.properties.confidence,
      status: f.properties.status,
      label: f.properties.label,
      source: f.properties.source
    }));
}

// Canonical preliminary parcels derived from GeoJSON
export const INITIAL_PARCELS_PS12 = parcelsPreliminaryGeoJson.features.map((f, idx) => {
  const p = f.properties;
  return {
    id: p.parcelId,
    parcelId: p.parcelId,
    surveyNumber: `Sy. No. ${104 + Math.floor(idx / 3)}/${(idx % 3) + 1} (Demo)`,
    ulpin: `1409240019280${idx + 1}`, // Illustrative Demo ID
    illustrativeId: `1409240019280${idx + 1}`,
    name: p.name,
    areaSqM: p.area,
    buildingsCount: p.buildingsCount,
    buildingIds: p.buildingIds,
    overallConfidence: p.confidenceScore,
    confidenceLabel: p.confidence,
    status: p.status === 'preliminary' ? 'AI-Assisted Preliminary' : 'Requires Surveyor Review',
    source: p.source || 'AI-assisted',
    validation: p.validation || 'Requires Surveyor Review',
    color: p.color,
    polygon: p.polygonLocal,
    boundarySegments: getBoundarySegmentsForParcel(p.parcelId),
    centroid: p.centroidLocal,
    geoJsonCoordinates: f.geometry.coordinates[0],
    disclaimer: 'Prototype / AI-Assisted Preliminary GIS Dataset — Requires Surveyor Validation'
  };
});

// Validated parcels (post-surveyor review) derived from parcelsValidated.geojson
export const VALIDATED_PARCELS_PS12 = parcelsValidatedGeoJson.features.map((f, idx) => {
  const p = f.properties;
  return {
    id: p.parcelId,
    parcelId: p.parcelId,
    surveyNumber: `Sy. No. ${104 + Math.floor(idx / 3)}/${(idx % 3) + 1} (Demo)`,
    ulpin: `1409240019280${idx + 1}`,
    illustrativeId: `1409240019280${idx + 1}`,
    name: p.name,
    areaSqM: p.area,
    buildingsCount: p.buildingsCount,
    buildingIds: p.buildingIds,
    overallConfidence: p.confidenceScore,
    confidenceLabel: p.confidence,
    status: 'Verified (Surveyor Review Complete)',
    source: p.source,
    validation: p.validation,
    color: p.color,
    polygon: p.polygonLocal,
    centroid: p.centroidLocal,
    geoJsonCoordinates: f.geometry.coordinates[0],
    surveyorSignoff: p.surveyorSignoff,
    disclaimer: 'GIS-Ready Preliminary Dataset — Demonstration Prototype'
  };
});

// Topology Error Dataset (Demonstrating temporary geometry errors in Scene 09)
export const TOPOLOGY_ERROR_DEMO = {
  // Overlapping geometry between P001 and P003
  overlapPolygon: [
    [-38, 14],
    [-5, 14],
    [-3, 19],
    [-36, 19],
    [-38, 14]
  ],
  overlapDescription: 'Overlapping polygon sliver: 38.4 m² planar spatial overlap detected between Parcel 001 and Parcel 003.',
  // Gap between P001 and P002
  gapPoints: [
    [-4, -14],
    [-1, -14],
    [0, 16],
    [-3, 16],
    [-4, -14]
  ],
  gapDescription: 'Spatial sliver gap: 2.4m unassigned cadastral void along access lane.',
  // Snapping repair rules applied
  snappedThreshold: '0.05m geodetic vertex snap'
};

// Surveyor boundary adjustment demo for Scene 11
export const SURVEYOR_VERIFICATION_DEMO = {
  parcelId: 'P001',
  segmentIndex: 2, // Internal fence line between P001 and P003
  originalAI: {
    from: [-3, 16],
    to: [-38, 16],
    status: 'UNCERTAIN',
    evidenceType: 'Vegetation / Fence line',
    reason: 'AI detected ambiguity between garden hedge and boundary monument line'
  },
  fieldTruth: {
    from: [-3, 16.8],
    to: [-38, 16.8],
    status: 'VERIFIED',
    evidenceType: 'Ground Survey Pillar & Stone Monument',
    surveyorNote: 'Confirmed by Licensed Cadastral Surveyor: Boundary monument stone found at offset +0.8m'
  }
};
