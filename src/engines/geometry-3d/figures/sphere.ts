/**
 * MathG — Sphere Figure (Curved Solid)
 * Strip-based approximation for intuition
 * Surface area = 4πr²
 * No formal net (sphere cannot be flattened without distortion)
 */

import type { IFigure3D, BoundingBox, NetDef, NetFaceDef } from '../types';

const PI = Math.PI;

export const sphereFigure: IFigure3D = {
  id: 'sphere',
  name: 'Sphere',
  category: 'curved',

  getDimensionDefs() {
    return [
      { id: 'radius', label: 'Radius', min: 0.5, max: 2, step: 0.25, defaultValue: 1.5 },
    ];
  },

  getBoundingBox(dimensions): BoundingBox {
    const r = dimensions.radius ?? 1.5;
    return {
      width: 2 * r,
      height: 2 * r,
      depth: 2 * r,
    };
  },

  getFaces(): null {
    return null;
  },

  getNet(dimensions): NetDef | null {
    // Sphere has no true net - use strip approximation for intuition (like orange peel)
    const r = dimensions.radius ?? 1.5;
    const stripCount = 8;
    const stripWidth = (2 * PI * r) / stripCount;
    const stripHeight = (PI * r) / 2; // half circumference per strip

    const faces: NetFaceDef[] = [];
    for (let i = 0; i < stripCount; i++) {
      faces.push({
        id: `strip-${i}`,
        label: `Strip ${i + 1}`,
        shape: 'rectangle',
        width: stripWidth,
        height: stripHeight,
        x: i * stripWidth,
        y: 0,
      });
    }

    return {
      faces,
      totalWidth: 2 * PI * r,
      totalHeight: stripHeight,
    };
  },

  getSurfaceArea(dimensions): number {
    const r = dimensions.radius ?? 1.5;
    return 4 * PI * r * r;
  },

  getFormula(): string {
    return '4πr²';
  },
};
