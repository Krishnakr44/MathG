'use client';

/**
 * MathG — Mistake Trigger Component
 * Teachers trigger mistakes manually during class
 * Use in any module workspace
 */

import { useMistakeBankOptional } from '../MistakeBankContext';
import { getLocalizedText } from '../schema';
import type { Mistake, LocaleCode } from '../types';

export interface MistakeTriggerProps {
  /** Module domain (graphs, geometry, etc.) — used to resolve viz action */
  moduleDomain: string;
  /** Mistake options to show in dropdown */
  mistakes: Mistake[] | { id: string; name: string }[];
  /** Currently selected mistake ID */
  selectedId: string | null;
  /** Callback when teacher selects a mistake */
  onSelect: (mistakeId: string | null) => void;
  /** Optional: locale for display */
  locale?: LocaleCode;
  /** Label for the dropdown */
  label?: string;
  /** Placeholder when none selected */
  placeholder?: string;
  className?: string;
}

export function MistakeTrigger({
  moduleDomain,
  mistakes,
  selectedId,
  onSelect,
  label = 'Highlight misconception',
  placeholder = 'None',
  className = '',
}: MistakeTriggerProps) {
  const bank = useMistakeBankOptional();

  const handleChange = (mistakeId: string | null) => {
    onSelect(mistakeId);
    bank?.triggerMistake(mistakeId, moduleDomain);
  };

  const options = mistakes.map((m) => {
    const id = typeof m === 'object' && 'id' in m ? m.id : (m as Mistake).id;
    const name =
      typeof m === 'object' && 'name' in m
        ? m.name
        : getLocalizedText((m as Mistake).concept, bank?.locale ?? 'en');
    return { id, name };
  });

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={selectedId ?? ''}
        onChange={(e) => handleChange(e.target.value || null)}
        className="block w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
