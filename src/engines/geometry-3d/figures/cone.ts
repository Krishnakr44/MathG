/**
 * MathG — Cone Figure (Curved Solid)
 * Circular base + curved lateral surface (sector)
 * Slant height l = √(r² + h²)
 * Curved surface unfolds to sector: radius = l, arc length = 2πr
 * Surface area = πr² + πrl = πr(r + l)
 */

import type { IFigure3D, BoundingBox, NetDef, NetFaceDef } from '../types';

const PI = Math.PI;

export const coneFigure: IFigure3D = {
  id: 'cone',
  name: 'Cone',
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
    // Same as cylinder: 2r × h × 2r — cone fits same visual space as cylinder
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
    const l = Math.sqrt(r * r + h * h); // slant height
    const circumference = 2 * PI * r;
    // Sector angle (radians): arc/circumference * 2π = arc/l (since full circle radius l has circumference 2πl)
    // arc = circumference, so angle = circumference / l
    const sectorAngleRad = circumference / l;

    // Net: circle (base) + sector (curved surface)
    const faces: NetFaceDef[] = [
      {
        id: 'base',
        label: 'Base',
        shape: 'circle',
        width: 2 * r,
        height: 2 * r,
        x: l - r,
        y: l,
        adjacentTo: ['curved'],
      },
      {
        id: 'curved',
        label: 'Curved surface',
        shape: 'sector',
        width: 2 * l,
        height: 2 * l,
        angle: sectorAngleRad,
        x: 0,
        y: 0,
        adjacentTo: ['base'],
      },
    ];

    return {
      faces,
      totalWidth: 2 * l,
      totalHeight: 2 * l,
    };
  },

  getSurfaceArea(dimensions): number {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    const l = Math.sqrt(r * r + h * h);
    return PI * r * r + PI * r * l;
  },

  getFormula(): string {
    return 'πr² + πrl = πr(r + l), l = √(r² + h²)';
  },
};
