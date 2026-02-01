/**
 * Expression Parser — Algebraic + trigonometric
 * Supports: y = x + 2, y = sin(x), y = a*sin(x) + b, etc.
 */

import type { MathResult } from '@/core/types';
import type { ASTNode, IExpressionParser } from '@/core/types/math-engine.types';

const TRIG_FUNCTIONS = ['sin', 'cos', 'tan', 'sec', 'cosec', 'cot', 'sqrt', 'abs', 'log', 'exp'];

export function createExpressionParser(): IExpressionParser {
  return {
    parse(expression: string): MathResult<ASTNode> {
      const trimmed = expression.trim();
      if (!trimmed) {
        return { ok: false, error: 'Empty expression' };
      }
      try {
        // Handle "y = expr" format — extract right-hand side
        const eqIndex = trimmed.indexOf('=');
        const expr = eqIndex >= 0 ? trimmed.slice(eqIndex + 1).trim() : trimmed;
        const ast = parseExpr(expr, 0).node;
        return { ok: true, value: ast };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : 'Parse error',
          code: 'PARSE_ERROR',
        };
      }
    },
  };
}

interface ParseResult {
  node: ASTNode;
  end: number;
}

function parseExpr(s: string, i: number): ParseResult {
  let result = parseAddSub(s, i);
  return result;
}

function skipSp(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

function parseAddSub(s: string, i: number): ParseResult {
  let left = parseMulDiv(s, i);
  i = left.end;

  while (i < s.length) {
    i = skipSp(s, i);
    if (i >= s.length) break;
    const c = s[i];
    if (c === '+') {
      i++;
      const right = parseMulDiv(s, i);
      left = { node: { type: 'binary', op: '+', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else if (c === '-') {
      i++;
      const right = parseMulDiv(s, i);
      left = { node: { type: 'binary', op: '-', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else {
      break;
    }
  }
  return { ...left, end: i };
}

function parseMulDiv(s: string, i: number): ParseResult {
  let left = parsePower(s, i);
  i = left.end;

  while (i < s.length) {
    i = skipSp(s, i);
    if (i >= s.length) break;
    const c = s[i];
    if (c === '*') {
      i++;
      const right = parsePower(s, i);
      left = { node: { type: 'binary', op: '*', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else if (c === '/') {
      i++;
      const right = parsePower(s, i);
      left = { node: { type: 'binary', op: '/', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else if (c === ' ' && i + 1 < s.length && /[a-z0-9(]/.test(s[i + 1])) {
      i++;
      const right = parsePower(s, i);
      left = { node: { type: 'binary', op: '*', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else if (/[a-zA-Z(]/.test(c)) {
      // Implicit multiplication: 2x, 2sin(x), (x+1)(x-1)
      const right = parsePower(s, i);
      left = { node: { type: 'binary', op: '*', left: left.node, right: right.node }, end: right.end };
      i = right.end;
    } else {
      break;
    }
  }
  return { ...left, end: i };
}

function parsePower(s: string, i: number): ParseResult {
  let base = parseUnary(s, i);
  i = base.end;

  if (i < s.length && s[i] === '^') {
    i++;
    const exp = parseUnary(s, i);
    base = { node: { type: 'binary', op: '^', left: base.node, right: exp.node }, end: exp.end };
    i = exp.end;
  }
  return { ...base, end: i };
}

function parseUnary(s: string, i: number): ParseResult {
  i = skipSp(s, i);
  if (i < s.length && s[i] === '-') {
    i++;
    const arg = parseUnary(s, i);
    return { node: { type: 'unary', op: '-', arg: arg.node }, end: arg.end };
  }
  return parsePrimary(s, i);
}

function parsePrimary(s: string, i: number): ParseResult {
  i = skipSp(s, i);
  if (i >= s.length) throw new Error('Unexpected end');

  // Number
  const numMatch = s.slice(i).match(/^-?\d+\.?\d*/);
  if (numMatch) {
    const val = parseFloat(numMatch[0]);
    return { node: { type: 'number', value: val }, end: i + numMatch[0].length };
  }

  // Function call: sin(x), cos(x), etc.
  for (const fn of TRIG_FUNCTIONS) {
    if (s.slice(i).startsWith(fn)) {
      i = skipSp(s, i + fn.length);
      if (i >= s.length || s[i] !== '(') throw new Error(`Expected ( after ${fn}`);
      const arg = parseExpr(s, i + 1);
      i = skipSp(s, arg.end);
      if (i >= s.length || s[i] !== ')') throw new Error('Expected )');
      i++;
      return { node: { type: 'function', name: fn, args: [arg.node] }, end: i };
    }
  }

  // Variable: x, a, b, c, pi
  const varMatch = s.slice(i).match(/^([a-zA-Z][a-zA-Z0-9]*)/);
  if (varMatch) {
    const name = varMatch[1];
    if (name === 'pi') {
      return { node: { type: 'number', value: Math.PI }, end: i + name.length };
    }
    return { node: { type: 'variable', name }, end: i + name.length };
  }

  // Parentheses
  if (s[i] === '(') {
    i = skipSp(s, i + 1);
    const inner = parseExpr(s, i);
    i = skipSp(s, inner.end);
    if (i >= s.length || s[i] !== ')') throw new Error('Expected )');
    i++;
    return { node: { type: 'paren', inner: inner.node }, end: i };
  }

  throw new Error(`Unexpected character at position ${i}: ${s[i]}`);
}
