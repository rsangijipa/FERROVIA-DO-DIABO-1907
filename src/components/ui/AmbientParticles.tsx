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
  drift: string;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${22 + Math.random() * 18}s`,
    size: `${2 + Math.random() * 2}px`,
    opacity: 0.06 + Math.random() * 0.08,
    drift: `${(Math.random() - 0.5) * 40}px`,
  }));
}

export function AmbientParticles({ type = "dust" }: { type?: "dust" | "soot" | "firefly" | "heat" }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const reducedMotion = useGameStore((store) => store.settings.reducedMotion);

  useEffect(() => {
    // Check reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches || reducedMotion) return;

    // Heat and soot should be denser
    const countMultiplier = type === "soot" || type === "heat" ? 2 : 1;
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
  }, [reducedMotion, type]);

  if (reducedMotion || (particles.length === 0 && type !== "heat")) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {type === "heat" && <div className="heat-wave" />}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`ambient-particle ${type !== "dust" ? type : ""} ${type === "heat" || type === "soot" ? "particle-dense" : ""}`}
          style={{
            left: p.left,
            bottom: "-4px",
            animationDelay: p.delay,
            animationDuration: type === "heat" ? "12s" : p.duration,
            width: type === "heat" ? `${4 + Math.random() * 6}px` : p.size,
            height: type === "heat" ? `${10 + Math.random() * 20}px` : p.size,
            opacity: type === "firefly" ? p.opacity * 4 : p.opacity,
            "--drift-x": p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
