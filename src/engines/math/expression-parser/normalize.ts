/**
 * MathG — Expression Normalization Pipeline
 * Preprocesses teacher input into safe parseable format
 */

const ALLOWED_FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'sec', 'cosec', 'cot',
  'sqrt', 'abs', 'log', 'exp',
]);

const FORBIDDEN = new Set([
  'eval', 'Function', 'constructor', 'prototype', 'window', 'document',
  'require', 'import', 'export', 'process', 'global',
  'diff', 'integral', 'derivative', 'd/dx', '∫', 'lim', 'limit',
  'while', 'for', 'setTimeout', 'setInterval', 'if', 'else', 'return',
]);

export interface NormalizeResult {
  normalized: string;
  error: string | null;
}

/**
 * Normalize teacher-entered equation to safe internal format.
 * - Removes "y =" prefix
 * - sinx, sin x → sin(x)
 * - 2x → 2*x, xsin(x) → x*sin(x)
 * - π → pi, e → E (constant)
 * - Normalizes whitespace
 */
export function normalizeExpression(raw: string): NormalizeResult {
  let s = raw.trim();
  if (!s) return { normalized: '', error: 'Empty expression' };

  // Reject forbidden tokens
  const lower = s.toLowerCase();
  for (const f of FORBIDDEN) {
    if (lower.includes(f)) {
      return { normalized: '', error: `Not allowed: ${f}` };
    }
  }

  // Extract RHS if "y =" present
  if (s.includes('=')) {
    const eqIdx = s.indexOf('=');
    const lhs = s.slice(0, eqIdx).trim().toLowerCase();
    if (lhs !== 'y') {
      return { normalized: '', error: 'Use y = f(x) format. Only x is the variable.' };
    }
    s = s.slice(eqIdx + 1).trim();
  }

  // Replace π with pi, e (standalone) with E constant
  s = s.replace(/\bπ\b|\\pi\b/gi, 'pi');
  s = s.replace(/(?<![a-zA-Z0-9_.])e(?![a-zA-Z0-9_.])/g, '2.718281828'); // e constant

  // Normalize trig: sinx, sin x → sin(x)
  s = normalizeTrigWithoutParens(s);

  // Implicit multiplication: 2x → 2*x, )( → )*(
  s = normalizeImplicitMult(s);

  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim();

  return { normalized: s, error: null };
}

function normalizeTrigWithoutParens(s: string): string {
  const fns = ['sin', 'cos', 'tan', 'sec', 'cosec', 'cot', 'sqrt', 'abs', 'log', 'exp'];
  let result = s;
  for (const fn of fns) {
    // sin2x, cos3x → sin(2*x), cos(3*x)
    result = result.replace(new RegExp(`\\b${fn}(\\d+)x\\b`, 'gi'), `${fn}($1*x)`);
    // sin 2x, sin 2 x → sin(2*x)
    result = result.replace(new RegExp(`\\b${fn}\\s+(\\d+)\\s*\\*?\\s*x\\b`, 'gi'), `${fn}($1*x)`);
    result = result.replace(new RegExp(`\\b${fn}\\s+(\\d+)\\s*x\\b`, 'gi'), `${fn}($1*x)`);
    // sinx, sin x → sin(x)
    result = result.replace(new RegExp(`\\b${fn}\\s*x\\b`, 'gi'), `${fn}(x)`);
    result = result.replace(new RegExp(`\\b${fn}x\\b`, 'gi'), `${fn}(x)`);
  }
  return result;
}

function normalizeImplicitMult(s: string): string {
  let result = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  result = result.replace(/\)\s*([a-zA-Z(])/g, ')*$1');
  return result;
}
