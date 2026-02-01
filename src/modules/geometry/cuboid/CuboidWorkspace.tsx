'use client';

/**
 * Cuboid Workspace — 3D view, net view, surface area
 * Surface area = 2(lb + bh + lh)
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Cuboid3DView } from '@/engines/geometry-viz/Cuboid3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { cuboidShape } from '@/engines/geometry/shapes/cuboid';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';
import type { ShapeDimensions } from '@/core/types/geometry.types';

export interface CuboidWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

export function CuboidWorkspace({
  config,
  parameters,
  onParametersChange,
}: CuboidWorkspaceProps) {
  const length = (parameters.length as number) ?? 3;
  const breadth = (parameters.breadth as number) ?? 2;
  const height = (parameters.height as number) ?? 2;
  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');
  const [showFormula, setShowFormula] = useState(false);

  const dimensions: ShapeDimensions = { length, breadth, height };
  const net = cuboidShape.getNet?.(dimensions);
  const surfaceArea = cuboidShape.getSurfaceArea?.(dimensions) ?? 0;
  const formula = cuboidShape.getFormula?.(dimensions) ?? '';

  const faceAreas: Record<string, number> = net
    ? {
        front: length * height,
        back: length * height,
        left: breadth * height,
        right: breadth * height,
        top: length * breadth,
        bottom: length * breadth,
      }
    : {};

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: 'Cube & Cuboid', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              <label className="block text-sm mb-1">Length: {length}</label>
              <input
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={length}
                onChange={(e) => handleSliderChange('length', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Breadth: {breadth}</label>
              <input
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={breadth}
                onChange={(e) => handleSliderChange('breadth', Number(e.target.value))}
                className="w-full"
              />
              <label className="block text-sm mt-2 mb-1">Height: {height}</label>
              <input
                type="range"
                min={1}
                max={8}
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
              {viewMode === '3d' ? '3D View — Drag to rotate' : 'Net (Unfolded)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' ? (
                <Cuboid3DView
                  length={length}
                  breadth={breadth}
                  height={height}
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
