"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const PARTICLE_COUNT = 8;

interface Particle {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${22 + Math.random() * 18}s`,
    size: `${2 + Math.random() * 2}px`,
    opacity: 0.06 + Math.random() * 0.08,
  }));
}

export function AmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const reducedMotion = useGameStore((store) => store.settings.reducedMotion);

  useEffect(() => {
    // Check reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches || reducedMotion) return;

    // Generate initial particles asynchronously to avoid cascading renders
    const rafId = requestAnimationFrame(() => setParticles(generateParticles()));

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setParticles([]);
      } else {
        setParticles(generateParticles());
      }
    };
    mql.addEventListener("change", handler);
    return () => {
      cancelAnimationFrame(rafId);
      mql.removeEventListener("change", handler);
    };
  }, [reducedMotion]);

  if (reducedMotion || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="ambient-particle"
          style={{
            left: p.left,
            bottom: "-4px",
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
