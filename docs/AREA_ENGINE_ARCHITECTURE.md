# MathG — Area & Surface Area Learning Engine

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PEDAGOGY ENGINE (Orchestrator)                        │
│  Learning Layers L1→L6 • Formula Reveal Control • Teacher Pacing • Predict   │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  GEOMETRY ENGINE  │  │ TRANSFORMATION    │  │  COVERAGE ENGINE   │
│  • Dimensions     │  │ ENGINE            │  │  • Unit squares    │
│  • Area compute   │  │ • 3D → Net        │  │  • Strips/sectors  │
│  • Surface area   │  │ • Cutting logic   │  │  • Resolution      │
│  • Pure math      │  │ • Morphing        │  │  • Approximation   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VISUALIZATION ENGINE (Renderer)                          │
│  • 2D: SVG/Canvas (grids, nets, coverage)                                    │
│  • 3D: CSS 3D / Three.js (rotatable solids)                                  │
│  • Deterministic: same input → same output                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL SHAPE CONTRACT (IShapeModule)                    │
│  defineDimensions • getGeometrySpec • getNetSpec • getCoverageSpec            │
│  getAreaPattern • getFormulaMapping • getMisconceptions                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Teacher adjusts slider → Dimensions change
    → Geometry Engine recomputes area
    → Transformation Engine updates net
    → Coverage Engine updates units (resolution)
    → Pedagogy Engine decides what to show (layer)
    → Visualization Engine renders
```

## Layer Flow (Teacher-Controlled)

| Layer | Name | Content |
|-------|------|---------|
| L1 | 3D / Concrete | Rotate, zoom, dimension sliders |
| L2 | Decomposition | Net view, face correspondence |
| L3 | Coverage | Unit squares / strips overlay |
| L4 | Pattern | Rows×cols, arc×radius, etc. |
| L5 | Formula | Terms linked to dimensions |
| L6 | Comparison | Predict mode, stress test |

## Coverage Approximation Strategy

| Surface Type | Method | Resolution |
|--------------|--------|------------|
| Flat (rectangle, triangle) | Unit squares | 1 (exact) |
| Curved (circle) | Sector slicing | 4–32 sectors |
| Curved (cylinder, cone) | Strip approximation | Adjustable |

- **Flat**: Exact coverage, no approximation
- **Curved**: Sectors rearrange to rectangle-like form; more sectors → smoother

## Formula-to-Visual Mapping

Each formula term maps to:
- **Dimension**: Slider ID (length, breadth, radius)
- **Highlight region**: { x, y, w, h } in coverage space
- **Origin**: Human-readable explanation

Example (Rectangle): `length` → horizontal extent, `breadth` → vertical extent
