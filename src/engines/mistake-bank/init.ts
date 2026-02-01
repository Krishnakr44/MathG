/**
 * MathG — Mistake Bank Initialization
 * Load all registered mistake packs on app start
 */

import { loadFromCache } from './storage';
import { registerMistakes } from './registry';
import { loadGraphsMistakes } from '@/config/mistakes/load-graphs-mistakes';
import type { Mistake } from './schema';

let initialized = false;

export function initMistakeBank(): void {
  if (initialized) return;

  // Load built-in mistake packs (runs at module load or first call)
  loadGraphsMistakes();

  // Hydrate from offline cache (user-imported packs) — client only
  if (typeof window !== 'undefined') {
    const cached = loadFromCache();
    if (cached.length > 0) {
      const byModule = new Map<string, Mistake[]>();
      for (const m of cached) {
        const moduleId = m.packId ?? 'imported';
        const list = byModule.get(moduleId) ?? [];
        list.push(m);
        byModule.set(moduleId, list);
      }
      byModule.forEach((mistakes, moduleId) => {
        registerMistakes({ moduleId, mistakes });
      });
    }
  }

  initialized = true;
}
