/**
 * MathG — Quadratic Equation Utilities
 * ax² + bx + c: roots, vertex, axis of symmetry, discriminant
 */

export interface QuadraticAnalysis {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  roots: { real: number[]; hasImaginary: boolean };
  vertex: { x: number; y: number };
  axisOfSymmetry: number;
}

/** Compute discriminant: b² - 4ac */
export function discriminant(a: number, b: number, c: number): number {
  return b * b - 4 * a * c;
}

/** Find roots of ax² + bx + c = 0 */
export function quadraticRoots(
  a: number,
  b: number,
  c: number
): { real: number[]; hasImaginary: boolean } {
  if (a === 0) {
    if (b === 0) return { real: [], hasImaginary: false };
    return { real: [-c / b], hasImaginary: false };
  }
  const d = discriminant(a, b, c);
  if (d > 0) {
    const sqrtD = Math.sqrt(d);
    return {
      real: [(-b - sqrtD) / (2 * a), (-b + sqrtD) / (2 * a)].sort((p, q) => p - q),
      hasImaginary: false,
    };
  }
  if (d === 0) {
    return { real: [-b / (2 * a)], hasImaginary: false };
  }
  return { real: [], hasImaginary: true };
}

/** Vertex of parabola y = ax² + bx + c */
export function quadraticVertex(a: number, b: number, c: number): { x: number; y: number } {
  if (a === 0) return { x: 0, y: c };
  const x = -b / (2 * a);
  const y = a * x * x + b * x + c;
  return { x, y };
}

/** Axis of symmetry: x = -b/(2a) */
export function axisOfSymmetry(a: number, b: number): number {
  if (a === 0) return 0;
  return -b / (2 * a);
}

/** Evaluate y = ax² + bx + c at x */
export function evaluateQuadratic(a: number, b: number, c: number, x: number): number {
  return a * x * x + b * x + c;
}

/** Full analysis for visualization */
export function analyzeQuadratic(a: number, b: number, c: number): QuadraticAnalysis {
  const roots = quadraticRoots(a, b, c);
  const vertex = quadraticVertex(a, b, c);
  return {
    a,
    b,
    c,
    discriminant: discriminant(a, b, c),
    roots,
    vertex,
    axisOfSymmetry: axisOfSymmetry(a, b),
  };
}
