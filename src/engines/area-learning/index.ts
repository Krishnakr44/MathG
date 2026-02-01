/**
 * MathG — Area & Surface Area Learning Engine
 * Core engine: Geometry, Transformation, Coverage, Pedagogy
 * Universal Shape Contract
 */

export * from './types';
export * from './geometry-engine';
export * from './transformation-engine';
export * from './coverage-engine';
export {
  type PedagogyState,
  INITIAL_PEDAGOGY_STATE,
  canAdvanceLayer,
  canGoBackLayer,
  mayRevealFormula,
  getFormulaMapping,
} from './pedagogy-engine';
export { rectangleShape } from './shapes/rectangle-shape';
export { circleShape } from './shapes/circle-shape';
