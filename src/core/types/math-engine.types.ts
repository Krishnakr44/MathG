/**
 * Math Engine — Type definitions
 * Parser, evaluator, domain validator
 */

import type { MathResult } from './index.types';

// ─── AST (Abstract Syntax Tree) ──────────────────────────────────────────────
export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; arg: ASTNode }
  | { type: 'function'; name: string; args: ASTNode[] }
  | { type: 'paren'; inner: ASTNode };

// ─── Parser Interface ───────────────────────────────────────────────────────
export interface IExpressionParser {
  parse(expression: string): MathResult<ASTNode>;
}

// ─── Evaluator Interface ─────────────────────────────────────────────────────
export interface IExpressionEvaluator {
  evaluate(ast: ASTNode, x: number, params?: Record<string, number>): number;
}

// ─── Domain Validator (e.g., cosec undefined at nπ) ──────────────────────────
export interface IDomainValidator {
  getUndefinedPoints(
    ast: ASTNode,
    xMin: number,
    xMax: number
  ): number[];
}

// ─── Function Registry Entry ─────────────────────────────────────────────────
export interface FunctionDef {
  name: string;
  arity: number;
  eval: (args: number[]) => number;
  domainCheck?: (args: number[]) => boolean; // false = undefined
}
