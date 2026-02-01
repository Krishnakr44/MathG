# MathG — Area & Surface Area Visualization System

Geometry modules for Indian middle-school classrooms (Class 8+).
Formulas emerge visually, not shown upfront.

---

## Core Philosophy

- **Area** = covering a surface
- **Volume** = filling space
- **Formulas** emerge from visual patterns, not memorization

---

## Module Structure

Each shape module implements:

1. **3D Visualization** — Rotatable object (3D shapes)
2. **Net View** — Unfolded 2D representation
3. **Coverage View** — Unit squares / sectors overlay
4. **Pattern Discovery** — Rows × columns, etc.
5. **Formula Emergence** — Shown only after pattern is clear
6. **Comparison** — Change parameters, observe impact

---

## Implemented Modules

### Module 1: Square & Rectangle (2D)
- **Path**: `modules/geometry/rectangle/`
- **Features**: Grid coverage, length/breadth sliders, rows × columns pattern
- **Area**: length × breadth

### Module 2: Cube & Cuboid (3D)
- **Path**: `modules/geometry/cuboid/`
- **Features**: 3D rotatable view (CSS 3D), net unfolding, face areas
- **Surface area**: 2(lb + bh + lh)

---

## Architecture

### Shape Interface (`IGeometryShape`)
- `getDefaultDimensions()` — Slider defaults
- `getNet()` — Net definition (3D shapes)
- `getCoverage()` — Unit squares / sectors (2D)
- `getArea()` / `getSurfaceArea()` — Computed values
- `getFormula()` — Formula string (shown on demand)

### Visualization Components
- **CoverageCanvas** — Grid overlay for 2D shapes
- **NetViewCanvas** — 2D net layout
- **Cuboid3DView** — CSS 3D rotatable cuboid

### Shared Engine
- `src/engines/geometry/` — Shape definitions, unfolding logic
- `src/engines/geometry-viz/` — Visualization components

---

## Extension: Adding a New Shape

1. Create shape in `engines/geometry/shapes/<shape>.ts`
2. Implement `IGeometryShape`
3. Add visualization component if needed
4. Create module in `modules/geometry/<shape>/`
5. Register in `config/modules/register-all.ts`

---

## Planned Modules

- Triangle (cut rectangle diagonally)
- Circle (sectors → rectangle)
- Cylinder (unwrap curved surface)
- Cone (sector unwrap)
- Sphere (cylinder comparison)
