"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

import { getCharacterPortrait } from "@/content/assetManifest";

interface CharacterPortraitProps {
  characterId: string;
  name: string;
  size?: number;
  className?: string;
}

export function CharacterPortrait({ characterId, name, size = 64, className }: CharacterPortraitProps) {
  const portraitSrc = getCharacterPortrait(characterId);
  const [isBroken, setIsBroken] = useState(false);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const showImage = portraitSrc && !isBroken;

  return (
    <div
      className={clsx(
        "relative shrink-0 overflow-hidden rounded-full border-2 border-[color:rgba(212,163,103,0.32)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <Image
          src={portraitSrc}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setIsBroken(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(77,56,45,0.9),rgba(25,29,27,0.95))]">
          <span
            className="font-serif font-bold text-[var(--color-latao)]"
            style={{ fontSize: size * 0.32 }}
          >
            {initials}
          </span>
        </div>
      )}

      {/* Vignette frame */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.4)]" />
    </div>
  );
}
