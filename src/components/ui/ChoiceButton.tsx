"use client";

import { motion } from "framer-motion";

interface ChoiceDelta {
  label: string;
  value: number;
}

interface ChoiceButtonProps {
  label: string;
  deltas?: ChoiceDelta[];
  onClick: () => void;
}

export function ChoiceButton({ label, deltas, onClick }: ChoiceButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.995 }}
      onClick={onClick}
      className="group w-full rounded-md border border-[color:rgba(197,154,93,0.45)] bg-[color:rgba(44,42,40,0.9)] px-4 py-3 text-left transition hover:border-[color:var(--color-cobre)]"
    >
      <p className="text-sm text-[var(--color-paper)]">{label}</p>
      {!!deltas?.length && (
        <div className="mt-2 flex flex-wrap gap-2 opacity-0 transition group-hover:opacity-100">
          {deltas.map((delta) => (
            <span
              key={`${delta.label}-${delta.value}`}
              className={`rounded px-2 py-1 text-xs ${
                delta.value > 0
                  ? "bg-[color:rgba(94,138,97,0.18)] text-[var(--color-success)]"
                  : delta.value < 0
                    ? "bg-[color:rgba(182,73,50,0.18)] text-[var(--color-danger)]"
                    : "bg-[color:rgba(82,122,138,0.2)] text-[var(--color-info)]"
              }`}
            >
              {delta.label} {delta.value > 0 ? "+" : ""}
              {delta.value}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}
