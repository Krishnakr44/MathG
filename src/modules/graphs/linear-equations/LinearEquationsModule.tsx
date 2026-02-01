'use client';

/**
 * Module 2: Linear Equations in Two Variables (Class 9–10)
 * Purpose: Show how linear equations form straight lines and represent infinite solutions
 * Features: ax+by+c=0 → y=mx+c, sliders, intercepts
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { LinearEquationsWorkspace } from './LinearEquationsWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-linear-equations';

export class LinearEquationsModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Linear Equations in Two Variables';
  domain: MathDomain = 'graphs';
  version = '1.0.0';
  ncertChapter = 'Linear Equations in Two Variables';
  classRange = '9-10';

  getDefaultConfig(): ModuleConfig {
    return {
      expressions: ['y = 2*x + 1'],
      parameters: [
        { id: 'm', label: 'Slope (m)', type: 'slider', defaultValue: 2, min: -5, max: 5, step: 0.5 },
        { id: 'c', label: 'Intercept (c)', type: 'slider', defaultValue: 1, min: -5, max: 5, step: 0.5 },
      ],
      bounds: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
      mistakeIds: ['mistake-sign-slope', 'mistake-intercept-zero'],
    };
  }

  getLinkedMistakes(): string[] {
    return ['mistake-sign-slope', 'mistake-intercept-zero'];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'horizontal', label: 'Horizontal (y=c)', config: { expressions: ['y = 3'] } },
      { id: 'vertical-slope', label: 'Steep slope', config: { expressions: ['y = 4*x - 2'] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <LinearEquationsWorkspace
        config={props.config}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new LinearEquationsModule());
