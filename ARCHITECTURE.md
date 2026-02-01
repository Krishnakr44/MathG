# MathG — Architecture Document

**Math Visualization & Mistake Lab** for Indian middle-school teachers (Class 6–8)

---

## 1. Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Modular** | Each math domain (graphs, geometry, algebra, statistics) is a pluggable module |
| **Separation of concerns** | UI, math engine, visualization, mistake logic are independent layers |
| **Offline-first** | JSON config, service worker, local storage; DB optional later |
| **Teacher-first UX** | 2–3 clicks max, projection-friendly, minimal animations |
| **Deterministic** | No heavy AI; logic is predictable and testable |

---

## 2. Folder Structure

```
mathg/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (routes)/
│   │
│   ├── core/                   # Core abstractions & interfaces
│   │   ├── types/              # Shared TypeScript types
│   │   ├── registry/           # Module registration system
│   │   └── constants/
│   │
│   ├── engines/
│   │   ├── math/               # Math Engine
│   │   │   ├── parser/
│   │   │   ├── evaluator/
│   │   │   ├── validator/
│   │   │   └── index.ts
│   │   │
│   │   ├── visualization/     # Visualization Engine
│   │   │   ├── renderer/      # Cartesian plane, SVG/Canvas
│   │   │   ├── controls/      # Sliders, toggles
│   │   │   └── index.ts
│   │   │
│   │   └── mistake-bank/      # Mistake Bank Engine
│   │       ├── store/
│   │       ├── strategies/
│   │       └── index.ts
│   │
│   ├── modules/                # Pluggable math domain modules
│   │   ├── _base/              # Base module interface
│   │   ├── graphs/             # Linear, quadratic, trig
│   │   ├── geometry/           # (future)
│   │   ├── algebra/            # (future)
│   │   └── statistics/         # (future)
│   │
│   ├── ui/                     # UI Framework components
│   │   ├── layout/
│   │   ├── controls/
│   │   └── teacher/
│   │
│   └── config/                 # JSON-based configuration
│       ├── modules/
│       └── mistakes/
│
├── public/
│   └── manifest.json           # PWA / offline
│
└── docs/                       # Extension guides
```

---

## 3. Core Layers

### 3.1 Math Engine

**Responsibilities:**
- Parse mathematical expressions (algebraic + trigonometric)
- Validate domains (e.g., sin, cos, cosec undefined points)
- Symbolic + numeric evaluation

**Key interfaces:**
- `IExpressionParser` — parse string → AST
- `IExpressionEvaluator` — evaluate AST at given x
- `IDomainValidator` — check validity over interval
- `MathResult<T>` — success/error wrapper

**Extension point:** Add new functions via `FUNCTION_REGISTRY`.

---

### 3.2 Visualization Engine

**Responsibilities:**
- Reusable Cartesian plane renderer (Canvas/SVG)
- Function plotting, point plotting, transformations
- Sliders for parameters (a, b, c, shifts, scaling)
- Toggle individual equation terms ON/OFF

**Key interfaces:**
- `IGraphRenderer` — render plane + curves
- `IPlotConfig` — bounds, axes, grid
- `IParameterControl` — slider/toggle definition
- `IVisualizationStrategy` — mistake-specific viz config

**Extension point:** New plot types via `PLOT_TYPE_REGISTRY`.

---

### 3.3 Mistake Bank Engine

**Responsibilities:**
- Store common student mistakes as structured data
- Link each mistake to a visualization strategy
- Reuse mistakes across modules

**Key interfaces:**
- `IMistake` — id, description, domain, viz strategy ref
- `IMistakeBank` — CRUD, filter by domain
- `IVisualizationStrategy` — how to show the mistake

**Extension point:** New mistake types via JSON config + strategy ID.

---

### 3.4 UI Framework

**Responsibilities:**
- Teacher-first UX (2–3 clicks max)
- Projection-friendly layout
- No animations unless they explain a concept

**Key patterns:**
- `TeacherLayout` — large fonts, high contrast
- `QuickActionBar` — one-click presets
- `ModuleLauncher` — grid of modules

---

## 4. Module Interfaces

### 4.1 Base Module Interface

```typescript
interface IMathModule {
  id: string;
  name: string;
  domain: MathDomain;           // 'graphs' | 'geometry' | 'algebra' | 'statistics'
  version: string;
  
  // Config
  getDefaultConfig(): ModuleConfig;
  
  // Mistake integration
  getLinkedMistakes(): string[];  // Mistake IDs
  
  // UI
  renderWorkspace(props: WorkspaceProps): React.ReactNode;
  getQuickActions(): QuickAction[];
}
```

### 4.2 Module Config

```typescript
interface ModuleConfig {
  expressions?: string[];
  parameters?: ParameterDef[];
  bounds?: Bounds;
  mistakeIds?: string[];
}
```

### 4.3 Parameter Definition

```typescript
interface ParameterDef {
  id: string;
  label: string;
  type: 'slider' | 'toggle';
  defaultValue: number | boolean;
  min?: number;
  max?: number;
  step?: number;
  linkedTo?: string;  // Expression term ID for toggle
}
```

---

## 5. Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Interfaces** | `I` prefix | `IMathModule`, `IMistake` |
| **Types** | PascalCase | `MathResult`, `Bounds` |
| **Files** | kebab-case | `expression-parser.ts` |
| **Modules** | PascalCase folder | `graphs/`, `geometry/` |
| **Config** | kebab-case JSON | `linear-graphs.json` |
| **Mistakes** | `mistake-` prefix | `mistake-sin-domain.json` |
| **Constants** | SCREAMING_SNAKE | `DEFAULT_BOUNDS` |

---

## 6. Extension Points

### Adding a New Math Domain Module

1. Create `src/modules/<domain>/` folder
2. Implement `IMathModule`
3. Register in `src/core/registry/module-registry.ts`
4. Add config JSON in `src/config/modules/`

### Adding a New Mistake

1. Add JSON in `src/config/mistakes/`
2. Implement `IVisualizationStrategy` if new viz type
3. Link from module via `getLinkedMistakes()`

### Adding a New Math Function

1. Add to `FUNCTION_REGISTRY` in math engine
2. Implement parser token + evaluator
3. Add domain validator if needed (e.g., cosec)

---

## 7. Data Flow

```
Teacher selects module → Module loads config
                       → Math Engine parses expressions
                       → Visualization Engine renders
                       → Teacher picks mistake (optional)
                       → Mistake Bank loads strategy
                       → Viz updates to show mistake
```

---

## 8. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Visualization | Canvas + SVG (no external graphing libs) |
| Data | JSON config → IndexedDB/localStorage later |
| Styling | Tailwind CSS (projection-friendly) |
| Offline | Service Worker, manifest.json |

---

## 9. File Naming Reference

- `*.types.ts` — Type definitions
- `*.config.ts` — Configuration
- `*.registry.ts` — Registration / plugin system
- `index.ts` — Public API of a package
