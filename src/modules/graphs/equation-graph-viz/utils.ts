/**
 * Equation & Graph Viz — Utilities
 * Safe evaluation, param extraction, step params
 */

import { createExpressionParser } from '@/engines/math/parser/expression-parser';
import type { ASTNode } from '@/core/types/math-engine.types';

const parser = createExpressionParser();

const RESERVED = new Set(['x', 'pi']);

export function parseEquation(equation: string): { ast: ASTNode | null; error: string | null } {
  const result = parser.parse(equation);
  if (result.ok) return { ast: result.value, error: null };
  return { ast: null, error: result.error };
}

export function extractParams(ast: ASTNode | null): string[] {
  if (!ast) return [];
  const params: string[] = [];
  function collect(node: ASTNode) {
    if (node.type === 'variable' && !RESERVED.has(node.name) && !params.includes(node.name)) {
      params.push(node.name);
    }
    if ('left' in node && node.left) collect(node.left);
    if ('right' in node && node.right) collect(node.right);
    if ('arg' in node && node.arg) collect(node.arg);
    if ('inner' in node && node.inner) collect(node.inner);
    if ('args' in node && node.args) node.args.forEach(collect);
  }
  collect(ast);
  return params;
}

export function getStepParams(
  paramNames: string[],
  paramValues: Record<string, number>,
  step: 'base' | 'transform' | 'final'
): Record<string, number> {
  const result: Record<string, number> = {};
  for (let i = 0; i < paramNames.length; i++) {
    const name = paramNames[i];
    const val = paramValues[name] ?? 1;
    if (step === 'base') {
      result[name] = i === 0 ? 1 : 0;
    } else if (step === 'transform') {
      result[name] = i === 0 ? val : 0;
    } else {
      result[name] = val;
    }
  }
  return result;
}
