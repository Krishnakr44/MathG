# Equation & Graph Visualization Module

Standalone pluggable module for MathG — renders equations on a Cartesian plane with teacher-friendly features.

## Features

- **Equation input**: `y = x + 2`, `y = sin(x)`, `y = a*sin(x) + b`, etc.
- **Trig support**: sin, cos, tan, sec, cosec, cot
- **Discontinuities**: Vertical asymptotes for tan, cosec, sec, cot
- **Bounds**: −2π to 2π (teacher-friendly)
- **Sliders**: a, b, c bound to equation parameters
- **Step-by-step**: Base → Transform → Final
- **Term toggles**: Show/hide terms in composite equations
- **Teacher utilities**: Grid, axes, intercepts, misconception highlights
- **Mistake Bank**: Dropdown to highlight common student misconceptions

## Mistake Bank Integration

The module links to these mistakes (configure in `getLinkedMistakes()`):

- `mistake-sign-slope` — Confusing positive vs negative slope
- `mistake-intercept-zero` — Forgetting c when line passes through origin
- `mistake-sin-domain` — Confusing sin domain with tan/cosec

Add highlight regions in `MISTAKE_HIGHLIGHTS` in `EquationGraphWorkspace.tsx`.

## Component Structure

```
EquationGraphModule (IMathModule)
└── EquationGraphWorkspace
    ├── EquationInput
    ├── ParameterSliders
    ├── StepByStepView
    ├── TermToggles
    ├── TeacherUtilities
    └── GraphCanvas (from engines/visualization)
```
