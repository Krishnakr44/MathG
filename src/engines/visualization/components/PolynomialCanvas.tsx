'use client';

/**
 * PolynomialCanvas — Plots polynomial with zeros (x-intercepts)
 * Module 6: Polynomials (degree ≤ 3)
 */

import { useRef, useEffect, useCallback } from 'react';
import { evaluatePolynomial, polynomialZeros } from '@/engines/math/utils/polynomial-utils';
import type { Bounds } from '@/core/types';

export interface PolynomialCanvasProps {
  coefficients: number[];
  bounds?: Bounds;
  showZeros?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_BOUNDS: Bounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

export function PolynomialCanvas({
  coefficients,
  bounds = DEFAULT_BOUNDS,
  showZeros = true,
  width = 600,
  height = 450,
  className = '',
}: PolynomialCanvasProps) {
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
      const y = evaluatePolynomial(coefficients, x);
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

    const zeros = polynomialZeros(coefficients);
    if (showZeros && zeros.length > 0) {
      ctx.fillStyle = '#dc2626';
      for (const r of zeros) {
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
  }, [coefficients, bounds, showZeros]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
