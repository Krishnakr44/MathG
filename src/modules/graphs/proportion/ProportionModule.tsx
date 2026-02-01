'use client';

/**
 * Module 7: Direct & Inverse Proportion (Class 8)
 * Purpose: Visually differentiate proportional relationships
 * Features: Toggle direct/inverse, slider, table+graph sync
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { ProportionWorkspace } from './ProportionWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-proportion';

export class ProportionModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Direct & Inverse Proportion';
  domain: MathDomain = 'graphs';
  version = '1.0.0';
  ncertChapter = 'Direct and Inverse Proportions';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'k', label: 'Constant (k)', type: 'slider', defaultValue: 10, min: 1, max: 50, step: 1 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'direct', label: 'Direct (y = kx)', config: {} },
      { id: 'inverse', label: 'Inverse (y = k/x)', config: {} },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <ProportionWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new ProportionModule());
