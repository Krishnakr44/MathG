/**
 * MathG — Expression Validation
 * Validates before evaluation — teacher-friendly errors
 */

import type { ASTNode } from '@/core/types/math-engine.types';

const ALLOWED_FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'sec', 'cosec', 'cot',
  'sqrt', 'abs', 'log', 'exp',
]);

const ALLOWED_VARIABLES = new Set(['x', 'a', 'b', 'c', 'd', 'm', 'k']);
const ALLOWED_CONSTANTS = new Set(['pi']);
const MAX_EXPRESSION_LENGTH = 500;
const MAX_NESTING_DEPTH = 30;
const MAX_NODE_COUNT = 200;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateExpression(expr: string, ast: ASTNode | null): ValidationResult {
  const errors: string[] = [];

  if (!expr.trim()) {
    errors.push('Expression is empty');
    return { valid: false, errors };
  }

  if (expr.length > MAX_EXPRESSION_LENGTH) {
    errors.push(`Expression too long (max ${MAX_EXPRESSION_LENGTH} characters)`);
  }

  if (!ast) {
    errors.push('Could not parse expression');
    return { valid: false, errors };
  }

  // Balanced parentheses (handled by parser, but double-check)
  const open = (expr.match(/\(/g) || []).length;
  const close = (expr.match(/\)/g) || []).length;
  if (open !== close) {
    errors.push('Unbalanced parentheses');
  }

  // Validate AST
  let nodeCount = 0;
  let maxDepth = 0;

  function walk(node: ASTNode, depth: number): void {
    nodeCount++;
    if (depth > maxDepth) maxDepth = depth;

    if (nodeCount > MAX_NODE_COUNT) return;
    if (depth > MAX_NESTING_DEPTH) return;

    switch (node.type) {
      case 'variable':
        if (!ALLOWED_VARIABLES.has(node.name) && !ALLOWED_CONSTANTS.has(node.name.toLowerCase())) {
          errors.push(`Variable "${node.name}" not allowed. Use x or constants (a, b, c, m, k).`);
        }
        break;
      case 'function':
        if (!ALLOWED_FUNCTIONS.has(node.name.toLowerCase())) {
          errors.push(`Function "${node.name}" not supported.`);
        }
        node.args.forEach((a) => walk(a, depth + 1));
        break;
      case 'binary':
        if (!['+', '-', '*', '/', '^'].includes(node.op)) {
          errors.push(`Operator "${node.op}" not supported.`);
        }
        walk(node.left, depth + 1);
        walk(node.right, depth + 1);
        break;
      case 'unary':
        walk(node.arg, depth + 1);
        break;
      case 'paren':
        walk(node.inner, depth + 1);
        break;
      case 'number':
        if (!Number.isFinite(node.value)) {
          errors.push('Invalid number in expression');
        }
        break;
    }
  }

  walk(ast, 0);

  if (nodeCount > MAX_NODE_COUNT) {
    errors.push('Expression too complex');
  }
  if (maxDepth > MAX_NESTING_DEPTH) {
    errors.push('Expression nesting too deep');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
