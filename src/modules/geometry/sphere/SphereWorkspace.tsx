'use client';

/**
 * Sphere Workspace — Radius, net (strip approximation), surface area
 * Surface area = 4πr²
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Figure3DView } from '@/engines/geometry-viz/Figure3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { sphereFigure } from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';

export interface SphereWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function SphereWorkspace({
  config,
  parameters,
  onParametersChange,
}: SphereWorkspaceProps) {
  const radius = (parameters.radius as number) ?? 1.5;
  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');

  const dimensions = { radius };
  const bounds = sphereFigure.getBoundingBox(dimensions);
  const net = sphereFigure.getNet(dimensions);
  const surfaceArea = sphereFigure.getSurfaceArea(dimensions);
  const formula = sphereFigure.getFormula(dimensions);

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: 'Sphere', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              <label className="block text-sm mb-1">Radius: {radius}</label>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={radius}
                onChange={(e) => handleSliderChange('radius', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">View</h3>
              <div className="flex flex-col gap-2">
                {(['3d', 'net'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-surface)] hover:bg-[var(--color-border)]'
                    }`}
                  >
                    {mode === '3d' ? '3D View' : 'Strip approximation'}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Surface area</h3>
              <p className="text-sm font-medium text-[var(--color-primary)]">{surfaceArea.toFixed(1)} sq units</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{formula}</p>
            </div>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">
              {viewMode === '3d' ? '3D View — Drag to rotate' : 'Strip approximation (net)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' ? (
                <Figure3DView
                  kind="sphere"
                  dimensions={dimensions}
                  bounds={bounds}
                  width={450}
                  heightPx={400}
                />
              ) : net ? (
                <NetViewCanvas
                  net={net}
                  showLabels
                  width={500}
                  height={400}
                />
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
