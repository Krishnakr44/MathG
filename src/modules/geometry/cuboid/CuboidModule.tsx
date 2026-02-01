'use client';

/**
 * Module: Cube & Cuboid (3D)
 * 3D rotatable object, net unfolding, face-by-face area
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { CuboidWorkspace } from './CuboidWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-cuboid';

export class CuboidModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Cube & Cuboid';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'length', label: 'Length', type: 'slider', defaultValue: 3, min: 1, max: 8, step: 0.5 },
        { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 2, min: 1, max: 8, step: 0.5 },
        { id: 'height', label: 'Height', type: 'slider', defaultValue: 2, min: 1, max: 8, step: 0.5 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'cube', label: 'Cube (2×2×2)', config: { parameters: [{ id: 'length', label: 'Length', type: 'slider', defaultValue: 2, min: 1, max: 8, step: 0.5 }, { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 2, min: 1, max: 8, step: 0.5 }, { id: 'height', label: 'Height', type: 'slider', defaultValue: 2, min: 1, max: 8, step: 0.5 }] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <CuboidWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new CuboidModule());
