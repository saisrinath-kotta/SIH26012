// Prototype Confidence Model for PS12 3D Cadastre Prototype
// Assigns illustrative categorical confidence ratings (HIGH, MEDIUM, UNCERTAIN)
// Critical Distinction: Visible physical evidence != Legal cadastral boundary.
// AI DOES NOT GUESS. Ambiguous features are flagged for human surveyor review.

export const CONFIDENCE_LEVELS = {
  HIGH: {
    key: 'HIGH',
    label: 'High Confidence',
    color: '#10b981', // Emerald green
    badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
    description: 'Crisp, unambiguous physical boundary feature (e.g. solid masonry compound wall, concrete curb, survey pillar)'
  },
  MEDIUM: {
    key: 'MEDIUM',
    label: 'Medium Confidence',
    color: '#38bdf8', // Sky cyan
    badgeBg: 'bg-sky-950/90 text-sky-300 border-sky-500/40',
    description: 'Partially occluded structure or shadowed road margin requiring standard geometric review'
  },
  UNCERTAIN: {
    key: 'UNCERTAIN',
    label: 'Uncertain — Field Review Required',
    color: '#eab308', // Amber yellow
    badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
    description: 'Informal hedge, overgrown vegetation, or broken fence line. Requires human surveyor field verification'
  }
};

/**
 * Evaluates categorical confidence for physical boundary evidence
 */
export function getBoundaryConfidence(evidenceType) {
  switch (evidenceType) {
    case 'compound_wall':
    case 'visible_boundary_marker':
    case 'road_edge':
    case 'curb':
      return CONFIDENCE_LEVELS.HIGH;
    case 'fence':
      return CONFIDENCE_LEVELS.HIGH;
    case 'hedge':
    case 'informal_divider':
    case 'vegetation_cluster':
      return CONFIDENCE_LEVELS.UNCERTAIN;
    default:
      return CONFIDENCE_LEVELS.MEDIUM;
  }
}

/**
 * Returns categorical confidence for building extraction
 */
export function getBuildingCategoricalConfidence(buildingId) {
  // Prototype demonstration assignments
  switch (buildingId) {
    case 'B-001':
    case 'B-002':
    case 'B-003':
    case 'B-008':
      return CONFIDENCE_LEVELS.HIGH;
    case 'B-004':
    case 'B-005':
    case 'B-009':
      return CONFIDENCE_LEVELS.MEDIUM;
    case 'B-006':
    case 'B-007':
      return CONFIDENCE_LEVELS.MEDIUM;
    default:
      return CONFIDENCE_LEVELS.HIGH;
  }
}
