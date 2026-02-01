/**
 * Math Module — Base interface for pluggable modules
 * Each domain (graphs, geometry, algebra, statistics) implements this
 */

import type { ReactNode } from 'react';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from './index.types';

// ─── Base Module Interface ───────────────────────────────────────────────────
export interface IMathModule {
  id: string;
  name: string;
  domain: MathDomain;
  version: string;

  /** NCERT chapter alignment (e.g. "Introduction to Graphs") */
  ncertChapter?: string;
  /** Class range (e.g. "8", "9-10") */
  classRange?: string;

  /** Default config when module loads */
  getDefaultConfig(): ModuleConfig;

  /** Mistake IDs this module can display */
  getLinkedMistakes(): string[];

  /** Main workspace UI */
  renderWorkspace(props: WorkspaceProps): ReactNode;

  /** Quick actions for teacher (2–3 clicks) */
  getQuickActions(): QuickAction[];
}
