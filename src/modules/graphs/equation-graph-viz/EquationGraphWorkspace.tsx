'use client';

/**
 * EquationGraphWorkspace — Main workspace for Equation & Graph Viz module
 * Integrates: equation input, sliders, step-by-step, graph, teacher utilities
 */

import { useState, useCallback, useMemo } from 'react';
import { GraphCanvas } from '@/engines/visualization/components/GraphCanvas';
import { getVisualizationAction, getMistakeById } from '@/engines/mistake-bank/registry';
import { MistakeTrigger } from '@/engines/mistake-bank/components/MistakeTrigger';
import { MistakeDetailPanel } from '@/engines/mistake-bank/components/MistakeDetailPanel';
import { EquationInput } from './EquationInput';
import { ParameterSliders } from './ParameterSliders';
import { StepByStepView } from './StepByStepView';
import { TermToggles } from './TermToggles';
import { TeacherUtilities } from './TeacherUtilities';
import { parseEquation, extractParams, getStepParams } from './utils';
import type { ASTNode } from '@/core/types/math-engine.types';
import type { VizStep } from './types';
import type { Mistake } from '@/engines/mistake-bank/types';

const TWO_PI = 2 * Math.PI;
const DEFAULT_BOUNDS = { xMin: -TWO_PI, xMax: TWO_PI, yMin: -4, yMax: 4 };
const DEFAULT_EQUATION = 'y = a*sin(x) + b';
const GRAPHS_DOMAIN = 'graphs';

export interface EquationGraphWorkspaceProps {
  initialEquation?: string;
  linkedMistakes?: Mistake[] | { id: string; name: string }[];
  onMistakeSelect?: (id: string | null) => void;
}

export function EquationGraphWorkspace({
  initialEquation = DEFAULT_EQUATION,
  linkedMistakes = [],
  onMistakeSelect,
}: EquationGraphWorkspaceProps) {
  const [equation, setEquation] = useState(initialEquation);
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, number>>({ a: 1, b: 0, c: 0 });
  const [step, setStep] = useState<VizStep>('final');
  const [termVisibility, setTermVisibility] = useState<Record<string, boolean>>({});
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showIntercepts, setShowIntercepts] = useState(true);
  const [selectedMistakeId, setSelectedMistakeId] = useState<string | null>(null);

  const handleEquationChange = useCallback((eq: string, parsedAst: ASTNode | null) => {
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
  }, []);

  const paramNames = useMemo(() => (ast ? extractParams(ast) : ['a', 'b', 'c']), [ast]);

  const stepParams = useMemo(
    () => getStepParams(paramNames, paramValues, step),
    [paramNames, paramValues, step]
  );

  const handleParamChange = useCallback((id: string, value: number) => {
    setParamValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    const { ast: parsedAst } = parseEquation(DEFAULT_EQUATION);
    setEquation(DEFAULT_EQUATION);
    setAst(parsedAst);
    setParamValues({ a: 1, b: 0 });
    setStep('final');
    setSelectedMistakeId(null);
  }, []);

  const handleMistakeSelect = useCallback(
    (id: string | null) => {
      setSelectedMistakeId(id);
      onMistakeSelect?.(id);
    },
    [onMistakeSelect]
  );

  const highlightRegions = useMemo(() => {
    if (!selectedMistakeId) return [];
    const action = getVisualizationAction(selectedMistakeId, GRAPHS_DOMAIN);
    return action?.config.highlightRegions ?? [];
  }, [selectedMistakeId]);

  const sliderParams = paramNames.map((id) => ({
    id,
    label: id,
    value: paramValues[id] ?? (id === 'a' ? 1 : 0),
    min: -5,
    max: 5,
    step: 0.1,
  }));

  const terms = useMemo(() => {
    if (!equation) return [];
    const parts = equation.split(/[+=]/).map((s) => s.trim()).filter(Boolean);
    return parts.slice(1).map((p, i) => ({
      id: `term-${i}`,
      label: p,
      visible: termVisibility[`term-${i}`] ?? true,
    }));
  }, [equation, termVisibility]);

  const handleTermToggle = useCallback((id: string, visible: boolean) => {
    setTermVisibility((prev) => ({ ...prev, [id]: visible }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <EquationInput value={equation} onChange={handleEquationChange} />
          <ParameterSliders params={sliderParams} onChange={handleParamChange} />
          <StepByStepView step={step} onStepChange={setStep} />
          {terms.length > 1 && (
            <TermToggles
              terms={terms}
              onToggle={handleTermToggle}
            />
          )}
          <TeacherUtilities
            showGrid={showGrid}
            showAxes={showAxes}
            showIntercepts={showIntercepts}
            onShowGridChange={setShowGrid}
            onShowAxesChange={setShowAxes}
            onShowInterceptsChange={setShowIntercepts}
            onReset={handleReset}
            onCompare={() => {}}
          />
          <MistakeTrigger
            moduleDomain={GRAPHS_DOMAIN}
            mistakes={linkedMistakes}
            selectedId={selectedMistakeId}
            onSelect={handleMistakeSelect}
            label="Highlight misconception"
          />
          {selectedMistakeId && (
            <MistakeDetailPanel mistake={getMistakeById(selectedMistakeId) ?? null} />
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="border rounded-lg bg-white p-4 overflow-hidden">
            <p className="text-sm text-gray-600 mb-2">
              {step === 'base' && 'Base function'}
              {step === 'transform' && 'After transformation'}
              {step === 'final' && 'Final equation'}
            </p>
            <GraphCanvas
              ast={ast}
              params={stepParams}
              bounds={DEFAULT_BOUNDS}
              showGrid={showGrid}
              showAxes={showAxes}
              showIntercepts={showIntercepts}
              highlightRegions={highlightRegions}
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
