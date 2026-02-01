'use client';

/**
 * Linear Equations Workspace — ax+by+c=0 → y=mx+c
 * Slider-based manipulation, dynamic line, intercepts
 */

import { useState, useCallback, useEffect } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { LinePlotCanvas } from '@/engines/visualization/components/LinePlotCanvas';
import { parseLinearEquation } from '@/engines/math/utils/linear-utils';
import type { ParameterValues } from '@/core/types';

export interface LinearEquationsWorkspaceProps {
  config: { expressions?: string[]; bounds?: { xMin: number; xMax: number; yMin: number; yMax: number } };
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const DEFAULT_EQ = 'y = 2*x + 1';
const DEFAULT_BOUNDS = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function LinearEquationsWorkspace({
  config,
  parameters,
  onParametersChange,
}: LinearEquationsWorkspaceProps) {
  const [equation, setEquation] = useState((config.expressions?.[0] as string) ?? DEFAULT_EQ);
  const [m, setM] = useState(2);
  const [c, setC] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const bounds = config.bounds ?? DEFAULT_BOUNDS;

  useEffect(() => {
    const mVal = (parameters.m as number) ?? 2;
    const cVal = (parameters.c as number) ?? 1;
    setM(mVal);
    setC(cVal);
  }, [parameters]);

  const handleEquationChange = useCallback(() => {
    const { m: parsedM, c: parsedC, error: err } = parseLinearEquation(equation);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setM(parsedM);
    setC(parsedC);
    onParametersChange({ ...parameters, m: parsedM, c: parsedC });
  }, [equation, parameters, onParametersChange]);

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      const next = { ...parameters, [id]: value };
      onParametersChange(next);
      if (id === 'm') setM(value);
      else setC(value);
    },
    [parameters, onParametersChange]
  );

  const lines = [{ m, c, color: '#0066cc', label: `y = ${m}x + ${c}` }];

  return (
    <AppLayout header={{ title: 'Linear Equations in Two Variables', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Equation</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">y = mx + c or ax + by + c = 0</p>
              <input
                type="text"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                onBlur={handleEquationChange}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm"
                placeholder="y = 2*x + 1"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
              <button
                type="button"
                onClick={handleEquationChange}
                className="mt-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--btn-radius)] hover:opacity-90"
              >
                Apply
              </button>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Slope & Intercept</h3>
              <label className="block text-sm mb-1">m = {m}</label>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.5}
                value={m}
                onChange={(e) => handleSliderChange('m', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">c = {c}</label>
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
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">y = {m}x + {c}</h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <LinePlotCanvas
                lines={lines}
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
