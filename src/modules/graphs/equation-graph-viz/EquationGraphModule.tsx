'use client';

/**
 * Equation & Graph Visualization Module — Standalone pluggable module
 * Plugs into MathG core architecture
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { getMistakesByModule } from '@/engines/mistake-bank/registry';
import { GraphWorkspaceLayout } from './GraphWorkspaceLayout';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-equation-viz';
const TWO_PI = 2 * Math.PI;

export class EquationGraphModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Equation & Graph Visualization';
  domain: MathDomain = 'graphs';
  version = '1.0.0';

  getDefaultConfig(): ModuleConfig {
    return {
      expressions: ['y = a*sin(x) + b'],
      parameters: [
        { id: 'a', label: 'a', type: 'slider', defaultValue: 1, min: -3, max: 3, step: 0.1 },
        { id: 'b', label: 'b', type: 'slider', defaultValue: 0, min: -3, max: 3, step: 0.1 },
      ],
      bounds: { xMin: -TWO_PI, xMax: TWO_PI, yMin: -4, yMax: 4 },
      mistakeIds: ['mistake-sign-slope', 'mistake-intercept-zero', 'mistake-sin-domain'],
    };
  }

  getLinkedMistakes(): string[] {
    return ['mistake-sign-slope', 'mistake-intercept-zero', 'mistake-sin-domain'];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'linear', label: 'Linear (y = ax + b)', config: { expressions: ['y = a*x + b'] } },
      { id: 'sine', label: 'Sine', config: { expressions: ['y = sin(x)'] } },
      { id: 'sine-shift', label: 'Sine + shift', config: { expressions: ['y = a*sin(x) + b'] } },
      { id: 'tangent', label: 'Tangent', config: { expressions: ['y = tan(x)'] } },
      { id: 'quadratic', label: 'Quadratic', config: { expressions: ['y = a*x^2 + b*x + c'] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    const initialEquation = (props.config.expressions?.[0] as string) ?? 'y = sin(x)';
    const linkedMistakes = getMistakesByModule(this.id);

    return (
      <GraphWorkspaceLayout
        initialEquation={initialEquation}
        linkedMistakes={linkedMistakes}
      />
    );
  }
}

registerModule(new EquationGraphModule());
