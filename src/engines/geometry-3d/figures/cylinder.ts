/**
 * MathG — Cylinder Figure (Curved Solid)
 * Two circular bases + curved lateral surface
 * Curved surface unwraps to rectangle: width = 2πr, height = h
 * Surface area = 2πr² + 2πrh = 2πr(r + h)
 */

import type { IFigure3D, BoundingBox, NetDef, NetFaceDef } from '../types';

const PI = Math.PI;

export const cylinderFigure: IFigure3D = {
  id: 'cylinder',
  name: 'Cylinder',
  category: 'curved',

  getDimensionDefs() {
    return [
      { id: 'radius', label: 'Radius', min: 0.5, max: 3, step: 0.25, defaultValue: 1.5 },
      { id: 'height', label: 'Height', min: 1, max: 6, step: 0.5, defaultValue: 3 },
    ];
  },

  getBoundingBox(dimensions): BoundingBox {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    return {
      width: 2 * r,
      height: h,
      depth: 2 * r,
    };
  },

  getFaces(): null {
    return null;
  },

  getNet(dimensions): NetDef {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    const circumference = 2 * PI * r;

    // Net: two circles (bases) + rectangle (curved surface unwrapped)
    // Layout: [base1] above [curved rect] above [base2]
    // Curved rect: width = circumference, height = h
    const faces: NetFaceDef[] = [
      {
        id: 'base1',
        label: 'Top base',
        shape: 'circle',
        width: 2 * r,
        height: 2 * r,
        x: circumference / 2 - r,
        y: 0,
        adjacentTo: ['curved'],
      },
      {
        id: 'curved',
        label: 'Curved surface',
        shape: 'rectangle',
        width: circumference,
        height: h,
        x: 0,
        y: 2 * r,
        adjacentTo: ['base1', 'base2'],
      },
      {
        id: 'base2',
        label: 'Bottom base',
        shape: 'circle',
        width: 2 * r,
        height: 2 * r,
        x: circumference / 2 - r,
        y: 2 * r + h,
        adjacentTo: ['curved'],
      },
    ];

    return {
      faces,
      totalWidth: Math.max(circumference, 2 * r),
      totalHeight: 2 * r + h + 2 * r,
    };
  },

  getSurfaceArea(dimensions): number {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    return 2 * PI * r * r + 2 * PI * r * h;
  },

  getFormula(): string {
    return '2πr² + 2πrh = 2πr(r + h)';
  },
};
