/**
 * MathG — Direct & Inverse Proportion Utilities
 * y ∝ x  →  y = kx
 * y ∝ 1/x  →  y = k/x
 */

export type ProportionType = 'direct' | 'inverse';

/** Direct proportion: y = kx. Given (x1,y1), k = y1/x1 */
export function directProportionConstant(x: number, y: number): number {
  if (x === 0) return 0;
  return y / x;
}

/** Inverse proportion: y = k/x. Given (x1,y1), k = x1*y1 */
export function inverseProportionConstant(x: number, y: number): number {
  return x * y;
}

/** Evaluate direct: y = kx */
export function evaluateDirect(k: number, x: number): number {
  return k * x;
}

/** Evaluate inverse: y = k/x */
export function evaluateInverse(k: number, x: number): number {
  if (x === 0) return Infinity;
  return k / x;
}

/** Generate table for direct proportion: y = kx */
export function directProportionTable(
  k: number,
  xValues: number[]
): { x: number; y: number }[] {
  return xValues.map((x) => ({ x, y: evaluateDirect(k, x) }));
}

/** Generate table for inverse proportion: y = k/x */
export function inverseProportionTable(
  k: number,
  xValues: number[]
): { x: number; y: number }[] {
  return xValues.filter((x) => x !== 0).map((x) => ({ x, y: evaluateInverse(k, x) }));
}
