'use client';

/**
 * Intro Graphs Workspace — Table → Points → Graph
 * Cartesian plane with adjustable scale, quadrant highlighting
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { PointPlotCanvas } from '@/engines/visualization/components/PointPlotCanvas';

export interface IntroGraphsWorkspaceProps {
  config: { bounds?: { xMin: number; xMax: number; yMin: number; yMax: number } };
}

const DEFAULT_POINTS = [
  { x: 0, y: 0, label: '(0,0)' },
  { x: 1, y: 2, label: '(1,2)' },
  { x: 2, y: 4, label: '(2,4)' },
  { x: 3, y: 6, label: '(3,6)' },
];

export function IntroGraphsWorkspace({ config }: IntroGraphsWorkspaceProps) {
  const bounds = config.bounds ?? { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
  const [points, setPoints] = useState<{ x: number; y: number; label?: string }[]>(DEFAULT_POINTS);
  const [tableInput, setTableInput] = useState('0,0\n1,2\n2,4\n3,6');
  const [showQuadrants, setShowQuadrants] = useState(true);
  const [connectPoints, setConnectPoints] = useState(true);
  const [xScale, setXScale] = useState(bounds.xMax);
  const [yScale, setYScale] = useState(bounds.yMax);

  const displayBounds = { xMin: -xScale, xMax: xScale, yMin: -yScale, yMax: yScale };

  const handleTableApply = useCallback(() => {
    const rows = tableInput.trim().split('\n').filter(Boolean);
    const parsed: { x: number; y: number; label?: string }[] = [];
    for (const row of rows) {
      const parts = row.split(/[,\s]+/).map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
        parsed.push({ x: parts[0], y: parts[1], label: `(${parts[0]},${parts[1]})` });
      }
    }
    if (parsed.length > 0) setPoints(parsed);
  }, [tableInput]);

  return (
    <AppLayout header={{ title: 'Introduction to Graphs', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Table input</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Enter x,y pairs (one per line)</p>
              <textarea
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                rows={6}
                className="w-full p-2 border border-[var(--color-border)] rounded text-sm font-mono"
                placeholder="0,0&#10;1,2&#10;2,4"
              />
              <button
                type="button"
                onClick={handleTableApply}
                className="mt-2 w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--btn-radius)] hover:opacity-90"
              >
                Apply
              </button>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Scale</h3>
              <label className="block text-sm mb-1">X: ±{xScale}</label>
              <input
                type="range"
                min={5}
                max={20}
                value={xScale}
                onChange={(e) => setXScale(Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Y: ±{yScale}</label>
              <input
                type="range"
                min={5}
                max={20}
                value={yScale}
                onChange={(e) => setYScale(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showQuadrants}
                  onChange={(e) => setShowQuadrants(e.target.checked)}
                />
                <span className="text-sm">Quadrants</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={connectPoints}
                  onChange={(e) => setConnectPoints(e.target.checked)}
                />
                <span className="text-sm">Connect</span>
              </label>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Graph</h3>
            <div className="flex items-center justify-center min-h-[400px]">
              <PointPlotCanvas
                points={points}
                bounds={displayBounds}
                showGrid
                showAxes
                highlightQuadrants={showQuadrants}
                connectPoints={connectPoints}
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
