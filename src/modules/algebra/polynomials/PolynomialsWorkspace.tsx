'use client';

/**
 * Polynomials Workspace — Polynomial input, graph, zeros
 * Degree ≤ 3, x-intercepts highlighted
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { PolynomialCanvas } from '@/engines/visualization/components/PolynomialCanvas';
import { parsePolynomial, polynomialZeros } from '@/engines/math/utils/polynomial-utils';

export interface PolynomialsWorkspaceProps {
  config: { expressions?: string[]; bounds?: { xMin: number; xMax: number; yMin: number; yMax: number } };
}

const DEFAULT_BOUNDS = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const DEFAULT_EXPR = 'x^2 - 3*x + 2';

export function PolynomialsWorkspace({ config }: PolynomialsWorkspaceProps) {
  const defaultExpr = (config.expressions?.[0] as string) ?? DEFAULT_EXPR;
  const [expression, setExpression] = useState(defaultExpr);
  const [coefficients, setCoefficients] = useState<number[]>(() => parsePolynomial(defaultExpr));
  const bounds = config.bounds ?? DEFAULT_BOUNDS;

  const handleApply = useCallback(() => {
    const coef = parsePolynomial(expression);
    setCoefficients(coef);
  }, [expression]);

  const zeros = polynomialZeros(coefficients);

  return (
    <AppLayout header={{ title: 'Polynomials', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Polynomial</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">ax³ + bx² + cx + d (degree ≤ 3)</p>
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm"
                placeholder="x^2 - 3*x + 2"
              />
              <button
                type="button"
                onClick={handleApply}
                className="mt-2 w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--btn-radius)] hover:opacity-90"
              >
                Apply
              </button>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Zeros (x-intercepts)</h3>
              <p className="text-sm">
                {zeros.length === 0
                  ? 'No real zeros'
                  : zeros.map((z) => z.toFixed(2)).join(', ')}
              </p>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Graph</h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <PolynomialCanvas
                coefficients={coefficients}
                bounds={bounds}
                showZeros
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
