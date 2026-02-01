'use client';

/**
 * Module 6: Polynomials (Class 9–10)
 * Purpose: Explain zeros of polynomials and their graphical meaning
 * Features: Polynomial input (degree ≤3), graph, x-intercepts
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { PolynomialsWorkspace } from './PolynomialsWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'algebra-polynomials';

export class PolynomialsModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Polynomials';
  domain: MathDomain = 'algebra';
  version = '1.0.0';
  ncertChapter = 'Polynomials';
  classRange = '9-10';

  getDefaultConfig(): ModuleConfig {
    return {
      expressions: ['x^2 - 3*x + 2'],
      bounds: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'quadratic', label: 'Quadratic', config: { expressions: ['x^2 - 3*x + 2'] } },
      { id: 'cubic', label: 'Cubic', config: { expressions: ['x^3 - 2*x'] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return <PolynomialsWorkspace config={props.config} />;
  }
}

registerModule(new PolynomialsModule());
