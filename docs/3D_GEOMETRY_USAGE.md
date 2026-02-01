# 3D Geometry Module — Usage Guide

## Overview

The MathG 3D geometry system is organized by figure type:

- **Flat Solids**: Square, Rectangle (reference)
- **Polyhedra**: Cube, Cuboid, Prism (triangular, rectangular)
- **Curved Solids**: Cylinder, Cone, Sphere

Each figure is an independent module using shared engines (`geometry-3d`, `scale-utils`).

---

## Example Usage

### Cube (special case of Cuboid)

```tsx
import { cuboidFigure, isCube } from '@/engines/geometry-3d';

const dimensions = { length: 2, breadth: 2, height: 2 };
if (isCube(dimensions)) {
  console.log('Cube!');
}
const surfaceArea = cuboidFigure.getSurfaceArea(dimensions); // 24
const net = cuboidFigure.getNet(dimensions);
```

### Prism (triangular or rectangular base)

```tsx
import { prismFigure } from '@/engines/geometry-3d';

// Triangular prism
const triDimensions = { baseWidth: 3, baseHeight: 2, height: 4, baseShape: 0 };
const triNet = prismFigure.getNet(triDimensions);
const triSA = prismFigure.getSurfaceArea(triDimensions);

// Rectangular prism (= cuboid)
const rectDimensions = { baseWidth: 3, baseHeight: 2, height: 4, baseShape: 1 };
const rectNet = prismFigure.getNet(rectDimensions);
```

### Cone

```tsx
import { coneFigure } from '@/engines/geometry-3d';

const dimensions = { radius: 1.5, height: 3 };
const net = coneFigure.getNet(dimensions); // sector + circle
const surfaceArea = coneFigure.getSurfaceArea(dimensions); // πr² + πrl
const formula = coneFigure.getFormula(dimensions); // "πr² + πrl = πr(r + l), l = √(r² + h²)"
```

---

## Cuboid Face Pairs

- **Top / Bottom**: area = length × breadth
- **Front / Back**: area = length × height
- **Left / Right**: area = breadth × height

Surface area = 2(lb + bh + hl)

Toggle face pairs ON/OFF to see contribution; highlight pairs for visual emphasis.

---

## Unified Scale

All figures use `scale-utils` for consistent visual scale:

```tsx
import { computeScale, toViewportScale } from '@/engines/geometry-3d';
const bounds = figure.getBoundingBox(dimensions);
const scale = computeScale(bounds);
const pixelScale = toViewportScale(bounds);
```

---

## Modules

| Module       | Path                    | Features                                      |
|-------------|--------------------------|-----------------------------------------------|
| Cube & Cuboid | `modules/geometry/cuboid` | Face pairs, toggle, highlight, net, 3D view |
| Prism       | `modules/geometry/prism`  | Triangle/rectangle base, net, surface area    |
| Cone        | `modules/geometry/cone`   | Net (sector + circle), slant height, SA      |
