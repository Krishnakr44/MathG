'use client';

/**
 * MathG — App Layout
 * Global header + content area with consistent padding
 * Header is fixed; content has top padding for header height
 */

import { Header } from '@/ui/components/Header';
import type { HeaderProps } from '@/ui/components/Header';

export interface AppLayoutProps {
  children: React.ReactNode;
  /** Header props */
  header?: HeaderProps;
}

export function AppLayout({ children, header = {} }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      <Header {...header} />
      <main
        className="min-h-screen pt-[var(--header-height)]"
        style={{ paddingTop: 'var(--header-height)' }}
      >
        {children}
      </main>
    </div>
  );
}
