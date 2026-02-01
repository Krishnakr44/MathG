# MathG — Mistake Bank System Guide

How to add new modules and mistakes without touching core code.

---

## 1. Mistake Bank Schema

Each mistake must include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique ID (e.g., `mistake-sign-slope`) |
| `domain` | MathDomain | ✓ | `graphs` \| `geometry` \| `algebra` \| `statistics` |
| `classLevel` | number[] | ✓ | Class levels: 6, 7, 8 |
| `chapter` | string \| LocalizedText | ✓ | Chapter name |
| `concept` | string \| LocalizedText | ✓ | Concept name |
| `studentWrongAnswer` | string \| LocalizedText | ✓ | Student's wrong answer/reasoning |
| `studentReasoning` | string \| LocalizedText | ✓ | Why student thinks it's correct |
| `correctReasoning` | string \| LocalizedText | ✓ | Teacher script |
| `examTip` | string \| LocalizedText | ✓ | Exam-oriented correction tip |
| `visualizationActions` | VisualizationAction[] | ✓ | One mistake → many viz actions |
| `commonExpression` | string | | Example expression |
| `tags` | string[] | | Searchable tags |
| `packId` | string | | For export grouping |

### LocalizedText (multilingual)

```json
{
  "en": "English text",
  "hi-Latn": "Hinglish text (Hindi in Latin script)",
  "hi": "हिंदी (Devanagari)"
}
```

### VisualizationAction (one mistake → many viz)

```json
{
  "id": "viz-slope-comparison",
  "moduleDomain": "graphs",
  "strategyId": "viz-slope-comparison",
  "config": {
    "highlightRegions": [{ "xMin": -2, "xMax": 0, "yMin": -2, "yMax": 2 }],
    "expressionOverride": "y = -2x + 3"
  }
}
```

---

## 2. Adding a New Module (e.g., Geometry Visualizer)

### Step 1: Create mistake configs

Create `src/config/mistakes/geometry/mistake-<name>.json`:

```json
{
  "id": "mistake-parallel-sides",
  "domain": "geometry",
  "classLevel": [7, 8],
  "chapter": { "en": "Quadrilaterals" },
  "concept": { "en": "Confusing parallel sides" },
  "studentWrongAnswer": { "en": "..." },
  "studentReasoning": { "en": "..." },
  "correctReasoning": { "en": "..." },
  "examTip": { "en": "..." },
  "visualizationActions": [
    {
      "id": "viz-parallel-highlight",
      "moduleDomain": "geometry",
      "config": {
        "custom": { "highlightSides": ["AB", "CD"] }
      }
    }
  ]
}
```

### Step 2: Create loader

Create `src/config/mistakes/load-geometry-mistakes.ts`:

```typescript
import { registerMistakes } from '@/engines/mistake-bank/registry';
import mistakeParallelSides from './geometry/mistake-parallel-sides.json';

registerMistakes({
  moduleId: 'geometry-visualizer',
  mistakes: [mistakeParallelSides as Mistake],
});
```

### Step 3: Register in init

Add to `src/engines/mistake-bank/init.ts`:

```typescript
import { loadGeometryMistakes } from '@/config/mistakes/load-geometry-mistakes';
// ...
loadGeometryMistakes();
```

### Step 4: Integrate in module workspace

```tsx
import { MistakeTrigger } from '@/engines/mistake-bank/components/MistakeTrigger';
import { getMistakesByModule, getVisualizationAction } from '@/engines/mistake-bank/registry';

// In your workspace:
const linkedMistakes = getMistakesByModule('geometry-visualizer');
const action = getVisualizationAction(selectedMistakeId, 'geometry');

<MistakeTrigger
  moduleDomain="geometry"
  mistakes={linkedMistakes}
  selectedId={selectedMistakeId}
  onSelect={setSelectedMistakeId}
/>
```

---

## 3. Reusing Visualization Primitives

- **Graphs**: Use `highlightRegions`, `expressionOverride` in `config`
- **Geometry**: Use `config.custom` for domain-specific data (e.g., `highlightSides`)
- **Statistics**: Use `config.custom` for bar/line chart highlights

Each module resolves `getVisualizationAction(mistakeId, moduleDomain)` and applies the config to its renderer.

---

## 4. Offline Caching

- Built-in mistakes: loaded at init
- User-imported packs: cached in `localStorage` under `mathg-mistake-bank-cache`
- On load: built-in first, then merge cache

---

## 5. Export/Import Mistake Packs

- **Export**: `MistakeExportImport` component or `exportAsJson(mistakes)`
- **Import**: Paste JSON, call `importFromJson(json)` → `applyImportedMistakes(mistakes, moduleId)`
- **Pack format**: `MistakePack` with `id`, `name`, `chapter`, `domain`, `classLevel`, `mistakes[]`, `version`

---

## 6. Checklist for New Modules

1. [ ] Create mistake JSON files in `src/config/mistakes/<domain>/`
2. [ ] Create loader in `src/config/mistakes/load-<domain>-mistakes.ts`
3. [ ] Add loader call to `init.ts`
4. [ ] In module workspace: use `MistakeTrigger`, `getMistakesByModule`, `getVisualizationAction`
5. [ ] Apply viz config (highlight regions, overrides) to your renderer
6. [ ] No changes to core Mistake Bank code
