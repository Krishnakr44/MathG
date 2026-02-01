'use client';

/**
 * QuadraticCanvas — Parabola with roots, vertex, axis of symmetry
 * Module 4: Quadratic Equations
 */

import { useRef, useEffect, useCallback } from 'react';
import { evaluateQuadratic, quadraticRoots, quadraticVertex } from '@/engines/math/utils/quadratic-utils';
import type { Bounds } from '@/core/types';

export interface QuadraticCanvasProps {
  a: number;
  b: number;
  c: number;
  bounds?: Bounds;
  showRoots?: boolean;
  showVertex?: boolean;
  showAxis?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function QuadraticCanvas({
  a,
  b,
  c,
  bounds = DEFAULT_BOUNDS,
  showRoots = true,
  showVertex = true,
  showAxis = true,
  width = 600,
  height = 450,
  className = '',
}: QuadraticCanvasProps) {
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

    const SAMPLE_COUNT = 300;
    const stepX = (xMax - xMin) / SAMPLE_COUNT;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const x = xMin + i * stepX;
      const y = evaluateQuadratic(a, b, c, x);
      if (Number.isFinite(y) && y >= yMin - 2 && y <= yMax + 2) {
        points.push({ x, y });
      }
    }

    ctx.strokeStyle = '#0066cc';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (points.length >= 2) {
      ctx.moveTo(xToPx(points[0].x), yToPx(points[0].y));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(xToPx(points[i].x), yToPx(points[i].y));
      }
    }
    ctx.stroke();

    const roots = quadraticRoots(a, b, c);
    if (showRoots && roots.real.length > 0) {
      ctx.fillStyle = '#dc2626';
      for (const r of roots.real) {
        if (r >= xMin && r <= xMax) {
          const px = xToPx(r);
          ctx.beginPath();
          ctx.arc(px, yToPx(0), 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#374151';
          ctx.font = '11px sans-serif';
          ctx.fillText(`(${r.toFixed(1)}, 0)`, px + 6, yToPx(0) - 4);
          ctx.fillStyle = '#dc2626';
        }
      }
    }

    const vertex = quadraticVertex(a, b, c);
    if (showVertex && Number.isFinite(vertex.x) && Number.isFinite(vertex.y)) {
      if (vertex.x >= xMin && vertex.x <= xMax && vertex.y >= yMin && vertex.y <= yMax) {
        const px = xToPx(vertex.x);
        const py = yToPx(vertex.y);
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#374151';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Vertex (${vertex.x.toFixed(1)}, ${vertex.y.toFixed(1)})`, px + 8, py - 4);
      }
    }

    if (showAxis && a !== 0) {
      const axisX = -b / (2 * a);
      if (axisX >= xMin && axisX <= xMax) {
        const px = xToPx(axisX);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [a, b, c, bounds, showRoots, showVertex, showAxis]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
