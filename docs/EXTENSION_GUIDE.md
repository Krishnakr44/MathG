# MathG — Extension Guide

How to add new math domains, mistakes, and visualization strategies.

---

## 1. Adding a New Math Domain Module

### Step 1: Create module folder

```
src/modules/<domain>/
  ├── <domain>-<topic>.tsx   # e.g., geometry-triangles.tsx
  └── index.ts               # barrel export
```

### Step 2: Implement IMathModule

```typescript
import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';

class MyModule extends BaseMathModule {
  id = 'my-domain-topic';
  name = 'My Topic';
  domain = 'my-domain';
  version = '1.0.0';

  getDefaultConfig() { /* ... */ }
  getLinkedMistakes() { return ['mistake-xyz']; }
  renderWorkspace(props) { /* ... */ }
  getQuickActions() { /* ... */ }
}

registerModule(new MyModule());
```

### Step 3: Register in app

Import the module file in `src/app/page.tsx` or a central registry loader so it runs on app load.

---

## 2. Adding a New Mistake

### Step 1: Create JSON config

`src/config/mistakes/mistake-<name>.json`:

```json
{
  "id": "mistake-<name>",
  "name": "Short name",
  "description": "What students do wrong",
  "domain": "graphs",
  "classLevel": [7, 8],
  "visualizationStrategyId": "viz-<strategy-id>",
  "commonExpression": "y = ...",
  "tags": ["tag1", "tag2"]
}
```

### Step 2: Implement visualization strategy

In `src/engines/mistake-bank/strategies/`, add a strategy that defines how to show the mistake (plot overrides, highlight regions, etc.).

---

## 3. Adding a New Math Function

### Step 1: Add to FUNCTION_REGISTRY

In `src/engines/math/evaluator/evaluator.ts`:

```typescript
FUNCTION_REGISTRY.myFunc = ([a, b]) => /* ... */;
```

### Step 2: Add parser support

Extend `expression-parser.ts` to recognize `myFunc(...)`.

### Step 3: Add domain validator (if needed)

In `domain-validator.ts`, add undefined points for functions like cosec, tan, etc.

---

## 4. Adding a New Plot Type

### Step 1: Extend IPlotDef

Add your type to `PlotType` in `visualization.types.ts`.

### Step 2: Implement render logic

In `CartesianRenderer`, add a branch for your plot type in the render loop.

---

## 5. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Modules | `domain-topic` | `graphs-linear` |
| Mistakes | `mistake-<name>` | `mistake-sign-slope` |
| Strategies | `viz-<name>` | `viz-slope-comparison` |
| Config files | kebab-case | `graphs-linear.json` |
