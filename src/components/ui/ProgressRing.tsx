"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({ value, size = 36, strokeWidth = 3, className }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={clsx("shrink-0", className)}
      aria-label={`Progresso ${progress}%`}
      role="img"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(236, 227, 209, 0.12)"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-latao)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
        transition={{ type: "spring", stiffness: 80, damping: 16 }}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      {/* Label */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-paper)"
        fontSize={size * 0.26}
        fontWeight={600}
      >
        {Math.round(progress)}
      </text>
    </svg>
  );
}
