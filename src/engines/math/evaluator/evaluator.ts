/**
 * Expression Evaluator — Symbolic + numeric
 * Extension point: FUNCTION_REGISTRY for new functions
 */

import type { ASTNode } from '@/core/types/math-engine.types';
import type { IExpressionEvaluator } from '@/core/types/math-engine.types';

export const FUNCTION_REGISTRY: Record<string, (args: number[]) => number> = {
  sin: ([a]) => Math.sin(a),
  cos: ([a]) => Math.cos(a),
  tan: ([a]) => Math.tan(a),
  cosec: ([a]) => {
    const s = Math.sin(a);
    if (Math.abs(s) < 1e-10) return NaN;
    return 1 / s;
  },
  sec: ([a]) => {
    const c = Math.cos(a);
    if (Math.abs(c) < 1e-10) return NaN;
    return 1 / c;
  },
  cot: ([a]) => {
    const t = Math.tan(a);
    if (Math.abs(t) < 1e-10) return NaN;
    return 1 / t;
  },
  sqrt: ([a]) => Math.sqrt(a),
  abs: ([a]) => Math.abs(a),
  log: ([a]) => Math.log(a),
  exp: ([a]) => Math.exp(a),
};

export function createExpressionEvaluator(): IExpressionEvaluator {
  return {
    evaluate(ast: ASTNode, x: number, params: Record<string, number> = {}): number {
      return evalNode(ast, { x, ...params });
    },
  };
}

function evalNode(ast: ASTNode, ctx: Record<string, number>): number {
  switch (ast.type) {
    case 'number':
      return ast.value;
    case 'variable':
      return ctx[ast.name] ?? 0;
    case 'binary': {
      const l = evalNode(ast.left, ctx);
      const r = evalNode(ast.right, ctx);
      switch (ast.op) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return r === 0 ? NaN : l / r;
        case '^': return Math.pow(l, r);
        default: return NaN;
      }
    }
    case 'unary':
      return -evalNode(ast.arg, ctx);
    case 'function': {
      const fn = FUNCTION_REGISTRY[ast.name];
      if (!fn) return NaN;
      const args = ast.args.map((a) => evalNode(a, ctx));
      return fn(args);
    }
    case 'paren':
      return evalNode(ast.inner, ctx);
    default:
      return NaN;
  }
}
