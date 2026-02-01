'use client';

/**
 * Module: Cylinder (3D Curved Solid)
 * Radius, height, net unfolding, surface area
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { CylinderWorkspace } from './CylinderWorkspace';
import type { MathDomain, ModuleConfig, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-cylinder';

export class CylinderModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Cylinder';
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
      <CylinderWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new CylinderModule());
