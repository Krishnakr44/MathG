'use client';

/**
 * Prism Workspace — Base shape (triangle/rectangle), height, net, surface area
 * Surface area = lateral area + 2 × base area
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Cuboid3DView } from '@/engines/geometry-viz/Cuboid3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { prismFigure } from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';

export interface PrismWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function PrismWorkspace({
  config,
  parameters,
  onParametersChange,
}: PrismWorkspaceProps) {
  const baseWidth = (parameters.baseWidth as number) ?? 3;
  const baseHeight = (parameters.baseHeight as number) ?? 2;
  const height = (parameters.height as number) ?? 4;
  const baseShape = (parameters.baseShape as number) ?? 0;
  const isRect = baseShape >= 0.5;

  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');
  const [showFormula, setShowFormula] = useState(false);

  const dimensions = { baseWidth, baseHeight, height, baseShape };
  const bounds = prismFigure.getBoundingBox(dimensions);
  const faces = prismFigure.getFaces(dimensions);
  const net = prismFigure.getNet(dimensions);
  const surfaceArea = prismFigure.getSurfaceArea(dimensions);
  const formula = prismFigure.getFormula(dimensions);

  const faceAreas: Record<string, number> = faces
    ? Object.fromEntries(faces.map((f) => [f.id, f.area]))
    : {};

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: isRect ? 'Rectangular Prism' : 'Triangular Prism', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Base shape</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSliderChange('baseShape', 0)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium ${!isRect ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]'}`}
                >
                  Triangle
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange('baseShape', 1)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium ${isRect ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]'}`}
                >
                  Rectangle
                </button>
              </div>
            </div>
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              <label className="block text-sm mb-1">Base width: {baseWidth}</label>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={baseWidth}
                onChange={(e) => handleSliderChange('baseWidth', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Base height: {baseHeight}</label>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={baseHeight}
                onChange={(e) => handleSliderChange('baseHeight', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Prism height: {height}</label>
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
              {viewMode === '3d' ? '3D View' : 'Net (Unfolded)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' && isRect ? (
                <Cuboid3DView
                  length={baseWidth}
                  breadth={baseHeight}
                  height={height}
                  width={450}
                  heightPx={400}
                  bounds={bounds}
                />
              ) : viewMode === 'net' && net ? (
                <NetViewCanvas
                  net={net}
                  faceAreas={faceAreas}
                  showLabels
                  width={500}
                  height={400}
                />
              ) : viewMode === '3d' && !isRect ? (
                <div className="flex flex-col items-center justify-center gap-4 text-[var(--color-text-muted)]">
                  <p className="text-sm">Triangular prism 3D view coming soon.</p>
                  <button
                    type="button"
                    onClick={() => setViewMode('net')}
                    className="px-4 py-2 rounded bg-[var(--color-primary)] text-white text-sm"
                  >
                    View net instead
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
