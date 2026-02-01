'use client';

/**
 * Module: Prism (3D)
 * Triangular or rectangular base, height, net unfolding, surface area
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { PrismWorkspace } from './PrismWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-prism';

export class PrismModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Prism';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'baseWidth', label: 'Base width', type: 'slider', defaultValue: 3, min: 1, max: 5, step: 0.5 },
        { id: 'baseHeight', label: 'Base height', type: 'slider', defaultValue: 2, min: 1, max: 5, step: 0.5 },
        { id: 'height', label: 'Prism height', type: 'slider', defaultValue: 4, min: 1, max: 6, step: 0.5 },
        { id: 'baseShape', label: 'Base', type: 'slider', defaultValue: 0, min: 0, max: 1, step: 1 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'triangular', label: 'Triangular prism', config: { parameters: [{ id: 'baseShape', label: 'Base', type: 'slider', defaultValue: 0, min: 0, max: 1, step: 1 }] } },
      { id: 'rectangular', label: 'Rectangular prism', config: { parameters: [{ id: 'baseShape', label: 'Base', type: 'slider', defaultValue: 1, min: 0, max: 1, step: 1 }] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <PrismWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new PrismModule());
