// Script to generate canonical GeoJSON files for PS12 Cadastral 3D prototype
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GIS_ORIGIN = {
  longitude: 77.5945627,
  latitude: 12.9715987,
  metersPerDegLon: 108477,
  metersPerDegLat: 111000
};

function threeToGis(x, z) {
  const lon = GIS_ORIGIN.longitude + (x / GIS_ORIGIN.metersPerDegLon);
  const lat = GIS_ORIGIN.latitude - (z / GIS_ORIGIN.metersPerDegLat);
  return [Number(lon.toFixed(7)), Number(lat.toFixed(7))];
}

const targetDir = path.resolve(__dirname, '../src/data/gis');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. BUILDINGS
const buildingDefs = [
  {
    id: 'B-001',
    name: 'North Commercial Complex - Block A',
    parcelId: 'P001',
    type: 'building',
    buildingUse: 'commercial',
    confidence: 'Illustrative (96%)',
    confidenceScore: 0.96,
    area: 256,
    height: 24,
    floors: 7,
    roofStyle: 'stepped_commercial',
    facadeColor: '#f8fafc',
    roofColor: '#475569',
    hasBalconies: true,
    hasShopFront: true,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -24, z: 2, w: 16, d: 16 }
  },
  {
    id: 'B-002',
    name: 'Urban Mixed-Use Plaza - Block B',
    parcelId: 'P001',
    type: 'building',
    buildingUse: 'mixed_use',
    confidence: 'Illustrative (94%)',
    confidenceScore: 0.94,
    area: 168,
    height: 18,
    floors: 5,
    roofStyle: 'terrace_pergola',
    facadeColor: '#fed7aa',
    roofColor: '#b45309',
    hasBalconies: true,
    hasShopFront: true,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -9, z: 2, w: 12, d: 14 }
  },
  {
    id: 'B-003',
    name: 'East Residential High-Rise - Tower A',
    parcelId: 'P002',
    type: 'building',
    buildingUse: 'residential',
    confidence: 'Illustrative (93%)',
    confidenceScore: 0.93,
    area: 224,
    height: 30,
    floors: 9,
    roofStyle: 'stepped_terrace',
    facadeColor: '#f1f5f9',
    roofColor: '#334155',
    hasBalconies: true,
    hasShopFront: false,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: 7, z: 2, w: 16, d: 14 }
  },
  {
    id: 'B-004',
    name: 'East Residential Complex - Tower B',
    parcelId: 'P002',
    type: 'building',
    buildingUse: 'residential',
    confidence: 'Illustrative (91%)',
    confidenceScore: 0.91,
    area: 196,
    height: 22,
    floors: 6,
    roofStyle: 'flat_parapet',
    facadeColor: '#e2e8f0',
    roofColor: '#475569',
    hasBalconies: true,
    hasShopFront: false,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: 7, z: 20, w: 14, d: 14 }
  },
  {
    id: 'B-005',
    name: 'Dense Residential Villa 1',
    parcelId: 'P003',
    type: 'building',
    buildingUse: 'residential',
    confidence: 'Illustrative (89%)',
    confidenceScore: 0.89,
    area: 120,
    height: 10,
    floors: 3,
    roofStyle: 'pitched_terracotta',
    facadeColor: '#ffedd5',
    roofColor: '#b45309',
    hasBalconies: false,
    hasShopFront: false,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -28, z: 28, w: 10, d: 12 }
  },
  {
    id: 'B-006',
    name: 'Dense Residential Villa 2',
    parcelId: 'P003',
    type: 'building',
    buildingUse: 'residential',
    confidence: 'Illustrative (88%)',
    confidenceScore: 0.88,
    area: 72,
    height: 8,
    floors: 2,
    roofStyle: 'pitched_terracotta',
    facadeColor: '#fef3c7',
    roofColor: '#9a3412',
    hasBalconies: false,
    hasShopFront: false,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -16, z: 32, w: 9, d: 8 }
  },
  {
    id: 'B-007',
    name: 'Dense Residential Villa 3',
    parcelId: 'P003',
    type: 'building',
    buildingUse: 'residential',
    confidence: 'Illustrative (86%)',
    confidenceScore: 0.86,
    area: 80,
    height: 11,
    floors: 3,
    roofStyle: 'pitched_terracotta',
    facadeColor: '#e0e7ff',
    roofColor: '#b45309',
    hasBalconies: false,
    hasShopFront: false,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -38, z: 28, w: 8, d: 10 }
  },
  {
    id: 'B-008',
    name: 'Civic Community Center',
    parcelId: 'P004',
    type: 'building',
    buildingUse: 'civic',
    confidence: 'Illustrative (97%)',
    confidenceScore: 0.97,
    area: 280,
    height: 15,
    floors: 4,
    roofStyle: 'flat_parapet',
    facadeColor: '#ffffff',
    roofColor: '#0284c7',
    hasBalconies: false,
    hasShopFront: true,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: -26, z: -32, w: 20, d: 14 }
  },
  {
    id: 'B-009',
    name: 'Workshop & Logistics Warehouse',
    parcelId: 'P005',
    type: 'building',
    buildingUse: 'commercial',
    confidence: 'Illustrative (92%)',
    confidenceScore: 0.92,
    area: 216,
    height: 11,
    floors: 2,
    roofStyle: 'flat_parapet',
    facadeColor: '#cbd5e1',
    roofColor: '#64748b',
    hasBalconies: false,
    hasShopFront: true,
    source: 'AI-assisted',
    status: 'preliminary',
    bounds: { x: 5, z: -32, w: 18, d: 12 }
  }
];

const buildingFeatures = buildingDefs.map(b => {
  const halfW = b.bounds.w / 2;
  const halfD = b.bounds.d / 2;
  const x1 = b.bounds.x - halfW;
  const x2 = b.bounds.x + halfW;
  const z1 = b.bounds.z - halfD;
  const z2 = b.bounds.z + halfD;

  const ringLocal = [
    [x1, z1],
    [x2, z1],
    [x2, z2],
    [x1, z2],
    [x1, z1]
  ];

  const ringGeo = ringLocal.map(([x, z]) => threeToGis(x, z));

  return {
    type: 'Feature',
    id: b.id,
    geometry: {
      type: 'Polygon',
      coordinates: [ringGeo]
    },
    properties: {
      id: b.id,
      name: b.name,
      parcelId: b.parcelId,
      type: 'building',
      buildingUse: b.buildingUse,
      confidence: b.confidence,
      confidenceScore: b.confidenceScore,
      area: b.area,
      height: b.height,
      floors: b.floors,
      roofStyle: b.roofStyle,
      facadeColor: b.facadeColor,
      roofColor: b.roofColor,
      hasBalconies: b.hasBalconies,
      hasShopFront: b.hasShopFront,
      source: b.source,
      status: b.status,
      localCenter: [b.bounds.x, b.bounds.z],
      localDimensions: [b.bounds.w, b.bounds.d, b.height],
      disclaimer: 'Illustrative / Demo Confidence - Prototype dataset'
    }
  };
});

const buildingsGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'Prototype AI-Assisted Building Footprints',
    crs: 'EPSG:4326',
    generated: new Date().toISOString(),
    disclaimer: 'Illustrative AI Output - Requires Surveyor Validation'
  },
  features: buildingFeatures
};

fs.writeFileSync(path.join(targetDir, 'buildings.geojson'), JSON.stringify(buildingsGeoJson, null, 2));

// 2. ROADS
const roadDefs = [
  {
    id: 'road-art-01',
    name: 'Main Urban Boulevard (East-West)',
    roadClass: 'arterial',
    width: 10,
    hasMarkings: true,
    pointsLocal: [[-150, -15], [150, -15]]
  },
  {
    id: 'road-art-02',
    name: 'Sector Central Avenue (North-South)',
    roadClass: 'arterial',
    width: 9,
    hasMarkings: true,
    pointsLocal: [[20, -150], [20, 150]]
  },
  {
    id: 'road-sec-01',
    name: 'Collector Cross Street 1',
    roadClass: 'secondary',
    width: 6,
    hasMarkings: false,
    pointsLocal: [[-65, -150], [-65, 150]]
  },
  {
    id: 'road-sec-02',
    name: 'Collector Cross Street 2',
    roadClass: 'secondary',
    width: 6,
    hasMarkings: false,
    pointsLocal: [[-150, 45], [150, 45]]
  }
];

const roadFeatures = roadDefs.map(r => ({
  type: 'Feature',
  id: r.id,
  geometry: {
    type: 'LineString',
    coordinates: r.pointsLocal.map(([x, z]) => threeToGis(x, z))
  },
  properties: {
    id: r.id,
    name: r.name,
    type: 'road',
    roadClass: r.roadClass,
    width: r.width,
    hasMarkings: r.hasMarkings,
    source: 'AI-assisted',
    status: 'preliminary',
    pointsLocal: r.pointsLocal,
    disclaimer: 'Prototype GIS Dataset'
  }
}));

const roadsGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'Prototype AI-Assisted Road Network',
    crs: 'EPSG:4326',
    generated: new Date().toISOString()
  },
  features: roadFeatures
};

fs.writeFileSync(path.join(targetDir, 'roads.geojson'), JSON.stringify(roadsGeoJson, null, 2));

// 3. ACCESS CORRIDORS
const accessDefs = [
  {
    id: 'acc-01',
    name: 'Community Access Corridor 1',
    roadClass: 'access_corridor',
    corridorType: 'narrow_lane',
    width: 3.5,
    pointsLocal: [[-45, -15], [-45, 45]]
  },
  {
    id: 'acc-02',
    name: 'East-West Intra-Sector Lane',
    roadClass: 'access_corridor',
    corridorType: 'narrow_lane',
    width: 3.2,
    pointsLocal: [[-65, 15], [20, 15]]
  },
  {
    id: 'acc-03',
    name: 'Shared Residential Pedestrian Pathway',
    roadClass: 'access_corridor',
    corridorType: 'pathway',
    width: 2.5,
    pointsLocal: [[-2, -14], [-2, 38]]
  },
  {
    id: 'acc-04',
    name: 'Rear Utility Access Passage',
    roadClass: 'access_corridor',
    corridorType: 'pathway',
    width: 2.0,
    pointsLocal: [[-38, 16], [-5, 16]]
  }
];

const accessFeatures = accessDefs.map(a => ({
  type: 'Feature',
  id: a.id,
  geometry: {
    type: 'LineString',
    coordinates: a.pointsLocal.map(([x, z]) => threeToGis(x, z))
  },
  properties: {
    id: a.id,
    name: a.name,
    type: 'access_corridor',
    roadClass: a.roadClass,
    corridorType: a.corridorType,
    width: a.width,
    source: 'AI-assisted',
    status: 'preliminary',
    pointsLocal: a.pointsLocal,
    disclaimer: 'Prototype GIS Dataset'
  }
}));

const accessCorridorsGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'Prototype AI-Assisted Access Corridors & Pathways',
    crs: 'EPSG:4326',
    generated: new Date().toISOString()
  },
  features: accessFeatures
};

fs.writeFileSync(path.join(targetDir, 'accessCorridors.geojson'), JSON.stringify(accessCorridorsGeoJson, null, 2));

// 4. BOUNDARY EVIDENCE
const boundaryDefs = [
  // P001 evidence
  { id: 'BE-001', parcelId: 'P001', evidenceType: 'compound_wall', confidence: 'HIGH', status: 'verified_physical', label: 'Solid Masonry Compound Wall', from: [-36, -14], to: [-5, -14] },
  { id: 'BE-002', parcelId: 'P001', evidenceType: 'road_edge', confidence: 'HIGH', status: 'verified_physical', label: 'Paved Curb Line along Access Lane', from: [-5, -14], to: [-3, 16] },
  { id: 'BE-003', parcelId: 'P001', evidenceType: 'hedge', confidence: 'UNCERTAIN', status: 'requires_field_review', label: 'Vegetation & Informal Broken Fence', from: [-3, 16], to: [-38, 16] },
  { id: 'BE-004', parcelId: 'P001', evidenceType: 'compound_wall', confidence: 'HIGH', status: 'verified_physical', label: 'Continuous Masonry Boundary Wall', from: [-38, 16], to: [-36, -14] },

  // P002 evidence
  { id: 'BE-005', parcelId: 'P002', evidenceType: 'road_edge', confidence: 'HIGH', status: 'verified_physical', label: 'Main Boulevard Paved Curb Frontage', from: [-2, -14], to: [22, -14] },
  { id: 'BE-006', parcelId: 'P002', evidenceType: 'fence', confidence: 'HIGH', status: 'verified_physical', label: 'Avenue Perimeter Metal Railing', from: [22, -14], to: [24, 38] },
  { id: 'BE-007', parcelId: 'P002', evidenceType: 'compound_wall', confidence: 'HIGH', status: 'verified_physical', label: 'Rear Masonry Retaining Wall', from: [24, 38], to: [-1, 38] },
  { id: 'BE-008', parcelId: 'P002', evidenceType: 'road_edge', confidence: 'HIGH', status: 'verified_physical', label: 'Shared Corridor Access Curb', from: [-1, 38], to: [-2, -14] },

  // P003 evidence
  { id: 'BE-009', parcelId: 'P003', evidenceType: 'hedge', confidence: 'UNCERTAIN', status: 'requires_field_review', label: 'Informal Hedge Line / Dense Shrubbery', from: [-46, 17], to: [-2, 17] },
  { id: 'BE-010', parcelId: 'P003', evidenceType: 'road_edge', confidence: 'HIGH', status: 'verified_physical', label: 'Shared Access Pathway Edge', from: [-2, 17], to: [-2, 42] },
  { id: 'BE-011', parcelId: 'P003', evidenceType: 'curb', confidence: 'HIGH', status: 'verified_physical', label: 'Collector Street Concrete Curb', from: [-2, 42], to: [-48, 42] },
  { id: 'BE-012', parcelId: 'P003', evidenceType: 'fence', confidence: 'HIGH', status: 'verified_physical', label: 'Access Pathway Boundary Fence', from: [-48, 42], to: [-46, 17] },

  // P004 evidence
  { id: 'BE-013', parcelId: 'P004', evidenceType: 'compound_wall', confidence: 'HIGH', status: 'verified_physical', label: 'Government Civic Compound Wall', from: [-42, -43], to: [-10, -43] },
  { id: 'BE-014', parcelId: 'P004', evidenceType: 'visible_boundary_marker', confidence: 'HIGH', status: 'verified_physical', label: 'Concrete Survey Marker Pillars', from: [-10, -43], to: [-8, -18] },
  { id: 'BE-015', parcelId: 'P004', evidenceType: 'curb', confidence: 'HIGH', status: 'verified_physical', label: 'Boulevard Setback Curb Line', from: [-8, -18], to: [-40, -18] },
  { id: 'BE-016', parcelId: 'P004', evidenceType: 'compound_wall', confidence: 'HIGH', status: 'verified_physical', label: 'Side Boundary Masonry Wall', from: [-40, -18], to: [-42, -43] },

  // P005 evidence
  { id: 'BE-017', parcelId: 'P005', evidenceType: 'fence', confidence: 'HIGH', status: 'verified_physical', label: 'Industrial Steel Chainlink Fence', from: [-6, -43], to: [22, -43] },
  { id: 'BE-018', parcelId: 'P005', evidenceType: 'curb', confidence: 'HIGH', status: 'verified_physical', label: 'Avenue Margin Setback Curb', from: [22, -43], to: [20, -18] },
  { id: 'BE-019', parcelId: 'P005', evidenceType: 'curb', confidence: 'HIGH', status: 'verified_physical', label: 'Boulevard Road Margin', from: [20, -18], to: [-5, -18] },
  { id: 'BE-020', parcelId: 'P005', evidenceType: 'visible_boundary_marker', confidence: 'HIGH', status: 'verified_physical', label: 'Cadastral Boundary Monument Pillars', from: [-5, -18], to: [-6, -43] }
];

const boundaryFeatures = boundaryDefs.map(b => ({
  type: 'Feature',
  id: b.id,
  geometry: {
    type: 'LineString',
    coordinates: [threeToGis(b.from[0], b.from[1]), threeToGis(b.to[0], b.to[1])]
  },
  properties: {
    id: b.id,
    parcelId: b.parcelId,
    evidenceType: b.evidenceType,
    confidence: b.confidence,
    status: b.status,
    label: b.label,
    source: 'AI-assisted visual extraction',
    fromLocal: b.from,
    toLocal: b.to,
    conceptualDistinction: 'Physical visible boundary evidence is NOT legal cadastral boundary'
  }
}));

const boundaryEvidenceGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'Prototype Physical Boundary Evidence Layer',
    crs: 'EPSG:4326',
    generated: new Date().toISOString(),
    principle: 'A visible physical feature is NOT automatically a legal cadastral boundary.'
  },
  features: boundaryFeatures
};

fs.writeFileSync(path.join(targetDir, 'boundaryEvidence.geojson'), JSON.stringify(boundaryEvidenceGeoJson, null, 2));

// 5. PRELIMINARY PARCELS
const preliminaryParcelDefs = [
  {
    parcelId: 'P001',
    name: 'North Commercial Complex',
    area: 1284,
    confidence: 'Illustrative (94%)',
    confidenceScore: 0.94,
    status: 'preliminary',
    source: 'AI-assisted',
    validation: 'Requires Surveyor Review',
    buildingsCount: 2,
    buildingIds: ['B-001', 'B-002'],
    color: '#06b6d4',
    polygonLocal: [
      [-36, -14],
      [-5, -14],
      [-3, 16],
      [-38, 16],
      [-36, -14]
    ],
    centroidLocal: [-20, 1]
  },
  {
    parcelId: 'P002',
    name: 'East Residential Block',
    area: 1420,
    confidence: 'Illustrative (92%)',
    confidenceScore: 0.92,
    status: 'preliminary',
    source: 'AI-assisted',
    validation: 'Requires Surveyor Review',
    buildingsCount: 2,
    buildingIds: ['B-003', 'B-004'],
    color: '#0ea5e9',
    polygonLocal: [
      [-2, -14],
      [22, -14],
      [24, 38],
      [-1, 38],
      [-2, -14]
    ],
    centroidLocal: [10, 12]
  },
  {
    parcelId: 'P003',
    name: 'Dense Residential Cluster',
    area: 980,
    confidence: 'Illustrative (87%)',
    confidenceScore: 0.87,
    status: 'uncertain',
    source: 'AI-assisted',
    validation: 'Requires Surveyor Review (Hedge Ambiguity)',
    buildingsCount: 3,
    buildingIds: ['B-005', 'B-006', 'B-007'],
    color: '#38bdf8',
    polygonLocal: [
      [-46, 17],
      [-2, 17],
      [-2, 42],
      [-48, 42],
      [-46, 17]
    ],
    centroidLocal: [-24, 30]
  },
  {
    parcelId: 'P004',
    name: 'Civil Community Center',
    area: 1150,
    confidence: 'Illustrative (97%)',
    confidenceScore: 0.97,
    status: 'preliminary',
    source: 'AI-assisted',
    validation: 'Requires Surveyor Review',
    buildingsCount: 1,
    buildingIds: ['B-008'],
    color: '#818cf8',
    polygonLocal: [
      [-42, -43],
      [-10, -43],
      [-8, -18],
      [-40, -18],
      [-42, -43]
    ],
    centroidLocal: [-25, -30]
  },
  {
    parcelId: 'P005',
    name: 'Workshop & Logistics Yard',
    area: 1040,
    confidence: 'Illustrative (91%)',
    confidenceScore: 0.91,
    status: 'preliminary',
    source: 'AI-assisted',
    validation: 'Requires Surveyor Review',
    buildingsCount: 1,
    buildingIds: ['B-009'],
    color: '#0284c7',
    polygonLocal: [
      [-6, -43],
      [22, -43],
      [20, -18],
      [-5, -18],
      [-6, -43]
    ],
    centroidLocal: [8, -30]
  }
];

const preliminaryFeatures = preliminaryParcelDefs.map(p => ({
  type: 'Feature',
  id: p.parcelId,
  geometry: {
    type: 'Polygon',
    coordinates: [p.polygonLocal.map(([x, z]) => threeToGis(x, z))]
  },
  properties: {
    parcelId: p.parcelId,
    id: p.parcelId,
    name: p.name,
    area: p.area,
    confidence: p.confidence,
    confidenceScore: p.confidenceScore,
    status: p.status,
    source: p.source,
    validation: p.validation,
    buildingsCount: p.buildingsCount,
    buildingIds: p.buildingIds,
    color: p.color,
    polygonLocal: p.polygonLocal,
    centroidLocal: p.centroidLocal,
    disclaimer: 'Prototype / AI-Assisted Preliminary GIS Dataset - Requires Surveyor Validation'
  }
}));

const parcelsPreliminaryGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'Prototype AI-Assisted Preliminary Cadastral Parcels',
    crs: 'EPSG:4326',
    generated: new Date().toISOString(),
    status: 'AI-ASSISTED PRELIMINARY',
    disclaimer: 'AI-ASSISTED PRELIMINARY RESULTS — REQUIRES SURVEYOR VALIDATION. NOT AN OFFICIAL CADASTRAL RECORD.'
  },
  features: preliminaryFeatures
};

fs.writeFileSync(path.join(targetDir, 'parcelsPreliminary.geojson'), JSON.stringify(parcelsPreliminaryGeoJson, null, 2));

// 6. VALIDATED PARCELS (Post-Surveyor Verification)
const validatedParcelDefs = preliminaryParcelDefs.map(p => {
  if (p.parcelId === 'P001') {
    // Surveyor verified boundary line between P001 and P003 adjusted by +0.8m
    const adjustedPolygonLocal = [
      [-36, -14],
      [-5, -14],
      [-3, 16.8],
      [-38, 16.8],
      [-36, -14]
    ];
    return {
      ...p,
      area: 1308,
      status: 'verified',
      validation: 'Surveyor Field Verified & Monumented',
      polygonLocal: adjustedPolygonLocal,
      centroidLocal: [-20, 1.4],
      surveyorSignoff: {
        date: '2026-09-29',
        license: 'KA-CAD-2026-0419',
        notes: 'Stone boundary monument pillar confirmed at +0.8m hedge offset.'
      }
    };
  }
  return {
    ...p,
    status: 'verified',
    validation: 'Surveyor Field Verified',
    surveyorSignoff: {
      date: '2026-09-29',
      license: 'KA-CAD-2026-0419',
      notes: 'Physical perimeter confirmed against visual boundary evidence.'
    }
  };
});

const validatedFeatures = validatedParcelDefs.map(p => ({
  type: 'Feature',
  id: p.parcelId,
  geometry: {
    type: 'Polygon',
    coordinates: [p.polygonLocal.map(([x, z]) => threeToGis(x, z))]
  },
  properties: {
    parcelId: p.parcelId,
    id: p.parcelId,
    name: p.name,
    area: p.area,
    confidence: 'Surveyor Verified (Field Truth)',
    confidenceScore: 1.0,
    status: 'verified',
    source: 'Surveyor Verified with AI Base',
    validation: p.validation,
    buildingsCount: p.buildingsCount,
    buildingIds: p.buildingIds,
    color: '#10b981',
    polygonLocal: p.polygonLocal,
    centroidLocal: p.centroidLocal,
    surveyorSignoff: p.surveyorSignoff,
    disclaimer: 'Prototype GIS Dataset — Field Verified Demonstration'
  }
}));

const parcelsValidatedGeoJson = {
  type: 'FeatureCollection',
  metadata: {
    title: 'GIS-Ready Preliminary Dataset (Surveyor Verified Demo)',
    crs: 'EPSG:4326',
    generated: new Date().toISOString(),
    status: 'VERIFIED',
    disclaimer: 'GIS-Ready Preliminary Dataset — Demonstration Prototype'
  },
  features: validatedFeatures
};

fs.writeFileSync(path.join(targetDir, 'parcelsValidated.geojson'), JSON.stringify(parcelsValidatedGeoJson, null, 2));

console.log('Successfully generated all 6 canonical GeoJSON datasets in src/data/gis/');
