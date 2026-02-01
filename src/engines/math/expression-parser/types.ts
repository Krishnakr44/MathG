/**
 * MathG — Expression Parser Types
 * Output format for graph visualization
 */

export interface ParserResult {
  /** Normalized expression string (e.g., "sin(x) + 2*x") */
  normalizedExpression: string;
  /** Safe evaluation function f(x) — returns undefined for undefined points */
  evaluate: (x: number, params?: Record<string, number>) => number | undefined;
  /** Domain information */
  domainInfo: DomainInfo;
  /** Validation/parse errors (teacher-friendly) */
  errors?: string[];
}

export interface DomainInfo {
  /** Whether expression is defined for all x in typical range */
  isDefined: boolean;
  /** Human-readable reason when not fully defined */
  reason?: string;
  /** Undefined x values (e.g., asymptotes) */
  undefinedPoints?: number[];
  /** Undefined intervals (e.g., sqrt for x < 0) */
  undefinedIntervals?: { min: number; max: number }[];
}
