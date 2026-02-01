/**
 * Visualization Engine — Public API
 * Graph renderer, controls, plot types
 */

export { CartesianRenderer } from './renderer/cartesian-renderer';
export { GraphCanvas } from './components/GraphCanvas';
export { PointPlotCanvas } from './components/PointPlotCanvas';
export { LinePlotCanvas } from './components/LinePlotCanvas';
export { BarChartCanvas } from './components/BarChartCanvas';
export { QuadraticCanvas } from './components/QuadraticCanvas';
export { PolynomialCanvas } from './components/PolynomialCanvas';
export { createParameterControls } from './controls/parameter-controls';
export type { IGraphRenderer, IPlotDef, IVisualizationStrategy } from '@/core/types';
