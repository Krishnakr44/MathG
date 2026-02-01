'use client';

/**
 * Cuboid3DView — Rotatable 3D cuboid using CSS 3D transforms
 * Lightweight, no Three.js dependency
 */

import { useRef, useState, useCallback } from 'react';

export interface Cuboid3DViewProps {
  length: number;
  breadth: number;
  height: number;
  width?: number;
  heightPx?: number;
  className?: string;
}

export function Cuboid3DView({
  length,
  breadth,
  height,
  width = 400,
  heightPx = 350,
  className = '',
}: Cuboid3DViewProps) {
  const [rotationX, setRotationX] = useState(20);
  const [rotationY, setRotationY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const scale = Math.min(width / (length + breadth + 2), heightPx / (height + breadth + 2)) * 20;
  const l = length * scale;
  const b = breadth * scale;
  const h = height * scale;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setRotationY((r) => r + dx);
      setRotationX((r) => Math.max(-90, Math.min(90, r - dy)));
      setLastPos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastPos]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseLeave = useCallback(() => setIsDragging(false), []);

  const faceStyle = (color: string) => ({
    position: 'absolute' as const,
    background: color,
    border: '2px solid #2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    color: '#1e3a8a',
    fontWeight: 600,
  });

  return (
    <div
      className={className}
      style={{
        width,
        height: heightPx,
        perspective: '700px',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: l,
            height: h,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front: length x height, at +Z */}
          <div style={{ ...faceStyle('rgba(59, 130, 246, 0.95)'), width: l, height: h, transform: `translateZ(${b / 2}px)` }}>
            {length}×{height}
          </div>
          {/* Back */}
          <div style={{ ...faceStyle('rgba(59, 130, 246, 0.5)'), width: l, height: h, transform: `translateZ(${-b / 2}px) rotateY(180deg)` }} />
          {/* Left: breadth x height */}
          <div style={{ ...faceStyle('rgba(37, 99, 235, 0.85)'), width: b, height: h, transform: `translateX(${-b / 2}px) rotateY(-90deg)` }}>
            {breadth}×{height}
          </div>
          {/* Right */}
          <div style={{ ...faceStyle('rgba(37, 99, 235, 0.85)'), width: b, height: h, transform: `translateX(${l - b / 2}px) rotateY(90deg)` }} />
          {/* Top: length x breadth */}
          <div style={{ ...faceStyle('rgba(96, 165, 250, 0.9)'), width: l, height: b, transform: `translateY(${-b / 2}px) rotateX(90deg)` }}>
            {length}×{breadth}
          </div>
          {/* Bottom */}
          <div style={{ ...faceStyle('rgba(96, 165, 250, 0.7)'), width: l, height: b, transform: `translateY(${h - b / 2}px) rotateX(-90deg)` }} />
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
    </div>
  );
}
