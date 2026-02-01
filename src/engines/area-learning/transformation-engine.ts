/**
 * MathG — Transformation Engine
 * Unfolding (3D → net), cutting, rearranging, morphing
 * Independent of visualization
 */

import type { IShapeModule, ShapeDimensions, NetSpec } from './types';

/**
 * Get net specification for 3D shape
 * Returns null for 2D shapes
 */
export function unfoldToNet(shape: IShapeModule, dimensions: ShapeDimensions): NetSpec | null {
  if (!shape.is3D) return null;
  return shape.getNetSpec(dimensions);
}

/**
 * Compute morphing parameters when dimension changes
 * Used for smooth transitions (e.g. net unfolding animation)
 */
export interface MorphParams {
  from: ShapeDimensions;
  to: ShapeDimensions;
  progress: number; // 0..1
}

export function interpolateDimensions(
  from: ShapeDimensions,
  to: ShapeDimensions,
  progress: number
): ShapeDimensions {
  const result: ShapeDimensions = {};
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
  for (const k of keys) {
    const a = from[k] ?? to[k] ?? 0;
    const b = to[k] ?? from[k] ?? 0;
    result[k] = a + (b - a) * progress;
  }
  return result;
}
