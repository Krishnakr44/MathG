/**
 * MathG — Rectangle Shape
 * 2D: Grid-based coverage, rows × columns
 * Area emerges as number of unit squares
 */

import type { IGeometryShape, ShapeDimensions, CoverageUnit, GeometryParameterDef } from '@/core/types/geometry.types';

export const RECTANGLE_PARAMS: GeometryParameterDef[] = [
  { id: 'length', label: 'Length', min: 1, max: 12, step: 1, defaultValue: 4 },
  { id: 'breadth', label: 'Breadth', min: 1, max: 12, step: 1, defaultValue: 3 },
];

export const rectangleShape: IGeometryShape = {
  id: 'rectangle',
  name: 'Rectangle',
  is3D: false,

  getDefaultDimensions(): ShapeDimensions {
    return { length: 4, breadth: 3 };
  },

  getCoverage(dimensions: ShapeDimensions): CoverageUnit[] {
    const l = Math.max(1, Math.round(dimensions.length ?? 4));
    const b = Math.max(1, Math.round(dimensions.breadth ?? 3));
    const units: CoverageUnit[] = [];
    for (let row = 0; row < b; row++) {
      for (let col = 0; col < l; col++) {
        units.push({
          x: col,
          y: row,
          width: 1,
          height: 1,
          count: row * l + col + 1,
        });
      }
    }
    return units;
  },

  getArea(dimensions: ShapeDimensions): number {
    const l = dimensions.length ?? 4;
    const b = dimensions.breadth ?? 3;
    return l * b;
  },

  getFormula(): string {
    return 'Area = length × breadth';
  },
};
