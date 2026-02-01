'use client';

/**
 * ParameterSliders — Sliders for a, b, c bound to equation
 */

export interface ParameterSlidersProps {
  params: { id: string; label: string; value: number; min: number; max: number; step: number }[];
  onChange: (id: string, value: number) => void;
  className?: string;
}

export function ParameterSliders({ params, onChange, className = '' }: ParameterSlidersProps) {
  if (params.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">Parameters</label>
      {params.map((p) => (
        <div key={p.id} className="flex items-center gap-3">
          <label className="text-sm w-8">{p.label}</label>
          <input
            type="range"
            min={p.min}
            max={p.max}
            step={p.step}
            value={p.value}
            onChange={(e) => onChange(p.id, parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm w-12 tabular-nums">{p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
