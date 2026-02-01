/**
 * Module Launcher — Grid of modules for teacher
 * One-click access to math domains
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllModules } from '@/core/registry/module-registry';
import type { IMathModule } from '@/core/types/module.types';

export function ModuleLauncher() {
  const [modules, setModules] = useState<IMathModule[]>([]);

  useEffect(() => {
    setModules(getAllModules());
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((m) => (
        <Link
          key={m.id}
          href={`/module/${m.id}`}
          className="block p-6 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{m.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {m.classRange ? `Class ${m.classRange}` : m.domain}
            {m.ncertChapter && ` · ${m.ncertChapter}`}
          </p>
        </Link>
      ))}
    </div>
  );
}
