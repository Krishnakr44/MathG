/**
 * MathG — 3D Geometry Engine
 * Unified figure abstraction, size normalization, polyhedra & curved solids
 */

export * from './types';
export * from './scale-utils';
export { cuboidFigure, isCube } from './figures/cuboid';
export { prismFigure } from './figures/prism';
export { cylinderFigure } from './figures/cylinder';
export { coneFigure } from './figures/cone';
export { sphereFigure } from './figures/sphere';

import type { IFigure3D } from './types';
import { cuboidFigure } from './figures/cuboid';
import { prismFigure } from './figures/prism';
import { cylinderFigure } from './figures/cylinder';
import { coneFigure } from './figures/cone';
import { sphereFigure } from './figures/sphere';

/** All 3D figures by category */
export const FIGURES_3D: Record<string, IFigure3D> = {
  cuboid: cuboidFigure,
  prism: prismFigure,
  cylinder: cylinderFigure,
  cone: coneFigure,
  sphere: sphereFigure,
};
