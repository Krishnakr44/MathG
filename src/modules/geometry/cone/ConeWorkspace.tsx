'use client';

/**
 * Cone Workspace — Radius, height, net (sector + circle), surface area
 * Slant height l = √(r² + h²)
 * Surface area = πr² + πrl = πr(r + l)
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Figure3DView } from '@/engines/geometry-viz/Figure3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { coneFigure } from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';

export interface ConeWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function ConeWorkspace({
  config,
  parameters,
  onParametersChange,
}: ConeWorkspaceProps) {
  const radius = (parameters.radius as number) ?? 1.5;
  const height = (parameters.height as number) ?? 3;

  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');
  const [showFormula, setShowFormula] = useState(false);

  const dimensions = { radius, height };
  const bounds = coneFigure.getBoundingBox(dimensions);
  const net = coneFigure.getNet(dimensions);
  const surfaceArea = coneFigure.getSurfaceArea(dimensions);
  const formula = coneFigure.getFormula(dimensions);

  const slantHeight = Math.sqrt(radius * radius + height * height);
  const baseArea = Math.PI * radius * radius;
  const curvedArea = Math.PI * radius * slantHeight;
  const faceAreas: Record<string, number> = {
    base: baseArea,
    curved: curvedArea,
  };

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: 'Cone', showBack: true, backHref: '/' }}>
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
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Slant height</h3>
              <p className="text-sm text-[var(--color-primary)]">l = √(r² + h²) = {slantHeight.toFixed(2)}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Vertical height vs slant height</p>
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
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                Sector radius = slant height, arc length = base circumference
              </p>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Surface area</h3>
              <p className="text-sm font-medium text-[var(--color-primary)]">{surfaceArea.toFixed(1)} sq units</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Base: {baseArea.toFixed(1)} + Curved: {curvedArea.toFixed(1)}</p>
              {showFormula && <p className="text-xs mt-1 text-[var(--color-text-muted)]">{formula}</p>}
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={showFormula}
                onChange={(e) => setShowFormula(e.target.checked)}
              />
              Show formula
            </label>
          </aside>
          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">
              {viewMode === '3d' ? '3D View — Drag to rotate' : 'Net — Sector (curved surface) + Circle (base)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' ? (
                <Figure3DView
                  kind="cone"
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
