'use client';

/**
 * CoverageCanvas — Grid-based area visualization
 * Unit squares for flat surfaces (rectangle, etc.)
 * Area = number of unit squares
 */

import { useRef, useEffect, useCallback } from 'react';
import type { CoverageUnit } from '@/core/types/geometry.types';

export interface CoverageCanvasProps {
  units: CoverageUnit[];
  unitSize?: number;
  showCount?: boolean;
  showFormula?: boolean;
  formula?: string;
  area?: number;
  width?: number;
  height?: number;
  className?: string;
}

const DEFAULT_UNIT_SIZE = 40;

export function CoverageCanvas({
  units,
  unitSize = DEFAULT_UNIT_SIZE,
  showCount = true,
  showFormula = false,
  formula = '',
  area = 0,
  width = 500,
  height = 400,
  className = '',
}: CoverageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (units.length === 0) return;

    const maxX = Math.max(...units.map((u) => u.x + u.width));
    const maxY = Math.max(...units.map((u) => u.y + u.height));
    const scale = Math.min(
      (width - 2 * padding) / maxX,
      (height - 2 * padding - 60) / maxY,
      unitSize
    );

    const ox = padding;
    const oy = padding;

    units.forEach((u) => {
      const x = ox + u.x * scale;
      const y = oy + u.y * scale;
      const w = u.width * scale;
      const h = u.height * scale;

      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      if (showCount && u.count !== undefined) {
        ctx.fillStyle = '#374151';
        ctx.font = `${Math.max(10, scale * 0.5)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(u.count), x + w / 2, y + h / 2);
      }
    });

    if (showFormula && formula) {
      ctx.fillStyle = '#059669';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(formula, width / 2, height - 25);
      if (area > 0) {
        ctx.fillStyle = '#374151';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Area = ${area} square units`, width / 2, height - 8);
      }
    }
  }, [units, unitSize, showCount, showFormula, formula, area, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
