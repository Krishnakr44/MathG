'use client';

/**
 * NetViewCanvas — 2D net (unfolded) representation of 3D shapes
 * Supports rectangle, triangle, circle, sector
 * Compatible with geometry.types NetDefinition and geometry-3d NetDef
 */

import { useRef, useEffect, useCallback } from 'react';

export interface NetFaceLike {
  id: string;
  label: string;
  shape: 'rectangle' | 'triangle' | 'circle' | 'sector';
  width: number;
  height: number;
  angle?: number;
  x: number;
  y: number;
  rotation?: number;
}

export interface NetLike {
  faces: NetFaceLike[];
  totalWidth: number;
  totalHeight: number;
}

export interface NetViewCanvasProps {
  net: NetLike;
  faceAreas?: Record<string, number>;
  showLabels?: boolean;
  highlightedFaces?: Set<string>;
  width?: number;
  height?: number;
  className?: string;
}

export function NetViewCanvas({
  net,
  faceAreas = {},
  showLabels = true,
  highlightedFaces,
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

    net.faces.forEach((face: NetFaceLike) => {
      const x = ox + face.x * scale;
      const y = oy + face.y * scale;
      const w = face.width * scale;
      const h = face.height * scale;
      const cx = x + w / 2;
      const cy = y + h / 2;
      const isHighlighted = highlightedFaces?.has(face.id);

      ctx.save();
      if (face.rotation) {
        ctx.translate(cx, cy);
        ctx.rotate((face.rotation * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      ctx.fillStyle = isHighlighted ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = isHighlighted ? '#1d4ed8' : '#2563eb';
      ctx.lineWidth = isHighlighted ? 3 : 2;

      switch (face.shape) {
        case 'rectangle':
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(x + w / 2, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'circle': {
          const r = Math.min(w, h) / 2;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          break;
        }
        case 'sector': {
          const r = Math.min(w, h) / 2;
          const angle = face.angle ?? Math.PI / 2;
          // Canvas: 0 = east, angles go clockwise; draw sector with arc at bottom
          const startAngle = Math.PI / 2 + angle / 2;
          const endAngle = Math.PI / 2 - angle / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, startAngle, endAngle, true);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }
        default:
          ctx.fillRect(x, y, w, h);
          ctx.strokeRect(x, y, w, h);
      }

      if (showLabels) {
        ctx.fillStyle = '#374151';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(face.label, cx, cy - 8);
        const area = faceAreas[face.id];
        if (area !== undefined) {
          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#059669';
          ctx.fillText(`${area.toFixed(1)}`, cx, cy + 8);
        }
      }
      ctx.restore();
    });
  }, [net, faceAreas, showLabels, highlightedFaces, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
