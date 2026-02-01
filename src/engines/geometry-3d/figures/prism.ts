/**
 * MathG — Prism Figure (Polyhedra)
 * Base: triangle or rectangle
 * Two identical bases + rectangular lateral faces
 * Surface area = lateral area + 2 × base area
 */

import type { IFigure3D, BoundingBox, FaceDef, NetDef, NetFaceDef } from '../types';

export type PrismBaseShape = 'triangle' | 'rectangle';

export const prismFigure: IFigure3D = {
  id: 'prism',
  name: 'Prism',
  category: 'polyhedra',

  getDimensionDefs() {
    return [
      { id: 'baseWidth', label: 'Base width', min: 1, max: 5, step: 0.5, defaultValue: 3 },
      { id: 'baseHeight', label: 'Base height', min: 1, max: 5, step: 0.5, defaultValue: 2 },
      { id: 'height', label: 'Prism height', min: 1, max: 6, step: 0.5, defaultValue: 4 },
      { id: 'baseShape', label: 'Base', min: 0, max: 1, step: 1, defaultValue: 0 }, // 0=triangle, 1=rectangle
    ];
  },

  getBoundingBox(dimensions): BoundingBox {
    const bw = dimensions.baseWidth ?? 3;
    const bh = dimensions.baseHeight ?? 2;
    const h = dimensions.height ?? 4;
    const isRect = (dimensions.baseShape ?? 0) >= 0.5;
    const depth = isRect ? bh : bh;
    return { width: bw, height: h, depth };
  },

  getFaces(dimensions): FaceDef[] {
    const bw = dimensions.baseWidth ?? 3;
    const bh = dimensions.baseHeight ?? 2;
    const h = dimensions.height ?? 4;
    const isRect = (dimensions.baseShape ?? 0) >= 0.5;
    const baseArea = isRect ? bw * bh : 0.5 * bw * bh;
    const lateralFaces = isRect ? 4 : 3;
    const lateralWidth = isRect ? (bw + bh) * 2 : bw + 2 * Math.sqrt(bh * bh + (bw / 2) * (bw / 2));
    const lateralArea = lateralWidth * h; // Approx
    const faces: FaceDef[] = [
      { id: 'base1', label: 'Base 1', pairId: 'top-bottom', width: bw, height: bh, area: baseArea },
      { id: 'base2', label: 'Base 2', pairId: 'top-bottom', width: bw, height: bh, area: baseArea },
    ];
    if (isRect) {
      faces.push(
        { id: 'front', label: 'Front', pairId: 'front-back', width: bw, height: h, area: bw * h },
        { id: 'back', label: 'Back', pairId: 'front-back', width: bw, height: h, area: bw * h },
        { id: 'left', label: 'Left', pairId: 'left-right', width: bh, height: h, area: bh * h },
        { id: 'right', label: 'Right', pairId: 'left-right', width: bh, height: h, area: bh * h }
      );
    } else {
      const sideLen = Math.sqrt(bh * bh + (bw / 2) * (bw / 2));
      faces.push(
        { id: 'front', label: 'Front', pairId: 'front-back', width: bw, height: h, area: bw * h },
        { id: 'left', label: 'Left', pairId: 'left-right', width: sideLen, height: h, area: sideLen * h },
        { id: 'right', label: 'Right', pairId: 'left-right', width: sideLen, height: h, area: sideLen * h }
      );
    }
    return faces;
  },

  getNet(dimensions): NetDef {
    const bw = dimensions.baseWidth ?? 3;
    const bh = dimensions.baseHeight ?? 2;
    const h = dimensions.height ?? 4;
    const isRect = (dimensions.baseShape ?? 0) >= 0.5;

    if (isRect) {
      // Rectangular prism net: [base1] above [left][front][right][back] above [base2]
      const faces: NetFaceDef[] = [
        { id: 'base1', label: 'Base 1', shape: 'rectangle', width: bw, height: bh, x: bh, y: 0, adjacentTo: ['front'] },
        { id: 'base2', label: 'Base 2', shape: 'rectangle', width: bw, height: bh, x: bh, y: bh + h, adjacentTo: ['front'] },
        { id: 'front', label: 'Front', shape: 'rectangle', width: bw, height: h, x: bh, y: bh, adjacentTo: ['base1', 'base2', 'left', 'right'] },
        { id: 'back', label: 'Back', shape: 'rectangle', width: bw, height: h, x: bh + bw + bh, y: bh, adjacentTo: ['left', 'right'] },
        { id: 'left', label: 'Left', shape: 'rectangle', width: bh, height: h, x: 0, y: bh, adjacentTo: ['front', 'back'] },
        { id: 'right', label: 'Right', shape: 'rectangle', width: bh, height: h, x: bh + bw, y: bh, adjacentTo: ['front', 'back'] },
      ];
      return {
        faces,
        totalWidth: 2 * bh + 2 * bw,
        totalHeight: 2 * bh + h,
      };
    } else {
      // Triangular prism: 2 triangles + 3 rectangles
      const faces: NetFaceDef[] = [
        { id: 'base1', label: 'Base 1', shape: 'triangle', width: bw, height: bh, x: bw, y: 0 },
        { id: 'base2', label: 'Base 2', shape: 'triangle', width: bw, height: bh, x: bw, y: h + bh },
        { id: 'front', label: 'Front', shape: 'rectangle', width: bw, height: h, x: bw, y: bh },
        { id: 'left', label: 'Left', shape: 'rectangle', width: Math.sqrt(bh * bh + (bw / 2) * (bw / 2)), height: h, x: 0, y: bh },
        { id: 'right', label: 'Right', shape: 'rectangle', width: Math.sqrt(bh * bh + (bw / 2) * (bw / 2)), height: h, x: bw + Math.sqrt(bh * bh + (bw / 2) * (bw / 2)), y: bh },
      ];
      const sideLen = Math.sqrt(bh * bh + (bw / 2) * (bw / 2));
      return {
        faces,
        totalWidth: bw + 2 * sideLen,
        totalHeight: 2 * bh + h,
      };
    }
  },

  getSurfaceArea(dimensions): number {
    const faces = prismFigure.getFaces(dimensions);
    return faces ? faces.reduce((sum, f) => sum + f.area, 0) : 0;
  },

  getFormula(dimensions): string {
    const isRect = (dimensions.baseShape ?? 0) >= 0.5;
    return isRect
      ? '2(base) + lateral'
      : '2(triangle base) + 3(rect lateral)';
  },
};
