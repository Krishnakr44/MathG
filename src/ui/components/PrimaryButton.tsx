'use client';

/**
 * MathG — Primary Button
 * Main action, high visibility
 */

export interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] font-medium
        bg-[var(--color-primary)] text-white
        hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed
        rounded-[var(--btn-radius)] transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  );
}
