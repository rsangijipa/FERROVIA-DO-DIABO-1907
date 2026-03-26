"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useSFX } from "@/hooks/useSFX";

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
  chips?: (string | ReactNode)[];
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { playClick, playTick } = useSFX();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const x = useTransform(smoothX, [-0.5, 0.5], ["2.5%", "-2.5%"]);
  const y = useTransform(smoothY, [-0.5, 0.5], ["2.5%", "-2.5%"]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(px);
    mouseY.set(py);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const visibleChips = compact ? chips?.slice(0, 2) : chips;

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "relative overflow-hidden rounded-[1.5rem] golden-frame w-full",
        compact ? "min-h-[14rem] sm:min-h-[16rem] lg:min-h-[18rem]" : "min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]",
        className
      )}
    >
      <motion.div 
        style={{ x, y, rotateX, rotateY, scale: 1.05 }} 
        className="absolute inset-0 z-0"
      >
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
            "rounded-[1.5rem] border-0 h-full w-full object-cover",
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
        />
      </motion.div>

      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-10",
          compact
            ? "bg-[linear-gradient(180deg,rgba(8,10,9,0.08),rgba(8,10,9,0.44)_46%,rgba(8,10,9,0.84))]"
            : "bg-[linear-gradient(180deg,rgba(8,10,9,0.12),rgba(8,10,9,0.56)_46%,rgba(8,10,9,0.92))]",
        )}
      />
      {!compact ? <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top,rgba(79,104,86,0.12),transparent_55%)]" /> : null}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(8,10,9,0.28))]" />

      {!compact ? (
        <div className="z-20">
          <DecorativeCorner position="top-left" />
          <DecorativeCorner position="top-right" />
          <DecorativeCorner position="bottom-left" />
          <DecorativeCorner position="bottom-right" />
        </div>
      ) : null}

      <motion.div
        className={clsx(
          "absolute inset-0 flex flex-col justify-end z-20",
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
            compact ? "mt-2 text-xl md:text-2xl lg:text-3xl" : "mt-3 text-2xl md:text-4xl lg:text-5xl",
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
                onClick={() => playClick()}
                onMouseEnter={() => playTick()}
                className={action.variant === "secondary" ? "btn-secondary" : "btn-primary"}
              >
                {action.label}
              </Link>
            ))}
          </motion.div>
        ) : null}

        {visibleChips?.length ? (
          <motion.div variants={fadeUp} className={clsx("flex flex-wrap gap-2", compact ? "mt-3" : "mt-5")}>
            {visibleChips.map((chip, i) => (
              <span key={i} className="image-badge">
                {chip}
              </span>
            ))}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
