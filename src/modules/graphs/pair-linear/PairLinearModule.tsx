'use client';

/**
 * Module 3: Pair of Linear Equations (Class 10)
 * Purpose: Visually explain consistency, inconsistency, dependency
 * Features: Two equations, intersection, classify: one/no/infinite solutions
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { PairLinearWorkspace } from './PairLinearWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-pair-linear';

export class PairLinearModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Pair of Linear Equations';
  domain: MathDomain = 'graphs';
  version = '1.0.0';
  ncertChapter = 'Pair of Linear Equations in Two Variables';
  classRange = '10';

  getDefaultConfig(): ModuleConfig {
    return {
      expressions: ['y = x + 1', 'y = -x + 3'],
      bounds: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'one-solution', label: 'One solution', config: { expressions: ['y = x + 1', 'y = -x + 3'] } },
      { id: 'no-solution', label: 'No solution (parallel)', config: { expressions: ['y = x + 1', 'y = x - 2'] } },
      { id: 'infinite', label: 'Infinite (coincident)', config: { expressions: ['y = x + 1', 'y = x + 1'] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return <PairLinearWorkspace config={props.config} />;
  }
}

registerModule(new PairLinearModule());
