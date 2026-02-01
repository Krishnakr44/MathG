'use client';

/**
 * NetViewCanvas — 2D net (unfolded) representation of 3D shapes
 * Faces laid out flat, edges visible
 */

import { useRef, useEffect, useCallback } from 'react';
import type { NetDefinition, NetFace } from '@/core/types/geometry.types';

export interface NetViewCanvasProps {
  net: NetDefinition;
  faceAreas?: Record<string, number>;
  showLabels?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function NetViewCanvas({
  net,
  faceAreas = {},
  showLabels = true,
  width = 500,
  height = 400,
  className = '',
}: NetViewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const padding = 30;
    const scale = Math.min(
      (width - 2 * padding) / net.totalWidth,
      (height - 2 * padding) / net.totalHeight
    );
    const ox = padding + (width - 2 * padding - net.totalWidth * scale) / 2;
    const oy = padding + (height - 2 * padding - net.totalHeight * scale) / 2;

    net.faces.forEach((face: NetFace) => {
      const x = ox + face.x * scale;
      const y = oy + face.y * scale;
      const w = face.width * scale;
      const h = face.height * scale;

      ctx.save();
      if (face.rotation) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((face.rotation * Math.PI) / 180);
        ctx.translate(-(x + w / 2), -(y + h / 2));
      }

      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      if (showLabels) {
        ctx.fillStyle = '#374151';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(face.label, x + w / 2, y + h / 2 - 8);
        const area = faceAreas[face.id];
        if (area !== undefined) {
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#059669';
          ctx.fillText(`${area.toFixed(1)}`, x + w / 2, y + h / 2 + 8);
        }
      }
      ctx.restore();
    });
  }, [net, faceAreas, showLabels, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
