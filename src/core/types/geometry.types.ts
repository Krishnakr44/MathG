/**
 * MathG — Geometry Module Types
 * Area & Surface Area Visualization System
 * Formulas emerge visually, not shown upfront
 */

// ─── View Modes ─────────────────────────────────────────────────────────────
export type GeometryViewMode = '3d' | 'net' | 'coverage';

// ─── Shape Dimensions (slider-bound) ────────────────────────────────────────
export interface ShapeDimensions {
  length?: number;
  breadth?: number;
  width?: number;
  height?: number;
  radius?: number;
  slantHeight?: number;
  [key: string]: number | undefined;
}

// ─── Face Definition (for nets) ─────────────────────────────────────────────
export interface NetFace {
  id: string;
  label: string;
  shape: 'rectangle' | 'triangle' | 'circle' | 'sector';
  width: number;
  height: number;
  /** For sector: angle in radians */
  angle?: number;
  /** Position in net layout */
  x: number;
  y: number;
  /** Rotation in net (degrees) */
  rotation?: number;
  /** Link to 3D face (for highlighting) */
  faceId?: string;
}

// ─── Net Definition (unfolded 2D representation) ─────────────────────────────
export interface NetDefinition {
  faces: NetFace[];
  totalWidth: number;
  totalHeight: number;
}

// ─── Coverage Unit (for area visualization) ─────────────────────────────────
export interface CoverageUnit {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Optional count label */
  count?: number;
}

// ─── Geometry Shape Interface ──────────────────────────────────────────────
export interface IGeometryShape {
  id: string;
  name: string;
  is3D: boolean;

  /** Default dimensions */
  getDefaultDimensions(): ShapeDimensions;

  /** Generate net (for 3D shapes) */
  getNet?(dimensions: ShapeDimensions): NetDefinition;

  /** Generate coverage units (unit squares, sectors) */
  getCoverage?(dimensions: ShapeDimensions): CoverageUnit[];

  /** Compute area from dimensions */
  getArea(dimensions: ShapeDimensions): number;

  /** Compute surface area (3D) or area (2D) */
  getSurfaceArea?(dimensions: ShapeDimensions): number;

  /** Formula string (shown only after pattern discovery) */
  getFormula?(dimensions: ShapeDimensions): string;
}

// ─── Parameter Definition for Sliders ──────────────────────────────────────
export interface GeometryParameterDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}
