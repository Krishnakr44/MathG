# MathG — Math Visualization & Mistake Lab

A scalable, modular web application for Indian middle-school math teachers (Class 6–8).

## Features

- **Modular math modules** — Graphs, geometry, algebra, statistics (pluggable)
- **Math Engine** — Parse algebraic + trigonometric expressions, validate domains
- **Visualization Engine** — Cartesian plane, function plotting, sliders, toggles
- **Mistake Bank** — Common student mistakes linked to visualization strategies
- **Teacher-first UX** — 2–3 clicks max, projection-friendly, offline-first

## Tech Stack

- **Framework:** Next.js 14 + TypeScript
- **Visualization:** Canvas/SVG (no external graphing APIs)
- **Data:** JSON-based config first, DB later
- **Logic:** Deterministic, no heavy AI dependency

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/           # Next.js App Router
├── core/          # Types, registry, constants
├── engines/       # Math, visualization, mistake bank
├── modules/       # Pluggable math domains (graphs, geometry, etc.)
├── ui/            # Teacher layout, controls
└── config/        # JSON config (modules, mistakes)
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Full architecture, interfaces, extension points
- [docs/EXTENSION_GUIDE.md](./docs/EXTENSION_GUIDE.md) — How to add new modules, mistakes, functions

## License

MIT
