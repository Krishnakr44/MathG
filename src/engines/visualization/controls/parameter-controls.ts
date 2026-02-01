/**
 * Parameter Controls — Sliders, toggles
 * Toggle individual equation terms ON/OFF
 */

import type { ParameterDef, ParameterValues } from '@/core/types';
import type { IParameterControl } from '@/core/types/visualization.types';

export function createParameterControls(
  defs: ParameterDef[],
  values: ParameterValues,
  onChange: (values: ParameterValues) => void
): IParameterControl[] {
  return defs.map((def) => ({
    id: def.id,
    getValue: () => values[def.id] ?? def.defaultValue,
    setValue: (v: number | boolean) => {
      onChange({ ...values, [def.id]: v });
    },
    render: () => null, // React component would render here
  }));
}
