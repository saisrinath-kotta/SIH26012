// Feature Extraction Transformation Pipeline for PS12 Prototype
// Demonstrates transformation from Raw Imagery Pixels -> Segmentation Mask -> Vector Feature -> Preliminary Cadastre

export const EXTRACTION_TRANSFORMATION_STEPS = [
  {
    step: 1,
    name: 'Raw Pixel Ingestion',
    tech: 'Centimeter UAV Orthophoto',
    visual: 'Sub-decimeter RGB pixels acquired under daylight nadir survey',
    output: 'Orthomosaic raster tensor'
  },
  {
    step: 2,
    name: 'Multi-Class Segmentation',
    tech: 'Semantic Feature Convolutions',
    visual: 'Pixel classification into Building, Road, Access, and Open Space masks',
    output: 'Class probability masks'
  },
  {
    step: 3,
    name: 'Contour Vectorization',
    tech: 'Douglas-Peucker & Orthogonal Regularization',
    visual: 'Curved pixel borders regularized into crisp 90° architectural polygonal edges',
    output: 'Polygonal footprints (B-001..B-009)'
  },
  {
    step: 4,
    name: 'Boundary Evidence Correlation',
    tech: 'Spatial Adjacency Graph',
    visual: 'Correlating physical compound walls, curbs, and hedges against building footprints',
    output: 'High-confidence & uncertain boundary vectors'
  },
  {
    step: 5,
    name: 'Preliminary Parcel Synthesis',
    tech: 'Planar Graph Face Extraction',
    visual: 'Closed boundary loops form candidate cadastral polygons (P001..P005)',
    output: 'Preliminary Cadastral Parcels'
  }
];

/**
 * Returns candidate extraction lifecycle for a parcel
 */
export function getParcelGenerationPipeline(parcelId) {
  return {
    parcelId,
    stages: [
      { id: 'evidence', label: 'Boundary Evidence', status: 'COMPLETE', color: '#10b981' },
      { id: 'graph', label: 'Feature Relationships', status: 'ACTIVE', color: '#0ea5e9' },
      { id: 'candidate', label: 'Candidate Polygons', status: 'PENDING', color: '#818cf8' },
      { id: 'preliminary', label: 'Preliminary Parcel Map', status: 'PENDING', color: '#06b6d4' }
    ],
    disclaimer: 'AI-Assisted Preliminary Result — Requires Surveyor Validation'
  };
}
