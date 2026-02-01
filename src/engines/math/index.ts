/**
 * Math Engine — Public API
 * Parse, evaluate, validate mathematical expressions
 */

export { createExpressionParser } from './parser/expression-parser';
export { createExpressionEvaluator, FUNCTION_REGISTRY } from './evaluator/evaluator';
export { createDomainValidator } from './validator/domain-validator';
export { parseMathExpression } from './expression-parser';
export type { ParserResult, DomainInfo } from './expression-parser';
export type { IExpressionParser, IExpressionEvaluator, IDomainValidator } from '@/core/types';
export * from './utils';
