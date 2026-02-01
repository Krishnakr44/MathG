/**
 * MathG — Math Expression Parser
 * Converts teacher-entered equations into validated, evaluatable functions
 * NO eval, NO UI — pure parsing and evaluation
 */

import { createExpressionParser } from '../parser/expression-parser';
import { createExpressionEvaluator } from '../evaluator/evaluator';
import { normalizeExpression } from './normalize';
import { validateExpression } from './validate';
import { computeDomainInfo } from './domain';
import type { ParserResult } from './types';
import type { ASTNode } from '@/core/types/math-engine.types';

const parser = createExpressionParser();
const evaluator = createExpressionEvaluator();

/**
 * Parse teacher-entered equation into evaluatable function.
 * Returns structured result for graph visualization.
 *
 * @param input - Raw teacher input (e.g., "y = sin(x)", "sinx + 1", "x^2 + 2x")
 * @returns ParserResult with normalizedExpression, evaluate(x), domainInfo, errors?
 */
export function parseMathExpression(input: string): ParserResult {
  const errors: string[] = [];

  // 1. Normalize
  const { normalized, error: normError } = normalizeExpression(input);
  if (normError) {
    return createErrorResult(input, [normError]);
  }

  if (!normalized.trim()) {
    return createErrorResult(input, ['Empty expression']);
  }

  // 2. Parse to AST (parser expects RHS; normalized is RHS)
  const parseResult = parser.parse(normalized);
  let ast: ASTNode | null = null;

  if (parseResult.ok) {
    ast = parseResult.value;
  } else {
    errors.push(parseResult.error);
  }

  // 3. Validate
  const { valid, errors: validationErrors } = validateExpression(normalized, ast);
  if (!valid) {
    errors.push(...validationErrors);
  }

  // 4. If any errors, return error result
  if (errors.length > 0) {
    return createErrorResult(normalized, errors);
  }

  // 5. Compute domain info
  const domainInfo = computeDomainInfo(ast);

  // 6. Create safe evaluate function
  const evaluate = (x: number, params: Record<string, number> = {}): number | undefined => {
    if (!ast) return undefined;
    const result = evaluator.evaluate(ast, x, params);
    if (!Number.isFinite(result)) return undefined;
    if (result === Infinity || result === -Infinity) return undefined;
    return result;
  };

  return {
    normalizedExpression: normalized,
    evaluate,
    domainInfo,
  };
}

function createErrorResult(expression: string, errors: string[]): ParserResult {
  return {
    normalizedExpression: expression,
    evaluate: () => undefined,
    domainInfo: { isDefined: false, reason: errors[0] },
    errors,
  };
}

// Re-export for extension
export { normalizeExpression } from './normalize';
export { validateExpression } from './validate';
export { computeDomainInfo } from './domain';
export type { ParserResult, DomainInfo } from './types';
