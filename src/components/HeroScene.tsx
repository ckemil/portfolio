"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Solid colour bands, no blending between them: mint, white, ultraviolet
const BANDS = ["#3cffd0", "#ffffff", "#5200ff"].map((c) => new THREE.Color(c));

function bandAt(t: number, out: THREE.Color) {
  const i = Math.min(Math.floor(Math.min(Math.max(t, 0), 0.999) * BANDS.length), BANDS.length - 1);
  return out.copy(BANDS[i]);
}

// Hard-edged round dot — no soft glow
function dotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

export default function HeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // WebGL unavailable: the hero still works without the scene
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Fade only (no rise); the first frame is drawn before the browser paints, so it fades in from real content
    renderer.domElement.classList.add("rise");
    renderer.domElement.style.setProperty("--rise", "0px");
    mount.appendChild(renderer.domElement);

    // Without a GPU (SwiftShader/llvmpipe, as in headless audit browsers) every frame is drawn on the CPU,
    // so show a still frame there instead of animating
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const gpu = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)) : "";
    const still = reduce || /swiftshader|llvmpipe|software/i.test(gpu);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 10;

    const group = new THREE.Group();
    scene.add(group);

    // Knot of particles
    const knot = new THREE.TorusKnotGeometry(2.4, 0.75, small ? 160 : 260, small ? 14 : 22, 2, 3);
    const knotPos = knot.getAttribute("position");
    const knotColors = new Float32Array(knotPos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < knotPos.count; i++) {
      bandAt((knotPos.getY(i) + 3.2) / 6.4, c).toArray(knotColors, i * 3);
    }
    const knotGeo = new THREE.BufferGeometry();
    knotGeo.setAttribute("position", knotPos.clone());
    knotGeo.setAttribute("color", new THREE.BufferAttribute(knotColors, 3));
    knot.dispose();

    // Loose dust around it
    const dustCount = small ? 300 : 700;
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 3.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dustPos.set([r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)], i * 3);
      bandAt(Math.random(), c).toArray(dustColors, i * 3);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const texture = dotTexture();
    const material = new THREE.PointsMaterial({
      size: 0.06,
      map: texture,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.5,
      opacity: 0.9,
    });
    const knotPoints = new THREE.Points(knotGeo, material);
    const dustPoints = new THREE.Points(dustGeo, material);
    group.add(knotPoints, dustPoints);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (still) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    if (still) {
      renderer.render(scene, camera);
      return () => {
        ro.disconnect();
        knotGeo.dispose();
        dustGeo.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        mount.removeChild(renderer.domElement);
      };
    }

    // Pointer tilt + scroll
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) loop();
    });
    io.observe(mount);

    let frame = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      cancelAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const scroll = window.scrollY;

      knotPoints.rotation.y = t * 0.15;
      knotPoints.rotation.x = t * 0.05;
      dustPoints.rotation.y = -t * 0.03;

      group.rotation.x += (pointer.y * 0.35 + scroll * 0.0006 - group.rotation.x) * 0.05;
      group.rotation.y += (pointer.x * 0.5 - group.rotation.y) * 0.05;
      group.position.y = scroll * 0.004;
      group.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03 + scroll * 0.0004);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
      ro.disconnect();
      knotGeo.dispose();
      dustGeo.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className={className} />;
}
