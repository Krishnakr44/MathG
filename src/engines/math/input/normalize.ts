/**
 * MathG — Equation Input Normalization
 * Converts teacher-style input to safe internal format
 * NO eval, NO multi-variable, NO calculus
 */

const FORBIDDEN = new Set([
  'eval', 'Function', 'constructor', 'prototype', 'window', 'document',
  'require', 'import', 'export', 'process', 'global',
  'diff', 'integral', 'derivative', 'd/dx', '∫', 'lim', 'limit',
  'while', 'for', 'setTimeout', 'setInterval',
]);

const TRIG_NAMES = ['sin', 'cos', 'tan', 'sec', 'cosec', 'cot', 'sqrt', 'abs', 'log', 'exp'];

export interface NormalizeResult {
  normalized: string;
  error: string | null;
}

/**
 * Normalize teacher-style input to safe parseable format.
 * - "y=sinx" → "y = sin(x)"
 * - "sin x + 1" → "sin(x) + 1"
 * - "x^2 + 2x" → "x^2 + 2*x"
 */
export function normalizeEquationInput(raw: string): NormalizeResult {
  let s = raw.trim();
  if (!s) return { normalized: '', error: 'Enter an equation' };

  // Safety: reject forbidden tokens
  const lower = s.toLowerCase();
  for (const f of FORBIDDEN) {
    if (lower.includes(f)) {
      return { normalized: '', error: `Not allowed: ${f}` };
    }
  }

  // Handle equation format: y = f(x)
  if (s.includes('=')) {
    const eqIdx = s.indexOf('=');
    const lhs = s.slice(0, eqIdx).trim().toLowerCase();
    if (lhs !== 'y') {
      return { normalized: '', error: 'Use y = f(x) format. Only x is the variable.' };
    }
  } else {
    s = 'y = ' + s;
  }

  // Extract RHS — validate variables only here (so "y" in LHS is ignored)
  const eqIdx = s.indexOf('=');
  let rhs = s.slice(eqIdx + 1).trim();

  // Validate variables only in RHS — x, parameters (a,b,c,d,m,k), constants (pi,e), and function names allowed
  const varMatch = rhs.match(/\b([a-zA-Z]+)\b/g);
  if (varMatch) {
    const allowed = new Set(['x', 'a', 'b', 'c', 'd', 'm', 'k', 'pi', 'e', ...TRIG_NAMES]);
    for (const v of varMatch) {
      const vLower = v.toLowerCase();
      const isFunction = TRIG_NAMES.some((t) => vLower === t || vLower.startsWith(t + '('));
      if (!allowed.has(vLower) && !isFunction) {
        return { normalized: '', error: `Only x and constants (a,b,c,d,m,k) allowed in expression. Found: ${v}` };
      }
    }
  }

  // Normalize: sinx, sin x, cosx, etc. → sin(x)
  rhs = normalizeTrigWithoutParens(rhs);

  // Normalize: 2x, 3sin(x) → 2*x, 3*sin(x) (implicit mult before x or function)
  rhs = normalizeImplicitMult(rhs);

  const normalized = s.slice(0, eqIdx + 1) + ' ' + rhs;
  return { normalized, error: null };
}

function normalizeTrigWithoutParens(s: string): string {
  let result = s;
  for (const fn of TRIG_NAMES) {
    result = result.replace(new RegExp(`\\b${fn}\\s*x\\b`, 'gi'), `${fn}(x)`);
    result = result.replace(new RegExp(`\\b${fn}x\\b`, 'gi'), `${fn}(x)`);
    result = result.replace(new RegExp(`\\b${fn}\\s+(\\d+)\\s*\\*?\\s*x\\b`, 'gi'), `${fn}($1*x)`);
    result = result.replace(new RegExp(`\\b${fn}\\s+(\\d+)\\s*x\\b`, 'gi'), `${fn}($1*x)`);
  }
  return result;
}

function normalizeImplicitMult(s: string): string {
  // Number followed by letter: 2x → 2*x, 3sin → 3*sin
  let result = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  // ) followed by ( or letter: )( → )*(, )x → )*x
  result = result.replace(/\)\s*([a-zA-Z(])/g, ')*$1');
  return result;
}
