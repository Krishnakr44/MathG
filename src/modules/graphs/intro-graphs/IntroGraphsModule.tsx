'use client';

/**
 * Module 1: Introduction to Graphs (Class 8)
 * Purpose: Help students understand what graphs represent and how points relate to real situations
 * Features: Cartesian plane, plot points, table input, quadrant highlighting
 */

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { IntroGraphsWorkspace } from './IntroGraphsWorkspace';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-intro';

export class IntroGraphsModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Introduction to Graphs';
  domain: MathDomain = 'graphs';
  version = '1.0.0';
  ncertChapter = 'Introduction to Graphs';
  classRange = '8';

  getDefaultConfig(): ModuleConfig {
    return {
      bounds: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
      parameters: [
        { id: 'xScale', label: 'X scale', type: 'slider', defaultValue: 10, min: 5, max: 20, step: 1 },
        { id: 'yScale', label: 'Y scale', type: 'slider', defaultValue: 10, min: 5, max: 20, step: 1 },
      ],
    };
  }

  getLinkedMistakes(): string[] {
    return [];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'distance-time', label: 'Distance–Time', config: {} },
      { id: 'simple-points', label: 'Simple points', config: {} },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return <IntroGraphsWorkspace config={props.config} />;
  }
}

registerModule(new IntroGraphsModule());
