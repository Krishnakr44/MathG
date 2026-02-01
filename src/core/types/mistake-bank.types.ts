/**
 * Mistake Bank Engine — Type definitions
 * Structured mistake data, linked to visualization
 */

import type { MathDomain } from './index.types';
import type { IVisualizationStrategy } from './visualization.types';

// ─── Mistake (structured, reusable) ─────────────────────────────────────────
export interface IMistake {
  id: string;
  name: string;
  description: string;
  domain: MathDomain;
  classLevel?: number[]; // 6, 7, 8
  visualizationStrategyId: string;
  commonExpression?: string; // Example where mistake occurs
  tags?: string[];
}

// ─── Mistake Bank Interface ──────────────────────────────────────────────────
export interface IMistakeBank {
  getById(id: string): IMistake | undefined;
  getByDomain(domain: MathDomain): IMistake[];
  getByClassLevel(level: number): IMistake[];
  getAll(): IMistake[];
}

// ─── Strategy Resolver (links mistake → viz strategy) ────────────────────────
export interface IStrategyResolver {
  getStrategy(id: string): IVisualizationStrategy | undefined;
}
