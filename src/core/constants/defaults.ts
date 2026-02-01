/**
 * MathG — Default constants
 * Projection-friendly, teacher-first defaults
 */

import type { Bounds } from '@/core/types';

export const DEFAULT_BOUNDS: Bounds = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export const DEFAULT_GRID_STEP = 1;

export const TEACHER_LAYOUT = {
  minFontSize: 16,
  projectionContrast: 'high',
  maxClicksToAction: 3,
} as const;
