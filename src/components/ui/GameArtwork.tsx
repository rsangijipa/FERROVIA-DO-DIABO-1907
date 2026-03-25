"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { areaFallbacks, type FallbackAreaKey } from "@/content/assetManifest";

type ArtworkRatio = "16/9" | "4/3" | "1/1";
type ArtworkFit = "cover" | "contain";

interface GameArtworkProps {
  src?: string;
  alt: string;
  aspectRatio?: ArtworkRatio;
  overlay?: boolean;
  preload?: boolean;
  fallbackArea?: FallbackAreaKey;
  fallbackLabel?: string;
  fadeBottom?: boolean;
  fit?: ArtworkFit;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

interface ArtworkFrameProps extends Omit<GameArtworkProps, "src" | "fallbackArea"> {
  normalizedSrc: string;
  fallbackSrc: string;
}

function ArtworkFrame({
  normalizedSrc,
  fallbackSrc,
  alt,
  aspectRatio = "16/9",
  overlay = false,
  preload = false,
  fallbackLabel = "Acervo visual",
  fadeBottom = false,
  fit = "cover",
  sizes = "100vw",
  className,
  imageClassName,
}: ArtworkFrameProps) {
  const [resolvedSrc, setResolvedSrc] = useState(normalizedSrc);
  const [isBroken, setIsBroken] = useState(false);

  return (
    <div
      className={clsx(
        "relative isolate overflow-hidden rounded-[1rem] border border-[color:var(--color-border)] bg-[color:rgba(31,35,32,0.86)] artwork-inset-shadow",
        className,
      )}
      style={{ aspectRatio }}
    >
      {isBroken ? (
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(81,107,87,0.24),transparent_55%),linear-gradient(180deg,rgba(31,35,32,0.96),rgba(44,42,40,0.92))] px-6 text-center">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-latao)]">Fallback visual</p>
            <p className="mt-2 font-serif text-xl text-[var(--color-paper)]">{fallbackLabel}</p>
          </div>
        </div>
      ) : (
        <Image
          fill
          alt={alt}
          src={resolvedSrc}
          sizes={sizes}
          preload={preload}
          decoding="async"
          className={clsx("transition duration-500", fit === "contain" ? "object-contain" : "object-cover", imageClassName)}
          onError={() => {
            if (resolvedSrc !== fallbackSrc) {
              setResolvedSrc(fallbackSrc);
              return;
            }

            setIsBroken(true);
          }}
        />
      )}

      {overlay ? <div className="cinematic-overlay" /> : null}
      {fadeBottom ? <div className="hero-bottom-fade" /> : null}
    </div>
  );
}

export function GameArtwork({
  src,
  fallbackArea = "app",
  ...props
}: GameArtworkProps) {
  const fallbackSrc = areaFallbacks[fallbackArea];
  const normalizedSrc = src || fallbackSrc;

  return <ArtworkFrame key={`${fallbackArea}:${normalizedSrc}`} normalizedSrc={normalizedSrc} fallbackSrc={fallbackSrc} {...props} />;
}
