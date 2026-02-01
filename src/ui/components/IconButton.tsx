'use client';

/**
 * MathG — Icon Button
 * Minimal, icon-only actions
 */

const ICONS: Record<string, React.ReactNode> = {
  help: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  ),
  reset: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  ),
};

export interface IconButtonProps {
  icon: keyof typeof ICONS;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function IconButton({ icon, label, onClick, className = '' }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]
        rounded-[var(--btn-radius-sm)] transition-colors
        ${className}
      `}
    >
      {ICONS[icon]}
    </button>
  );
}
