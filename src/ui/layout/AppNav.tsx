'use client';

/**
 * MathG — Minimal app navigation
 * Projection-friendly, distraction-free
 */

import Link from 'next/link';

export function AppNav() {
  return (
    <nav className="shrink-0 px-4 py-2 bg-slate-800 text-white flex items-center gap-4">
      <Link href="/" className="font-bold text-lg hover:text-slate-200">
        MathG
      </Link>
      <Link href="/module/graphs-equation-viz" className="text-sm hover:text-slate-200">
        Equation & Graph
      </Link>
      <Link href="/module/graphs-linear" className="text-sm hover:text-slate-200">
        Linear Graphs
      </Link>
    </nav>
  );
}
