'use client';

/**
 * Module 4: Quadratic Equations (Class 10)
 * Purpose: Build intuition for parabolas and roots without heavy algebra
 * Features: ax²+bx+c, sliders, roots, vertex, axis of symmetry
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { QuadraticWorkspace } from './QuadraticWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-quadratic';

export class QuadraticModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Quadratic Equations';
  domain: MathDomain = 'graphs';
  version = '1.0.0';
  ncertChapter = 'Quadratic Equations';
  classRange = '10';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'a', label: 'a', type: 'slider', defaultValue: 1, min: -3, max: 3, step: 0.5 },
        { id: 'b', label: 'b', type: 'slider', defaultValue: 0, min: -5, max: 5, step: 0.5 },
        { id: 'c', label: 'c', type: 'slider', defaultValue: 0, min: -5, max: 5, step: 0.5 },
      ],
      bounds: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'two-roots', label: 'Two roots', config: { parameters: [{ id: 'a', label: 'a', type: 'slider', defaultValue: 1, min: -3, max: 3, step: 0.5 }, { id: 'b', label: 'b', type: 'slider', defaultValue: -3, min: -5, max: 5, step: 0.5 }, { id: 'c', label: 'c', type: 'slider', defaultValue: 2, min: -5, max: 5, step: 0.5 }] } },
      { id: 'one-root', label: 'One root', config: { parameters: [{ id: 'a', label: 'a', type: 'slider', defaultValue: 1, min: -3, max: 3, step: 0.5 }, { id: 'b', label: 'b', type: 'slider', defaultValue: -2, min: -5, max: 5, step: 0.5 }, { id: 'c', label: 'c', type: 'slider', defaultValue: 1, min: -5, max: 5, step: 0.5 }] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <QuadraticWorkspace
        config={props.config}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new QuadraticModule());
