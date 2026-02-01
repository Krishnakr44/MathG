/**
 * MathG — Core type definitions
 * Shared across math engine, visualization, and mistake bank
 */

// ─── Math Domain ─────────────────────────────────────────────────────────────
export type MathDomain = 'graphs' | 'geometry' | 'algebra' | 'statistics';

// ─── Result wrapper (deterministic, no AI) ──────────────────────────────────
export type MathResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; code?: string };

// ─── Bounds & Plot Config ────────────────────────────────────────────────────
export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface IPlotConfig {
  bounds: Bounds;
  gridStep?: number;
  showGrid?: boolean;
  showAxes?: boolean;
  aspectRatio?: number;
}

// ─── Parameter Controls ─────────────────────────────────────────────────────
export interface ParameterDef {
  id: string;
  label: string;
  type: 'slider' | 'toggle';
  defaultValue: number | boolean;
  min?: number;
  max?: number;
  step?: number;
  linkedTo?: string; // Expression term ID for toggle
}

export type ParameterValues = Record<string, number | boolean>;

// ─── Module Config ──────────────────────────────────────────────────────────
export interface ModuleConfig {
  expressions?: string[];
  parameters?: ParameterDef[];
  bounds?: Bounds;
  mistakeIds?: string[];
}

// ─── Quick Action (Teacher UX: 2–3 clicks) ────────────────────────────────────
export interface QuickAction {
  id: string;
  label: string;
  icon?: string;
  config: Partial<ModuleConfig>;
}

// ─── Workspace Props (passed to module render) ────────────────────────────────
export interface WorkspaceProps {
  config: ModuleConfig;
  parameters: ParameterValues;
  onParametersChange: (values: ParameterValues) => void;
  mistakeId?: string;
}
