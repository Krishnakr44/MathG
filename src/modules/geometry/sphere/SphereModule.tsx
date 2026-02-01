'use client';

/**
 * Module: Sphere (3D Curved Solid)
 * Radius, strip-based net approximation, surface area
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { SphereWorkspace } from './SphereWorkspace';
import type { MathDomain, ModuleConfig, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-sphere';

export class SphereModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Sphere';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '9';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'radius', label: 'Radius', type: 'slider', defaultValue: 1.5, min: 0.5, max: 2, step: 0.25 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <SphereWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new SphereModule());
