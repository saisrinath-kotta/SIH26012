// City Data Model - Procedural Urban Generation for PS12 3D Cadastre
// Generates realistic dark urban neighborhoods, arterial roads, narrow access corridors, trees, and focus parcels

import { getBuildingFeatures, getRoadFeatures, getAccessCorridorFeatures } from './gis';

// Focus neighborhood center offset
export const FOCUS_AREA = {
  center: [-5, 0, 0],
  bounds: { minX: -55, maxX: 45, minZ: -45, maxZ: 55 },
  name: 'Ward 14 - Kengeri Urban Sector',
  crs: 'EPSG:4326 / Local Grid Metric (Meters)'
};

// Procedural building generator with deterministic pseudo-random variation
function createDeterministicRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateCityLayout() {
  const rand = createDeterministicRandom(101296);

  const buildings = [];
  const trees = [];
  const roadSegments = [];

  // 1. Roads & Corridors sourced directly from Canonical GIS Data (roads.geojson & accessCorridors.geojson)
  const gisRoads = getRoadFeatures();
  gisRoads.forEach((r) => {
    const [p1, p2] = r.pointsLocal;
    roadSegments.push({
      id: r.id,
      type: r.roadClass,
      start: [p1[0], 0, p1[1]],
      end: [p2[0], 0, p2[1]],
      width: r.width,
      hasMarkings: r.hasMarkings
    });
  });

  const gisAccess = getAccessCorridorFeatures();
  gisAccess.forEach((a) => {
    const [p1, p2] = a.pointsLocal;
    roadSegments.push({
      id: a.id,
      type: 'access',
      start: [p1[0], 0, p1[1]],
      end: [p2[0], 0, p2[1]],
      width: a.width,
      hasMarkings: false
    });
  });

  // 2. Focus Neighborhood Buildings sourced directly from Canonical GIS Data (buildings.geojson)
  const gisBuildings = getBuildingFeatures();
  const focusBuildings = gisBuildings.map((b) => ({
    id: b.id,
    x: b.localCenter[0],
    z: b.localCenter[1],
    w: b.localDimensions[0],
    d: b.localDimensions[1],
    h: b.localDimensions[2],
    facadeColor: b.facadeColor,
    roofColor: b.roofColor,
    roofStyle: b.roofStyle,
    parcelId: b.parcelId,
    type: b.type,
    confidence: b.confidenceScore,
    floors: b.floors,
    hasBalconies: b.hasBalconies,
    hasShopFront: b.hasShopFront
  }));

  buildings.push(...focusBuildings);

  // 3. Surrounding Neighborhoods (Realistic diverse urban blocks)
  const blockCenters = [
    // North blocks
    { cx: -100, cz: -80, spanX: 55, spanZ: 50 },
    { cx: -20, cz: -80, spanX: 65, spanZ: 50 },
    { cx: 70, cz: -80, spanX: 70, spanZ: 50 },

    // Mid West blocks
    { cx: -105, cz: 15, spanX: 60, spanZ: 45 },
    { cx: -105, cz: 80, spanX: 60, spanZ: 55 },

    // Mid East blocks
    { cx: 75, cz: 15, spanX: 75, spanZ: 45 },
    { cx: 75, cz: 80, spanX: 75, spanZ: 55 },

    // South blocks
    { cx: -20, cz: 90, spanX: 65, spanZ: 60 }
  ];

  const architecturalPalettes = [
    { facade: '#f8fafc', roof: '#475569' }, // Clean white + slate roof
    { facade: '#fef3c7', roof: '#b45309' }, // Warm cream + terracotta
    { facade: '#ffedd5', roof: '#c2410c' }, // Light peach + terracotta
    { facade: '#eddcd2', roof: '#64748b' }, // Sandstone beige + gravel
    { facade: '#e2e8f0', roof: '#334155' }, // Modern light gray
    { facade: '#dbeafe', roof: '#475569' }, // Soft pastel blue
    { facade: '#dcfce7', roof: '#b45309' }, // Soft pale sage green
    { facade: '#f3e8ff', roof: '#64748b' }  // Soft pale lavender/gray
  ];

  blockCenters.forEach((block, bIdx) => {
    const numBldgs = Math.floor(4 + rand() * 5);
    for (let i = 0; i < numBldgs; i++) {
      const w = 9 + rand() * 14;
      const d = 9 + rand() * 14;
      const h = 8 + rand() * 32;

      // Position within block boundaries
      const offsetX = (rand() - 0.5) * (block.spanX - w - 6);
      const offsetZ = (rand() - 0.5) * (block.spanZ - d - 6);
      const bx = block.cx + offsetX;
      const bz = block.cz + offsetZ;

      const palette = architecturalPalettes[Math.floor(rand() * architecturalPalettes.length)];
      const isLowRise = h < 14;

      buildings.push({
        id: `bldg-periph-${bIdx}-${i}`,
        x: Math.round(bx),
        z: Math.round(bz),
        w: Math.round(w),
        d: Math.round(d),
        h: Math.round(h),
        facadeColor: palette.facade,
        roofColor: isLowRise && rand() > 0.4 ? '#b45309' : palette.roof,
        roofStyle: isLowRise && rand() > 0.4 ? 'pitched_terracotta' : 'flat_parapet',
        parcelId: null,
        type: h > 24 ? 'commercial' : 'residential',
        confidence: 0.85 + rand() * 0.12,
        floors: Math.max(2, Math.round(h / 3.4)),
        hasBalconies: h > 16 && rand() > 0.3,
        hasShopFront: h > 18 && rand() > 0.5
      });
    }
  });

  // 4. Urban Vegetation / Trees
  // Place trees along roads, sidewalks, and open courtyards
  const treeLocations = [
    // Along Main EW Boulevard
    ...Array.from({ length: 18 }, (_, i) => ({ x: -130 + i * 15, z: -22 })),
    ...Array.from({ length: 18 }, (_, i) => ({ x: -130 + i * 15, z: -8 })),
    // Along NS Avenue
    ...Array.from({ length: 14 }, (_, i) => ({ x: 13, z: -110 + i * 16 })),
    ...Array.from({ length: 14 }, (_, i) => ({ x: 27, z: -110 + i * 16 })),
    // Focus neighborhood courtyard trees
    { x: -8, z: 8 },
    { x: -5, z: 20 },
    { x: -14, z: 20 },
    { x: -35, z: 12 },
    { x: -40, z: -2 },
    { x: 18, z: 6 },
    { x: 18, z: 28 },
    // Open plot green reserve (South-West corner)
    { x: -50, z: 70 },
    { x: -44, z: 65 },
    { x: -55, z: 62 },
    { x: -48, z: 78 }
  ];

  treeLocations.forEach((loc, idx) => {
    trees.push({
      id: `tree-${idx}`,
      x: loc.x + (rand() - 0.5) * 2,
      z: loc.z + (rand() - 0.5) * 2,
      height: 3.5 + rand() * 2.5,
      radius: 1.4 + rand() * 0.8
    });
  });

  return {
    buildings,
    trees,
    roadSegments
  };
}

// Global pipeline scene definitions (12 scenes)
export const SCENE_CONFIG = [
  {
    id: 1,
    title: 'THE URBAN LANDSCAPE',
    subtitle: 'From Physical Space to Digital Information',
    badge: 'SCENE 01 — CITY',
    phase: 'Physical Space',
    cameraMode: 'DESCEND',
    description: 'Cinematic establishing panorama descending toward an urban settlement with complex building arrangements and narrow corridors.'
  },
  {
    id: 2,
    title: 'THE CADASTRAL BOTTLENECK',
    subtitle: 'Complex Boundaries, Manual Interpretation & Field Disputes',
    badge: 'SCENE 02 — PROBLEM',
    phase: 'Cadastral Challenge',
    cameraMode: 'NEIGHBORHOOD',
    description: 'Irregular parcel boundaries, informal access roads, and traditional slow manual chain & total-station surveying.'
  },
  {
    id: 3,
    title: 'HIGH-PRECISION UAV SURVEY',
    subtitle: 'Autonomous Drone Flight & Photogrammetric Capture',
    badge: 'SCENE 03 — DRONE',
    phase: 'Data Acquisition',
    cameraMode: 'DRONE_FOLLOW',
    description: 'Surveying drone operates an automated lawnmower grid pattern capturing centimeter-grade aerial photogrammetry.'
  },
  {
    id: 4,
    title: 'HIGH-RESOLUTION AERIAL IMAGERY',
    subtitle: 'Orthomosaic Generation & Radiometric Calibration',
    badge: 'SCENE 04 — IMAGERY',
    phase: 'Spatial Pre-processing',
    cameraMode: 'TOP_DOWN_GIS',
    description: 'Stitched sub-decimeter true-ortho image plane referenced to national spatial reference grid (EPSG:4326).'
  },
  {
    id: 5,
    title: 'AI VISION FEATURE EXTRACTION',
    subtitle: 'Deep Convolutional Multi-Class Semantic Segmentation',
    badge: 'SCENE 05 — AI PIPELINE',
    phase: 'AI Inference',
    cameraMode: 'TOP_DOWN_GIS',
    description: 'Progressive semantic layer discovery: Building footprints, arterial roads, access corridors, and physical boundary evidence.'
  },
  {
    id: 6,
    title: 'BUILDING FOOTPRINT DETECTION',
    subtitle: 'Vectorized Polygonal Extraction with Confidence Scoring',
    badge: 'SCENE 06 — BUILDINGS',
    phase: 'Vectorization',
    cameraMode: 'PARCEL_CLOSEUP',
    description: 'Automated polygonization of rooflines into regularized vector boundaries with model confidence metrics.'
  },
  {
    id: 7,
    title: 'PRELIMINARY PARCEL MAP GENERATION',
    subtitle: 'AI-Assisted Parcel Delineation (Requires Surveyor Validation)',
    badge: 'SCENE 07 — PARCEL EXTRACTION',
    phase: 'Cadastral Generation',
    cameraMode: 'NEIGHBORHOOD',
    description: 'Delineation of preliminary land parcels (P001 to P005) combining building clustering and physical fence/road evidence.'
  },
  {
    id: 8,
    title: 'UNCERTAINTY & RISK DETECTION',
    subtitle: 'Explicit Delineation of High vs Low Confidence Features',
    badge: 'SCENE 08 — UNCERTAINTY',
    phase: 'Quality Assurance',
    cameraMode: 'PARCEL_CLOSEUP',
    description: 'Highlighting unambiguous physical evidence in green, flagging ambiguous walls or internal dividers in yellow for surveyor review.'
  },
  {
    id: 9,
    title: 'TOPOLOGICAL VALIDATION & REPAIR',
    subtitle: 'Detection & Cleansing of Overlaps, Slivers, and Gaps',
    badge: 'SCENE 09 — TOPOLOGY',
    phase: 'GIS Integrity',
    cameraMode: 'TOP_DOWN_GIS',
    description: 'Automated planar enforcement: flagging red overlapping polygons, snapping vertices, and closing spatial gaps.'
  },
  {
    id: 10,
    title: 'INTEGRATED WEB-GIS COMMAND PLATFORM',
    subtitle: 'Multi-Layer Spatial Inspection & Parcel Dossier Management',
    badge: 'SCENE 10 — WEB-GIS',
    phase: 'Cadastral GIS',
    cameraMode: 'SURVEYOR',
    description: 'Full-featured geospatial viewer with live geodetic area calculations, building counts, and verification actions.'
  },
  {
    id: 11,
    title: 'HUMAN-IN-THE-LOOP SURVEYOR VERIFICATION',
    subtitle: 'Field Verification, Boundary Adjustment & Surveyor Field Validation',
    badge: 'SCENE 11 — VERIFICATION',
    phase: 'Human Verification',
    cameraMode: 'SURVEYOR',
    description: 'Empowering licensed land surveyors to adjust uncertain vertices based on ground truth, transitioning status to Verified.'
  },
  {
    id: 12,
    title: 'DIGITAL CADASTRAL CITY',
    subtitle: 'GIS-Ready Preliminary Dataset from Sky to Screen',
    badge: 'SCENE 12 — FINAL DIGITAL TWIN',
    phase: 'Digital Cadastre',
    cameraMode: 'ESTABLISHING',
    description: 'Complete GIS-ready preliminary cadastral dataset with surveyor-verified boundaries ready for spatial planning and administrative review.'
  }
];
