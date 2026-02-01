# MathG — Module System

NCERT-aligned math visualization modules for Indian classrooms (Classes 8–10).

---

## Module Overview

| # | Module | Class | Purpose |
|---|--------|-------|---------|
| 1 | Introduction to Graphs | 8 | Table → points → graph, quadrants, coordinates |
| 2 | Linear Equations in Two Variables | 9–10 | y = mx + c, slope, intercepts |
| 3 | Pair of Linear Equations | 10 | Two lines, intersection, consistency |
| 4 | Quadratic Equations | 10 | Parabola, roots, vertex, discriminant |
| 5 | Statistics | 8–10 | Bar graph, histogram, frequency polygon |
| 6 | Polynomials | 9–10 | Zeros, x-intercepts, degree |
| 7 | Direct & Inverse Proportion | 8 | y = kx vs y = k/x, table + graph |

---

## Module Structure

Each module follows a consistent structure:

```
src/modules/<domain>/<module-name>/
├── <Module>Module.tsx    # IMathModule implementation
├── <Module>Workspace.tsx # Main workspace UI
└── index.ts              # Public exports
```

---

## Shared Infrastructure

### Math Engine
- **Parser**: `parseMathExpression()` — safe, deterministic
- **Utils**: `linear-utils`, `quadratic-utils`, `statistics-utils`, `proportion-utils`, `polynomial-utils`

### Visualization Engine
- **GraphCanvas**: Function plotting (AST-based)
- **PointPlotCanvas**: Discrete points (Module 1, 7)
- **LinePlotCanvas**: Lines y = mx + c (Module 2, 3)
- **QuadraticCanvas**: Parabola (Module 4)
- **PolynomialCanvas**: Polynomial curves (Module 6)
- **BarChartCanvas**: Bar, histogram, frequency polygon (Module 5)

---

## Teacher Workflows

### Module 1: Introduction to Graphs
1. Open module → Cartesian plane with sample points
2. Edit table (x,y pairs) → Click Apply → Points update
3. Toggle Quadrants / Connect points
4. Adjust scale sliders

### Module 2: Linear Equations
1. Enter equation (y = mx + c or ax+by+c=0) → Apply
2. Adjust m, c sliders → Line updates
3. Observe intercepts

### Module 3: Pair of Linear Equations
1. Enter two equations
2. Click Apply → Both lines plot
3. See classification: one / no / infinite solutions
4. Intersection point highlighted when one solution

### Module 4: Quadratic Equations
1. Adjust a, b, c sliders
2. Parabola updates; roots, vertex, axis shown
3. Observe discriminant → roots relationship

### Module 5: Statistics
1. Enter raw data (one value per line)
2. Select graph type: Bar / Histogram / Frequency polygon
3. Adjust class width (for histogram/polygon)
4. See mean, median, mode

### Module 6: Polynomials
1. Enter polynomial (e.g. x^2 - 3*x + 2)
2. Click Apply → Graph with zeros highlighted

### Module 7: Direct & Inverse Proportion
1. Toggle Direct / Inverse
2. Adjust k slider
3. Table + graph sync

---

## Extension Hooks

### Adding a New Module
1. Create folder under `src/modules/<domain>/`
2. Implement `IMathModule` (extend `BaseMathModule`)
3. Add to `src/config/modules/register-all.ts`

### Adding a New Math Function
1. Add to `FUNCTION_REGISTRY` in evaluator
2. Add to parser `TRIG_FUNCTIONS`
3. Add to `normalize.ts` and `validate.ts`

### Adding a New Visualization Type
1. Create component in `src/engines/visualization/components/`
2. Export from `src/engines/visualization/index.ts`
