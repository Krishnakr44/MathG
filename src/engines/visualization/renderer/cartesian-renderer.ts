/**
 * Cartesian Renderer — Reusable graph (Canvas/SVG)
 * Extension point: PLOT_TYPE_REGISTRY for new plot types
 */

import type { IPlotDef } from '@/core/types/visualization.types';
import type { IPlotConfig } from '@/core/types';
import type { IGraphRenderer } from '@/core/types/visualization.types';

export class CartesianRenderer implements IGraphRenderer {
  private config: IPlotConfig | null = null;
  private plots: IPlotDef[] = [];
  private params: Record<string, number | boolean> = {};
  private canvas: HTMLCanvasElement | null = null;
  private width = 400;
  private height = 400;

  setConfig(config: IPlotConfig): void {
    this.config = config;
  }

  setPlots(plots: IPlotDef[]): void {
    this.plots = plots;
  }

  setParameterValues(values: Record<string, number | boolean>): void {
    this.params = values;
  }

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.render();
  }

  render(): void {
    if (!this.canvas || !this.config) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    const { bounds } = this.config;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.width, this.height);

    // Axes
    const x0 = this.xToPx(0);
    const y0 = this.yToPx(0);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(this.width, y0);
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, this.height);
    ctx.stroke();

    // Grid (optional)
    if (this.config.showGrid) {
      ctx.strokeStyle = '#eee';
      const step = this.config.gridStep ?? 1;
      for (let x = Math.ceil(bounds.xMin); x <= bounds.xMax; x += step) {
        const px = this.xToPx(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, this.height);
        ctx.stroke();
      }
      for (let y = Math.ceil(bounds.yMin); y <= bounds.yMax; y += step) {
        const py = this.yToPx(y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(this.width, py);
        ctx.stroke();
      }
    }

    // Plots — placeholder: actual function plotting would use evaluator
    this.plots
      .filter((p) => p.visible !== false)
      .forEach((plot) => {
        ctx.strokeStyle = plot.color ?? '#0066cc';
        ctx.lineWidth = plot.strokeWidth ?? 2;
        // Extension: dispatch by plot.type to PLOT_TYPE_REGISTRY
      });
  }

  private xToPx(x: number): number {
    if (!this.config) return 0;
    const { xMin, xMax } = this.config.bounds;
    return ((x - xMin) / (xMax - xMin)) * this.width;
  }

  private yToPx(y: number): number {
    if (!this.config) return 0;
    const { yMin, yMax } = this.config.bounds;
    return this.height - ((y - yMin) / (yMax - yMin)) * this.height;
  }
}
