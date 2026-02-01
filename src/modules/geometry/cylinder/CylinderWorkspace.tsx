'use client';

/**
 * Cylinder Workspace — Radius, height, net, surface area
 * Curved surface unwraps to rectangle: width = 2πr, height = h
 * Surface area = 2πr² + 2πrh = 2πr(r + h)
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Figure3DView } from '@/engines/geometry-viz/Figure3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { cylinderFigure } from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';

export interface CylinderWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function CylinderWorkspace({
  config,
  parameters,
  onParametersChange,
}: CylinderWorkspaceProps) {
  const radius = (parameters.radius as number) ?? 1.5;
  const height = (parameters.height as number) ?? 3;
  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');

  const dimensions = { radius, height };
  const bounds = cylinderFigure.getBoundingBox(dimensions);
  const net = cylinderFigure.getNet(dimensions);
  const surfaceArea = cylinderFigure.getSurfaceArea(dimensions);
  const formula = cylinderFigure.getFormula(dimensions);

  const faceAreas: Record<string, number> = {
    base1: Math.PI * radius * radius,
    base2: Math.PI * radius * radius,
    curved: 2 * Math.PI * radius * height,
  };

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: 'Cylinder', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              <label className="block text-sm mb-1">Radius: {radius}</label>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.25}
                value={radius}
                onChange={(e) => handleSliderChange('radius', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Height: {height}</label>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={height}
                onChange={(e) => handleSliderChange('height', Number(e.target.value))}
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
                    {mode === '3d' ? '3D View' : 'Unfold (Net)'}
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
              {viewMode === '3d' ? '3D View — Drag to rotate' : 'Net (Unfolded)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' ? (
                <Figure3DView
                  kind="cylinder"
                  dimensions={dimensions}
                  bounds={bounds}
                  width={450}
                  heightPx={400}
                />
              ) : net ? (
                <NetViewCanvas
                  net={net}
                  faceAreas={faceAreas}
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
