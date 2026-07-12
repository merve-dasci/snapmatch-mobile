import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=90&w=800",
  "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=90&w=800"
];

export default function InfiniteSpiralLoop({ className = "" }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const scrollRef = useRef(0);

  const imageUrls = useMemo(() => IMAGE_URLS, []);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 620;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 9.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(6, 8, 8);
    scene.add(ambient, keyLight);

    const group = new THREE.Group();
    scene.add(group);

    const texture = new THREE.TextureLoader().load(imageUrls[0], undefined, undefined, () => {});
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2.6, 3.8, 200, 40);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0.3, 0);
    mesh.rotation.x = -0.18;
    group.add(mesh);
    meshRef.current = mesh;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      scrollRef.current += 0.003;
      const wave = Math.sin(scrollRef.current * 2.2) * 0.16;
      const spin = scrollRef.current * 0.7;
      group.rotation.y = spin;
      group.position.y = wave;
      mesh.rotation.z = Math.sin(scrollRef.current * 1.8) * 0.1;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const nextWidth = container.clientWidth || 900;
      const nextHeight = container.clientHeight || 620;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      container.innerHTML = "";
    };
  }, [imageUrls]);

  return (
    <div
      data-testid="spiral-loop"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`.trim()}
      aria-label="Sonsuz spiral loop"
      ref={mountRef}
    />
  );
}
