"use client";

import { motion } from "framer-motion";

interface BlueprintLineProps {
  className?: string;
  delay?: number;
}

export function BlueprintLine({ className, delay = 0 }: BlueprintLineProps) {
  return (
    <div className={`relative h-px w-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: "easeInOut" }}
        className="h-full w-full bg-gradient-to-r from-transparent via-[var(--color-latao)] to-transparent opacity-30"
      />
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeInOut" }}
        className="absolute inset-0 h-full w-20 bg-gradient-to-r from-transparent via-[var(--color-paper)] to-transparent opacity-40"
      />
    </div>
  );
}
