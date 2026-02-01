'use client';

/**
 * Module: Square & Rectangle (Area Learning Engine)
 * Flat shape, grid coverage, formula emergence
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { AreaLearningWorkspace } from '@/engines/area-learning-viz/AreaLearningWorkspace';
import { rectangleShape } from '@/engines/area-learning/shapes/rectangle-shape';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-rectangle-area';

export class RectangleAreaModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Rectangle (Area Engine)';
  domain: MathDomain = 'geometry';
  version = '2.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: rectangleShape.defineDimensions().map((d) => ({
        id: d.id,
        label: d.label,
        type: 'slider' as const,
        defaultValue: d.defaultValue,
        min: d.min,
        max: d.max,
        step: d.step,
      })),
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'square', label: 'Square (4×4)', config: {} },
      { id: 'wide', label: 'Wide rectangle', config: {} },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <AreaLearningWorkspace
        shape={rectangleShape}
        title="Rectangle — Area Learning"
        backHref="/"
      />
    );
  }
}

registerModule(new RectangleAreaModule());
