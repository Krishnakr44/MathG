'use client';

/**
 * Solids3D Workspace — Unified 3D geometry module
 * Figure selector: Cube, Cuboid, Prism, Cylinder, Cone, Sphere
 * Same camera, scale, rotation, net unfolding for all
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { Solids3DCanvas } from '@/engines/geometry-viz/Solids3DCanvas';
import { NetViewCanvas } from '@/engines/geometry-viz/NetViewCanvas';
import {
  FIGURES_3D,
  cuboidFigure,
  prismFigure,
  cylinderFigure,
  coneFigure,
  sphereFigure,
} from '@/engines/geometry-3d';
import type { ParameterValues } from '@/core/types';
import type { GeometryViewMode } from '@/core/types/geometry.types';
import type { FacePairId } from '@/engines/geometry-3d/types';
import type { Solids3DKind } from '@/engines/geometry-viz/Solids3DCanvas';

export interface Solids3DWorkspaceProps {
  config: Record<string, unknown>;
  parameters: ParameterValues;
  onParametersChange: (v: ParameterValues) => void;
}

const FIGURE_OPTIONS: { id: Figure3DKind | 'cube'; label: string }[] = [
  { id: 'cube', label: 'Cube' },
  { id: 'cuboid', label: 'Cuboid' },
  { id: 'prism', label: 'Prism' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'cone', label: 'Cone' },
  { id: 'sphere', label: 'Sphere' },
];

const FACE_PAIRS: { id: FacePairId; label: string; faces: [string, string] }[] = [
  { id: 'top-bottom', label: 'Top & Bottom', faces: ['top', 'bottom'] },
  { id: 'front-back', label: 'Front & Back', faces: ['front', 'back'] },
  { id: 'left-right', label: 'Left & Right', faces: ['left', 'right'] },
];

function getFigure(figureId: string) {
  if (figureId === 'cube') return cuboidFigure;
  return FIGURES_3D[figureId] ?? cuboidFigure;
}

function getDimensions(figureId: string, parameters: ParameterValues): Record<string, number> {
  if (figureId === 'cube') {
    const s = (parameters.length as number) ?? 2;
    return { length: s, breadth: s, height: s };
  }
  if (figureId === 'cuboid') {
    return {
      length: (parameters.length as number) ?? 3,
      breadth: (parameters.breadth as number) ?? 2,
      height: (parameters.height as number) ?? 2,
    };
  }
  if (figureId === 'prism') {
    return {
      baseWidth: (parameters.baseWidth as number) ?? 3,
      baseHeight: (parameters.baseHeight as number) ?? 2,
      height: (parameters.height as number) ?? 4,
      baseShape: (parameters.baseShape as number) ?? 0,
    };
  }
  if (figureId === 'cylinder' || figureId === 'cone') {
    return {
      radius: (parameters.radius as number) ?? 1.5,
      height: (parameters.height as number) ?? 3,
    };
  }
  if (figureId === 'sphere') {
    return { radius: (parameters.radius as number) ?? 1.5 };
  }
  return {};
}

export function Solids3DWorkspace({
  config,
  parameters,
  onParametersChange,
}: Solids3DWorkspaceProps) {
  const figureId = (parameters.figure as string) ?? 'cuboid';
  const [viewMode, setViewMode] = useState<GeometryViewMode>('3d');
  const [visiblePairs, setVisiblePairs] = useState<Set<FacePairId>>(new Set(['top-bottom', 'front-back', 'left-right']));
  const [highlightedPair, setHighlightedPair] = useState<FacePairId | null>(null);

  const figure = getFigure(figureId);
  const dimensions = getDimensions(figureId, parameters);
  const bounds = figure.getBoundingBox(dimensions);
  const faces = figure.getFaces(dimensions);
  const net = figure.getNet(dimensions);
  const surfaceArea = figure.getSurfaceArea(dimensions);
  const formula = figure.getFormula(dimensions);

  const faceAreas: Record<string, number> = faces
    ? Object.fromEntries(faces.map((f) => [f.id, f.area]))
    : figureId === 'cylinder'
      ? {
          base1: Math.PI * (dimensions.radius ?? 1.5) ** 2,
          base2: Math.PI * (dimensions.radius ?? 1.5) ** 2,
          curved: 2 * Math.PI * (dimensions.radius ?? 1.5) * (dimensions.height ?? 3),
        }
      : figureId === 'cone'
        ? {
            base: Math.PI * (dimensions.radius ?? 1.5) ** 2,
            curved: Math.PI * (dimensions.radius ?? 1.5) * Math.sqrt((dimensions.radius ?? 1.5) ** 2 + (dimensions.height ?? 3) ** 2),
          }
        : {};

  const visibleFaces = new Set(
    FACE_PAIRS.filter((p) => visiblePairs.has(p.id)).flatMap((p) => p.faces)
  );
  const highlightedPairsSet = highlightedPair ? new Set([highlightedPair]) : undefined;

  const handleFigureChange = useCallback(
    (id: string) => {
      onParametersChange({ ...parameters, figure: id });
    },
    [parameters, onParametersChange]
  );

  const handleSliderChange = useCallback(
    (id: string, value: number) => {
      onParametersChange({ ...parameters, [id]: value });
    },
    [parameters, onParametersChange]
  );

  const togglePair = useCallback((pairId: FacePairId) => {
    setVisiblePairs((prev) => {
      const next = new Set(prev);
      if (next.has(pairId)) next.delete(pairId);
      else next.add(pairId);
      return next;
    });
  }, []);

  const showFacePairs = figureId === 'cube' || figureId === 'cuboid';
  const kind: Solids3DKind = figureId === 'cube' ? 'cuboid' : figureId;

  return (
    <AppLayout header={{ title: '3D Solids', showBack: true, backHref: '/' }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-64 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Figure</h3>
              <select
                value={figureId}
                onChange={(e) => handleFigureChange(e.target.value)}
                className="w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)]"
              >
                {FIGURE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {(figureId === 'cube' || figureId === 'cuboid') && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
                {figureId === 'cube' ? (
                  <>
                    <label className="block text-sm mb-1">Side: {dimensions.length}</label>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={0.5}
                      value={dimensions.length ?? 2}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        onParametersChange({ ...parameters, length: v, breadth: v, height: v });
                      }}
                      className="w-full"
                    />
                  </>
                ) : (
                  <>
                    <label className="block text-sm mb-1">Length: {dimensions.length}</label>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={0.5}
                      value={dimensions.length ?? 3}
                      onChange={(e) => handleSliderChange('length', Number(e.target.value))}
                      className="w-full"
                    />
                    <label className="block text-sm mt-2 mb-1">Breadth: {dimensions.breadth}</label>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={0.5}
                      value={dimensions.breadth ?? 2}
                      onChange={(e) => handleSliderChange('breadth', Number(e.target.value))}
                      className="w-full"
                    />
                    <label className="block text-sm mt-2 mb-1">Height: {dimensions.height}</label>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={0.5}
                      value={dimensions.height ?? 2}
                      onChange={(e) => handleSliderChange('height', Number(e.target.value))}
                      className="w-full"
                    />
                  </>
                )}
              </div>
            )}

            {figureId === 'prism' && (
              <>
                <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                  <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Base shape</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSliderChange('baseShape', 0)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium ${(dimensions.baseShape ?? 0) < 0.5 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]'}`}
                    >
                      Triangle
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSliderChange('baseShape', 1)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium ${(dimensions.baseShape ?? 0) >= 0.5 ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)]'}`}
                    >
                      Rectangle
                    </button>
                  </div>
                </div>
                <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                  <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
                  <label className="block text-sm mb-1">Base width: {dimensions.baseWidth}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.5}
                    value={dimensions.baseWidth ?? 3}
                    onChange={(e) => handleSliderChange('baseWidth', Number(e.target.value))}
                    className="w-full"
                  />
                  <label className="block text-sm mt-2 mb-1">Base height: {dimensions.baseHeight}</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.5}
                    value={dimensions.baseHeight ?? 2}
                    onChange={(e) => handleSliderChange('baseHeight', Number(e.target.value))}
                    className="w-full"
                  />
                  <label className="block text-sm mt-2 mb-1">Prism height: {dimensions.height}</label>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={0.5}
                    value={dimensions.height ?? 4}
                    onChange={(e) => handleSliderChange('height', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {(figureId === 'cylinder' || figureId === 'cone') && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
                <label className="block text-sm mb-1">Radius: {dimensions.radius}</label>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.25}
                  value={dimensions.radius ?? 1.5}
                  onChange={(e) => handleSliderChange('radius', Number(e.target.value))}
                  className="w-full"
                />
                <label className="block text-sm mt-2 mb-1">Height: {dimensions.height}</label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={0.5}
                  value={dimensions.height ?? 3}
                  onChange={(e) => handleSliderChange('height', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {figureId === 'sphere' && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
                <label className="block text-sm mb-1">Radius: {dimensions.radius}</label>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.25}
                  value={dimensions.radius ?? 1.5}
                  onChange={(e) => handleSliderChange('radius', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            {showFacePairs && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Face pairs</h3>
                {FACE_PAIRS.map((pair) => {
                  const isOn = visiblePairs.has(pair.id);
                  const area = faces ? faces.filter((f) => pair.faces.includes(f.id)).reduce((s, f) => s + f.area, 0) : 0;
                  return (
                    <div key={pair.id} className="flex items-center justify-between gap-2 py-1">
                      <label className="flex items-center gap-2 cursor-pointer text-sm flex-1">
                        <input type="checkbox" checked={isOn} onChange={() => togglePair(pair.id)} />
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
            )}

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
                    {mode === '3d' ? '3D View' : figureId === 'sphere' ? 'Strip approximation' : 'Unfold (Net)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Surface area</h3>
              <p className="text-sm font-medium text-[var(--color-primary)]">{surfaceArea.toFixed(1)} sq units</p>
              <p className="text-xs mt-1 text-[var(--color-text-muted)]">{formula}</p>
            </div>
          </aside>

          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">
              {viewMode === '3d' ? '3D View — Drag to rotate' : figureId === 'sphere' ? 'Strip approximation' : 'Net (Unfolded)'}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {viewMode === '3d' ? (
                <Solids3DCanvas
                  kind={kind}
                  dimensions={dimensions}
                  bounds={bounds}
                  width={450}
                  heightPx={400}
                  visibleFaces={showFacePairs && visibleFaces.size < 6 ? visibleFaces : undefined}
                  highlightedPairs={highlightedPairsSet}
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
