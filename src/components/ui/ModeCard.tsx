import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

import { type FallbackAreaKey } from "@/content/assetManifest";

import { GameArtwork } from "./GameArtwork";
import { useSFX } from "@/hooks/useSFX";

interface ModeCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc?: string;
  imageAlt: string;
  fallbackArea?: FallbackAreaKey;
  metrics?: string[];
  className?: string;
  actionLabel?: string;
  priority?: boolean;
  compact?: boolean;
}

export function ModeCard({
  href,
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt,
  fallbackArea = "menu-card",
  metrics,
  className,
  actionLabel = "Jogar agora",
  priority = false,
  compact = false,
}: ModeCardProps) {
  const primaryMetric = metrics?.[0];
  const { playTick, playClick } = useSFX();

  return (
    <Link href={href} onClick={() => playClick()} className={clsx("group relative block min-w-0 w-full overflow-hidden rounded-[1.25rem] menu-card-hover border border-[color:var(--color-border)]", compact ? "h-auto" : "h-full", className)}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => playTick()}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative h-full w-full"
      >
        <GameArtwork
          src={imageSrc}
          alt={imageAlt}
          aspectRatio={compact ? "21/9" : "4/3"}
          overlay
          preload={priority}
          fadeBottom
          fallbackArea={fallbackArea}
          fallbackLabel={title}
          className={clsx(
            "rounded-[1.25rem] border-0",
            compact ? "min-h-[5.5rem] sm:min-h-[6.5rem]" : "min-h-[14rem] sm:min-h-[15rem]"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Luster effect on hover */}
        <div className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none bg-[linear-gradient(135deg,transparent_25%,rgba(212,163,103,0.08)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,15,14,0.05),rgba(12,15,14,0.54)_48%,rgba(12,15,14,0.9))]" />

        <div className={clsx("absolute inset-x-0 bottom-0", compact ? "p-3 sm:p-4" : "p-4 sm:p-5")}>
          <div className="flex items-center gap-3">
            <span className={clsx("flex items-center justify-center rounded-full border border-[color:rgba(233,223,201,0.16)] bg-[color:rgba(12,15,14,0.36)] text-[var(--color-paper)]", compact ? "h-7 w-7" : "h-10 w-10")}>
              <Icon size={compact ? 12 : 18} />
            </span>
            <h2 className={clsx("font-serif text-[var(--color-paper)]", compact ? "text-base sm:text-lg" : "text-xl")}>{title}</h2>
          </div>
          <p className={clsx("mt-1.5 max-w-[38ch] leading-5 text-[var(--color-paper)]/78", compact ? "text-[11px] line-clamp-1" : "text-sm")}>{description}</p>
          <div className={clsx("mt-3 items-center justify-between gap-3", compact ? "hidden" : "flex")}>
            {primaryMetric ? <span className="image-badge">{primaryMetric}</span> : <span />}
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-latao)]">{actionLabel}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
