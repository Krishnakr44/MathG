'use client';

/**
 * MathG — Panel / Card Container
 * Consistent container for content blocks
 */

export interface PanelProps {
  children: React.ReactNode;
  /** Optional title */
  title?: string;
  /** Optional className */
  className?: string;
}

export function Panel({ children, title, className = '' }: PanelProps) {
  return (
    <div
      className={`
        bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--btn-radius)]
        overflow-hidden
        ${className}
      `}
    >
      {title && (
        <div className="px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background-alt)]">
          <h2 className="text-sm font-medium text-[var(--color-text-muted)]">{title}</h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
