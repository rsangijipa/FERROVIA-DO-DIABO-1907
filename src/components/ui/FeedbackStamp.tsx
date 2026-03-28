"use client";

import clsx from "clsx";
import { Check, X, Unlock, Award } from "lucide-react";

type StampType = "correct" | "wrong" | "unlocked" | "completed";

const stampConfig: Record<StampType, { label: string; icon: typeof Check; borderColor: string; bgColor: string; textColor: string }> = {
  correct: {
    label: "Correto",
    icon: Check,
    borderColor: "rgba(94, 138, 97, 0.6)",
    bgColor: "rgba(94, 138, 97, 0.14)",
    textColor: "var(--color-success)",
  },
  wrong: {
    label: "Incorreto",
    icon: X,
    borderColor: "rgba(182, 73, 50, 0.6)",
    bgColor: "rgba(182, 73, 50, 0.14)",
    textColor: "var(--color-danger)",
  },
  unlocked: {
    label: "Desbloqueado",
    icon: Unlock,
    borderColor: "rgba(212, 163, 103, 0.5)",
    bgColor: "rgba(212, 163, 103, 0.12)",
    textColor: "var(--color-latao)",
  },
  completed: {
    label: "Concluído",
    icon: Award,
    borderColor: "rgba(124, 176, 183, 0.5)",
    bgColor: "rgba(124, 176, 183, 0.12)",
    textColor: "var(--color-tide)",
  },
};

interface FeedbackStampProps {
  type: StampType;
  className?: string;
}

export function FeedbackStamp({ type, className }: FeedbackStampProps) {
  const config = stampConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 anim-stamp",
        className,
      )}
      style={{
        borderColor: config.borderColor,
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      <Icon size={16} strokeWidth={2.5} />
      <span className="text-xs font-bold uppercase tracking-[0.18em]">{config.label}</span>
    </div>
  );
}
