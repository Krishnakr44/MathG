'use client';

/**
 * MathG — Mistake Bank Context
 * Teachers trigger mistakes manually during class
 */

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
} from 'react';
import {
  getMistakeById,
  getMistakesByDomain,
  getMistakesByModule,
  getVisualizationAction,
} from './registry';
import { getLocalizedText } from './schema';
import type { Mistake, VisualizationAction, LocaleCode } from './types';

export interface MistakeBankContextValue {
  /** Currently triggered mistake (teacher selected) */
  activeMistakeId: string | null;
  /** Visualization action for active mistake (domain-specific) */
  activeAction: VisualizationAction | null;
  /** Trigger a mistake by ID */
  triggerMistake: (mistakeId: string | null, moduleDomain?: string) => void;
  /** Get mistake by ID */
  getMistake: (id: string) => Mistake | undefined;
  /** Get mistakes for a module */
  getMistakesForModule: (moduleId: string) => Mistake[];
  /** Get mistakes by domain */
  getMistakesByDomain: (domain: string) => Mistake[];
  /** Current locale for localized text */
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
}

const MistakeBankContext = createContext<MistakeBankContextValue | null>(null);

export function MistakeBankProvider({
  children,
  defaultLocale = 'en',
}: {
  children: ReactNode;
  defaultLocale?: LocaleCode;
}) {
  const [activeMistakeId, setActiveMistakeId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<VisualizationAction | null>(null);
  const [moduleDomain, setModuleDomain] = useState<string | null>(null);
  const [locale, setLocale] = useState<LocaleCode>(defaultLocale);

  const triggerMistake = useCallback((mistakeId: string | null, domain?: string) => {
    setActiveMistakeId(mistakeId);
    setModuleDomain(domain ?? null);
    if (!mistakeId || !domain) {
      setActiveAction(null);
      return;
    }
    const action = getVisualizationAction(mistakeId, domain);
    setActiveAction(action ?? null);
  }, []);

  const getMistake = useCallback((id: string) => getMistakeById(id), []);
  const getMistakesForModule = useCallback((moduleId: string) => getMistakesByModule(moduleId), []);
  const getMistakesByDomainFn = useCallback((domain: string) => getMistakesByDomain(domain), []);

  const value = useMemo<MistakeBankContextValue>(
    () => ({
      activeMistakeId,
      activeAction,
      triggerMistake,
      getMistake,
      getMistakesForModule,
      getMistakesByDomain: getMistakesByDomainFn,
      locale,
      setLocale,
    }),
    [
      activeMistakeId,
      activeAction,
      triggerMistake,
      getMistake,
      getMistakesForModule,
      getMistakesByDomainFn,
      locale,
    ]
  );

  return (
    <MistakeBankContext.Provider value={value}>{children}</MistakeBankContext.Provider>
  );
}

export function useMistakeBank(): MistakeBankContextValue {
  const ctx = useContext(MistakeBankContext);
  if (!ctx) {
    throw new Error('useMistakeBank must be used within MistakeBankProvider');
  }
  return ctx;
}

export function useMistakeBankOptional(): MistakeBankContextValue | null {
  return useContext(MistakeBankContext);
}
