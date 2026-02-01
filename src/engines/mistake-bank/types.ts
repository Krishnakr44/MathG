/**
 * MathG — Mistake Bank Types (public API)
 */

import type { MathDomain } from '@/core/types';
import type { Mistake, MistakePack, VisualizationAction, LocalizedText, LocaleCode } from './schema';

export type { Mistake, MistakePack, VisualizationAction, LocalizedText, LocaleCode };
export { getLocalizedText } from './schema';

// ─── Mistake Bank Interface ──────────────────────────────────────────────────
export interface IMistakeBank {
  getById(id: string): Mistake | undefined;
  getByDomain(domain: MathDomain): Mistake[];
  getByClassLevel(level: number): Mistake[];
  getByChapter(chapter: string): Mistake[];
  getByModule(moduleId: string): Mistake[];
  getAll(): Mistake[];
  search(query: string): Mistake[];
}

// ─── Mistake Registry (modules register their mistakes) ───────────────────────
export interface MistakeRegistration {
  moduleId: string;
  mistakes: Mistake[];
}

// ─── Visualization hook (module receives action when teacher triggers mistake) ──
export interface MistakeVisualizationHook {
  mistakeId: string;
  action: VisualizationAction;
  locale?: LocaleCode;
}
