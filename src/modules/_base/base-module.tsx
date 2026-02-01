/**
 * Base Module — Abstract implementation for IMathModule
 * Extend this when adding new math domains
 */

import type { IMathModule } from '@/core/types/module.types';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

export abstract class BaseMathModule implements IMathModule {
  abstract id: string;
  abstract name: string;
  abstract domain: MathDomain;
  abstract version: string;

  abstract getDefaultConfig(): ModuleConfig;
  abstract getLinkedMistakes(): string[];
  abstract renderWorkspace(props: WorkspaceProps): React.ReactNode;

  getQuickActions(): QuickAction[] {
    return [];
  }
}
