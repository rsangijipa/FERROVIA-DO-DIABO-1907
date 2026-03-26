"use client";

import clsx from "clsx";

import { type FallbackAreaKey } from "@/content/assetManifest";
import { GameArtwork } from "./GameArtwork";

interface GameModuleHeaderProps {
  kicker?: string;
  title: string;
  imageSrc?: string;
  imageAlt: string;
  badge?: string;
  fallbackArea?: FallbackAreaKey;
  className?: string;
}

export function GameModuleHeader({
  kicker,
  title,
  imageSrc,
  imageAlt,
  badge,
  fallbackArea = "app",
  className,
}: GameModuleHeaderProps) {
  return (
    <div className={clsx("relative overflow-hidden rounded-2xl border border-[color:var(--color-border)]", className)}>
      <GameArtwork
        src={imageSrc}
        alt={imageAlt}
        aspectRatio="16/9"
        overlay
        fadeBottom
        fallbackArea={fallbackArea}
        fallbackLabel={title}
        className="min-h-[10rem] rounded-2xl border-0"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(8,10,9,0.82))]" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            {kicker && (
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-latao)]">{kicker}</p>
            )}
            <h2 className="mt-1 font-serif text-xl text-[var(--color-paper)]">{title}</h2>
          </div>
          {badge && <span className="image-badge image-badge-gold">{badge}</span>}
        </div>
      </div>
    </div>
  );
}
