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

      {/* Multi-overlay stack */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,9,0.12),rgba(8,10,9,0.56)_46%,rgba(8,10,9,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,104,86,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(8,10,9,0.36))]" />

      {/* Decorative corners */}
      <DecorativeCorner position="top-left" />
      <DecorativeCorner position="top-right" />
      <DecorativeCorner position="bottom-left" />
      <DecorativeCorner position="bottom-right" />

      {/* Content with stagger */}
      <motion.div
        className={clsx("absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10", contentClassName)}
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
          className="mt-3 max-w-4xl font-serif text-4xl leading-tight text-[var(--color-paper)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-paper)]/84 md:text-base"
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

        {chips?.length ? (
          <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
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
