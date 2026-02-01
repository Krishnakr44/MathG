'use client';

/**
 * Cuboid Workspace — 3D view, net view, surface area
 * Face pairs: Top/Bottom, Front/Back, Left/Right
 * Surface area = 2(lb + bh + lh)
 * Face toggle ON/OFF to show contribution
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Cuboid3DView } from '@/engines/geometry-viz/Cuboid3DView';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import { cuboidFigure, isCube } from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';
import type { FacePairId } from '@/engines/geometry-3d/types';

export interface CuboidWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const FACE_PAIRS: { id: FacePairId; label: string; faces: [string, string] }[] = [
  { id: 'top-bottom', label: 'Top & Bottom', faces: ['top', 'bottom'] },
  { id: 'front-back', label: 'Front & Back', faces: ['front', 'back'] },
  { id: 'left-right', label: 'Left & Right', faces: ['left', 'right'] },
];

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
  const [visiblePairs, setVisiblePairs] = useState<Set<FacePairId>>(new Set(['top-bottom', 'front-back', 'left-right']));
  const [highlightedPair, setHighlightedPair] = useState<FacePairId | null>(null);

  const dimensions = { length, breadth, height };
  const bounds = cuboidFigure.getBoundingBox(dimensions);
  const faces = cuboidFigure.getFaces(dimensions);
  const net = cuboidFigure.getNet(dimensions);
  const surfaceArea = cuboidFigure.getSurfaceArea(dimensions);
  const formula = cuboidFigure.getFormula(dimensions);

  const visibleFaces = new Set(
    FACE_PAIRS.filter((p) => visiblePairs.has(p.id)).flatMap((p) => p.faces)
  );
  const highlightedPairs = highlightedPair ? new Set([highlightedPair]) : undefined;

  const faceAreas: Record<string, number> = faces
    ? Object.fromEntries(faces.map((f) => [f.id, f.area]))
    : {};

  const togglePair = useCallback((pairId: FacePairId) => {
    setVisiblePairs((prev) => {
      const next = new Set(prev);
      if (next.has(pairId)) next.delete(pairId);
      else next.add(pairId);
      return next;
    });
  }, []);

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  return (
    <AppLayout header={{ title: isCube(dimensions) ? 'Cube' : 'Cuboid', showBack: true, backHref: '/' }}>
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
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Face pairs</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">Toggle faces to see contribution</p>
              {FACE_PAIRS.map((pair) => {
                const isOn = visiblePairs.has(pair.id);
                const area = faces
                  ? faces.filter((f) => pair.faces.includes(f.id)).reduce((s, f) => s + f.area, 0)
                  : 0;
                return (
                  <div key={pair.id} className="flex items-center justify-between gap-2 py-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm flex-1">
                      <input
                        type="checkbox"
                        checked={isOn}
                        onChange={() => togglePair(pair.id)}
                      />
                      <span>{pair.label}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setHighlightedPair(highlightedPair === pair.id ? null : pair.id)}
                      className={`text-xs px-2 py-0.5 rounded ${highlightedPair === pair.id ? 'bg-green-200' : 'bg-[var(--color-surface)]'}`}
                    >
                      Highlight
                    </button>
                    {isOn && <span className="text-xs text-[var(--color-primary)]">{area.toFixed(1)}</span>}
                  </div>
                );
              })}
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
                  bounds={bounds}
                  visibleFaces={visibleFaces.size < 6 ? visibleFaces : undefined}
                  highlightedPairs={highlightedPairs}
                />
              ) : net ? (
                <NetViewCanvas
                  net={net}
                  faceAreas={faceAreas}
                  showLabels
                  highlightedFaces={highlightedPair ? new Set(FACE_PAIRS.find((p) => p.id === highlightedPair)?.faces ?? []) : undefined}
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
