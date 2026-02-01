/**
 * MathG — 3D Geometry Engine Types
 * Unified figure abstraction, size normalization, face segmentation
 */

// ─── Figure Categories ──────────────────────────────────────────────────────
export type FigureCategory = 'flat' | 'polyhedra' | 'curved';

// ─── Face Pairs (for polyhedra) ─────────────────────────────────────────────
export type FacePairId = 'top-bottom' | 'front-back' | 'left-right';

export interface FaceDef {
  id: string;
  label: string;
  pairId: FacePairId;
  /** Dimensions for area: width × height */
  width: number;
  height: number;
  area: number;
}

// ─── Bounding Box (for size normalization) ──────────────────────────────────
export const NORMALIZED_BOUNDS = 4; // All shapes fit in 4×4×4 box

export interface BoundingBox {
  width: number;
  height: number;
  depth: number;
}

// ─── Net Face (with adjacency) ──────────────────────────────────────────────
export interface NetFaceDef {
  id: string;
  label: string;
  pairId?: FacePairId;
  shape: 'rectangle' | 'triangle' | 'circle' | 'sector';
  width: number;
  height: number;
  angle?: number;
  x: number;
  y: number;
  rotation?: number;
  /** Adjacent face IDs (for correct unfolding) */
  adjacentTo?: string[];
}

export interface NetDef {
  faces: NetFaceDef[];
  totalWidth: number;
  totalHeight: number;
}

// ─── 3D Figure Interface ───────────────────────────────────────────────────
export interface IFigure3D {
  id: string;
  name: string;
  category: FigureCategory;

  /** Dimension definitions (slider-bound) */
  getDimensionDefs(): { id: string; label: string; min: number; max: number; step: number; defaultValue: number }[];

  /** Bounding box in model units */
  getBoundingBox(dimensions: Record<string, number>): BoundingBox;

  /** Face definitions (polyhedra) or null */
  getFaces(dimensions: Record<string, number>): FaceDef[] | null;

  /** Net with correct adjacency */
  getNet(dimensions: Record<string, number>): NetDef | null;

  /** Surface area */
  getSurfaceArea(dimensions: Record<string, number>): number;

  /** Formula for display */
  getFormula(dimensions: Record<string, number>): string;
}
