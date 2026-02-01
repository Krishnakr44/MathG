/**
 * MathG — Unified Size Normalization
 * All figures fit in common bounding box
 * Deterministic scaling
 */

import type { BoundingBox } from './types';

/** All shapes normalize to fit in TARGET_SIZE × TARGET_SIZE × TARGET_SIZE box */
export const TARGET_SIZE = 4;
const VIEWPORT_SIZE = 400;

/**
 * Compute scale factor so figure fits in target bounds
 */
export function computeScale(bounds: BoundingBox): number {
  const maxDim = Math.max(bounds.width, bounds.height, bounds.depth);
  if (maxDim <= 0) return 1;
  return TARGET_SIZE / maxDim;
}

/**
 * Scale dimensions for rendering (pixels)
 */
export function toViewportScale(bounds: BoundingBox): number {
  const scale = computeScale(bounds);
  return (VIEWPORT_SIZE / TARGET_SIZE) * scale;
}

/**
 * Normalize dimensions for consistent visual scale
 */
export function normalizeDimensions(
  bounds: BoundingBox,
  width: number,
  height: number
): { scale: number; offsetX: number; offsetY: number } {
  const scale = Math.min(
    width / (bounds.width * 1.2),
    height / (bounds.height * 1.2)
  );
  const offsetX = (width - bounds.width * scale) / 2;
  const offsetY = (height - bounds.height * scale) / 2;
  return { scale, offsetX, offsetY };
}
