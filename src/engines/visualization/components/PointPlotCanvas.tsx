'use client';

/**
 * PointPlotCanvas — Plots discrete points on Cartesian plane
 * Module 1: Introduction to Graphs — table → points → graph
 * Highlights quadrants, axes, adjustable scale
 */

import { useRef, useEffect, useCallback } from 'react';
import type { Bounds } from '@/core/types';

export interface PointPlotCanvasProps {
  points: { x: number; y: number; label?: string }[];
  bounds?: Bounds;
  showGrid?: boolean;
  showAxes?: boolean;
  highlightQuadrants?: boolean;
  connectPoints?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function PointPlotCanvas({
  points,
  bounds = DEFAULT_BOUNDS,
  showGrid = true,
  showAxes = true,
  highlightQuadrants = false,
  connectPoints = false,
  width = 500,
  height = 400,
  className = '',
}: PointPlotCanvasProps) {
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

    if (highlightQuadrants) {
      const x0 = xToPx(0);
      const y0 = yToPx(0);
      ctx.fillStyle = 'rgba(200, 220, 255, 0.2)';
      ctx.fillRect(0, 0, x0, y0);
      ctx.fillRect(x0, 0, w - x0, y0);
      ctx.fillStyle = 'rgba(255, 220, 200, 0.2)';
      ctx.fillRect(0, y0, x0, h - y0);
      ctx.fillRect(x0, y0, w - x0, h - y0);
    }

    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const xStep = Math.max(1, Math.ceil((xMax - xMin) / 10));
      const yStep = Math.max(1, Math.ceil((yMax - yMin) / 10));
      for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
        const px = xToPx(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
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

    if (connectPoints && points.length >= 2) {
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xToPx(points[0].x), yToPx(points[0].y));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(xToPx(points[i].x), yToPx(points[i].y));
      }
      ctx.stroke();
    }

    ctx.fillStyle = '#0066cc';
    ctx.strokeStyle = '#004499';
    ctx.lineWidth = 1.5;
    for (const p of points) {
      const px = xToPx(p.x);
      const py = yToPx(p.y);
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      if (p.label) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.fillText(p.label, px + 8, py - 4);
        ctx.fillStyle = '#0066cc';
      }
    }
  }, [points, bounds, showGrid, showAxes, highlightQuadrants, connectPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
