'use client';

/**
 * Module 5: Statistics (Class 8, 9, 10)
 * Purpose: Help students understand data representation and interpretation
 * Features: Table input, bar graph, histogram, frequency polygon, mean/median/mode
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { StatisticsWorkspace } from './StatisticsWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'statistics-data-viz';

export class StatisticsModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Statistics';
  domain: MathDomain = 'statistics';
  version = '1.0.0';
  ncertChapter = 'Statistics';
  classRange = '8-10';

  getDefaultConfig(): ModuleConfig {
    return {
      parameters: [
        { id: 'classWidth', label: 'Class width', type: 'slider', defaultValue: 5, min: 1, max: 20, step: 1 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'bar', label: 'Bar graph', config: {} },
      { id: 'histogram', label: 'Histogram', config: {} },
      { id: 'polygon', label: 'Frequency polygon', config: {} },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <StatisticsWorkspace
        config={props.config as Record<string, unknown>}
        parameters={props.parameters}
        onParametersChange={props.onParametersChange}
      />
    );
  }
}

registerModule(new StatisticsModule());
