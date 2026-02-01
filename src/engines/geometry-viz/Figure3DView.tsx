'use client';

/**
 * Figure3DView — Shared 3D view for all figures
 * Same camera, scale, rotation for all shapes
 * Deterministic rendering (no randomness)
 */

import { useState, useCallback } from 'react';
import { toViewportScale } from '@/engines/geometry-3d/scale-utils';
import type { BoundingBox } from '@/engines/geometry-3d/types';
import { Cuboid3DView } from './Cuboid3DView';
import type { FacePairId } from '@/engines/geometry-3d/types';

export type Figure3DKind = 'cuboid' | 'prism' | 'cylinder' | 'cone' | 'sphere';

export interface Figure3DViewProps {
  kind: Figure3DKind;
  dimensions: Record<string, number>;
  bounds: BoundingBox;
  width?: number;
  heightPx?: number;
  className?: string;
  visibleFaces?: Set<string>;
  highlightedPairs?: Set<FacePairId>;
}

const PI = Math.PI;
const SIDES = 16;

const faceStyle = {
  position: 'absolute' as const,
  background: 'rgba(59, 130, 246, 0.9)',
  border: '2px solid #2563eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  color: '#1e3a8a',
  fontWeight: 600,
};

export function Figure3DView({
  kind,
  dimensions,
  bounds,
  width = 400,
  heightPx = 350,
  className = '',
  visibleFaces,
  highlightedPairs,
}: Figure3DViewProps) {
  const [rotationX, setRotationX] = useState(20);
  const [rotationY, setRotationY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const pixelScale = toViewportScale(bounds);

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

  const containerStyle = {
    width,
    height: heightPx,
    perspective: '700px',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const innerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformStyle: 'preserve-3d' as const,
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
    transition: isDragging ? 'none' : 'transform 0.05s ease-out',
  };

  if (kind === 'cuboid' || (kind === 'prism' && (dimensions.baseShape ?? 0) >= 0.5)) {
    const l = (kind === 'cuboid' ? dimensions.length : dimensions.baseWidth) ?? 3;
    const b = (kind === 'cuboid' ? dimensions.breadth : dimensions.baseHeight) ?? 2;
    const h = (kind === 'cuboid' ? dimensions.height : dimensions.height) ?? 2;
    return (
      <Cuboid3DView
        length={l}
        breadth={b}
        height={h}
        width={width}
        heightPx={heightPx}
        className={className}
        bounds={bounds}
        visibleFaces={visibleFaces}
        highlightedPairs={highlightedPairs}
      />
    );
  }

  if (kind === 'cylinder') {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    const rPx = r * pixelScale;
    const hPx = h * pixelScale;
    const chord = 2 * rPx * Math.sin(PI / SIDES);

    const sides: React.ReactNode[] = [];
    for (let i = 0; i < SIDES; i++) {
      const theta = (2 * PI * i) / SIDES + PI / SIDES;
      const x = rPx * Math.cos(theta);
      const z = rPx * Math.sin(theta);
      sides.push(
        <div
          key={i}
          style={{
            ...faceStyle,
            width: chord,
            height: hPx,
            transform: `rotateY(${-theta}rad) translateX(${x}px) translateY(${hPx / 2}px) translateZ(${z}px)`,
            transformOrigin: 'center center',
          }}
        />
      );
    }

    return (
      <div
        className={className}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div style={innerStyle}>
          <div style={{ position: 'relative', width: rPx * 2, height: hPx, transformStyle: 'preserve-3d' }}>
            {sides}
            <div
              style={{
                ...faceStyle,
                width: rPx * 2,
                height: rPx * 2,
                borderRadius: '50%',
                transform: `translateY(${-rPx}px) rotateX(90deg)`,
                transformOrigin: 'center center',
              }}
            />
            <div
              style={{
                ...faceStyle,
                width: rPx * 2,
                height: rPx * 2,
                borderRadius: '50%',
                transform: `translateY(${hPx - rPx}px) rotateX(-90deg)`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
      </div>
    );
  }

  if (kind === 'cone') {
    const r = dimensions.radius ?? 1.5;
    const h = dimensions.height ?? 3;
    const rPx = r * pixelScale;
    const hPx = h * pixelScale;
    const chord = 2 * rPx * Math.sin(PI / SIDES);
    const slant = Math.sqrt(rPx * rPx + hPx * hPx);

    const sides: React.ReactNode[] = [];
    for (let i = 0; i < SIDES; i++) {
      const theta = (2 * PI * i) / SIDES + PI / SIDES;
      const x = rPx * Math.cos(theta);
      const z = rPx * Math.sin(theta);
      const tilt = Math.atan2(hPx, rPx);
      sides.push(
        <div
          key={i}
          style={{
            ...faceStyle,
            width: chord,
            height: slant,
            transform: `rotateY(${-theta}rad) rotateX(${-tilt}rad) translateX(${x}px) translateZ(${z}px) translateY(${hPx / 2}px)`,
            transformOrigin: 'center top',
          }}
        />
      );
    }

    return (
      <div
        className={className}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div style={innerStyle}>
          <div style={{ position: 'relative', width: rPx * 2, height: hPx, transformStyle: 'preserve-3d' }}>
            {sides}
            <div
              style={{
                ...faceStyle,
                width: rPx * 2,
                height: rPx * 2,
                borderRadius: '50%',
                transform: `translateY(${hPx - rPx}px) rotateX(-90deg)`,
                transformOrigin: 'center center',
              }}
            />
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
      </div>
    );
  }

  if (kind === 'sphere') {
    const r = dimensions.radius ?? 1.5;
    const rPx = r * pixelScale;

    return (
      <div
        className={className}
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div style={innerStyle}>
          <div
            style={{
              ...faceStyle,
              width: rPx * 2,
              height: rPx * 2,
              borderRadius: '50%',
            }}
          />
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
      </div>
    );
  }

  return null;
}
