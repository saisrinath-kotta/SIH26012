// Canonical GIS Data Pipeline Index for PS12 3D Cadastre Prototype
// Single source of truth driving 3D Scene Visualization, WebGIS, Parcel Inspection, and Topology Validation

import buildingsGeoJson from './buildings.geojson';
import roadsGeoJson from './roads.geojson';
import accessCorridorsGeoJson from './accessCorridors.geojson';
import boundaryEvidenceGeoJson from './boundaryEvidence.geojson';
import parcelsPreliminaryGeoJson from './parcelsPreliminary.geojson';
import parcelsValidatedGeoJson from './parcelsValidated.geojson';

export {
  buildingsGeoJson,
  roadsGeoJson,
  accessCorridorsGeoJson,
  boundaryEvidenceGeoJson,
  parcelsPreliminaryGeoJson,
  parcelsValidatedGeoJson
};

// Global Geodetic CRS Metadata for coordinate conversion
export const GIS_METADATA = {
  crs: 'EPSG:4326',
  projectionName: 'WGS 84 (Latitude / Longitude)',
  localGrid: 'Local Tangent Plane (Metric X/Z)',
  origin: {
    longitude: 77.5945627,
    latitude: 12.9715987,
    metersPerDegLon: 108477,
    metersPerDegLat: 111000
  },
  disclaimer: 'AI-ASSISTED PRELIMINARY RESULTS — REQUIRES SURVEYOR VALIDATION. NOT AN OFFICIAL CADASTRAL RECORD.'
};

/**
 * Returns preliminary parcels list formatted for 3D and WebGIS components
 */
export function getPreliminaryParcels() {
  return parcelsPreliminaryGeoJson.features.map(f => ({
    id: f.properties.parcelId,
    parcelId: f.properties.parcelId,
    name: f.properties.name,
    areaSqM: f.properties.area,
    overallConfidence: f.properties.confidenceScore,
    confidenceLabel: f.properties.confidence,
    status: f.properties.status,
    validation: f.properties.validation,
    source: f.properties.source,
    color: f.properties.color,
    polygon: f.properties.polygonLocal,
    centroid: f.properties.centroidLocal,
    buildingsCount: f.properties.buildingsCount,
    buildingIds: f.properties.buildingIds,
    geoJsonCoordinates: f.geometry.coordinates[0],
    disclaimer: f.properties.disclaimer
  }));
}

/**
 * Returns validated parcels list (post surveyor review)
 */
export function getValidatedParcels() {
  return parcelsValidatedGeoJson.features.map(f => ({
    id: f.properties.parcelId,
    parcelId: f.properties.parcelId,
    name: f.properties.name,
    areaSqM: f.properties.area,
    overallConfidence: f.properties.confidenceScore,
    confidenceLabel: f.properties.confidence,
    status: f.properties.status,
    validation: f.properties.validation,
    source: f.properties.source,
    color: f.properties.color,
    polygon: f.properties.polygonLocal,
    centroid: f.properties.centroidLocal,
    buildingsCount: f.properties.buildingsCount,
    buildingIds: f.properties.buildingIds,
    geoJsonCoordinates: f.geometry.coordinates[0],
    surveyorSignoff: f.properties.surveyorSignoff,
    disclaimer: f.properties.disclaimer
  }));
}

/**
 * Returns building features extracted by AI
 */
export function getBuildingFeatures() {
  return buildingsGeoJson.features.map(f => ({
    id: f.properties.id,
    name: f.properties.name,
    parcelId: f.properties.parcelId,
    type: f.properties.buildingUse,
    confidence: f.properties.confidence,
    confidenceScore: f.properties.confidenceScore,
    area: f.properties.area,
    height: f.properties.height,
    floors: f.properties.floors,
    roofStyle: f.properties.roofStyle,
    facadeColor: f.properties.facadeColor,
    roofColor: f.properties.roofColor,
    hasBalconies: f.properties.hasBalconies,
    hasShopFront: f.properties.hasShopFront,
    source: f.properties.source,
    status: f.properties.status,
    localCenter: f.properties.localCenter,
    localDimensions: [
      f.properties.localDimensions?.[0] || 12,
      f.properties.localDimensions?.[1] || 12,
      f.properties.localDimensions?.[2] || f.properties.height || 18
    ],
    geoJsonCoordinates: f.geometry.coordinates[0]
  }));
}

/**
 * Returns road and corridor features
 */
export function getRoadFeatures() {
  return roadsGeoJson.features.map(f => ({
    id: f.properties.id,
    name: f.properties.name,
    roadClass: f.properties.roadClass,
    width: f.properties.width,
    hasMarkings: f.properties.hasMarkings,
    source: f.properties.source,
    pointsLocal: f.properties.pointsLocal,
    geoJsonCoordinates: f.geometry.coordinates
  }));
}

export function getAccessCorridorFeatures() {
  return accessCorridorsGeoJson.features.map(f => ({
    id: f.properties.id,
    name: f.properties.name,
    roadClass: f.properties.roadClass,
    corridorType: f.properties.corridorType,
    width: f.properties.width,
    source: f.properties.source,
    pointsLocal: f.properties.pointsLocal,
    geoJsonCoordinates: f.geometry.coordinates
  }));
}

/**
 * Returns boundary evidence features with high/uncertain/requires_field_review confidence
 */
export function getBoundaryEvidenceFeatures() {
  return boundaryEvidenceGeoJson.features.map(f => ({
    id: f.properties.id,
    parcelId: f.properties.parcelId,
    evidenceType: f.properties.evidenceType,
    confidence: f.properties.confidence,
    status: f.properties.status,
    label: f.properties.label,
    source: f.properties.source,
    from: f.properties.fromLocal,
    to: f.properties.toLocal,
    geoJsonCoordinates: f.geometry.coordinates
  }));
}
