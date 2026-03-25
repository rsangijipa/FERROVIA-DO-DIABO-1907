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
  className?: string;
}

export function ModeCard({
  href,
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt,
  fallbackArea = "menu-card",
  className,
}: ModeCardProps) {
  return (
    <Link href={href} className={clsx("group relative block overflow-hidden rounded-[1.2rem] menu-card-hover", className)}>
      <GameArtwork
        src={imageSrc}
        alt={imageAlt}
        aspectRatio="4/3"
        overlay
        fadeBottom
        fallbackArea={fallbackArea}
        fallbackLabel={title}
        className="min-h-[18rem] rounded-[1.2rem] border-0"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,15,14,0.08),rgba(12,15,14,0.62)_52%,rgba(12,15,14,0.88))]" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:rgba(233,223,201,0.16)] bg-[color:rgba(12,15,14,0.36)] text-[var(--color-paper)]">
            <Icon size={16} />
          </span>
          <h2 className="font-serif text-xl text-[var(--color-paper)]">{title}</h2>
        </div>
        <p className="mt-3 max-w-[34ch] text-sm leading-6 text-[var(--color-paper)]/78">{description}</p>
      </div>
    </Link>
  );
}
