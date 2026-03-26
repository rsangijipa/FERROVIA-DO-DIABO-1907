"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";

import { type FallbackAreaKey } from "@/content/assetManifest";

import { DecorativeCorner } from "./DecorativeCorner";
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
  compact?: boolean;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
} as const;

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
  compact = false,
}: SectionHeroProps) {
  const visibleChips = compact ? chips?.slice(0, 2) : chips;

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
        className={clsx(
          "rounded-[1.5rem] border-0",
          compact ? "min-h-[12rem] sm:min-h-[13.5rem] lg:min-h-[14.5rem]" : "min-h-[18rem] sm:min-h-[20rem] lg:min-h-[22rem]",
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
      />

      <div
        className={clsx(
          "pointer-events-none absolute inset-0",
          compact
            ? "bg-[linear-gradient(180deg,rgba(8,10,9,0.08),rgba(8,10,9,0.44)_46%,rgba(8,10,9,0.84))]"
            : "bg-[linear-gradient(180deg,rgba(8,10,9,0.12),rgba(8,10,9,0.56)_46%,rgba(8,10,9,0.92))]",
        )}
      />
      {!compact ? <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,104,86,0.12),transparent_55%)]" /> : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(8,10,9,0.28))]" />

      {!compact ? (
        <>
          <DecorativeCorner position="top-left" />
          <DecorativeCorner position="top-right" />
          <DecorativeCorner position="bottom-left" />
          <DecorativeCorner position="bottom-right" />
        </>
      ) : null}

      <motion.div
        className={clsx(
          "absolute inset-0 flex flex-col justify-end",
          compact ? "p-4 md:p-5 lg:p-6" : "p-6 md:p-8 lg:p-10",
          contentClassName,
        )}
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {eyebrow ? (
          <motion.p
            variants={fadeUp}
            className="text-xs uppercase tracking-[0.28em] text-[var(--color-latao)]/90"
          >
            {eyebrow}
          </motion.p>
        ) : null}

        <motion.h1
          variants={fadeUp}
          className={clsx(
            "max-w-4xl font-serif leading-tight text-[var(--color-paper)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
            compact ? "mt-2 text-2xl md:text-3xl" : "mt-3 text-3xl md:text-5xl",
          )}
        >
          {title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className={clsx(
            "max-w-3xl text-[var(--color-paper)]/84",
            compact ? "mt-2 text-sm leading-6" : "mt-4 text-sm leading-7 md:text-base",
          )}
        >
          {subtitle}
        </motion.p>

        {actions?.length ? (
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className={action.variant === "secondary" ? "btn-secondary" : "btn-primary"}
              >
                {action.label}
              </Link>
            ))}
          </motion.div>
        ) : null}

        {visibleChips?.length ? (
          <motion.div variants={fadeUp} className={clsx("flex flex-wrap gap-2", compact ? "mt-3" : "mt-5")}>
            {visibleChips.map((chip) => (
              <span key={chip} className="image-badge">
                {chip}
              </span>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
