import clsx from "clsx";
import { BookOpen, Clock, FlaskConical } from "lucide-react";

import { evidenceById } from "@/content/evidenceCatalog";
import type { ContentType } from "@/types/game";

const editorialStyle = {
  historical_fact: {
    label: "Fato histórico documentado",
    className: "border-[color:rgba(197,154,93,0.5)] bg-[color:rgba(197,154,93,0.14)] text-[var(--color-bronze)]",
    icon: BookOpen,
  },
  contemporary_fact: {
    label: "Situação contemporânea documentada",
    className: "border-[color:rgba(95,137,145,0.5)] bg-[color:rgba(95,137,145,0.14)] text-[var(--color-tide)]",
    icon: Clock,
  },
  simulation_2026: {
    label: "Simulação plausível de 2026",
    className: "border-[color:rgba(211,154,59,0.5)] bg-[color:rgba(211,154,59,0.14)] text-[var(--color-amber)]",
    icon: FlaskConical,
  },
} as const;

interface EditorialSealProps {
  contentType: ContentType;
  sourceRef: string;
  confidenceNote: string;
  compact?: boolean;
  className?: string;
}

export function EditorialSeal({ contentType, sourceRef, confidenceNote, compact = false, className }: EditorialSealProps) {
  const style = editorialStyle[contentType];
  const evidence = evidenceById[sourceRef];
  const Icon = style.icon;

  return (
    <div className={clsx("rounded-xl border p-3", style.className, className)}>
      <div className="flex items-center gap-2">
        <Icon size={13} strokeWidth={2} className="shrink-0 opacity-80" />
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">{style.label}</p>
      </div>
      {!compact ? (
        <>
          <p className="mt-2 text-sm leading-6 text-current/90">{confidenceNote}</p>
          {evidence ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-current/75">{evidence.shortRef}</p> : null}
        </>
      ) : evidence ? (
        <p className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-current/80">{evidence.shortRef}</p>
      ) : null}
    </div>
  );
}
