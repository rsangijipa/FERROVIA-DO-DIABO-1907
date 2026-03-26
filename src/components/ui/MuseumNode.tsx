"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { MuseumColorState } from "@/types/game";

const stateStyles: Record<MuseumColorState, { bg: string; border: string; iconColor: string; glow: string }> = {
  locked: {
    bg: "bg-[color:rgba(38,37,34,0.6)]",
    border: "border-[color:rgba(236,227,209,0.1)]",
    iconColor: "text-[var(--color-muted)]",
    glow: "",
  },
  discovered: {
    bg: "bg-[color:rgba(210,162,94,0.1)]",
    border: "border-[color:rgba(210,162,94,0.3)]",
    iconColor: "text-[var(--color-bronze)]",
    glow: "",
  },
  restored: {
    bg: "bg-[color:rgba(191,122,79,0.12)]",
    border: "border-[color:rgba(191,122,79,0.4)]",
    iconColor: "text-[var(--color-cobre)]",
    glow: "",
  },
  complete: {
    bg: "bg-[color:rgba(212,163,103,0.16)]",
    border: "border-[color:rgba(212,163,103,0.5)]",
    iconColor: "text-[var(--color-latao)]",
    glow: "glow-badge",
  },
};

const stateLabels: Record<MuseumColorState, string> = {
  locked: "Trancada",
  discovered: "Descoberta",
  restored: "Restaurada",
  complete: "Completa",
};

interface MuseumNodeProps {
  icon: LucideIcon;
  label: string;
  state: MuseumColorState;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MuseumNode({ icon: Icon, label, state, active = false, onClick, className }: MuseumNodeProps) {
  const style = stateStyles[state];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200",
        style.bg,
        style.border,
        style.glow,
        active && "ring-1 ring-[color:var(--color-latao)] ring-offset-1 ring-offset-[color:rgba(25,29,27,0.9)]",
        state === "locked" ? "cursor-not-allowed opacity-55" : "hover-lift-game cursor-pointer",
        className,
      )}
    >
      <span
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-full border transition-colors",
          style.border,
          style.bg,
          style.iconColor,
        )}
      >
        <Icon size={22} />
      </span>
      <span className="font-serif text-sm text-[var(--color-paper)]">{label}</span>
      <span
        className={clsx(
          "text-[0.6rem] uppercase tracking-[0.16em]",
          state === "complete"
            ? "text-[var(--color-latao)]"
            : state === "restored"
              ? "text-[var(--color-cobre)]"
              : state === "discovered"
                ? "text-[var(--color-bronze)]"
                : "text-[var(--color-muted)]",
        )}
      >
        {stateLabels[state]}
      </span>
    </button>
  );
}
