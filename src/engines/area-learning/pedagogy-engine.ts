/**
 * MathG — Pedagogy Engine
 * Learning layers L1–L6, formula reveal, teacher pacing
 * Controls what is shown and when
 */

import type { LearningLayer, IShapeModule, ShapeDimensions, FormulaMappingSpec } from './types';

export interface PedagogyState {
  currentLayer: LearningLayer;
  formulaRevealed: boolean;
  predictMode: boolean;
  selectedTermId: string | null;
}

export const INITIAL_PEDAGOGY_STATE: PedagogyState = {
  currentLayer: 1,
  formulaRevealed: false,
  predictMode: false,
  selectedTermId: null,
};

/**
 * Can advance to next layer?
 * L5 (Formula) requires L4 (Pattern) first
 */
export function canAdvanceLayer(current: LearningLayer): boolean {
  return current < 6;
}

/**
 * Can go back?
 */
export function canGoBackLayer(current: LearningLayer): boolean {
  return current > 1;
}

/**
 * Formula may be revealed only when at L5 or L6
 */
export function mayRevealFormula(state: PedagogyState): boolean {
  return state.currentLayer >= 5;
}

/**
 * Get formula mapping for current state
 * Returns null if formula not yet revealed
 */
export function getFormulaMapping(
  shape: IShapeModule,
  dimensions: ShapeDimensions,
  state: PedagogyState
): FormulaMappingSpec | null {
  if (!state.formulaRevealed || state.currentLayer < 5) return null;
  return shape.generateFormulaMapping(dimensions);
}
