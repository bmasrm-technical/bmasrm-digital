"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HomeBackground3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !isWebGLAvailable()) {
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Luxury Geometric Wireframe (Dual concentric rings & faceted geodesic structure)
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Outer Geodesic Icosahedron wireframe
    const icosaGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const icosaWireframe = new THREE.WireframeGeometry(icosaGeo);
    const icosaMat = new THREE.LineBasicMaterial({
      color: 0xd2b277,
      transparent: true,
      opacity: 0.28,
    });
    const icosaMesh = new THREE.LineSegments(icosaWireframe, icosaMat);
    centralGroup.add(icosaMesh);

    // Inner Torus Ring wireframe
    const torusGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xd2b277,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    centralGroup.add(torusMesh);

    // Second intersecting Torus Ring
    const torusGeo2 = new THREE.TorusGeometry(1.5, 0.02, 16, 70);
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat);
    torusMesh2.rotation.y = Math.PI / 4;
    centralGroup.add(torusMesh2);

    // 3. Rich Constellation of Golden Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 10;
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
      originalPositions[i] = x;
      originalPositions[i + 1] = y;
      originalPositions[i + 2] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Material with visible size and luxury gold tint
    const particleMat = new THREE.PointsMaterial({
      color: 0xd2b277,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Subtle Ambient Dust (smaller secondary layer)
    const dustCount = 150;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 20;
      dustPositions[i + 1] = (Math.random() - 0.5) * 20;
      dustPositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf3eee4,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    scene.add(dustSystem);

    // 5. Interactive Pointer Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      // Convert to normalized coordinates (-1 to 1)
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate central wireframe sculpture
      centralGroup.rotation.y = elapsedTime * 0.08 + currentMouseX * 0.3;
      centralGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2 - currentMouseY * 0.3;
      torusMesh.rotation.z = elapsedTime * 0.05;
      torusMesh2.rotation.z = -elapsedTime * 0.06;

      // Drift particle fields
      particleSystem.rotation.y = elapsedTime * 0.015;
      dustSystem.rotation.y = -elapsedTime * 0.01;

      // Camera parallax
      camera.position.x = currentMouseX * 0.6;
      camera.position.y = -currentMouseY * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);

      icosaGeo.dispose();
      icosaWireframe.dispose();
      icosaMat.dispose();
      torusGeo.dispose();
      torusGeo2.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 25%, rgba(210,178,119,0.08) 0%, rgba(10,9,8,1) 75%)",
      }}
    />
  );
}
