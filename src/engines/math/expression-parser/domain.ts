/**
 * MathG — Domain & Discontinuity Handling
 * Detects undefined values, returns structured info for graph rendering
 */

import type { ASTNode } from '@/core/types/math-engine.types';
import type { DomainInfo } from './types';

const TYPICAL_X_MIN = -10;
const TYPICAL_X_MAX = 10;

/** Functions with undefined points (argument-based) */
const UNDEFINED_POINTS: Record<string, (n: number) => number> = {
  tan: (n) => Math.PI / 2 + n * Math.PI,
  cosec: (n) => n * Math.PI,
  sec: (n) => Math.PI / 2 + n * Math.PI,
  cot: (n) => n * Math.PI,
};

/** Functions with undefined intervals (e.g., sqrt for x < 0) */
const UNDEFINED_INTERVALS: Record<string, (arg: ASTNode) => { min: number; max: number } | null> = {
  sqrt: () => ({ min: -Infinity, max: 0 }), // sqrt undefined for x < 0 when arg is x
  log: () => ({ min: -Infinity, max: 0 }),
};

export function computeDomainInfo(ast: ASTNode | null): DomainInfo {
  if (!ast) {
    return { isDefined: false, reason: 'No expression' };
  }

  const undefinedPoints: number[] = [];
  const undefinedIntervals: { min: number; max: number }[] = [];

  collectUndefined(ast, TYPICAL_X_MIN, TYPICAL_X_MAX, undefinedPoints, undefinedIntervals);

  const hasUndefined =
    undefinedPoints.length > 0 || undefinedIntervals.length > 0;

  let reason: string | undefined;
  if (hasUndefined) {
    if (undefinedPoints.length > 0) {
      reason = `Undefined at some points (e.g., asymptotes for tan, cosec, sec, cot)`;
    } else if (undefinedIntervals.length > 0) {
      reason = `Undefined for some x values (e.g., sqrt for x < 0)`;
    }
  }

  return {
    isDefined: !hasUndefined,
    reason,
    undefinedPoints: undefinedPoints.length > 0 ? undefinedPoints : undefined,
    undefinedIntervals:
      undefinedIntervals.length > 0 ? undefinedIntervals : undefined,
  };
}

function collectUndefined(
  ast: ASTNode,
  xMin: number,
  xMax: number,
  points: number[],
  intervals: { min: number; max: number }[]
): void {
  if (ast.type === 'function' && UNDEFINED_POINTS[ast.name]) {
    const gen = UNDEFINED_POINTS[ast.name];
    for (let n = -20; n <= 20; n++) {
      const x = gen(n);
      if (x >= xMin && x <= xMax) points.push(x);
    }
  }

  if (ast.type === 'function' && UNDEFINED_INTERVALS[ast.name]) {
    const interval = UNDEFINED_INTERVALS[ast.name](ast.args[0]);
    if (interval) intervals.push(interval);
  }

  if (ast.type === 'binary' && ast.op === '/') {
    // Division by zero — undefined when right side = 0
    // Simplified: we don't solve for x here; evaluator returns NaN
  }

  if ('left' in ast && ast.left) collectUndefined(ast.left, xMin, xMax, points, intervals);
  if ('right' in ast && ast.right) collectUndefined(ast.right, xMin, xMax, points, intervals);
  if ('arg' in ast && ast.arg) collectUndefined(ast.arg, xMin, xMax, points, intervals);
  if ('inner' in ast && ast.inner) collectUndefined(ast.inner, xMin, xMax, points, intervals);
  if ('args' in ast && ast.args) {
    ast.args.forEach((a) => collectUndefined(a, xMin, xMax, points, intervals));
  }
}
