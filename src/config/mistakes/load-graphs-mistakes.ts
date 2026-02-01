/**
 * MathG — Load graph misconceptions into Mistake Bank
 * Modules register their mistakes without touching core code
 */

import { registerMistakes } from '@/engines/mistake-bank/registry';
import type { Mistake } from '@/engines/mistake-bank/schema';

// Import JSON configs (Next.js / bundler resolves these)
import mistakeSignSlope from './graphs/mistake-sign-slope.json';
import mistakeInterceptZero from './graphs/mistake-intercept-zero.json';
import mistakeSinDomain from './graphs/mistake-sin-domain.json';

const GRAPHS_MODULE_ID = 'graphs-equation-viz';

const graphMistakes: Mistake[] = [
  mistakeSignSlope as Mistake,
  mistakeInterceptZero as Mistake,
  mistakeSinDomain as Mistake,
];

export function loadGraphsMistakes(): void {
  registerMistakes({
    moduleId: GRAPHS_MODULE_ID,
    mistakes: graphMistakes,
  });
}
