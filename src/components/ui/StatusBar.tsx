"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { formatPercent } from "@/lib/gameUtils";
import { AnimatedNumber } from "./AnimatedNumber";

interface StatusBarProps {
  label: ReactNode;
  value: number;
  colorVar: string;
}

export function StatusBar({ label, value, colorVar }: StatusBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-[var(--color-muted)]">
        <span>{label}</span>
        <AnimatedNumber value={value} format={formatPercent} />
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
