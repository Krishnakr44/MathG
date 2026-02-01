/**
 * Teacher Layout — Projection-friendly, 2–3 clicks max
 * Large fonts, high contrast, minimal animations
 */

import type { ReactNode } from 'react';

interface TeacherLayoutProps {
  children: ReactNode;
  title?: string;
}

export function TeacherLayout({ children, title }: TeacherLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {title && (
        <h1 className="text-[var(--text-heading)] font-bold mb-6 text-[var(--color-text)]">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
