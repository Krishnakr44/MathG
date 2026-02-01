'use client';

/**
 * Module: Circle (Area Learning Engine)
 * Curved shape, sector coverage, πr² emergence
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { AreaLearningWorkspace } from '@/engines/area-learning-viz/AreaLearningWorkspace';
import { circleShape } from '@/engines/area-learning/shapes/circle-shape';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'geometry-circle-area';

export class CircleAreaModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Circle (Area Engine)';
  domain: MathDomain = 'geometry';
  version = '1.0.0';
  ncertChapter = 'Mensuration';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: circleShape.defineDimensions().map((d) => ({
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
      { id: 'small', label: 'Small circle (r=2)', config: {} },
      { id: 'large', label: 'Large circle (r=6)', config: {} },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <AreaLearningWorkspace
        shape={circleShape}
        title="Circle — Area Learning"
        backHref="/"
      />
    );
  }
}

registerModule(new CircleAreaModule());
