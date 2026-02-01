/**
 * MathG — Cuboid Figure (Polyhedra)
 * Cube = special case (l = b = h)
 * Face pairs: Top/Bottom, Front/Back, Left/Right
 * Surface area = 2(lb + bh + hl)
 */

import type { IFigure3D, BoundingBox, FaceDef, NetDef, NetFaceDef, FacePairId } from '../types';

export const cuboidFigure: IFigure3D = {
  id: 'cuboid',
  name: 'Cuboid',
  category: 'polyhedra',

  getDimensionDefs() {
    return [
      { id: 'length', label: 'Length', min: 1, max: 6, step: 0.5, defaultValue: 3 },
      { id: 'breadth', label: 'Breadth', min: 1, max: 6, step: 0.5, defaultValue: 2 },
      { id: 'height', label: 'Height', min: 1, max: 6, step: 0.5, defaultValue: 2 },
    ];
  },

  getBoundingBox(dimensions): BoundingBox {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;
    return { width: l, height: h, depth: b };
  },

  getFaces(dimensions): FaceDef[] {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;
    return [
      { id: 'top', label: 'Top', pairId: 'top-bottom', width: l, height: b, area: l * b },
      { id: 'bottom', label: 'Bottom', pairId: 'top-bottom', width: l, height: b, area: l * b },
      { id: 'front', label: 'Front', pairId: 'front-back', width: l, height: h, area: l * h },
      { id: 'back', label: 'Back', pairId: 'front-back', width: l, height: h, area: l * h },
      { id: 'left', label: 'Left', pairId: 'left-right', width: b, height: h, area: b * h },
      { id: 'right', label: 'Right', pairId: 'left-right', width: b, height: h, area: b * h },
    ];
  },

  getNet(dimensions): NetDef {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;

    // Cross layout with correct adjacency:
    //       [top]
    // [back][left][front][right]
    //       [bottom]
    const faces: NetFaceDef[] = [
      { id: 'front', label: 'Front', pairId: 'front-back', shape: 'rectangle', width: l, height: h, x: b + l, y: b, adjacentTo: ['left', 'right', 'top', 'bottom'] },
      { id: 'back', label: 'Back', pairId: 'front-back', shape: 'rectangle', width: l, height: h, x: b, y: b, adjacentTo: ['left', 'right', 'top', 'bottom'] },
      { id: 'left', label: 'Left', pairId: 'left-right', shape: 'rectangle', width: b, height: h, x: 0, y: b, adjacentTo: ['front', 'back', 'top', 'bottom'] },
      { id: 'right', label: 'Right', pairId: 'left-right', shape: 'rectangle', width: b, height: h, x: b + 2 * l, y: b, adjacentTo: ['front', 'back', 'top', 'bottom'] },
      { id: 'top', label: 'Top', pairId: 'top-bottom', shape: 'rectangle', width: l, height: b, x: b + l, y: 0, adjacentTo: ['front', 'back', 'left', 'right'] },
      { id: 'bottom', label: 'Bottom', pairId: 'top-bottom', shape: 'rectangle', width: l, height: b, x: b + l, y: b + h, adjacentTo: ['front', 'back', 'left', 'right'] },
    ];

    return {
      faces,
      totalWidth: 2 * b + 2 * l,
      totalHeight: 2 * b + h,
    };
  },

  getSurfaceArea(dimensions): number {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;
    return 2 * (l * b + b * h + l * h);
  },

  getFormula(): string {
    return '2(l×b + b×h + l×h)';
  },
};

/** Cube = cuboid with l = b = h */
export function isCube(dimensions: Record<string, number>): boolean {
  const l = dimensions.length ?? 3;
  const b = dimensions.breadth ?? 2;
  const h = dimensions.height ?? 2;
  const eps = 0.01;
  return Math.abs(l - b) < eps && Math.abs(b - h) < eps;
}
