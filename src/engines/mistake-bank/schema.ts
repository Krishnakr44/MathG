/**
 * MathG — Mistake Bank Schema
 * Data-driven, extensible, multilingual
 */

import type { MathDomain } from '@/core/types';

// ─── Multilingual text (English / Hinglish / Hindi) ─────────────────────────
export type LocaleCode = 'en' | 'hi-Latn' | 'hi';

export interface LocalizedText {
  en: string;
  'hi-Latn'?: string; // Hinglish (Hindi in Latin script)
  hi?: string;       // Hindi (Devanagari)
}

export function getLocalizedText(
  text: string | LocalizedText,
  locale: LocaleCode = 'en'
): string {
  if (typeof text === 'string') return text;
  const val = text[locale] ?? text['hi-Latn'] ?? text.en;
  return val ?? '';
}

// ─── Visualization Action (one mistake → many viz actions) ───────────────────
export interface VisualizationAction {
  id: string;
  /** Module domain this action applies to (graphs, geometry, etc.) */
  moduleDomain: MathDomain;
  /** Strategy ID for legacy compatibility */
  strategyId?: string;
  /** Domain-specific config: highlight regions, plot overrides, etc. */
  config: VisualizationActionConfig;
}

export interface VisualizationActionConfig {
  /** Highlight regions on graph (xMin, xMax, yMin, yMax) */
  highlightRegions?: { xMin: number; xMax: number; yMin: number; yMax: number }[];
  /** Override equation/expression to show misconception */
  expressionOverride?: string;
  /** Parameter overrides (e.g., show wrong slope) */
  parameterOverrides?: Record<string, number | boolean>;
  /** Bounds override */
  boundsOverride?: { xMin?: number; xMax?: number; yMin?: number; yMax?: number };
  /** Custom: geometry shapes, ratio bars, etc. */
  custom?: Record<string, unknown>;
}

// ─── Mistake (full schema) ───────────────────────────────────────────────────
export interface Mistake {
  id: string;
  /** Module domain (graphs, algebra, geometry, statistics) */
  domain: MathDomain;
  /** Class levels: 6, 7, 8 */
  classLevel: number[];
  /** Chapter (e.g., "Linear Equations", "Introduction to Trigonometry") */
  chapter: string | LocalizedText;
  /** Concept (e.g., "Slope of a line", "sin vs tan domain") */
  concept: string | LocalizedText;

  /** Student's wrong answer or reasoning */
  studentWrongAnswer: string | LocalizedText;
  /** Why the student thinks this is correct */
  studentReasoning: string | LocalizedText;
  /** Correct reasoning (teacher script) */
  correctReasoning: string | LocalizedText;
  /** Exam-oriented correction tip */
  examTip: string | LocalizedText;

  /** Linked visualization actions (one mistake → many viz) */
  visualizationActions: VisualizationAction[];

  /** Example expression where mistake occurs (e.g., "y = -2x + 3") */
  commonExpression?: string;
  /** Searchable tags */
  tags?: string[];

  /** Optional: Mistake pack / chapter for export grouping */
  packId?: string;
}

// ─── Mistake Pack (for export/import per chapter) ────────────────────────────
export interface MistakePack {
  id: string;
  name: string | LocalizedText;
  chapter: string | LocalizedText;
  domain: MathDomain;
  classLevel: number[];
  mistakes: Mistake[];
  version: string;
  createdAt?: string;
}
