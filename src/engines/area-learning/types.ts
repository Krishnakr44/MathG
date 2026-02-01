/**
 * MathG — Area & Surface Area Learning Engine
 * Universal Shape Contract & Engine Types
 * Long-term core engine, not a one-off demo
 */

// ─── Learning Layers (Teacher-controlled) ─────────────────────────────────────
export type LearningLayer = 1 | 2 | 3 | 4 | 5 | 6;

export const LAYER_NAMES: Record<LearningLayer, string> = {
  1: '3D / Concrete',
  2: 'Decomposition / Unfolding',
  3: 'Coverage Simulation',
  4: 'Pattern Recognition',
  5: 'Formula Emergence',
  6: 'Comparison & Stress Testing',
};

// ─── Dimension Definition (slider-bound) ────────────────────────────────────
export interface DimensionDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export type ShapeDimensions = Record<string, number>;

// ─── Geometry Spec (for 3D rendering) ──────────────────────────────────────
export interface GeometrySpec {
  type: '2d' | '3d';
  /** For 3D: face definitions */
  faces?: FaceSpec[];
  /** For 2D: outline or region */
  outline?: { type: 'rect' | 'triangle' | 'circle' | 'polygon'; params: Record<string, number> };
}

export interface FaceSpec {
  id: string;
  label: string;
  shape: 'rectangle' | 'triangle' | 'circle' | 'sector';
  width: number;
  height: number;
  /** For sector */
  angle?: number;
  /** 3D position/rotation */
  transform?: string;
}

// ─── Net Spec (unfolded 2D) ─────────────────────────────────────────────────
export interface NetFaceSpec {
  id: string;
  label: string;
  shape: 'rectangle' | 'triangle' | 'circle' | 'sector';
  width: number;
  height: number;
  angle?: number;
  x: number;
  y: number;
  rotation?: number;
  faceId?: string;
}

export interface NetSpec {
  faces: NetFaceSpec[];
  totalWidth: number;
  totalHeight: number;
}

// ─── Coverage Spec (unit squares, strips, sectors) ─────────────────────────
export interface CoverageUnitSpec {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** For curved: arc/sector params */
  type: 'square' | 'strip' | 'sector';
  count?: number;
  /** Link to dimension for formula mapping */
  linkedDimension?: string;
}

export interface CoverageSpec {
  units: CoverageUnitSpec[];
  resolution: number;
  /** Approximate vs exact */
  isApproximation: boolean;
}

// ─── Area Pattern (for L4) ──────────────────────────────────────────────────
export interface AreaPatternSpec {
  description: string;
  /** e.g. "rows × columns", "arc × radius" */
  structure: string;
  /** Visual regions to highlight */
  highlightRegions?: { x: number; y: number; w: number; h: number; label: string }[];
}

// ─── Formula Mapping (term → visual origin) ─────────────────────────────────
export interface FormulaTermMapping {
  term: string;
  label: string;
  /** Human-readable origin */
  origin: string;
  /** Region to highlight when term is clicked */
  highlightRegion?: { x: number; y: number; w: number; h: number };
  /** Dimension ID this term maps to */
  dimensionId?: string;
}

export interface FormulaMappingSpec {
  formula: string;
  terms: FormulaTermMapping[];
}

// ─── Misconception (built-in, triggerable) ──────────────────────────────────
export interface MisconceptionSpec {
  id: string;
  title: string;
  /** What students often think */
  wrongBelief: string;
  /** Visual contradiction to show */
  visualContradiction: 'height_vs_side' | 'curved_vs_flat' | 'formula_scope' | 'units_ignored' | 'custom';
  /** Custom contradiction params */
  contradictionParams?: Record<string, unknown>;
  /** How to resolve visually */
  resolutionHint: string;
}

// ─── Universal Shape Contract ───────────────────────────────────────────────
export interface IShapeModule {
  id: string;
  name: string;
  is3D: boolean;
  /** Flat (rectangle, triangle, circle) or curved (cylinder, cone, sphere) */
  surfaceType: 'flat' | 'curved';

  defineDimensions(): DimensionDef[];

  /** Geometry for 3D/2D rendering */
  getGeometrySpec(dimensions: ShapeDimensions): GeometrySpec;

  /** Net layout (3D shapes) or N/A */
  getNetSpec(dimensions: ShapeDimensions): NetSpec | null;

  /** Coverage units with adjustable resolution */
  simulateCoverage(dimensions: ShapeDimensions, resolution: number): CoverageSpec;

  /** Pattern for L4 (rows×cols, etc.) */
  deriveAreaPattern(dimensions: ShapeDimensions): AreaPatternSpec;

  /** Formula terms linked to visual origins */
  generateFormulaMapping(dimensions: ShapeDimensions): FormulaMappingSpec;

  /** Built-in misconceptions */
  provideMisconceptions(): MisconceptionSpec[];

  /** Compute area (exact) */
  computeArea(dimensions: ShapeDimensions): number;

  /** Surface area (3D) */
  computeSurfaceArea?(dimensions: ShapeDimensions): number;
}
