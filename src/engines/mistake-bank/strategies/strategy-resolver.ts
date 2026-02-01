/**
 * Strategy Resolver — Links mistake → visualization strategy
 * Extension point: register new strategies
 */

import type { IVisualizationStrategy } from '@/core/types/visualization.types';
import type { IStrategyResolver } from '@/core/types/mistake-bank.types';

const strategies = new Map<string, IVisualizationStrategy>();

export function createStrategyResolver(
  initialStrategies: IVisualizationStrategy[] = []
): IStrategyResolver {
  initialStrategies.forEach((s) => strategies.set(s.id, s));

  return {
    getStrategy(id: string): IVisualizationStrategy | undefined {
      return strategies.get(id);
    },
  };
}

export function registerStrategy(strategy: IVisualizationStrategy): void {
  strategies.set(strategy.id, strategy);
}
