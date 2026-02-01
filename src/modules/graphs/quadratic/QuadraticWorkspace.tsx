'use client';

/**
 * Quadratic Workspace — ax² + bx + c
 * Parabola, roots, vertex, axis of symmetry, discriminant
 */

import { useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { QuadraticCanvas } from '@/engines/visualization/components/QuadraticCanvas';
import { analyzeQuadratic } from '@/engines/math/utils/quadratic-utils';
import type { ParameterValues } from '@/core/types';

export interface QuadraticWorkspaceProps {
  config: { bounds?: { xMin: number; xMax: number; yMin: number; yMax: number } };
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const DEFAULT_BOUNDS = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function QuadraticWorkspace({
  config,
  parameters,
  onParametersChange,
}: QuadraticWorkspaceProps) {
  const a = (parameters.a as number) ?? 1;
  const b = (parameters.b as number) ?? 0;
  const c = (parameters.c as number) ?? 0;
  const bounds = config.bounds ?? DEFAULT_BOUNDS;

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  const analysis = analyzeQuadratic(a, b, c);

  let rootsText = '';
  if (analysis.roots.hasImaginary) rootsText = 'Imaginary roots';
  else if (analysis.roots.real.length === 0) rootsText = 'No real roots';
  else if (analysis.roots.real.length === 1) rootsText = `One root: ${analysis.roots.real[0].toFixed(2)}`;
  else rootsText = `Two roots: ${analysis.roots.real[0].toFixed(2)}, ${analysis.roots.real[1].toFixed(2)}`;

  return (
    <AppLayout header={{ title: 'Quadratic Equations', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">y = ax² + bx + c</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">a = {a}, b = {b}, c = {c}</p>
              <label className="block text-sm mb-1">a</label>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={a}
                onChange={(e) => handleSliderChange('a', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">b</label>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={b}
                onChange={(e) => handleSliderChange('b', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">c</label>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={c}
                onChange={(e) => handleSliderChange('c', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Analysis</h3>
              <p className="text-sm">Discriminant: {analysis.discriminant.toFixed(2)}</p>
              <p className="text-sm font-medium text-[var(--color-primary)] mt-1">{rootsText}</p>
              <p className="text-sm mt-1">Vertex: ({analysis.vertex.x.toFixed(2)}, {analysis.vertex.y.toFixed(2)})</p>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">y = {a}x² + {b}x + {c}</h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <QuadraticCanvas
                a={a}
                b={b}
                c={c}
                bounds={bounds}
                showRoots
                showVertex
                showAxis
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
