'use client';

/**
 * TermToggles — Toggle visibility of each term in composite equations
 */

export interface TermToggle {
  id: string;
  label: string;
  visible: boolean;
}

export interface TermTogglesProps {
  terms: TermToggle[];
  onToggle: (id: string, visible: boolean) => void;
  className?: string;
}

export function TermToggles({ terms, onToggle, className = '' }: TermTogglesProps) {
  if (terms.length === 0) return null;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Show terms</label>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <label key={t.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={t.visible}
              onChange={(e) => onToggle(t.id, e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{t.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
