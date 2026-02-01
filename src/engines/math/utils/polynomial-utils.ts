/**
 * MathG — Polynomial Utilities
 * Zeros (x-intercepts), degree, evaluation
 * Supports up to degree 3
 */

export interface PolynomialAnalysis {
  coefficients: number[];
  degree: number;
  zeros: number[];
  evaluate: (x: number) => number;
}

/** Evaluate polynomial at x: a0 + a1*x + a2*x² + a3*x³ */
export function evaluatePolynomial(coefficients: number[], x: number): number {
  let result = 0;
  let pow = 1;
  for (const c of coefficients) {
    result += c * pow;
    pow *= x;
  }
  return result;
}

/** Find real zeros of quadratic (degree 2) */
function quadraticZeros(a0: number, a1: number, a2: number): number[] {
  const d = a1 * a1 - 4 * a2 * a0;
  if (d < 0) return [];
  if (d === 0) return [-a1 / (2 * a2)];
  const sqrtD = Math.sqrt(d);
  return [(-a1 - sqrtD) / (2 * a2), (-a1 + sqrtD) / (2 * a2)].sort((p, q) => p - q);
}

/** Find real zeros of cubic (degree 3) — simplified: one real root via Newton */
function cubicZeros(a0: number, a1: number, a2: number, a3: number): number[] {
  // Newton-Raphson for one root, then factor
  let x = 0;
  for (let i = 0; i < 50; i++) {
    const f = a0 + a1 * x + a2 * x * x + a3 * x * x * x;
    const fp = a1 + 2 * a2 * x + 3 * a3 * x * x;
    if (Math.abs(fp) < 1e-12) break;
    const xNew = x - f / fp;
    if (Math.abs(xNew - x) < 1e-10) break;
    x = xNew;
  }
  const zeros: number[] = [];
  if (Math.abs(evaluatePolynomial([a0, a1, a2, a3], x)) < 1e-8) {
    zeros.push(x);
    // Factor out (x - r), get quadratic
    const b3 = a3;
    const b2 = a2 + a3 * x;
    const b1 = a1 + b2 * x;
    const b0 = a0 + b1 * x;
    const quadZeros = quadraticZeros(b0, b1, b2);
    zeros.push(...quadZeros.filter((z) => Math.abs(z - x) > 1e-8));
  }
  return zeros.sort((p, q) => p - q);
}

/** Find real zeros of polynomial (degree ≤ 3) */
export function polynomialZeros(coefficients: number[]): number[] {
  const coef = [...coefficients];
  while (coef.length > 1 && coef[coef.length - 1] === 0) coef.pop();
  if (coef.length <= 1) return [];
  if (coef.length === 2) return coef[0] === 0 ? [] : [-coef[0] / coef[1]];
  if (coef.length === 3) return quadraticZeros(coef[0], coef[1], coef[2]);
  if (coef.length === 4) return cubicZeros(coef[0], coef[1], coef[2], coef[3]);
  return [];
}

/** Parse "ax³ + bx² + cx + d" or "ax^3 + bx^2 + cx + d" to coefficients [d, c, b, a] */
export function parsePolynomial(input: string): number[] {
  const s = input.trim().toLowerCase().replace(/\s+/g, ' ');
  const coef: number[] = [0, 0, 0, 0];
  const parts = s.split(/([+-])/);
  let sign = 1;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (p === '+' || p === '-') {
      sign = p === '-' ? -1 : 1;
      continue;
    }
    if (!p) continue;
    const m = p.match(/(-?\d*\.?\d*)\s*\*?\s*x\s*\^?\s*(\d)?/);
    if (!m || !p.includes('x')) {
      const num = parseFloat(p.replace(/[^0-9.-]/g, '')) || 0;
      coef[0] = sign * num;
      sign = 1;
      continue;
    }
    const deg = m[2] ? parseInt(m[2], 10) : 1;
    const rawVal = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
    const val = sign * rawVal;
    if (deg >= 0 && deg <= 3) coef[deg] = val;
    sign = 1;
  }
  return coef;
}
