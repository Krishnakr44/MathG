'use client';

/**
 * GraphCanvas — Renders functions on Cartesian plane
 * Handles discontinuities, undefined regions, teacher-friendly bounds
 * Optimized for low-end PCs (bounded sampling)
 */

import { useRef, useEffect, useCallback } from 'react';
import { createExpressionEvaluator } from '@/engines/math/evaluator/evaluator';
import { createDomainValidator } from '@/engines/math/validator/domain-validator';
import type { ASTNode } from '@/core/types/math-engine.types';
import type { Bounds } from '@/core/types';

const TWO_PI = 2 * Math.PI;
const DEFAULT_BOUNDS: Bounds = { xMin: -TWO_PI, xMax: TWO_PI, yMin: -4, yMax: 4 };
const SAMPLE_COUNT = 300; // Low-end PC friendly
const GAP_THRESHOLD = 0.5; // Treat as discontinuity if y jump > this

export interface GraphCanvasProps {
  ast: ASTNode | null;
  params?: Record<string, number>;
  bounds?: Bounds;
  showGrid?: boolean;
  showAxes?: boolean;
  showIntercepts?: boolean;
  color?: string;
  width?: number;
  height?: number;
  highlightRegions?: { xMin: number; xMax: number; yMin: number; yMax: number }[];
  annotations?: { x: number; y: number; label: string; type?: 'label' | 'arrow' }[];
  className?: string;
}

const evaluator = createExpressionEvaluator();
const domainValidator = createDomainValidator();

function sampleFunction(
  ast: ASTNode,
  xMin: number,
  xMax: number,
  params: Record<string, number>
): { x: number; y: number; valid: boolean }[] {
  const points: { x: number; y: number; valid: boolean }[] = [];
  const undefinedPoints = domainValidator.getUndefinedPoints(ast, xMin, xMax);
  const step = (xMax - xMin) / SAMPLE_COUNT;

  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const x = xMin + i * step;
    const y = evaluator.evaluate(ast, x, params);
    const valid = Number.isFinite(y);
    points.push({ x, y, valid });
  }

  return points;
}

function splitAtDiscontinuities(
  points: { x: number; y: number; valid: boolean }[],
  yMin: number,
  yMax: number
): { x: number; y: number }[][] {
  const segments: { x: number; y: number }[][] = [];
  let current: { x: number; y: number }[] = [];

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const prev = points[i - 1];

    // Gap: invalid point or large jump
    const isGap =
      !p.valid ||
      (prev && prev.valid && Math.abs(p.y - prev.y) > GAP_THRESHOLD * (yMax - yMin));
    const outOfBounds = p.valid && (p.y < yMin - 1 || p.y > yMax + 1);

    if (isGap || outOfBounds) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    } else if (p.valid) {
      current.push({ x: p.x, y: p.y });
    }
  }
  if (current.length > 0) segments.push(current);
  return segments;
}

export function GraphCanvas({
  ast,
  params = {},
  bounds = DEFAULT_BOUNDS,
  showGrid = true,
  showAxes = true,
  showIntercepts = true,
  color = '#0066cc',
  width = 600,
  height = 400,
  highlightRegions = [],
  annotations = [],
  className = '',
}: GraphCanvasProps) {
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

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Highlight regions (e.g. misconception zones)
    if (highlightRegions.length > 0) {
      ctx.fillStyle = 'rgba(255, 200, 0, 0.15)';
      for (const r of highlightRegions) {
        const px1 = xToPx(r.xMin);
        const px2 = xToPx(r.xMax);
        const py1 = yToPx(r.yMax);
        const py2 = yToPx(r.yMin);
        ctx.fillRect(px1, py1, px2 - px1, py2 - py1);
      }
    }

    // Grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      const xStep = xMax - xMin > 4 * Math.PI ? Math.PI : 1;
      const yStep = 1;
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

    // Axes
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

    // Plot function
    if (ast) {
      const points = sampleFunction(ast, xMin, xMax, params);
      const segments = splitAtDiscontinuities(points, yMin, yMax);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (const seg of segments) {
        if (seg.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(xToPx(seg[0].x), yToPx(seg[0].y));
        for (let i = 1; i < seg.length; i++) {
          ctx.lineTo(xToPx(seg[i].x), yToPx(seg[i].y));
        }
        ctx.stroke();
      }

      // Vertical asymptotes (dashed) at undefined points
      const undefinedPoints = domainValidator.getUndefinedPoints(ast, xMin, xMax);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1;
      for (const x of undefinedPoints) {
        const px = xToPx(x);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Intercepts
    if (showIntercepts && ast) {
      const yAtZero = evaluator.evaluate(ast, 0, params);
      if (Number.isFinite(yAtZero) && yAtZero >= yMin && yAtZero <= yMax) {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(xToPx(0), yToPx(yAtZero), 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.fillText(`(0, ${yAtZero.toFixed(1)})`, xToPx(0) + 8, yToPx(yAtZero) - 4);
      }
    }

    // Annotations
    for (const a of annotations) {
      const px = xToPx(a.x);
      const py = yToPx(a.y);
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.fillText(a.label, px + 6, py - 4);
      if (a.type === 'arrow') {
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + 20, py - 10);
        ctx.stroke();
      }
    }
  }, [
    ast,
    params,
    bounds,
    showGrid,
    showAxes,
    showIntercepts,
    color,
    highlightRegions,
    annotations,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
