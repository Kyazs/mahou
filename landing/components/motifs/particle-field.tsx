"use client";

import { useEffect, useRef } from "react";

interface ParticleFieldProps {
  variant?: "default" | "embers";
  scopeToSection?: boolean;
}

export function ParticleField({
  variant = "default",
  scopeToSection = false,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];
    let animationId: number | null = null;
    let isVisible = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const COLOR_BRASS = "#c9a06a";
    const COLOR_SEAL = "#d43b2a";

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function initParticles() {
      particles = [];
      const area = width * height;
      const count = Math.min(Math.floor(area / 18000), 20);
      for (let i = 0; i < count; i++) {
        const isSeal =
          variant === "embers" ? Math.random() < 0.55 : Math.random() < 0.25;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx:
            variant === "embers"
              ? (Math.random() - 0.5) * 0.15
              : (Math.random() - 0.5) * 0.2,
          vy:
            variant === "embers"
              ? -(0.15 + Math.random() * 0.35)
              : (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.4 + 0.2,
          color: isSeal ? COLOR_SEAL : COLOR_BRASS,
        });
      }
      draw();
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    let lastFrameTime = 0;
    const FPS_INTERVAL = 1000 / 30;

    function update(timestamp: number) {
      if (prefersReducedMotion || !isVisible) return;
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < FPS_INTERVAL) {
        animationId = requestAnimationFrame(update);
        return;
      }
      lastFrameTime = timestamp - (elapsed % FPS_INTERVAL);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (variant === "embers") {
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        } else {
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      }
      draw();
      animationId = requestAnimationFrame(update);
    }

    function handleResize() {
      if (animationId) cancelAnimationFrame(animationId);
      resize();
      if (!prefersReducedMotion) update(performance.now());
    }

    resize();
    if (!prefersReducedMotion) update(performance.now());

    let visibilityObserver: IntersectionObserver | null = null;
    if (scopeToSection && canvas.parentElement) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible && !prefersReducedMotion && !animationId) {
            update(performance.now());
          } else if (!isVisible && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        },
        { threshold: 0 }
      );
      visibilityObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (visibilityObserver) visibilityObserver.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [variant, scopeToSection]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none z-0 h-full w-full opacity-35 ${scopeToSection ? "absolute inset-0" : "fixed inset-0"}`}
      aria-hidden="true"
    />
  );
}
