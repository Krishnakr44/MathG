/**
 * MathG — Equation Input Validation
 * Safe evaluation guard, no eval, no infinite loops
 */

import type { ASTNode } from '@/core/types/math-engine.types';

const MAX_AST_DEPTH = 50;
const MAX_AST_NODES = 500;

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

/**
 * Validate AST before evaluation — prevent unsafe or degenerate cases
 */
export function validateAst(ast: ASTNode | null): ValidationResult {
  if (!ast) return { valid: false, error: 'No expression' };

  let nodeCount = 0;
  let maxDepth = 0;

  function walk(node: ASTNode, depth: number): void {
    nodeCount++;
    if (nodeCount > MAX_AST_NODES) return;
    if (depth > maxDepth) maxDepth = depth;
    if (depth > MAX_AST_DEPTH) return;

    if ('left' in node && node.left) walk(node.left, depth + 1);
    if ('right' in node && node.right) walk(node.right, depth + 1);
    if ('arg' in node && node.arg) walk(node.arg, depth + 1);
    if ('inner' in node && node.inner) walk(node.inner, depth + 1);
    if ('args' in node && node.args) node.args.forEach((a) => walk(a, depth + 1));
  }

  walk(ast, 0);

  if (nodeCount > MAX_AST_NODES) {
    return { valid: false, error: 'Expression too complex' };
  }
  if (maxDepth > MAX_AST_DEPTH) {
    return { valid: false, error: 'Expression too deeply nested' };
  }

  return { valid: true, error: null };
}
