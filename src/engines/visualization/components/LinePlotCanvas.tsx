'use client';

/**
 * LinePlotCanvas — Plots lines (y = mx + c) on Cartesian plane
 * Module 2 & 3: Linear equations, pair of linear equations
 * Highlights intercepts, intersection point
 */

import { useRef, useEffect, useCallback } from 'react';
import { evaluateLinear } from '@/engines/math/utils/linear-utils';
import type { Bounds } from '@/core/types';

export interface LineDef {
  m: number;
  c: number;
  color?: string;
  label?: string;
}

export interface LinePlotCanvasProps {
  lines: LineDef[];
  intersection?: { x: number; y: number } | null;
  bounds?: Bounds;
  showGrid?: boolean;
  showAxes?: boolean;
  showIntercepts?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
const LINE_COLORS = ['#0066cc', '#dc2626', '#059669'];

export function LinePlotCanvas({
  lines,
  intersection = null,
  bounds = DEFAULT_BOUNDS,
  showGrid = true,
  showAxes = true,
  showIntercepts = true,
  width = 600,
  height = 400,
  className = '',
}: LinePlotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { xMin, xMax, yMin, yMax } = bounds;
    const w = canvas.width;
    const h = canvas.height;

    const xToPx = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const yToPx = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const step = Math.max(1, Math.ceil((xMax - xMin) / 10));
      for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
        const px = xToPx(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) {
        const py = yToPx(y);
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }
    }

    if (showAxes) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.5;
      const x0 = xToPx(0);
      const y0 = yToPx(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y0);
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, h);
      ctx.stroke();
    }

    lines.forEach((line, i) => {
      const color = line.color ?? LINE_COLORS[i % LINE_COLORS.length];
      const y1 = evaluateLinear(line.m, line.c, xMin);
      const y2 = evaluateLinear(line.m, line.c, xMax);
      const p1 = { x: xMin, y: y1 };
      const p2 = { x: xMax, y: y2 };
      const px1 = xToPx(p1.x);
      const py1 = yToPx(p1.y);
      const px2 = xToPx(p2.x);
      const py2 = yToPx(p2.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();

      if (showIntercepts) {
        const yAt0 = evaluateLinear(line.m, line.c, 0);
        if (Number.isFinite(yAt0) && yAt0 >= yMin && yAt0 <= yMax) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(xToPx(0), yToPx(yAt0), 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });

    if (intersection && Number.isFinite(intersection.x) && Number.isFinite(intersection.y)) {
      const px = xToPx(intersection.x);
      const py = yToPx(intersection.y);
      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.fillText(
          `(${intersection.x.toFixed(1)}, ${intersection.y.toFixed(1)})`,
          px + 10,
          py - 6
        );
      }
    }
  }, [lines, intersection, bounds, showGrid, showAxes, showIntercepts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
