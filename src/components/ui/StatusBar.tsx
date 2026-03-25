"use client";

import { motion } from "framer-motion";

import { formatPercent } from "@/lib/gameUtils";

interface StatusBarProps {
  label: string;
  value: number;
  colorVar: string;
}

export function StatusBar({ label, value, colorVar }: StatusBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[var(--color-muted)]">
        <span>{label}</span>
        <span>{formatPercent(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[color:rgba(233,223,201,0.18)]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: `var(${colorVar})` }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}
