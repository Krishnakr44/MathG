/**
 * Mistake Store — JSON-based, offline-first
 * Extension point: load from config/mistakes/*.json
 */

import type { IMistake, IMistakeBank } from '@/core/types/mistake-bank.types';
import type { MathDomain } from '@/core/types';

const mistakes = new Map<string, IMistake>();

export function createMistakeBank(initialMistakes: IMistake[] = []): IMistakeBank {
  initialMistakes.forEach((m) => mistakes.set(m.id, m));

  return {
    getById(id: string): IMistake | undefined {
      return mistakes.get(id);
    },
    getByDomain(domain: MathDomain): IMistake[] {
      return Array.from(mistakes.values()).filter((m) => m.domain === domain);
    },
    getByClassLevel(level: number): IMistake[] {
      return Array.from(mistakes.values()).filter(
        (m) => m.classLevel?.includes(level)
      );
    },
    getAll(): IMistake[] {
      return Array.from(mistakes.values());
    },
  };
}
