'use client';

/**
 * Statistics Workspace — Table input, bar/histogram/polygon
 * Mean, median, mode visualization
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { BarChartCanvas } from '@/engines/visualization/components/BarChartCanvas';
import { statisticsSummary, createClassIntervals } from '@/engines/math/utils/statistics-utils';
import type { BarChartDataPoint } from '@/engines/visualization/components/BarChartCanvas';
import type { ParameterValues } from '@/core/types';

export interface StatisticsWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const DEFAULT_RAW = '5\n10\n12\n15\n18\n20\n22\n25\n28\n30';
const DEFAULT_CLASS_WIDTH = 5;

export function StatisticsWorkspace({
  config,
  parameters,
  onParametersChange,
}: StatisticsWorkspaceProps) {
  const [rawInput, setRawInput] = useState(DEFAULT_RAW);
  const [chartType, setChartType] = useState<'bar' | 'histogram' | 'frequency-polygon'>('bar');
  const classWidth = (parameters.classWidth as number) ?? DEFAULT_CLASS_WIDTH;

  const handleClassWidthChange = useCallback(
    (v: number) => {
      onParametersChange({ ...parameters, classWidth: v });
    },
    [parameters, onParametersChange]
  );

  const values = rawInput
    .trim()
    .split(/\s+/)
    .map((s) => parseFloat(s))
    .filter((v) => Number.isFinite(v));

  const intervals = createClassIntervals(values, classWidth);
  const barData: BarChartDataPoint[] =
    chartType === 'bar'
      ? (() => {
          const freq = new Map<number, number>();
          for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
          return [...freq.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([k, v]) => ({ label: String(k), value: v }));
        })()
      : chartType === 'frequency-polygon'
        ? intervals.map((i) => ({ label: String((i.min + i.max) / 2), value: i.frequency }))
        : intervals.map((i) => ({ label: i.label, value: i.frequency }));

  const summary = statisticsSummary(values);

  return (
    <AppLayout header={{ title: 'Statistics', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Data input</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Enter values (one per line)</p>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                rows={8}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm font-mono"
                placeholder="5&#10;10&#10;12&#10;15"
              />
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Graph type</h3>
              <div className="flex flex-col gap-2">
                {(['bar', 'histogram', 'frequency-polygon'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="chartType"
                      checked={chartType === t}
                      onChange={() => setChartType(t)}
                    />
                    <span className="text-sm capitalize">{t.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            {chartType !== 'bar' && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Class width</h3>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={classWidth}
                  onChange={(e) => handleClassWidthChange(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm mt-1">{classWidth}</p>
              </div>
            )}
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Summary</h3>
              <p className="text-sm">Mean: {summary.mean.toFixed(2)}</p>
              <p className="text-sm">Median: {summary.median.toFixed(2)}</p>
              <p className="text-sm">Mode: {summary.mode.length ? summary.mode.join(', ') : '—'}</p>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)] capitalize">
              {chartType.replace('-', ' ')}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <BarChartCanvas
                data={barData}
                chartType={chartType}
                classWidth={classWidth}
                showValues
                width={600}
                height={400}
              />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
