/**
 * MathG — Circle Shape (Curved, 2D)
 * Sector slicing with adjustable resolution
 * Rearrangement into rectangle-like form
 * Area emerges as πr²
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

const PI = Math.PI;

export const circleShape: IShapeModule = {
  id: 'circle',
  name: 'Circle',
  is3D: false,
  surfaceType: 'curved',

  defineDimensions(): DimensionDef[] {
    return [
      { id: 'radius', label: 'Radius', min: 1, max: 8, step: 0.5, defaultValue: 3 },
    ];
  },

  getGeometrySpec(dimensions: ShapeDimensions): GeometrySpec {
    const r = dimensions.radius ?? 3;
    return {
      type: '2d',
      outline: { type: 'circle', params: { radius: r } },
    };
  },

  getNetSpec(): NetSpec | null {
    return null; // 2D shape
  },

  simulateCoverage(dimensions: ShapeDimensions, resolution: number): CoverageSpec {
    const r = Math.max(0.5, dimensions.radius ?? 3);
    const sectors = Math.max(4, Math.min(32, Math.round(resolution)));
    const units: CoverageUnitSpec[] = [];
    const arcLen = (PI * r) / sectors; // Half circumference / sectors
    const h = r; // Height = radius

    // Rearranged sectors: rectangle πr × r
    // Each sector: arc × radius strip
    for (let i = 0; i < sectors; i++) {
      units.push({
        id: `sector-${i}`,
        x: i * arcLen,
        y: 0,
        width: arcLen,
        height: h,
        type: 'sector',
        count: i + 1,
        linkedDimension: 'radius',
      });
    }

    return {
      units,
      resolution: sectors,
      isApproximation: true,
    };
  },

  deriveAreaPattern(dimensions: ShapeDimensions): AreaPatternSpec {
    const r = dimensions.radius ?? 3;
    const circ = 2 * PI * r;
    return {
      description: `Half circumference (πr) × radius (r)`,
      structure: 'arc × radius',
      highlightRegions: [
        { x: 0, y: 0, w: PI * r, h: 0.3, label: 'πr (half circumference)' },
        { x: 0, y: 0, w: 0.3, h: r, label: 'r (radius)' },
      ] as { x: number; y: number; w: number; h: number; label: string }[],
    };
  },

  generateFormulaMapping(dimensions: ShapeDimensions): FormulaMappingSpec {
    const r = dimensions.radius ?? 3;
    return {
      formula: 'Area = πr²',
      terms: [
        { term: 'π', label: 'π', origin: 'Ratio of circumference to diameter', dimensionId: undefined },
        { term: 'r', label: 'r', origin: 'Radius', dimensionId: 'radius', highlightRegion: { x: 0, y: 0, w: 0.5, h: r } },
        { term: 'r²', label: 'r²', origin: 'Radius × radius', dimensionId: 'radius', highlightRegion: { x: 0, y: 0, w: r, h: r } },
      ],
    };
  },

  provideMisconceptions(): MisconceptionSpec[] {
    return [
      {
        id: 'curved-vs-flat',
        title: 'Curved ≠ flat',
        wrongBelief: 'Circle area = perimeter × something',
        visualContradiction: 'curved_vs_flat',
        resolutionHint: 'Sectors rearrange to rectangle: πr × r',
      },
      {
        id: 'diameter-instead-radius',
        title: 'Diameter vs radius',
        wrongBelief: 'Using diameter in πr²',
        visualContradiction: 'custom',
        contradictionParams: { wrongFormula: 'πd²' },
        resolutionHint: 'Formula uses radius r, not diameter d',
      },
    ];
  },

  computeArea(dimensions: ShapeDimensions): number {
    const r = dimensions.radius ?? 3;
    return PI * r * r;
  },
};
