# MathG — Equation Input System

## Supported Input Formats

Teachers can enter equations in common styles:

| Teacher input | Normalized | Example |
|---------------|------------|---------|
| `y = sin(x)` | `y = sin(x)` | Standard |
| `y=sinx` | `y = sin(x)` | No spaces, no parens |
| `sin x + 1` | `y = sin(x) + 1` | Implicit y=, space before x |
| `x^2 + 2x + 1` | `y = x^2 + 2*x + 1` | Implicit multiplication |
| `2sin(x)` | `y = 2*sin(x)` | Implicit mult before function |

## Supported Functions

- **Trig**: sin, cos, tan, sec, cosec, cot
- **Other**: sqrt, abs, log, exp
- **Constants**: pi
- **Variables**: x (only), a, b, c (parameters)

## Safety

- **No eval**: Parser-based evaluation only
- **No multi-variable**: Only y = f(x)
- **No calculus**: diff, integral, etc. rejected
- **Bounded AST**: Max 500 nodes, max depth 50
- **Undefined regions**: tan, cosec, sec, cot handled with asymptotes

## Error Handling

- Live validation with clear messages
- Syntax errors highlighted (red border)
- Graceful handling of undefined regions in graph
- No UI crash on invalid input

## Extension Points

- **Parser**: `src/engines/math/parser/expression-parser.ts`
- **Normalizer**: `src/engines/math/input/normalize.ts`
- **Validator**: `src/engines/math/input/validate.ts`
- **Evaluator**: `src/engines/math/evaluator/evaluator.ts` (FUNCTION_REGISTRY)
