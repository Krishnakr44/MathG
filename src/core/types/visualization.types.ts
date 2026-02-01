/**
 * Visualization Engine — Type definitions
 * Graph renderer, plot config, controls
 */

import type { Bounds, IPlotConfig } from './index.types';

// ─── Plot Type (extension point) ─────────────────────────────────────────────
export type PlotType = 'function' | 'points' | 'transform' | 'custom';

// ─── Single Plot Definition ──────────────────────────────────────────────────
export interface IPlotDef {
  id: string;
  type: PlotType;
  expression?: string;
  points?: [number, number][];
  visible?: boolean;
  color?: string;
  strokeWidth?: number;
}

// ─── Graph Renderer Interface ───────────────────────────────────────────────
export interface IGraphRenderer {
  setConfig(config: IPlotConfig): void;
  setPlots(plots: IPlotDef[]): void;
  setParameterValues(values: Record<string, number | boolean>): void;
  render(): void;
  resize(width: number, height: number): void;
}

// ─── Parameter Control Interface (slider, toggle) ────────────────────────────
export interface IParameterControl {
  id: string;
  getValue(): number | boolean;
  setValue(value: number | boolean): void;
  render(): HTMLElement | React.ReactNode;
}

// ─── Visualization Strategy (for mistake display) ─────────────────────────────
export interface IVisualizationStrategy {
  id: string;
  name: string;
  description: string;
  plotOverrides?: Partial<IPlotDef>[];
  boundsOverride?: Partial<Bounds>;
  highlightRegions?: { xMin: number; xMax: number; yMin: number; yMax: number }[];
}
