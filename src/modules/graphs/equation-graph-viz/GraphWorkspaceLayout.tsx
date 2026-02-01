'use client';

/**
 * MathG — Graph Workspace Layout
 * Projection-friendly, one-screen workflow
 * Top: Equation bar | Left: Controls | Right: Graph | Bottom: Collapsible hints
 */

import { useState, useCallback, useEffect } from 'react';
import { AppLayout } from '@/ui/layout/AppLayout';
import { EquationInputBar } from './EquationInputBar';
import { GraphCanvas } from '@/engines/visualization/components/GraphCanvas';
import { ParameterSliders } from './ParameterSliders';
import { StepByStepView } from './StepByStepView';
import { TermToggles } from './TermToggles';
import { MistakeTrigger } from '@/engines/mistake-bank/components/MistakeTrigger';
import { MistakeDetailPanel } from '@/engines/mistake-bank/components/MistakeDetailPanel';
import { getVisualizationAction, getMistakeById } from '@/engines/mistake-bank/registry';
import { parseEquation, extractParams, getStepParams } from './utils';
import type { ASTNode } from '@/core/types/math-engine.types';
import type { VizStep } from './types';
import type { Mistake } from '@/engines/mistake-bank/types';

const TWO_PI = 2 * Math.PI;
const DEFAULT_BOUNDS = { xMin: -TWO_PI, xMax: TWO_PI, yMin: -4, yMax: 4 };
const DEFAULT_EQUATION = 'y = sin(x)';
const GRAPHS_DOMAIN = 'graphs';

export interface GraphWorkspaceLayoutProps {
  initialEquation?: string;
  linkedMistakes?: Mistake[] | { id: string; name: string }[];
}

export function GraphWorkspaceLayout({
  initialEquation = DEFAULT_EQUATION,
  linkedMistakes = [],
}: GraphWorkspaceLayoutProps) {
  const [equation, setEquation] = useState(initialEquation);
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, number>>({ a: 1, b: 0, c: 0 });
  const [step, setStep] = useState<VizStep>('final');
  const [termVisibility, setTermVisibility] = useState<Record<string, boolean>>({});
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showIntercepts, setShowIntercepts] = useState(true);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);

  useEffect(() => {
    if (initialEquation) {
      const { ast: parsedAst } = parseEquation(initialEquation);
      setEquation(initialEquation);
      setAst(parsedAst);
      if (parsedAst) {
        const params = extractParams(parsedAst);
        const vals: Record<string, number> = {};
        params.forEach((p, i) => {
          vals[p] = i === 0 ? 1 : 0;
        });
        setParamValues(vals);
      }
    }
  }, [initialEquation]);

  const handleEquationChange = useCallback(
    (eq: string, parsedAst: ASTNode | null, _error: string | null) => {
      setEquation(eq);
      setAst(parsedAst);
      if (parsedAst) {
        const params = extractParams(parsedAst);
        setParamValues((prev) => {
          const next = { ...prev };
          params.forEach((p, i) => {
            if (next[p] === undefined) next[p] = i === 0 ? 1 : 0;
          });
          return next;
        });
      }
    },
    []
  );

  const paramNames = ast ? extractParams(ast) : [];
  const stepParams = getStepParams(paramNames, paramValues, step);

  const handleReset = useCallback(() => {
    const { ast: parsedAst } = parseEquation(DEFAULT_EQUATION);
    setEquation(DEFAULT_EQUATION);
    setAst(parsedAst);
    setParamValues({});
    setStep('final');
    setSelectedMistakeId(null);
  }, []);

  const highlightRegions = selectedMistakeId
    ? (getVisualizationAction(selectedMistakeId, GRAPHS_DOMAIN)?.config.highlightRegions ?? [])
    : [];

  const sliderParams = paramNames.map((id) => ({
    id,
    label: id,
    value: paramValues[id] ?? (id === 'a' ? 1 : 0),
    min: -5,
    max: 5,
    step: 0.1,
  }));

  const terms = equation
    ? equation
        .split(/[+=]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(1)
        .map((p, i) => ({
          id: `term-${i}`,
          label: p,
          visible: termVisibility[`term-${i}`] ?? true,
        }))
    : [];

  const selectedMistake = selectedMistakeId ? getMistakeById(selectedMistakeId) : null;

  return (
    <AppLayout
      header={{
        title: 'Equation & Graph Visualizer',
        showBack: true,
        backHref: '/',
        onReset: handleReset,
      }}
    >
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      {/* Top: Equation input bar — prominent, editor-like */}
      <header className="shrink-0 px-4 py-4 bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <EquationInputBar value={equation} onChange={handleEquationChange} />
      </header>

      {/* Main: Left controls + Right graph */}
      <main className="flex-1 flex min-h-0 p-4 gap-4">
        {/* Left: Controls & transformations */}
        <aside className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto">
          <div className="space-y-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full px-4 py-2 text-base font-medium bg-[var(--color-surface)] hover:bg-[var(--color-border)] text-[var(--color-text)] rounded-[var(--btn-radius)] transition-colors"
          >
            Reset
          </button>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-base">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                Grid
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-base">
                <input
                  type="checkbox"
                  checked={showAxes}
                  onChange={(e) => setShowAxes(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                Axes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-base">
                <input
                  type="checkbox"
                  checked={showIntercepts}
                  onChange={(e) => setShowIntercepts(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                Intercepts
              </label>
            </div>
          </div>
          {sliderParams.length > 0 && (
            <ParameterSliders params={sliderParams} onChange={(id, v) => setParamValues((p) => ({ ...p, [id]: v }))} />
          )}
          <StepByStepView step={step} onStepChange={setStep} />
          {terms.length > 1 && (
            <TermToggles
              terms={terms}
              onToggle={(id, v) => setTermVisibility((p) => ({ ...p, [id]: v }))}
            />
          )}
          {linkedMistakes.length > 0 && (
            <MistakeTrigger
              moduleDomain={GRAPHS_DOMAIN}
              mistakes={linkedMistakes}
              selectedId={selectedMistakeId}
              onSelect={setSelectedMistakeId}
              label="Misconception"
            />
          )}
        </aside>

        {/* Right: Graph canvas */}
        <section className="flex-1 min-w-0 flex flex-col bg-[var(--color-background)] rounded-[var(--btn-radius)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
            <span className="text-base font-medium text-[var(--color-text-muted)]">
              {step === 'base' && 'Base function'}
              {step === 'transform' && 'Transformation'}
              {step === 'final' && 'Final equation'}
            </span>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center min-h-[400px]">
            <GraphCanvas
              ast={ast}
              params={stepParams}
              bounds={DEFAULT_BOUNDS}
              showGrid={showGrid}
              showAxes={showAxes}
              showIntercepts={showIntercepts}
              highlightRegions={highlightRegions}
              width={800}
              height={500}
              className="max-w-full max-h-full"
            />
          </div>
        </section>
      </main>

      {/* Bottom: Collapsible mistake hints */}
      {selectedMistake && (
        <footer className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-primary-muted)]">
          <button
            type="button"
            onClick={() => setHintsOpen((o) => !o)}
            className="w-full px-4 py-3 text-left text-base font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors flex items-center justify-between"
          >
            <span>Mistake hints & teacher script</span>
            <span className="text-2xl">{hintsOpen ? '−' : '+'}</span>
          </button>
          {hintsOpen && (
            <div className="px-4 pb-4">
              <MistakeDetailPanel mistake={selectedMistake} />
            </div>
          )}
        </footer>
      )}
    </div>
    </AppLayout>
  );
}
