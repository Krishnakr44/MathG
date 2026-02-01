/**
 * MathG — Geometry Engine
 * Pure math: dimensions, area, surface area
 * Independent of visualization
 */

import type { IShapeModule, ShapeDimensions } from './types';

export interface GeometryResult {
  area: number;
  surfaceArea?: number;
  dimensions: ShapeDimensions;
}

/**
 * Compute area and surface area from shape and dimensions
 */
export function computeGeometry(shape: IShapeModule, dimensions: ShapeDimensions): GeometryResult {
  const area = shape.computeArea(dimensions);
  const surfaceArea = shape.is3D && shape.computeSurfaceArea
    ? shape.computeSurfaceArea(dimensions)
    : undefined;
  return { area, surfaceArea, dimensions };
}

/**
 * Validate dimensions against shape's defined ranges
 */
export function validateDimensions(
  shape: IShapeModule,
  dimensions: ShapeDimensions
): { valid: boolean; errors: string[] } {
  const defs = shape.defineDimensions();
  const errors: string[] = [];
  for (const def of defs) {
    const val = dimensions[def.id];
    if (val === undefined) continue;
    if (val < def.min || val > def.max) {
      errors.push(`${def.label} must be between ${def.min} and ${def.max}`);
    }
  }
  return { valid: errors.length === 0, errors };
}
