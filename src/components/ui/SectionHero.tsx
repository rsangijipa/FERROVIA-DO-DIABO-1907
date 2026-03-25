import Link from "next/link";
import clsx from "clsx";

import { type FallbackAreaKey } from "@/content/assetManifest";

import { GameArtwork } from "./GameArtwork";

interface HeroAction {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
}

interface SectionHeroProps {
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt: string;
  eyebrow?: string;
  chips?: string[];
  actions?: HeroAction[];
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
  actions,
  fallbackArea = "app",
  preload = false,
  className,
  contentClassName,
}: SectionHeroProps) {
  return (
    <section className={clsx("relative overflow-hidden rounded-[1.5rem] golden-frame", className)}>
      <GameArtwork
        src={imageSrc}
        alt={imageAlt}
        aspectRatio="16/9"
        overlay
        preload={preload}
        fallbackArea={fallbackArea}
        fallbackLabel={title}
        fadeBottom
        className="min-h-[22rem] rounded-[1.5rem] border-0"
        sizes="100vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,9,0.04),rgba(8,10,9,0.54)_46%,rgba(8,10,9,0.88))]" />

      <div className={clsx("absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10", contentClassName)}>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/82">{eyebrow}</p> : null}
        <h1 className="mt-2 max-w-4xl font-serif text-4xl text-[var(--color-paper)] md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-paper)]/84 md:text-base">{subtitle}</p>

        {actions?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link key={action.href + action.label} href={action.href} className={action.variant === "secondary" ? "btn-secondary" : "btn-primary"}>
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}

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
