'use client';

/**
 * Module: 3D Solids (Unified)
 * Cube, Cuboid, Prism, Cylinder, Cone, Sphere
 * Figure selector + shared camera, scale, rotation, net unfolding
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { Solids3DWorkspace } from './Solids3DWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-solids-3d';

export class Solids3DModule extends BaseMathModule {
  id = MODULE_ID;
  name = '3D Solids';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'figure', label: 'Figure', type: 'slider', defaultValue: 1, min: 0, max: 5, step: 1 },
        { id: 'length', label: 'Length', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 0.5 },
        { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 2, min: 1, max: 6, step: 0.5 },
        { id: 'height', label: 'Height', type: 'slider', defaultValue: 2, min: 1, max: 6, step: 0.5 },
        { id: 'baseWidth', label: 'Base width', type: 'slider', defaultValue: 3, min: 1, max: 5, step: 0.5 },
        { id: 'baseHeight', label: 'Base height', type: 'slider', defaultValue: 2, min: 1, max: 5, step: 0.5 },
        { id: 'baseShape', label: 'Base shape', type: 'slider', defaultValue: 0, min: 0, max: 1, step: 1 },
        { id: 'radius', label: 'Radius', type: 'slider', defaultValue: 1.5, min: 0.5, max: 3, step: 0.25 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'cube', label: 'Cube', config: { parameters: [{ id: 'figure', label: 'Figure', type: 'slider', defaultValue: 0 }] } },
      { id: 'cylinder', label: 'Cylinder', config: { parameters: [{ id: 'figure', label: 'Figure', type: 'slider', defaultValue: 3 }] } },
      { id: 'cone', label: 'Cone', config: { parameters: [{ id: 'figure', label: 'Figure', type: 'slider', defaultValue: 4 }] } },
      { id: 'sphere', label: 'Sphere', config: { parameters: [{ id: 'figure', label: 'Figure', type: 'slider', defaultValue: 5 }] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    const params = props.parameters as Record<string, unknown>;
    const figureMap = ['cube', 'cuboid', 'prism', 'cylinder', 'cone', 'sphere'];
    const figure =
      typeof params?.figure === 'string' && figureMap.includes(params.figure)
        ? params.figure
        : figureMap[Math.min(Math.max(0, Math.floor(Number(params?.figure) || 1)), 5)] ?? 'cuboid';
    const parameters = { ...params, figure } as Record<string, unknown>;

    return (
      <Solids3DWorkspace
        config={props.config as Record<string, unknown>}
        parameters={parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new Solids3DModule());
