'use client';

/**
 * TeacherUtilities — Grid, axes, intercepts, annotations, misconception highlights
 */

export interface TeacherUtilitiesProps {
  showGrid: boolean;
  showAxes: boolean;
  showIntercepts: boolean;
  onShowGridChange: (v: boolean) => void;
  onShowAxesChange: (v: boolean) => void;
  onShowInterceptsChange: (v: boolean) => void;
  onReset: () => void;
  onCompare?: () => void;
  selectedMistakeId?: string | null;
  onMistakeSelect?: (id: string | null) => void;
  mistakeOptions?: { id: string; name: string }[];
  className?: string;
}

export function TeacherUtilities({
  showGrid,
  showAxes,
  showIntercepts,
  onShowGridChange,
  onShowAxesChange,
  onShowInterceptsChange,
  onReset,
  onCompare,
  selectedMistakeId,
  onMistakeSelect,
  mistakeOptions = [],
  className = '',
}: TeacherUtilitiesProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">Display</label>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => onShowGridChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Grid</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAxes}
            onChange={(e) => onShowAxesChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Axes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showIntercepts}
            onChange={(e) => onShowInterceptsChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm">Intercepts</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Reset
        </button>
        {onCompare && (
          <button
            type="button"
            onClick={onCompare}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Compare
          </button>
        )}
      </div>

      {mistakeOptions.length > 0 && onMistakeSelect && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Highlight misconception
          </label>
          <select
            value={selectedMistakeId ?? ''}
            onChange={(e) => onMistakeSelect(e.target.value || null)}
            className="block w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="">None</option>
            {mistakeOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
