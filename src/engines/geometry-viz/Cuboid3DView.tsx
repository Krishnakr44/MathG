'use client';

/**
 * Cuboid3DView — Rotatable 3D cuboid using CSS 3D transforms
 * Supports face toggling, pair highlighting, unified scale
 */

import { useRef, useState, useCallback } from 'react';
import type { FacePairId } from '@/engines/geometry-3d/types';
import { toViewportScale } from '@/engines/geometry-3d/scale-utils';
import type { BoundingBox } from '@/engines/geometry-3d/types';

export interface Cuboid3DViewProps {
  length: number;
  breadth: number;
  height: number;
  width?: number;
  heightPx?: number;
  className?: string;
  /** Faces to show (undefined = all). IDs: top, bottom, front, back, left, right */
  visibleFaces?: Set<string>;
  /** Face pairs to highlight (top-bottom, front-back, left-right) */
  highlightedPairs?: Set<FacePairId>;
  /** Use unified scale from bounding box */
  bounds?: BoundingBox;
}

const FACE_PAIRS: Record<FacePairId, [string, string]> = {
  'top-bottom': ['top', 'bottom'],
  'front-back': ['front', 'back'],
  'left-right': ['left', 'right'],
};

export function Cuboid3DView({
  length,
  breadth,
  height,
  width = 400,
  heightPx = 350,
  className = '',
  visibleFaces,
  highlightedPairs,
  bounds,
}: Cuboid3DViewProps) {
  const [rotationX, setRotationX] = useState(20);
  const [rotationY, setRotationY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const bbox = bounds ?? { width: length, height, depth: breadth };
  const pixelScale = toViewportScale(bbox);
  const l = length * pixelScale;
  const b = breadth * pixelScale;
  const h = height * pixelScale;

  const isVisible = (faceId: string) => !visibleFaces || visibleFaces.has(faceId);
  const isHighlighted = (faceId: string) =>
    highlightedPairs &&
    (Object.entries(FACE_PAIRS) as [FacePairId, [string, string]][]).some(
      ([pairId, [a, bf]]) => highlightedPairs.has(pairId) && (faceId === a || faceId === bf)
    );

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

  const faceStyle = (faceId: string, baseColor: string) => {
    const visible = isVisible(faceId);
    const highlighted = isHighlighted(faceId);
    return {
      position: 'absolute' as const,
      background: visible ? (highlighted ? 'rgba(34, 197, 94, 0.9)' : baseColor) : 'rgba(200, 200, 200, 0.3)',
      border: `2px solid ${highlighted ? '#16a34a' : visible ? '#2563eb' : '#9ca3af'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      color: visible ? '#1e3a8a' : '#6b7280',
      fontWeight: 600,
      opacity: visible ? 1 : 0.5,
    };
  };

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
          <div style={{ ...faceStyle('front', 'rgba(59, 130, 246, 0.95)'), width: l, height: h, transform: `translateZ(${b / 2}px)` }}>
            {length}×{height}
          </div>
          {/* Back */}
          <div style={{ ...faceStyle('back', 'rgba(59, 130, 246, 0.5)'), width: l, height: h, transform: `translateZ(${-b / 2}px) rotateY(180deg)` }} />
          {/* Left: breadth x height */}
          <div style={{ ...faceStyle('left', 'rgba(37, 99, 235, 0.85)'), width: b, height: h, transform: `translateX(${-b / 2}px) rotateY(-90deg)` }}>
            {breadth}×{height}
          </div>
          {/* Right */}
          <div style={{ ...faceStyle('right', 'rgba(37, 99, 235, 0.85)'), width: b, height: h, transform: `translateX(${l - b / 2}px) rotateY(90deg)` }} />
          {/* Top: length x breadth */}
          <div style={{ ...faceStyle('top', 'rgba(96, 165, 250, 0.9)'), width: l, height: b, transform: `translateY(${-b / 2}px) rotateX(90deg)` }}>
            {length}×{breadth}
          </div>
          {/* Bottom */}
          <div style={{ ...faceStyle('bottom', 'rgba(96, 165, 250, 0.7)'), width: l, height: b, transform: `translateY(${h - b / 2}px) rotateX(-90deg)` }} />
        </div>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
    </div>
  );
}
