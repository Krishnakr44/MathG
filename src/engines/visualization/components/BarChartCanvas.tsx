'use client';

/**
 * BarChartCanvas — Bar graph, histogram, frequency polygon
 * Module 5: Statistics — data representation
 */

import { useRef, useEffect, useCallback } from 'react';

export type ChartType = 'bar' | 'histogram' | 'frequency-polygon';

export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface BarChartCanvasProps {
  data: BarChartDataPoint[];
  chartType?: ChartType;
  classWidth?: number;
  showValues?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function BarChartCanvas({
  data,
  chartType = 'bar',
  classWidth = 5,
  showValues = true,
  width = 500,
  height = 350,
  className = '',
}: BarChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 30, right: 20, bottom: 50, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    if (data.length === 0) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.fillText('No data', w / 2 - 30, h / 2 - 7);
      return;
    }

    const maxVal = Math.max(...data.map((d) => d.value), 1);

    const xToPx = (i: number) => padding.left + (i / data.length) * chartW + chartW / (2 * data.length);
    const yToPx = (v: number) => padding.top + chartH - (v / maxVal) * chartH;

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    if (chartType === 'bar') {
      const barW = chartW / data.length * 0.7;
      data.forEach((d, i) => {
        const x = padding.left + (i / data.length) * chartW + (chartW / data.length - barW) / 2;
        const barH = (d.value / maxVal) * chartH;
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(x, padding.top + chartH - barH, barW, barH);
        ctx.strokeStyle = '#004499';
        ctx.strokeRect(x, padding.top + chartH - barH, barW, barH);
        if (showValues) {
          ctx.fillStyle = '#374151';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, x + barW / 2, padding.top + chartH + 16);
          ctx.fillText(String(d.value), x + barW / 2, padding.top + chartH - barH - 4);
        }
      });
    } else if (chartType === 'histogram') {
      const barW = chartW / data.length;
      data.forEach((d, i) => {
        const x = padding.left + i * barW;
        const barH = (d.value / maxVal) * chartH;
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(x, padding.top + chartH - barH, barW, barH);
        if (showValues) {
          ctx.fillStyle = '#374151';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, x + barW / 2, padding.top + chartH + 14);
        }
      });
    } else if (chartType === 'frequency-polygon') {
      ctx.strokeStyle = '#0066cc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      data.forEach((d, i) => {
        const px = xToPx(i);
        const py = yToPx(d.value);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      data.forEach((d, i) => {
        const px = xToPx(i);
        const py = yToPx(d.value);
        ctx.fillStyle = '#0066cc';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fill();
        if (showValues) {
          ctx.fillStyle = '#374151';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, px, padding.top + chartH + 14);
        }
      });
    }
  }, [data, chartType, showValues]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    draw();
  }, [width, height, draw]);

  return <canvas ref={canvasRef} className={className} style={{ maxWidth: '100%' }} />;
}
