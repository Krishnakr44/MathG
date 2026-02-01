'use client';

/**
 * Pair of Linear Equations Workspace — Two lines, intersection
 * Classify: one solution, no solution, infinite solutions
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { LinePlotCanvas } from '@/engines/visualization/components/LinePlotCanvas';
import { parseLinearEquation, intersectLines } from '@/engines/math/utils/linear-utils';

export interface PairLinearWorkspaceProps {
  config: { expressions?: string[]; bounds?: { xMin: number; xMax: number; yMin: number; yMax: number } };
}

const DEFAULT_BOUNDS = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function PairLinearWorkspace({ config }: PairLinearWorkspaceProps) {
  const defaultEqs = config.expressions ?? ['y = x + 1', 'y = -x + 3'];
  const [eq1, setEq1] = useState(defaultEqs[0] ?? 'y = x + 1');
  const [eq2, setEq2] = useState(defaultEqs[1] ?? 'y = -x + 3');
  const [m1, setM1] = useState(1);
  const [c1, setC1] = useState(1);
  const [m2, setM2] = useState(-1);
  const [c2, setC2] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const bounds = config.bounds ?? DEFAULT_BOUNDS;

  const applyEquations = useCallback(() => {
    const r1 = parseLinearEquation(eq1);
    const r2 = parseLinearEquation(eq2);
    if (r1.error || r2.error) {
      setError(r1.error ?? r2.error ?? 'Invalid equation');
      return;
    }
    setError(null);
    setM1(r1.m);
    setC1(r1.c);
    setM2(r2.m);
    setC2(r2.c);
  }, [eq1, eq2]);

  const intersection = intersectLines(m1, c1, m2, c2);
  const lines = [
    { m: m1, c: c1, color: '#0066cc', label: eq1 },
    { m: m2, c: c2, color: '#dc2626', label: eq2 },
  ];
  const intersectionPoint =
    intersection.type === 'one' ? { x: intersection.x, y: intersection.y } : null;

  let solutionType = '';
  if (intersection.type === 'one') solutionType = 'One solution';
  else if (intersection.type === 'none') solutionType = 'No solution (parallel)';
  else solutionType = 'Infinite solutions (coincident)';

  return (
    <AppLayout header={{ title: 'Pair of Linear Equations', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Line 1</h3>
              <input
                type="text"
                value={eq1}
                onChange={(e) => setEq1(e.target.value)}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm"
                placeholder="y = x + 1"
              />
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Line 2</h3>
              <input
                type="text"
                value={eq2}
                onChange={(e) => setEq2(e.target.value)}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm"
                placeholder="y = -x + 3"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={applyEquations}
              className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--btn-radius)] hover:opacity-90"
            >
              Apply
            </button>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-1 text-[var(--color-text)]">Classification</h3>
              <p className="text-sm font-medium text-[var(--color-primary)]">{solutionType}</p>
              {intersection.type === 'one' && (
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Intersection: ({intersection.x.toFixed(2)}, {intersection.y.toFixed(2)})
                </p>
              )}
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">{solutionType}</h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <LinePlotCanvas
                lines={lines}
                intersection={intersectionPoint}
                bounds={bounds}
                showGrid
                showAxes
                showIntercepts
                width={600}
                height={450}
              />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
