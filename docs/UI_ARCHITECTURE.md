# MathG — UI Architecture

## Layout (Projection-Friendly)

```
┌─────────────────────────────────────────────────────────────┐
│ AppNav (minimal: MathG, Equation & Graph, Linear)           │
├─────────────────────────────────────────────────────────────┤
│ Equation Input Bar (prominent, editor-like)                  │
│   y = [ sin(x)                    ] [x+2] [sin(x)] [x²+2x]  │
├──────────────┬──────────────────────────────────────────────┤
│ Left Panel   │ Graph Canvas                                  │
│ - Reset      │ - Cartesian plane                             │
│ - Grid/Axes  │ - Function plot                               │
│ - Sliders    │ - Discontinuities (asymptotes)                │
│ - Step view  │ - Intercepts                                   │
│ - Term toggles│                                               │
│ - Mistake    │                                               │
├──────────────┴──────────────────────────────────────────────┤
│ Bottom: Mistake hints (collapsible)                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

```
src/
├── app/
│   ├── page.tsx              # Home = GraphWorkspaceLayout (1-click to graph)
│   ├── layout.tsx
│   └── MistakeBankWrapper.tsx
├── modules/graphs/equation-graph-viz/
│   ├── GraphWorkspaceLayout.tsx   # Main layout
│   ├── EquationInputBar.tsx      # Prominent equation input
│   ├── ParameterSliders.tsx
│   ├── StepByStepView.tsx
│   ├── TermToggles.tsx
│   └── utils.ts
├── engines/
│   ├── math/
│   │   ├── parser/expression-parser.ts
│   │   ├── input/
│   │   │   ├── normalize.ts      # Teacher-style → safe format
│   │   │   └── validate.ts       # AST safety checks
│   │   └── evaluator/evaluator.ts
│   └── visualization/components/
│       └── GraphCanvas.tsx
└── ui/layout/
    └── AppNav.tsx
```

## Equation Input Flow

1. **Raw input** → `normalizeEquationInput()` → reject forbidden, multi-var, calculus
2. **Normalized** → `parseEquation()` → AST or parse error
3. **AST** → `validateAst()` → reject too complex
4. **Valid** → `onChange(normalized, ast, null)` → GraphCanvas renders

## Error Handling Strategy

- **Normalization error**: Red border, clear message (e.g., "Only x and constants allowed")
- **Parse error**: Red border, parse message (e.g., "Expected ) after sin")
- **Validation error**: Red border, safety message (e.g., "Expression too complex")
- **Graph**: Undefined regions (tan, cosec) → asymptotes, no crash

## Extension Points

- **Parser**: Add tokens in `expression-parser.ts`
- **Normalizer**: Add patterns in `normalize.ts`
- **Functions**: Add to `FUNCTION_REGISTRY` in evaluator
- **Mistake Bank**: Link via `getVisualizationAction()`
