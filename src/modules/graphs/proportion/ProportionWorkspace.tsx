'use client';

/**
 * Proportion Workspace — Direct (y=kx) vs Inverse (y=k/x)
 * Table + graph sync, slider for k
 */

import { useState, useCallback, useMemo } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { PointPlotCanvas } from '@/engines/visualization/components/PointPlotCanvas';
import {
  directProportionTable,
  inverseProportionTable,
  type ProportionType,
} from '@/engines/math/utils/proportion-utils';
import type { ParameterValues } from '@/core/types';

export interface ProportionWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const X_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ProportionWorkspace({
  config,
  parameters,
  onParametersChange,
}: ProportionWorkspaceProps) {
  const k = (parameters.k as number) ?? 10;
  const [proportionType, setProportionType] = useState<ProportionType>('direct');

  const handleKChange = useCallback(
    (v: number) => {
      onParametersChange({ ...parameters, k: v });
    },
    [parameters, onParametersChange]
  );

  const tableData = useMemo(() => {
    if (proportionType === 'direct') {
      return directProportionTable(k, X_VALUES);
    }
    return inverseProportionTable(k, X_VALUES);
  }, [k, proportionType]);

  const points = tableData.map((p) => ({
    x: p.x,
    y: p.y,
    label: `(${p.x}, ${p.y.toFixed(1)})`,
  }));

  const bounds = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const xMin = Math.min(0, ...xs);
    const xMax = Math.max(10, ...xs) + 1;
    const yMin = Math.min(0, ...ys);
    const yMax = Math.max(...ys) + 2;
    return { xMin, xMax, yMin, yMax };
  }, [points]);

  return (
    <AppLayout header={{ title: 'Direct & Inverse Proportion', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Type</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="proportion"
                    checked={proportionType === 'direct'}
                    onChange={() => setProportionType('direct')}
                  />
                  <span className="text-sm">Direct (y = kx)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="proportion"
                    checked={proportionType === 'inverse'}
                    onChange={() => setProportionType('inverse')}
                  />
                  <span className="text-sm">Inverse (y = k/x)</span>
                </label>
              </div>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Constant k</h3>
              <input
                type="range"
                min={1}
                max={50}
                value={k}
                onChange={(e) => handleKChange(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">k = {k}</p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Table</h3>
              <div className="text-sm font-mono overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-1">x</th>
                      <th className="text-left p-1">y</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.slice(0, 8).map((row, i) => (
                      <tr key={i}>
                        <td className="p-1">{row.x}</td>
                        <td className="p-1">{row.y.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">
              {proportionType === 'direct' ? `y = ${k}x` : `y = ${k}/x`}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <PointPlotCanvas
                points={points}
                bounds={bounds}
                showGrid
                showAxes
                connectPoints={proportionType === 'direct'}
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
