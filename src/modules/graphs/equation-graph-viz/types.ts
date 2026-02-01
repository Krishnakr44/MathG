/**
 * Equation & Graph Viz — Module types
 */

export type VizStep = 'base' | 'transform' | 'final';

export interface EquationTerm {
  id: string;
  expression: string;
  label: string;
  visible: boolean;
}

export interface MistakeHighlight {
  mistakeId: string;
  regions: { xMin: number; xMax: number; yMin: number; yMax: number }[];
  color?: string;
}
