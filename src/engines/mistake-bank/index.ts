/**
 * MathG — Mistake Bank Engine — Public API
 */

export { registerMistakes, getMistakeById, getMistakesByDomain, getMistakesByClassLevel, getMistakesByChapter, getMistakesByModule, getAllMistakes, searchMistakes, getVisualizationAction } from './registry';
export { initMistakeBank } from './init';
export { MistakeBankProvider, useMistakeBank, useMistakeBankOptional } from './MistakeBankContext';
export { MistakeTrigger } from './components/MistakeTrigger';
export { MistakeDetailPanel } from './components/MistakeDetailPanel';
export { MistakeExportImport } from './components/MistakeExportImport';
export { cacheToStorage, loadFromCache, exportAsJson, exportMistakePack, importFromJson, applyImportedMistakes } from './storage';
export { getLocalizedText } from './schema';
export type { Mistake, MistakePack, VisualizationAction, LocalizedText, LocaleCode, IMistakeBank, MistakeRegistration, MistakeVisualizationHook } from './types';
