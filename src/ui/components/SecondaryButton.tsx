'use client';

/**
 * MathG — Secondary Button
 * Secondary action, subtle
 */

export interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] font-medium
        bg-[var(--color-surface)] text-[var(--color-text)]
        hover:bg-[var(--color-border)] disabled:opacity-50 disabled:cursor-not-allowed
        rounded-[var(--btn-radius)] transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  );
}
