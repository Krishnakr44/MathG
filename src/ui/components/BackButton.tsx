'use client';

/**
 * MathG — Back Button
 * Returns to previous logical teaching step (not browser history)
 * Consistent location, clear text + arrow
 */

import Link from 'next/link';

export interface BackButtonProps {
  /** Destination (logical parent) */
  href: string;
  /** Optional label override */
  label?: string;
  /** Optional className */
  className?: string;
}

export function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-3 py-2 text-[var(--color-text)] font-medium hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-[var(--btn-radius-sm)] transition-colors ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
