/**
 * Domain Validator — e.g., cosec undefined at nπ
 * Extension point: add domain checks per function
 */

import type { ASTNode } from '@/core/types/math-engine.types';
import type { IDomainValidator } from '@/core/types/math-engine.types';

const UNDEFINED_POINTS: Record<string, (n: number) => number> = {
  tan: (n) => Math.PI / 2 + n * Math.PI,
  cosec: (n) => n * Math.PI,
  sec: (n) => Math.PI / 2 + n * Math.PI,
  cot: (n) => n * Math.PI,
  log: () => 0,
  sqrt: () => -1, // negative x
};

export function createDomainValidator(): IDomainValidator {
  return {
    getUndefinedPoints(ast: ASTNode, xMin: number, xMax: number): number[] {
      const points: number[] = [];
      collectUndefined(ast, xMin, xMax, points);
      return Array.from(new Set(points)).sort((a, b) => a - b);
    },
  };
}

function collectUndefined(ast: ASTNode, xMin: number, xMax: number, out: number[]): void {
  if (ast.type === 'function' && UNDEFINED_POINTS[ast.name]) {
    const gen = UNDEFINED_POINTS[ast.name];
    for (let n = -20; n <= 20; n++) {
      const x = gen(n);
      if (x >= xMin && x <= xMax) out.push(x);
    }
  }
  if (ast.type === 'binary' && ast.op === '/') {
    // Division by zero — would need to solve right side = 0
  }
  if ('left' in ast && ast.left) collectUndefined(ast.left, xMin, xMax, out);
  if ('right' in ast && ast.right) collectUndefined(ast.right, xMin, xMax, out);
  if ('arg' in ast && ast.arg) collectUndefined(ast.arg, xMin, xMax, out);
  if ('inner' in ast && ast.inner) collectUndefined(ast.inner, xMin, xMax, out);
  if ('args' in ast && ast.args) {
    ast.args.forEach((a) => collectUndefined(a, xMin, xMax, out));
  }
}
