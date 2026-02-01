/**
 * MathG — Rectangle Shape (Flat, 2D)
 * Grid-based coverage, rows × columns
 * Area emerges as number of unit squares
 */

import type {
  IShapeModule,
  DimensionDef,
  ShapeDimensions,
  GeometrySpec,
  NetSpec,
  CoverageSpec,
  CoverageUnitSpec,
  AreaPatternSpec,
  FormulaMappingSpec,
  MisconceptionSpec,
} from '../types';

export const rectangleShape: IShapeModule = {
  id: 'rectangle',
  name: 'Rectangle',
  is3D: false,
  surfaceType: 'flat',

  defineDimensions(): DimensionDef[] {
    return [
      { id: 'length', label: 'Length', min: 1, max: 12, step: 1, defaultValue: 4 },
      { id: 'breadth', label: 'Breadth', min: 1, max: 12, step: 1, defaultValue: 3 },
    ];
  },

  getGeometrySpec(dimensions: ShapeDimensions): GeometrySpec {
    const l = Math.max(1, Math.round(dimensions.length ?? 4));
    const b = Math.max(1, Math.round(dimensions.breadth ?? 3));
    return {
      type: '2d',
      outline: { type: 'rect', params: { width: l, height: b } },
    };
  },

  getNetSpec(): NetSpec | null {
    return null; // 2D shape
  },

  simulateCoverage(dimensions: ShapeDimensions, _resolution: number): CoverageSpec {
    const l = Math.max(1, Math.round(dimensions.length ?? 4));
    const b = Math.max(1, Math.round(dimensions.breadth ?? 3));
    const units: CoverageUnitSpec[] = [];
    for (let row = 0; row < b; row++) {
      for (let col = 0; col < l; col++) {
        units.push({
          id: `u-${row}-${col}`,
          x: col,
          y: row,
          width: 1,
          height: 1,
          type: 'square',
          count: row * l + col + 1,
        });
      }
    }
    return { units, resolution: 1, isApproximation: false };
  },

  deriveAreaPattern(dimensions: ShapeDimensions): AreaPatternSpec {
    const l = dimensions.length ?? 4;
    const b = dimensions.breadth ?? 3;
    return {
      description: `${Math.round(b)} rows × ${Math.round(l)} columns`,
      structure: 'rows × columns',
      highlightRegions: [
        { x: 0, y: 0, w: l, h: 1, label: '1 row' },
        { x: 0, y: 0, w: 1, h: b, label: '1 column' },
      ] as { x: number; y: number; w: number; h: number; label: string }[],
    };
  },

  generateFormulaMapping(dimensions: ShapeDimensions): FormulaMappingSpec {
    const l = dimensions.length ?? 4;
    const b = dimensions.breadth ?? 3;
    return {
      formula: 'Area = length × breadth',
      terms: [
        { term: 'length', label: 'length', origin: 'Horizontal dimension', dimensionId: 'length', highlightRegion: { x: 0, y: 0, w: l, h: 0.2 } },
        { term: 'breadth', label: 'breadth', origin: 'Vertical dimension', dimensionId: 'breadth', highlightRegion: { x: 0, y: 0, w: 0.2, h: b } },
      ],
    };
  },

  provideMisconceptions(): MisconceptionSpec[] {
    return [
      {
        id: 'height-vs-side',
        title: 'Height ≠ side',
        wrongBelief: 'Using slant side instead of perpendicular height',
        visualContradiction: 'height_vs_side',
        resolutionHint: 'Height must be perpendicular to base',
      },
      {
        id: 'units-ignored',
        title: 'Units ignored',
        wrongBelief: 'Area has no units',
        visualContradiction: 'units_ignored',
        resolutionHint: 'Area = square units (e.g. cm²)',
      },
    ];
  },

  computeArea(dimensions: ShapeDimensions): number {
    const l = dimensions.length ?? 4;
    const b = dimensions.breadth ?? 3;
    return l * b;
  },
};
