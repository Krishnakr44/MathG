'use client';

/**
 * MathG — Global Header
 * Fixed, consistent across all pages
 * Left: Logo | Center: Module name | Right: Reset, Help
 */

import Link from 'next/link';
import { IconButton } from './IconButton';

export interface HeaderProps {
  /** Current module/screen name (center) */
  title?: string;
  /** Callback for Reset action */
  onReset?: () => void;
  /** Callback for Help action */
  onHelp?: () => void;
  /** Show back button (when not on home) */
  showBack?: boolean;
  /** Back destination (default: /) */
  backHref?: string;
}

export function Header({
  title = 'MathG',
  onReset,
  onHelp,
  showBack = false,
  backHref = '/',
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] flex items-center justify-between px-4 bg-[var(--color-background)] border-b border-[var(--color-border)]"
      style={{ boxShadow: 'var(--header-shadow)' }}
    >
      {/* Left: Logo / Back */}
      <div className="flex items-center gap-3 min-w-0">
        {showBack ? (
          <Link
            href={backHref}
            className="flex items-center gap-2 text-[var(--color-text)] font-medium hover:text-[var(--color-primary)] transition-colors shrink-0"
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
            <span>Back</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="font-bold text-lg text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors shrink-0"
          >
            MathG
          </Link>
        )}
      </div>

      {/* Center: Module name */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-[var(--color-text)] truncate max-w-[50%]">
        {title}
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-[var(--btn-radius-sm)] transition-colors"
          >
            Reset
          </button>
        )}
        {onHelp && (
          <IconButton
            icon="help"
            label="Help"
            onClick={onHelp}
          />
        )}
      </div>
    </header>
  );
}
