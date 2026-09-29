// Prototype AI Inference Engine for PS12 3D Cadastre Prototype
// Deterministic simulation demonstrating where a real vision model operates
// Note: This is prototype simulation logic for demonstration, NOT a trained production model.

export const INFERENCE_STATES = {
  IDLE: 'IDLE',
  IMAGE_INGESTION: 'IMAGE_INGESTION',
  PREPROCESSING: 'PREPROCESSING',
  AI_INFERENCE: 'AI_INFERENCE',
  SEGMENTATION: 'SEGMENTATION',
  FEATURE_VECTORISATION: 'FEATURE_VECTORISATION',
  BOUNDARY_EVIDENCE: 'BOUNDARY_EVIDENCE',
  PARCEL_GENERATION: 'PARCEL_GENERATION',
  TOPOLOGY_CHECK: 'TOPOLOGY_CHECK',
  READY_FOR_SURVEYOR: 'READY_FOR_SURVEYOR'
};

export const INFERENCE_STAGE_CONFIG = [
  {
    key: INFERENCE_STATES.IMAGE_INGESTION,
    label: 'Image Ingestion',
    shortLabel: 'Ingestion',
    description: 'Centimeter-grade UAV aerial orthomosaic tiles loaded into memory tensor',
    sceneId: 4,
    color: '#0284c7'
  },
  {
    key: INFERENCE_STATES.PREPROCESSING,
    label: 'Spatial Preprocessing',
    shortLabel: 'Preprocessing',
    description: 'Radiometric calibration & EPSG:4326 georeferenced spatial tile pyramid',
    sceneId: 4,
    color: '#0ea5e9'
  },
  {
    key: INFERENCE_STATES.AI_INFERENCE,
    label: 'Vision Inference',
    shortLabel: 'Inference',
    description: 'Multi-scale spatial feature extraction over urban orthomosaic scanline',
    sceneId: 5,
    color: '#06b6d4'
  },
  {
    key: INFERENCE_STATES.SEGMENTATION,
    label: 'Multi-Class Segmentation',
    shortLabel: 'Segmentation',
    description: 'Pixel-level masks for buildings, roads, access corridors, and land zoning',
    sceneId: 5,
    color: '#38bdf8'
  },
  {
    key: INFERENCE_STATES.FEATURE_VECTORISATION,
    label: 'Vector Feature Extraction',
    shortLabel: 'Vectorization',
    description: 'Regularized polygonal vector footprints extracted for structures (B-001..B-009)',
    sceneId: 6,
    color: '#00f0ff'
  },
  {
    key: INFERENCE_STATES.BOUNDARY_EVIDENCE,
    label: 'Boundary Evidence Analysis',
    shortLabel: 'Boundary Evidence',
    description: 'Physical compound walls, curbs, and hedges delineated with uncertainty flags',
    sceneId: 8,
    color: '#eab308'
  },
  {
    key: INFERENCE_STATES.PARCEL_GENERATION,
    label: 'Preliminary Parcel Generation',
    shortLabel: 'Parcel Generation',
    description: 'Graph relationship clustering forms candidate preliminary parcel polygons (P001..P005)',
    sceneId: 7,
    color: '#818cf8'
  },
  {
    key: INFERENCE_STATES.TOPOLOGY_CHECK,
    label: 'Planar Topology Validation',
    shortLabel: 'Topology Check',
    description: 'Enforcing polygon closure, detecting overlaps, and geodetic vertex snapping',
    sceneId: 9,
    color: '#f59e0b'
  },
  {
    key: INFERENCE_STATES.READY_FOR_SURVEYOR,
    label: 'Surveyor Field Review Ready',
    shortLabel: 'Surveyor Ready',
    description: 'Validated preliminary cadastral dataset packaged for licensed surveyor sign-off',
    sceneId: 11,
    color: '#10b981'
  }
];

// Helper to map 12-scene pipeline IDs to corresponding AI inference state
export function getInferenceStateForScene(sceneId) {
  switch (sceneId) {
    case 1:
    case 2:
    case 3:
      return INFERENCE_STATES.IDLE;
    case 4:
      return INFERENCE_STATES.IMAGE_INGESTION;
    case 5:
      return INFERENCE_STATES.SEGMENTATION;
    case 6:
      return INFERENCE_STATES.FEATURE_VECTORISATION;
    case 7:
      return INFERENCE_STATES.PARCEL_GENERATION;
    case 8:
      return INFERENCE_STATES.BOUNDARY_EVIDENCE;
    case 9:
      return INFERENCE_STATES.TOPOLOGY_CHECK;
    case 10:
    case 11:
      return INFERENCE_STATES.READY_FOR_SURVEYOR;
    case 12:
      return INFERENCE_STATES.READY_FOR_SURVEYOR;
    default:
      return INFERENCE_STATES.IDLE;
  }
}
