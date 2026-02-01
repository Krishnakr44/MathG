/**
 * MathG — Mistake Bank Registry
 * Modules register their mistakes without touching core code
 */

import type { Mistake } from './schema';
import type { MistakeRegistration } from './types';

const mistakes = new Map<string, Mistake>();
const moduleToMistakes = new Map<string, Set<string>>();

export function registerMistakes(registration: MistakeRegistration): void {
  const { moduleId, mistakes: mistakeList } = registration;
  const ids = new Set<string>();

  for (const m of mistakeList) {
    mistakes.set(m.id, m);
    ids.add(m.id);
  }

  const existing = moduleToMistakes.get(moduleId);
  if (existing) {
    ids.forEach((id) => existing.add(id));
  } else {
    moduleToMistakes.set(moduleId, ids);
  }
}

export function getMistakeById(id: string): Mistake | undefined {
  return mistakes.get(id);
}

export function getMistakesByDomain(domain: string): Mistake[] {
  return Array.from(mistakes.values()).filter((m) => m.domain === domain);
}

export function getMistakesByClassLevel(level: number): Mistake[] {
  return Array.from(mistakes.values()).filter((m) => m.classLevel?.includes(level));
}

export function getMistakesByChapter(chapter: string): Mistake[] {
  return Array.from(mistakes.values()).filter((m) => {
    const ch = typeof m.chapter === 'string' ? m.chapter : m.chapter.en;
    return ch.toLowerCase().includes(chapter.toLowerCase());
  });
}

export function getMistakesByModule(moduleId: string): Mistake[] {
  const ids = moduleToMistakes.get(moduleId);
  if (!ids) return [];
  return Array.from(ids)
    .map((id) => mistakes.get(id))
    .filter((m): m is Mistake => m !== undefined);
}

export function getAllMistakes(): Mistake[] {
  return Array.from(mistakes.values());
}

export function searchMistakes(query: string): Mistake[] {
  const q = query.toLowerCase();
  return Array.from(mistakes.values()).filter((m) => {
    const concept = typeof m.concept === 'string' ? m.concept : m.concept.en;
    const chapter = typeof m.chapter === 'string' ? m.chapter : m.chapter.en;
    const tags = m.tags?.join(' ') ?? '';
    const student = typeof m.studentWrongAnswer === 'string' ? m.studentWrongAnswer : m.studentWrongAnswer.en;
    return (
      concept.toLowerCase().includes(q) ||
      chapter.toLowerCase().includes(q) ||
      tags.toLowerCase().includes(q) ||
      student.toLowerCase().includes(q)
    );
  });
}

export function getVisualizationAction(
  mistakeId: string,
  moduleDomain: string
): Mistake['visualizationActions'][0] | undefined {
  const mistake = mistakes.get(mistakeId);
  if (!mistake) return undefined;
  return mistake.visualizationActions.find((a) => a.moduleDomain === moduleDomain);
}
