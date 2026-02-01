'use client';

/**
 * Rectangle Workspace — Grid coverage, pattern discovery, formula emergence
 * Area = length × breadth (rows × columns)
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { CoverageCanvas } from '@/engines/geometry-viz/CoverageCanvas';
import { rectangleShape } from '@/engines/geometry/shapes/rectangle';
import type { ParameterValues } from '@/core/types';
import type { ShapeDimensions } from '@/core/types/geometry.types';

export interface RectangleWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function RectangleWorkspace({
  config,
  parameters,
  onParametersChange,
}: RectangleWorkspaceProps) {
  const length = (parameters.length as number) ?? 4;
  const breadth = (parameters.breadth as number) ?? 3;
  const [showFormula, setShowFormula] = useState(false);
  const [showCount, setShowCount] = useState(true);

  const dimensions: ShapeDimensions = { length, breadth };
  const coverage = rectangleShape.getCoverage?.(dimensions) ?? [];
  const area = rectangleShape.getArea(dimensions);
  const formula = rectangleShape.getFormula?.(dimensions) ?? '';

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: 'Square & Rectangle', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              <label className="block text-sm mb-1">Length: {length}</label>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={length}
                onChange={(e) => handleSliderChange('length', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Breadth: {breadth}</label>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={breadth}
                onChange={(e) => handleSliderChange('breadth', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Pattern</h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {length} rows × {breadth} columns = {area} unit squares
              </p>
            </div>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={showCount}
                  onChange={(e) => setShowCount(e.target.checked)}
                />
                Show count
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={showFormula}
                  onChange={(e) => setShowFormula(e.target.checked)}
                />
                Show formula
              </label>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Coverage</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-2">
              Area = number of unit squares
            </p>
            <div className="flex items-center justify-center min-h-[400px]">
              <CoverageCanvas
                units={coverage}
                showCount={showCount}
                showFormula={showFormula}
                formula={formula}
                area={area}
                width={500}
                height={400}
              />
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
