"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import type { RestorationStage } from "@/types/game";

const stages: RestorationStage[] = [
  "locked",
  "diagnosis",
  "prioritization",
  "contracting",
  "restoration",
  "validation",
  "released",
];

const stageLabels: Record<RestorationStage, string> = {
  locked: "Locked",
  diagnosis: "Diagnóstico",
  prioritization: "Priorização",
  contracting: "Contratação",
  restoration: "Restauro",
  validation: "Validação",
  released: "Liberado",
};

interface StagePipelineProps {
  currentStage: RestorationStage;
  className?: string;
}

export function StagePipeline({ currentStage, className }: StagePipelineProps) {
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {stages.map((stage, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLocked = stage === "locked" && currentStage === "locked";

        return (
          <div key={stage} className="flex items-center gap-1">
            {/* Dot */}
            <div className="relative flex flex-col items-center">
              <div
                className={clsx(
                  "relative flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300",
                  isCurrent
                    ? "border-[color:var(--color-latao)] bg-[color:rgba(212,163,103,0.24)]"
                    : isPast
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(191,122,79,0.22)]"
                      : "border-[color:rgba(236,227,209,0.15)] bg-[color:rgba(12,15,14,0.3)]",
                )}
              >
                {isCurrent && (
                  <motion.div
                    className="absolute h-2.5 w-2.5 rounded-full bg-[var(--color-latao)]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  />
                )}
                {isPast && (
                  <div className="h-2 w-2 rounded-full bg-[var(--color-cobre)]" />
                )}
              </div>
              {/* Label — only on current and when not locked */}
              {(isCurrent || isPast) && !isLocked && (
                <span
                  className={clsx(
                    "absolute top-6 whitespace-nowrap text-[0.58rem] uppercase tracking-[0.12em]",
                    isCurrent ? "font-semibold text-[var(--color-latao)]" : "text-[var(--color-muted)]",
                  )}
                >
                  {stageLabels[stage]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <div
                className={clsx(
                  "h-[2px] w-4 rounded-full transition-colors duration-300 md:w-6",
                  i < currentIndex
                    ? "bg-[var(--color-cobre)]"
                    : "bg-[color:rgba(236,227,209,0.1)]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
