'use client';

import { AppLayout } from '@/ui/layout/AppLayout';
import { ModuleLauncher } from '@/ui/layout/ModuleLauncher';
import { TeacherLayout } from '@/ui/layout/TeacherLayout';
import '@/config/modules/register-all'; // Register all NCERT modules

export default function Home() {
  return (
    <AppLayout header={{ title: 'MathG', showBack: false }}>
      <TeacherLayout title="Choose a module">
        <p className="text-[var(--color-text-muted)] mb-6">
          Select a module to start. Teacher-first — 2 clicks to visualization.
        </p>
        <ModuleLauncher />
      </TeacherLayout>
    </AppLayout>
  );
}
