/**
 * MathG — Linear Equation Utilities
 * ax + by + c = 0 ↔ y = mx + c
 * Intersection of two lines
 */

export interface LinearFormGeneral {
  a: number;
  b: number;
  c: number;
}

export interface LinearFormSlopeIntercept {
  m: number;
  c: number;
}

/** Convert ax + by + c = 0 to y = mx + c (when b ≠ 0) */
export function generalToSlopeIntercept(
  a: number,
  b: number,
  c: number
): LinearFormSlopeIntercept | null {
  if (b === 0) return null;
  return {
    m: -a / b,
    c: -c / b,
  };
}

/** Convert y = mx + c to ax + by + c = 0 (normalized: a, b, c integers where possible) */
export function slopeInterceptToGeneral(m: number, c: number): LinearFormGeneral {
  return { a: m, b: -1, c: c };
}

/** Evaluate y = mx + c at x */
export function evaluateLinear(m: number, c: number, x: number): number {
  return m * x + c;
}

/** Find intersection of two lines: y = m1*x + c1 and y = m2*x + c2 */
export interface LineIntersection {
  x: number;
  y: number;
  type: 'one' | 'none' | 'infinite';
}

export function intersectLines(
  m1: number,
  c1: number,
  m2: number,
  c2: number
): LineIntersection {
  if (Math.abs(m1 - m2) < 1e-10) {
    // Parallel or coincident
    if (Math.abs(c1 - c2) < 1e-10) {
      return { x: 0, y: c1, type: 'infinite' };
    }
    return { x: NaN, y: NaN, type: 'none' };
  }
  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return { x, y, type: 'one' };
}

/** Parse "ax + by + c = 0" or "y = mx + c" style input */
export function parseLinearEquation(input: string): {
  m: number;
  c: number;
  error: string | null;
} {
  const s = input.trim().toLowerCase();
  if (!s) return { m: 0, c: 0, error: 'Empty equation' };

  // Try y = mx + c
  const slopeMatch = s.match(/y\s*=\s*(-?\d*\.?\d*)\s*\*?\s*x\s*([+-]\s*\d+\.?\d*)?/);
  if (slopeMatch) {
    const m = slopeMatch[1] === '' || slopeMatch[1] === '-' ? (slopeMatch[1] === '-' ? -1 : 1) : parseFloat(slopeMatch[1]);
    const c = slopeMatch[2] ? parseFloat(slopeMatch[2].replace(/\s/g, '')) : 0;
    return { m, c, error: null };
  }

  // Try ax + by + c = 0 (simplified: assume normalized)
  const parts = s.split('=');
  if (parts.length !== 2) return { m: 0, c: 0, error: 'Invalid format. Use y = mx + c or ax + by + c = 0' };

  const lhs = parts[0].trim();
  const rhs = parseFloat(parts[1].trim()) || 0;

  // Simple ax + by = c → y = (c - ax) / b
  const xMatch = lhs.match(/(-?\d*\.?\d*)\s*\*?\s*x/);
  const yMatch = lhs.match(/(-?\d*\.?\d*)\s*\*?\s*y/);
  const a = xMatch ? (parseFloat(xMatch[1]) || (xMatch[1] === '-' ? -1 : 1)) : 0;
  const b = yMatch ? (parseFloat(yMatch[1]) || (yMatch[1] === '-' ? -1 : 1)) : 0;

  if (b === 0) return { m: 0, c: 0, error: 'Cannot solve for y when coefficient of y is 0' };
  const si = generalToSlopeIntercept(a, b, -rhs);
  if (!si) return { m: 0, c: 0, error: 'Invalid equation' };
  return { m: si.m, c: si.c, error: null };
}
