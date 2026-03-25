import clsx from "clsx";

import { type FallbackAreaKey } from "@/content/assetManifest";

import { GameArtwork } from "./GameArtwork";

interface SectionHeroProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt: string;
  eyebrow?: string;
  chips?: string[];
  fallbackArea?: FallbackAreaKey;
  preload?: boolean;
  className?: string;
  contentClassName?: string;
}

export function SectionHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  eyebrow,
  chips,
  fallbackArea = "app",
  preload = false,
  className,
  contentClassName,
}: SectionHeroProps) {
  return (
    <section className={clsx("relative overflow-hidden rounded-[1.4rem] golden-frame", className)}>
      <GameArtwork
        src={imageSrc}
        alt={imageAlt}
        aspectRatio="16/9"
        overlay
        preload={preload}
        fallbackArea={fallbackArea}
        fallbackLabel={title}
        fadeBottom
        className="min-h-[18rem] rounded-[1.4rem] border-0"
        sizes="100vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,15,14,0.12),rgba(12,15,14,0.72)_58%,rgba(12,15,14,0.9))]" />

      <div className={clsx("absolute inset-0 flex flex-col justify-end p-6 md:p-8", contentClassName)}>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-paper)]/80">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-serif text-3xl text-[var(--color-paper)] md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-paper)]/82 md:text-base">{subtitle}</p>

        {chips?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className="image-badge">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
