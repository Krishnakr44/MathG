'use client';

/**
 * StepByStepView — Base → Transform → Final
 */

import type { VizStep } from './types';

export interface StepByStepViewProps {
  step: VizStep;
  onStepChange: (step: VizStep) => void;
  className?: string;
}

const STEPS: { id: VizStep; label: string }[] = [
  { id: 'base', label: '1. Base' },
  { id: 'transform', label: '2. Transform' },
  { id: 'final', label: '3. Final' },
];

export function StepByStepView({ step, onStepChange, className = '' }: StepByStepViewProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Step-by-step</label>
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepChange(s.id)}
            className={`px-3 py-1.5 text-sm rounded ${
              step === s.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
