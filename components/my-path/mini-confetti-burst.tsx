"use client";

import { useEffect, useRef } from "react";

/*
 * Small button-local confetti explosion. Each particle shoots up
 * and out from the burst origin, pauses at the apex, then falls
 * under "gravity" while fading out. Runs via the Web Animations
 * API so every particle can have its own trajectory / easing.
 *
 * Bump `burstKey` to replay — the component remounts each time
 * and spawns a fresh set of particles.
 */

const COLORS = ["#7161ef", "#ec7357", "#679436", "#FFD700", "#FF6B9A", "#4ECDC4", "#FFA74F"];
const PARTICLE_COUNT = 40;

interface Particle {
  width: number;
  height: number;
  color: string;
  peakX: number;
  peakY: number;
  endX: number;
  endY: number;
  rotate: number;
  duration: number;
  delay: number;
}

function generate(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angleOutFromVertical = (Math.random() - 0.5) * Math.PI * 0.75;
    const launch = 90 + Math.random() * 110;
    const peakX = Math.sin(angleOutFromVertical) * launch;
    const peakY = -Math.cos(angleOutFromVertical) * launch;
    const drift = Math.sin(angleOutFromVertical) * (40 + Math.random() * 60);
    const fall = 220 + Math.random() * 220;
    const width = 6 + Math.random() * 6;
    return {
      width,
      height: width * (0.9 + Math.random() * 1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      peakX,
      peakY,
      endX: peakX + drift,
      endY: fall,
      rotate: Math.random() * 720 - 360,
      duration: 1100 + Math.random() * 600,
      delay: Math.random() * 120,
    };
  });
}

interface MiniConfettiBurstProps {
  burstKey?: number;
}

export function MiniConfettiBurst({ burstKey = 0 }: MiniConfettiBurstProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  if (particlesRef.current.length === 0) {
    particlesRef.current = generate();
  }

  useEffect(() => {
    particlesRef.current = generate();
    const container = containerRef.current;
    if (!container) return;
    const spans = Array.from(container.querySelectorAll<HTMLSpanElement>(".mini-confetti-particle"));
    const animations: Animation[] = [];
    spans.forEach((span, i) => {
      const p = particlesRef.current[i];
      if (!p) return;
      const anim = span.animate(
        [
          {
            transform: "translate(-50%, -50%) rotate(0deg)",
            opacity: 1,
            easing: "cubic-bezier(0.2, 0.7, 0.3, 1)",
            offset: 0,
          },
          {
            transform: `translate(calc(-50% + ${p.peakX}px), calc(-50% + ${p.peakY}px)) rotate(${p.rotate * 0.35}deg)`,
            opacity: 1,
            easing: "cubic-bezier(0.55, 0, 0.8, 0.6)",
            offset: 0.32,
          },
          {
            transform: `translate(calc(-50% + ${p.endX}px), calc(-50% + ${p.endY}px)) rotate(${p.rotate}deg)`,
            opacity: 0,
            offset: 1,
          },
        ],
        {
          duration: p.duration,
          delay: p.delay,
          fill: "forwards",
        },
      );
      animations.push(anim);
    });
    return () => {
      animations.forEach((a) => a.cancel());
    };
  }, [burstKey]);

  const particles = particlesRef.current;

  return (
    <div ref={containerRef} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="mini-confetti-particle absolute left-0 top-0 block rounded-xs"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            background: p.color,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
