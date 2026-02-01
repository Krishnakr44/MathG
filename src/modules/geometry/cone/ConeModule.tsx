'use client';

/**
 * Module: Cone (3D Curved Solid)
 * Radius, height, net unfolding (sector + circle), surface area
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { ConeWorkspace } from './ConeWorkspace';
import type { MathDomain, ModuleConfig, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-cone';

export class ConeModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Cone';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '9';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'radius', label: 'Radius', type: 'slider', defaultValue: 1.5, min: 0.5, max: 3, step: 0.25 },
        { id: 'height', label: 'Height', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 0.5 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <ConeWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new ConeModule());
