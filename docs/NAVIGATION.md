# MathG — Navigation Flow

## Structure (No Deep Nesting)

```
Home (/)
  └── Module selection (ModuleLauncher)
        └── Module Screen (/module/[id])
              └── Visualization State (in-module)
```

## Levels

| Level | Route | Description |
|-------|-------|-------------|
| 1. Home | `/` | Module selection grid |
| 2. Module | `/module/[id]` | Module workspace (e.g., Equation & Graph Visualizer) |
| 3. Visualization | (in-module) | Active graph, equation, controls |

## Back Button Behavior

- **From Module** → Back returns to **Home** (module selection)
- **From Home** → No Back (or hidden)
- **Logical step**: Back always goes one level up, never browser history

## Header

- **Left**: MathG logo (home) OR Back button (when not home)
- **Center**: Current screen name (MathG, module name)
- **Right**: Reset (when applicable), Help (optional)

## Routes

| Path | Header Title | Back |
|------|--------------|------|
| `/` | MathG | No |
| `/module/graphs-equation-viz` | Equation & Graph Visualizer | Yes → / |
| `/module/graphs-linear` | Linear Graphs (y = mx + c) | Yes → / |
