/**
 * MathG — Coverage Engine
 * Unit squares (flat), strips/sectors (curved)
 * Adjustable resolution for approximation accuracy
 */

import type { IShapeModule, ShapeDimensions, CoverageSpec } from './types';

/**
 * Simulate coverage with given resolution
 * Resolution: 1 = coarse, higher = finer (e.g. 8, 16, 32 for circle sectors)
 */
export function simulateCoverage(
  shape: IShapeModule,
  dimensions: ShapeDimensions,
  resolution: number
): CoverageSpec {
  return shape.simulateCoverage(dimensions, resolution);
}

/**
 * Default resolution by surface type
 */
export const DEFAULT_RESOLUTION: Record<string, number> = {
  flat: 1,      // Unit squares
  curved: 8,    // Sectors/strips
};
