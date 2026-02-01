'use client';

/**
 * MathG — Equation Input Bar
 * Prominent, editor-like, projection-friendly
 * Live validation, clear errors, no UI crash
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import { normalizeEquationInput } from '@/engines/math/input/normalize';
import { validateAst } from '@/engines/math/input/validate';
import { parseEquation } from './utils';
import type { ASTNode } from '@/core/types/math-engine.types';

export interface EquationInputBarProps {
  value: string;
  onChange: (equation: string, ast: ASTNode | null, error: string | null) => void;
  placeholder?: string;
  className?: string;
}

const PRESETS = [
  { label: 'x + 2', eq: 'y = x + 2' },
  { label: 'sin(x)', eq: 'y = sin(x)' },
  { label: 'x² + 2x + 1', eq: 'y = x^2 + 2*x + 1' },
  { label: 'tan(x)', eq: 'y = tan(x)' },
  { label: 'a·sin(x) + b', eq: 'y = a*sin(x) + b' },
];

function getRhs(full: string): string {
  const eqIdx = full.indexOf('=');
  return eqIdx >= 0 ? full.slice(eqIdx + 1).trim() : full;
}

function toFullEquation(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  if (s.toLowerCase().startsWith('y=') || s.toLowerCase().startsWith('y =')) {
    return s;
  }
  return `y = ${s}`;
}

export function EquationInputBar({
  value,
  onChange,
  placeholder = 'f(x) — e.g. sin(x), x^2 + 1',
  className = '',
}: EquationInputBarProps) {
  const rhs = getRhs(value);
  const [localRhs, setLocalRhs] = useState(rhs);
  const [error, setError] = useState<string | null>(null);
  const [hasSyntaxError, setHasSyntaxError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processInput = useCallback(
    (raw: string) => {
      setLocalRhs(raw);

      if (!raw.trim()) {
        setError(null);
        setHasSyntaxError(false);
        onChange('', null, null);
        return;
      }

      const full = toFullEquation(raw);
      if (!full) {
        setError(null);
        setHasSyntaxError(false);
        onChange('', null, null);
        return;
      }
      const { normalized, error: normError } = normalizeEquationInput(full);
      if (normError) {
        setError(normError);
        setHasSyntaxError(true);
        onChange(full, null, normError);
        return;
      }

      const { ast, error: parseError } = parseEquation(normalized);
      if (parseError) {
        setError(parseError);
        setHasSyntaxError(true);
        onChange(normalized, null, parseError);
        return;
      }

      const { valid, error: validateError } = validateAst(ast);
      if (!valid && validateError) {
        setError(validateError);
        setHasSyntaxError(true);
        onChange(normalized, null, validateError);
        return;
      }

      setError(null);
      setHasSyntaxError(false);
      setLocalRhs(getRhs(normalized));
      onChange(normalized, ast, null);
    },
    [onChange]
  );

  useEffect(() => {
    const v = getRhs(value);
    if (v !== localRhs) setLocalRhs(v);
  }, [value]);

  const handlePreset = useCallback(
    (eq: string) => {
      processInput(eq);
      inputRef.current?.focus();
    },
    [processInput]
  );

  return (
    <div className={className}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border-2
          bg-white
          ${hasSyntaxError ? 'border-red-500 bg-red-50/30' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'}
        `}
      >
        <span className="text-xl font-medium text-gray-600 shrink-0">y =</span>
        <input
          ref={inputRef}
          type="text"
          value={localRhs}
          onChange={(e) => processInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 text-xl font-mono py-2 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-400"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      {error && (
        <p className="mt-2 text-base font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-3">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePreset(p.eq)}
            className="px-3 py-1.5 text-base bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
