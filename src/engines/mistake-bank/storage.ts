/**
 * MathG — Mistake Bank Storage
 * Offline caching, export/import per chapter
 */

import type { Mistake, MistakePack } from './schema';
import { registerMistakes } from './registry';

const CACHE_KEY = 'mathg-mistake-bank-cache';
const CACHE_VERSION = 1;

interface CachedData {
  version: number;
  mistakes: Mistake[];
  moduleIds: string[];
  cachedAt: string;
}

export function cacheToStorage(mistakes: Mistake[], moduleIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const data: CachedData = {
      version: CACHE_VERSION,
      mistakes,
      moduleIds,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[MathG] Mistake Bank cache write failed:', e);
  }
}

export function loadFromCache(): Mistake[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as CachedData;
    if (data.version !== CACHE_VERSION) return [];
    return data.mistakes ?? [];
  } catch (e) {
    console.warn('[MathG] Mistake Bank cache read failed:', e);
    return [];
  }
}

export function exportMistakePack(mistakes: Mistake[]): MistakePack {
  const first = mistakes[0];
  const pack: MistakePack = {
    id: first?.packId ?? `pack-${Date.now()}`,
    name: first?.chapter ?? 'Mistake Pack',
    chapter: first?.chapter ?? 'Unknown',
    domain: first?.domain ?? 'graphs',
    classLevel: first?.classLevel ?? [6, 7, 8],
    mistakes,
    version: '1.0',
    createdAt: new Date().toISOString(),
  };
  return pack;
}

export function exportAsJson(mistakes: Mistake[]): string {
  const pack = exportMistakePack(mistakes);
  return JSON.stringify(pack, null, 2);
}

export function importFromJson(json: string): { mistakes: Mistake[]; errors: string[] } {
  const errors: string[] = [];
  try {
    const pack = JSON.parse(json) as MistakePack;
    if (!pack.mistakes || !Array.isArray(pack.mistakes)) {
      return { mistakes: [], errors: ['Invalid pack format: missing mistakes array'] };
    }

    for (const m of pack.mistakes) {
      if (!m.id || !m.domain) {
        errors.push(`Invalid mistake: missing id or domain`);
      }
    }

    return { mistakes: pack.mistakes, errors };
  } catch (e) {
    return { mistakes: [], errors: [`Parse error: ${e instanceof Error ? e.message : 'Unknown'}`] };
  }
}

export function applyImportedMistakes(mistakes: Mistake[], moduleId: string): void {
  registerMistakes({ moduleId, mistakes });
  const existing = loadFromCache();
  const byId = new Map(existing.map((m) => [m.id, m]));
  mistakes.forEach((m) => byId.set(m.id, m));
  const merged = Array.from(byId.values());
  const moduleIds = [...new Set([moduleId])];
  cacheToStorage(merged, moduleIds);
}
