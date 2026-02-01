'use client';

/**
 * Module: Square & Rectangle (2D)
 * Grid-based coverage, rows × columns
 * Area emerges as number of unit squares
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { RectangleWorkspace } from './RectangleWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-rectangle';

export class RectangleModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Square & Rectangle';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'length', label: 'Length', type: 'slider', defaultValue: 4, min: 1, max: 12, step: 1 },
        { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 3, min: 1, max: 12, step: 1 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'square', label: 'Square (4×4)', config: { parameters: [{ id: 'length', label: 'Length', type: 'slider', defaultValue: 4, min: 1, max: 12, step: 1 }, { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 4, min: 1, max: 12, step: 1 }] } },
      { id: 'wide', label: 'Wide rectangle', config: { parameters: [{ id: 'length', label: 'Length', type: 'slider', defaultValue: 6, min: 1, max: 12, step: 1 }, { id: 'breadth', label: 'Breadth', type: 'slider', defaultValue: 2, min: 1, max: 12, step: 1 }] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <RectangleWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new RectangleModule());
