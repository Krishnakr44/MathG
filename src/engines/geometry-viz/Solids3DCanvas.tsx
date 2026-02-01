'use client';

/**
 * Solids3DCanvas — Three.js-based 3D rendering for all figures
 * Uses standard geometries: BoxGeometry, CylinderGeometry, ConeGeometry,
 * SphereGeometry, ExtrudeGeometry (for prism)
 * Unified scale, camera, lighting, OrbitControls
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { computeScale } from '@/engines/geometry-3d/scale-utils';
import type { BoundingBox } from '@/engines/geometry-3d/types';
import type { FacePairId } from '@/engines/geometry-3d/types';

export type Solids3DKind = 'cuboid' | 'prism' | 'cylinder' | 'cone' | 'sphere';

export interface Solids3DCanvasProps {
  kind: Solids3DKind;
  dimensions: Record<string, number>;
  bounds: BoundingBox;
  width?: number;
  heightPx?: number;
  className?: string;
  visibleFaces?: Set<string>;
  highlightedPairs?: Set<FacePairId>;
}

const BASE_COLOR = 0x3b82f6;

function createCuboidGeometry(
  length: number,
  breadth: number,
  height: number
): THREE.BoxGeometry {
  return new THREE.BoxGeometry(length, height, breadth);
}

function createPrismGeometry(
  baseWidth: number,
  baseHeight: number,
  height: number,
  isRect: boolean
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const hw = baseWidth / 2;
  const hh = baseHeight / 2;
  if (isRect) {
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(hw, hh);
    shape.lineTo(-hw, hh);
    shape.lineTo(-hw, -hh);
  } else {
    shape.moveTo(-hw, -hh);
    shape.lineTo(hw, -hh);
    shape.lineTo(0, hh);
    shape.lineTo(-hw, -hh);
  }
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: height,
    bevelEnabled: false,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.translate(0, 0, -height / 2);
  geom.rotateX(-Math.PI / 2);
  return geom;
}

function createCylinderGeometry(radius: number, height: number): THREE.CylinderGeometry {
  return new THREE.CylinderGeometry(radius, radius, height, 32);
}

function createConeGeometry(radius: number, height: number): THREE.ConeGeometry {
  return new THREE.ConeGeometry(radius, height, 32);
}

function createSphereGeometry(radius: number): THREE.SphereGeometry {
  return new THREE.SphereGeometry(radius, 32, 32);
}

export function Solids3DCanvas({
  kind,
  dimensions,
  bounds,
  width = 450,
  heightPx = 400,
  className = '',
}: Solids3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);

  const viewScale = computeScale(bounds);

  const buildMesh = useCallback((): THREE.Mesh | null => {
    let geometry: THREE.BufferGeometry;
    let material: THREE.MeshPhongMaterial;

    if (kind === 'cuboid' || (kind === 'prism' && (dimensions.baseShape ?? 0) >= 0.5)) {
      const l = kind === 'cuboid' ? (dimensions.length ?? 3) : (dimensions.baseWidth ?? 3);
      const b = kind === 'cuboid' ? (dimensions.breadth ?? 2) : (dimensions.baseHeight ?? 2);
      const h = dimensions.height ?? 2;
      geometry = createCuboidGeometry(l, b, h);
      material = new THREE.MeshPhongMaterial({
        color: BASE_COLOR,
        flatShading: true,
        transparent: true,
        opacity: 0.95,
      });
    } else if (kind === 'prism') {
      const bw = dimensions.baseWidth ?? 3;
      const bh = dimensions.baseHeight ?? 2;
      const h = dimensions.height ?? 4;
      geometry = createPrismGeometry(bw, bh, h, false);
      material = new THREE.MeshPhongMaterial({
        color: BASE_COLOR,
        flatShading: true,
        transparent: true,
        opacity: 0.95,
      });
    } else if (kind === 'cylinder') {
      const r = dimensions.radius ?? 1.5;
      const h = dimensions.height ?? 3;
      geometry = createCylinderGeometry(r, h);
      material = new THREE.MeshPhongMaterial({
        color: BASE_COLOR,
        flatShading: false,
        transparent: true,
        opacity: 0.95,
      });
    } else if (kind === 'cone') {
      const r = dimensions.radius ?? 1.5;
      const h = dimensions.height ?? 3;
      geometry = createConeGeometry(r, h);
      material = new THREE.MeshPhongMaterial({
        color: BASE_COLOR,
        flatShading: false,
        transparent: true,
        opacity: 0.95,
      });
    } else if (kind === 'sphere') {
      const r = dimensions.radius ?? 1.5;
      geometry = createSphereGeometry(r);
      material = new THREE.MeshPhongMaterial({
        color: BASE_COLOR,
        flatShading: false,
        transparent: true,
        opacity: 0.95,
      });
    } else {
      return null;
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(viewScale);
    return mesh;
  }, [kind, dimensions, viewScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    const aspect = width / heightPx;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.set(5, 4, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, 5, -5);
    scene.add(dirLight2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    const mesh = buildMesh();
    if (mesh) {
      scene.add(mesh);
      meshRef.current = mesh;
    }

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      controls.dispose();
      renderer.dispose();
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        (meshRef.current.material as THREE.Material).dispose();
        scene.remove(meshRef.current);
        meshRef.current = null;
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [width, heightPx, buildMesh]);

  useEffect(() => {
    if (!meshRef.current || !sceneRef.current) return;
    const oldMesh = meshRef.current;
    sceneRef.current.remove(oldMesh);
    oldMesh.geometry.dispose();
    (oldMesh.material as THREE.Material).dispose();

    const newMesh = buildMesh();
    if (newMesh) {
      sceneRef.current.add(newMesh);
      meshRef.current = newMesh;
    } else {
      meshRef.current = null;
    }
  }, [buildMesh]);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div ref={containerRef} style={{ width, height: heightPx, cursor: 'grab' }} />
      <p className="text-xs text-center text-gray-500 mt-2">Drag to rotate</p>
    </div>
  );
}
