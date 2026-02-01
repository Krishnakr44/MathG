'use client';

/**
 * MathG — Area Learning Workspace
 * Reusable workspace for any shape implementing IShapeModule
 * Teacher controls: layers, sliders, formula reveal, predict mode
 */

import { useState, useCallback } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { CoverageCanvas } from '@/engines/geometry-viz/CoverageCanvas';
import {
  type IShapeModule,
  type ShapeDimensions,
  type LearningLayer,
  LAYER_NAMES,
  computeGeometry,
  simulateCoverage,
  getFormulaMapping,
  INITIAL_PEDAGOGY_STATE,
  canAdvanceLayer,
  canGoBackLayer,
} from '@/engines/area-learning';
import type { CoverageUnit } from '@/core/types/geometry.types';

export interface AreaLearningWorkspaceProps {
  shape: IShapeModule;
  title: string;
  backHref?: string;
}

export function AreaLearningWorkspace({
  shape,
  title,
  backHref = '/',
}: AreaLearningWorkspaceProps) {
  const dimDefs = shape.defineDimensions();
  const [dimensions, setDimensions] = useState<ShapeDimensions>(() => {
    const d: ShapeDimensions = {};
    dimDefs.forEach((def) => { d[def.id] = def.defaultValue; });
    return d;
  });
  const [currentLayer, setCurrentLayer] = useState<LearningLayer>(1);
  const [formulaRevealed, setFormulaRevealed] = useState(false);
  const [predictMode, setPredictMode] = useState(false);
  const [resolution, setResolution] = useState(shape.surfaceType === 'curved' ? 8 : 1);

  const handleSliderChange = useCallback((id: string, value: number) => {
    setDimensions((d) => ({ ...d, [id]: value }));
  }, []);

  const geo = computeGeometry(shape, dimensions);
  const coverage = simulateCoverage(shape, dimensions, resolution);
  const pedagogyState = {
    ...INITIAL_PEDAGOGY_STATE,
    currentLayer,
    formulaRevealed,
    predictMode,
  };
  const formulaMapping = getFormulaMapping(shape, dimensions, pedagogyState);

  const coverageUnits: CoverageUnit[] = coverage.units.map((u) => ({
    x: u.x,
    y: u.y,
    width: u.width,
    height: u.height,
    label: u.count !== undefined ? String(u.count) : undefined,
  }));

  return (
    <AppLayout header={{ title, showBack: true, backHref }}>
      <div className="flex flex-col min-h-[calc(100vh-var(--header-height))] p-4 gap-4">
        <div className="flex flex-wrap gap-4 items-start">
          <aside className="w-72 shrink-0 space-y-4">
            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Dimensions</h3>
              {dimDefs.map((def) => (
                <div key={def.id} className="mb-3">
                  <label className="block text-sm mb-1">{def.label}: {dimensions[def.id] ?? def.defaultValue}</label>
                  <input
                    type="range"
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    value={dimensions[def.id] ?? def.defaultValue}
                    onChange={(e) => handleSliderChange(def.id, Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Learning Layer</h3>
              <p className="text-sm text-[var(--color-primary)] font-medium mb-2">
                {LAYER_NAMES[currentLayer]}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentLayer((l) => Math.max(1, l - 1) as LearningLayer)}
                  disabled={!canGoBackLayer(currentLayer)}
                  className="px-3 py-1.5 text-sm rounded bg-[var(--color-surface)] disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLayer((l) => Math.min(6, l + 1) as LearningLayer)}
                  disabled={!canAdvanceLayer(currentLayer)}
                  className="px-3 py-1.5 text-sm rounded bg-[var(--color-surface)] disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>

            {shape.surfaceType === 'curved' && (
              <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
                <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Resolution</h3>
                <input
                  type="range"
                  min={4}
                  max={32}
                  step={2}
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm mt-1">{resolution} sectors</p>
              </div>
            )}

            <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-surface)]">
              <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">Area</h3>
              {predictMode ? (
                <p className="text-sm text-[var(--color-text-muted)]">Predict first, then reveal</p>
              ) : (
                <p className="text-sm font-medium text-[var(--color-primary)]">
                  {geo.area.toFixed(2)} sq units
                </p>
              )}
            </div>

            {currentLayer >= 5 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formulaRevealed}
                    onChange={(e) => setFormulaRevealed(e.target.checked)}
                  />
                  Show formula
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={predictMode}
                    onChange={(e) => setPredictMode(e.target.checked)}
                  />
                  Predict mode (hide result)
                </label>
              </div>
            )}
          </aside>

          <section className="flex-1 min-w-0 p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-base font-semibold mb-2 text-[var(--color-text)]">
              Layer {currentLayer}: {LAYER_NAMES[currentLayer]}
            </h3>
            <div className="flex items-center justify-center min-h-[400px]">
              {(currentLayer === 1 || currentLayer === 3 || currentLayer === 4) && (
                <CoverageCanvas
                  units={coverageUnits}
                  showCount={currentLayer >= 3}
                  showFormula={formulaRevealed && currentLayer >= 5}
                  formula={formulaMapping?.formula ?? ''}
                  area={predictMode ? 0 : geo.area}
                  width={500}
                  height={400}
                />
              )}
              {currentLayer === 2 && shape.is3D && (
                <p className="text-[var(--color-text-muted)]">Net view (3D shapes)</p>
              )}
              {currentLayer === 2 && !shape.is3D && (
                <CoverageCanvas
                  units={coverageUnits}
                  showCount
                  showFormula={false}
                  area={geo.area}
                  width={500}
                  height={400}
                />
              )}
              {(currentLayer === 5 || currentLayer === 6) && (
                <CoverageCanvas
                  units={coverageUnits}
                  showCount
                  showFormula={formulaRevealed}
                  formula={formulaMapping?.formula ?? ''}
                  area={predictMode ? 0 : geo.area}
                  width={500}
                  height={400}
                />
              )}
            </div>
            {formulaMapping && formulaRevealed && (
              <div className="mt-4 p-3 bg-[var(--color-surface)] rounded text-sm">
                <p className="font-medium text-[var(--color-primary)]">{formulaMapping.formula}</p>
                {formulaMapping.terms.length > 0 && (
                  <p className="text-[var(--color-text-muted)] mt-1">
                    Terms: {formulaMapping.terms.map((t) => t.term).join(', ')}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
