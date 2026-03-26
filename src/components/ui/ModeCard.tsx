import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

import { type FallbackAreaKey } from "@/content/assetManifest";

import { GameArtwork } from "./GameArtwork";

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
}: ModeCardProps) {
  const primaryMetric = metrics?.[0];

  return (
    <Link href={href} className={clsx("group relative block min-w-0 w-full overflow-hidden rounded-[1.25rem] menu-card-hover", className)}>
      <GameArtwork
        src={imageSrc}
        alt={imageAlt}
        aspectRatio="4/3"
        overlay
        fadeBottom
        fallbackArea={fallbackArea}
        fallbackLabel={title}
        className="min-h-[14rem] rounded-[1.25rem] border-0 sm:min-h-[15rem]"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,15,14,0.05),rgba(12,15,14,0.54)_48%,rgba(12,15,14,0.9))]" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(233,223,201,0.16)] bg-[color:rgba(12,15,14,0.36)] text-[var(--color-paper)]">
            <Icon size={18} />
          </span>
          <h2 className="font-serif text-xl text-[var(--color-paper)]">{title}</h2>
        </div>
        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-[var(--color-paper)]/78">{description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          {primaryMetric ? <span className="image-badge">{primaryMetric}</span> : <span />}
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-latao)]">{actionLabel}</span>
        </div>
      </div>
    </Link>
  );
}
