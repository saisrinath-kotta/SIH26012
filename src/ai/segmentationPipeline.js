// Multi-Class Semantic Segmentation Pipeline Specification for PS12 Prototype
// Slices aerial orthomosaic into distinct semantic vector classes:
// 1. Buildings (Cyan)
// 2. Roads (Amber)
// 3. Access Corridors (Violet)
// 4. Land-Use Classification (Subtle illustrative zoning overlays)
// 5. Boundary Evidence (Green high confidence vs Yellow uncertain)

export const SEGMENTATION_CLASSES = {
  BUILDING: {
    id: 'building',
    label: 'Building Footprints',
    colorHex: '#00f0ff',
    threeColor: '#38bdf8',
    strokeWidth: 2.5,
    tag: 'STRUCTURE'
  },
  ROAD_ARTERIAL: {
    id: 'road_arterial',
    label: 'Arterial / Primary Roads',
    colorHex: '#f59e0b',
    threeColor: '#f59e0b',
    strokeWidth: 4,
    tag: 'TRANSPORT'
  },
  ROAD_ACCESS: {
    id: 'road_access',
    label: 'Access Lanes & Alleys',
    colorHex: '#a855f7',
    threeColor: '#c084fc',
    strokeWidth: 2,
    tag: 'CORRIDOR'
  },
  BOUNDARY_EVIDENCE_HIGH: {
    id: 'boundary_high',
    label: 'High-Confidence Evidence (Masonry / Curb)',
    colorHex: '#10b981',
    threeColor: '#10b981',
    strokeWidth: 3,
    tag: 'PHYSICAL_EDGE'
  },
  BOUNDARY_EVIDENCE_UNCERTAIN: {
    id: 'boundary_uncertain',
    label: 'Uncertain Evidence (Hedge / Broken Fence)',
    colorHex: '#eab308',
    threeColor: '#eab308',
    strokeWidth: 2.5,
    tag: 'FIELD_REVIEW_REQUIRED'
  }
};

// Illustrative Land-Use Zoning Regions (Section 5 Requirement)
export const LAND_USE_REGIONS = [
  {
    id: 'lu-01',
    name: 'Sector Commercial Hub',
    classification: 'Commercial',
    color: '#0284c7',
    center: [-20, 0],
    dimensions: [42, 26],
    disclaimer: 'Illustrative AI Classification'
  },
  {
    id: 'lu-02',
    name: 'Residential Density Sector',
    classification: 'Residential',
    color: '#10b981',
    center: [-20, 26],
    dimensions: [44, 28],
    disclaimer: 'Illustrative AI Classification'
  },
  {
    id: 'lu-03',
    name: 'Civic & Community Facility',
    classification: 'Civic / Open Space',
    color: '#8b5cf6',
    center: [-26, -32],
    dimensions: [32, 20],
    disclaimer: 'Illustrative AI Classification'
  },
  {
    id: 'lu-04',
    name: 'Workshop & Logistics Enclosure',
    classification: 'Mixed Use / Workshop',
    color: '#f59e0b',
    center: [8, -32],
    dimensions: [28, 22],
    disclaimer: 'Illustrative AI Classification'
  }
];
