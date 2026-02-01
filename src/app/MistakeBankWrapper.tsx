'use client';

/**
 * MathG — Mistake Bank Wrapper
 * Initializes Mistake Bank and provides context
 */

import { useEffect } from 'react';
import { MistakeBankProvider } from '@/engines/mistake-bank/MistakeBankContext';
import { initMistakeBank } from '@/engines/mistake-bank/init';

// Initialize built-in packs immediately (SSR-safe: no window access for built-ins)
initMistakeBank();

export function MistakeBankWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initMistakeBank(); // Re-run for cache hydration (client-only)
  }, []);

  return <MistakeBankProvider>{children}</MistakeBankProvider>;
}
