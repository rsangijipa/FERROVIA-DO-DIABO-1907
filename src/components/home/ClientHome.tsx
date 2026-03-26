"use client";

import { HomeHub } from "@/components/home/HomeHub";
import { ModeInitializer } from "@/components/layout/ModeInitializer";
import { useGameStore } from "@/store/useGameStore";
import { LandingPage } from "./LandingPage";
import { AnimatePresence, motion } from "framer-motion";

export function ClientHome() {
  const hasAcceptedLanding = useGameStore((state) => state.saveData.hasAcceptedLanding);

  return (
    <motion.div
      key="hub"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <ModeInitializer mode="hub" />
      <HomeHub />
    </motion.div>
  );
}
