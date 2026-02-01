/**
 * Module Registry — Extension point for pluggable math modules
 * Add new domains by registering here
 */

import type { IMathModule } from '@/core/types/module.types';

const modules = new Map<string, IMathModule>();

export function registerModule(module: IMathModule): void {
  if (modules.has(module.id)) {
    console.warn(`[MathG] Module "${module.id}" already registered, overwriting`);
  }
  modules.set(module.id, module);
}

export function getModule(id: string): IMathModule | undefined {
  return modules.get(id);
}

export function getModulesByDomain(domain: string): IMathModule[] {
  return Array.from(modules.values()).filter((m) => m.domain === domain);
}

export function getAllModules(): IMathModule[] {
  return Array.from(modules.values());
}
