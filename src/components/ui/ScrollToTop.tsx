"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSFX } from "@/hooks/useSFX";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { playClick, playTick } = useSFX();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          onMouseEnter={() => playTick()}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-latao)]/30 bg-[color:rgba(10,12,11,0.85)] text-[var(--color-latao)] shadow-2xl backdrop-blur-md transition-shadow hover:border-[color:var(--color-latao)]/60 hover:shadow-[0_0_20px_rgba(212,163,103,0.15)] md:bottom-8 md:right-8"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={20} />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,163,103,0.1),transparent_70%)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
