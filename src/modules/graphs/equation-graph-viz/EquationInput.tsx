'use client';

/**
 * EquationInput — Accept equations like y = x + 2, y = sin(x), y = a*sin(x) + b
 */

import { useState, useCallback } from 'react';
import { parseEquation } from './utils';

export interface EquationInputProps {
  value: string;
  onChange: (equation: string, ast: import('@/core/types/math-engine.types').ASTNode | null) => void;
  placeholder?: string;
  className?: string;
}

const PRESETS = [
  { label: 'Linear', eq: 'y = a*x + b' },
  { label: 'Sine', eq: 'y = sin(x)' },
  { label: 'Sine + shift', eq: 'y = a*sin(x) + b' },
  { label: 'Cosine', eq: 'y = cos(x)' },
  { label: 'Tangent', eq: 'y = tan(x)' },
  { label: 'Quadratic', eq: 'y = a*x^2 + b*x + c' },
];

export function EquationInput({ value, onChange, placeholder = 'y = ...', className = '' }: EquationInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (eq: string) => {
      const { ast, error: err } = parseEquation(eq);
      setError(err);
      onChange(eq, ast);
    },
    [onChange]
  );

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Equation</label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handleChange(p.eq)}
            className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
