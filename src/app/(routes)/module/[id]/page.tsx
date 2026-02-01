'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getModule } from '@/core/registry/module-registry';
import { AppLayout } from '@/ui/layout/AppLayout';
import { TeacherLayout } from '@/ui/layout/TeacherLayout';
import '@/config/modules/register-all';

export default function ModulePage() {
  const params = useParams();
  const id = params?.id as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [parameters, setParameters] = useState<Record<string, number | boolean>>({});

  const module = id ? getModule(id) : undefined;

  useEffect(() => {
    if (module) {
      const cfg = module.getDefaultConfig();
      setConfig(cfg as Record<string, unknown>);
      const params: Record<string, number | boolean> = {};
      cfg.parameters?.forEach((p) => {
        params[p.id] = p.defaultValue;
      });
      setParameters(params);
    }
  }, [module]);

  if (!module) {
    return (
      <AppLayout header={{ title: 'Module not found', showBack: true, backHref: '/' }}>
        <TeacherLayout title="Module not found">
          <p className="text-[var(--color-text-muted)]">Module &quot;{id}&quot; not found.</p>
        </TeacherLayout>
      </AppLayout>
    );
  }

  return (
    <>
      {module.renderWorkspace({
        config: config ?? module.getDefaultConfig(),
        parameters,
        onParametersChange: setParameters,
      })}
    </>
  );
}
