/**
 * MathG — Cuboid Shape
 * 3D: Net unfolding, face-by-face area
 * Surface area = 2(lb + bh + lh)
 */

import type { IGeometryShape, ShapeDimensions, NetDefinition, NetFace, GeometryParameterDef } from '@/core/types/geometry.types';

export const CUBOID_PARAMS: GeometryParameterDef[] = [
  { id: 'length', label: 'Length', min: 1, max: 8, step: 0.5, defaultValue: 3 },
  { id: 'breadth', label: 'Breadth', min: 1, max: 8, step: 0.5, defaultValue: 2 },
  { id: 'height', label: 'Height', min: 1, max: 8, step: 0.5, defaultValue: 2 },
];

export const cuboidShape: IGeometryShape = {
  id: 'cuboid',
  name: 'Cuboid',
  is3D: true,

  getDefaultDimensions(): ShapeDimensions {
    return { length: 3, breadth: 2, height: 2 };
  },

  getNet(dimensions: ShapeDimensions): NetDefinition {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;

    // Cross/net layout:
    //       [top]
    // [back][left][front][right]
    //       [bottom]
    const faces: NetFace[] = [
      { id: 'front', label: 'Front', shape: 'rectangle', width: l, height: h, x: b + l, y: b, faceId: 'front' },
      { id: 'back', label: 'Back', shape: 'rectangle', width: l, height: h, x: b, y: b, faceId: 'back' },
      { id: 'left', label: 'Left', shape: 'rectangle', width: b, height: h, x: 0, y: b, faceId: 'left' },
      { id: 'right', label: 'Right', shape: 'rectangle', width: b, height: h, x: b + 2 * l, y: b, faceId: 'right' },
      { id: 'top', label: 'Top', shape: 'rectangle', width: l, height: b, x: b + l, y: 0, faceId: 'top' },
      { id: 'bottom', label: 'Bottom', shape: 'rectangle', width: l, height: b, x: b + l, y: b + h, faceId: 'bottom' },
    ];

    return {
      faces,
      totalWidth: 2 * b + 2 * l,
      totalHeight: 2 * b + h,
    };
  },

  getArea(dimensions: ShapeDimensions): number {
    return this.getSurfaceArea!(dimensions);
  },

  getSurfaceArea(dimensions: ShapeDimensions): number {
    const l = dimensions.length ?? 3;
    const b = dimensions.breadth ?? 2;
    const h = dimensions.height ?? 2;
    return 2 * (l * b + b * h + l * h);
  },

  getFormula(): string {
    return 'Surface area = 2(length×breadth + breadth×height + length×height)';
  },
};
