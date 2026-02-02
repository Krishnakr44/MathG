'use client';

/**
 * MathG — Custom Error Boundary
 * Avoids Next.js built-in ErrorBoundary's usePathname() which can fail
 * with "Cannot read properties of null (reading 'useContext')" during error recovery.
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[MathG] Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--color-background-alt)]">
      <div className="max-w-md w-full p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]">
        <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2">
          Something went wrong
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white rounded-[var(--btn-radius)] hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text)] rounded-[var(--btn-radius)] hover:bg-[var(--color-border)] transition-colors inline-flex items-center"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
