/**
 * Graphs Module — Linear equations (y = mx + c)
 * Example pluggable module
 */

'use client';

import { BaseMathModule } from '@/modules/_base/base-module';
import { registerModule } from '@/core/registry/module-registry';
import { AppLayout } from '@/ui/layout/AppLayout';
import { DEFAULT_BOUNDS } from '@/core/constants/defaults';
import type { MathDomain, ModuleConfig, QuickAction, WorkspaceProps } from '@/core/types';

const MODULE_ID = 'graphs-linear';

class LinearGraphsModule extends BaseMathModule {
  id = MODULE_ID;
  name = 'Linear Graphs (y = mx + c)';
  domain: MathDomain = 'graphs';
  version = '1.0.0';

  getDefaultConfig(): ModuleConfig {
    return {
      expressions: ['2*x + 1', '-x + 3'],
      parameters: [
        { id: 'm', label: 'Slope (m)', type: 'slider', defaultValue: 2, min: -5, max: 5, step: 0.5 },
        { id: 'c', label: 'Intercept (c)', type: 'slider', defaultValue: 1, min: -5, max: 5, step: 0.5 },
      ],
      bounds: DEFAULT_BOUNDS,
      mistakeIds: ['mistake-sign-slope', 'mistake-intercept-zero'],
    };
  }

  getLinkedMistakes(): string[] {
    return ['mistake-sign-slope', 'mistake-intercept-zero'];
  }

  getQuickActions(): QuickAction[] {
    return [
      { id: 'parallel', label: 'Parallel lines', config: { expressions: ['x + 1', 'x - 2'] } },
      { id: 'perpendicular', label: 'Perpendicular', config: { expressions: ['x', '-x'] } },
    ];
  }

  renderWorkspace(props: WorkspaceProps): React.ReactNode {
    return (
      <AppLayout
        header={{
          title: this.name,
          showBack: true,
          backHref: '/',
        }}
      >
        <div className="p-6">
          <div className="p-4 border border-[var(--color-border)] rounded-[var(--btn-radius)] bg-[var(--color-background)]">
            <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">{this.name}</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Config: {JSON.stringify(props.config.expressions?.join(', '))}
            </p>
            <div className="h-64 bg-[var(--color-surface)] rounded-[var(--btn-radius-sm)] flex items-center justify-center text-[var(--color-text-muted)]">
              [Graph canvas placeholder — connect CartesianRenderer]
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
}

// Auto-register on import
registerModule(new LinearGraphsModule());
