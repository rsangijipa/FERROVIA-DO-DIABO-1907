"use client";

import { motion } from "framer-motion";
import { Compass, Factory, ScrollText, Play } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { hubAssets } from "@/content/assetManifest";
import Image from "next/image";
import { AnimatedLocomotive } from "../ui/AnimatedLocomotive";

export function LandingPage() {
  const acceptLanding = useGameStore((state) => state.acceptLanding);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[color:rgba(10,12,11,1)]">
      {/* Background Blueprint Layer */}
      <div className="absolute inset-0 min-h-full w-full opacity-10 transition-opacity duration-1000">
        <Image 
          src={hubAssets.heroBlueprint} 
          alt="" 
          fill 
          className="object-cover" 
          priority
          sizes="100vw"
        />
      </div>

      <AnimatedLocomotive />
      
      {/* Texture Overlays */}
      <div className="noise-overlay opacity-30 pointer-events-none" />
      <div className="mist-overlay opacity-20 pointer-events-none" />
      
      {/* Gradient mask to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[color:rgba(10,12,11,0.9)] via-transparent to-[color:rgba(10,12,11,0.95)] z-[5] pointer-events-none" />

      {/* TOP CONTENT: Title & Premise */}
      <motion.div 
        className="relative z-10 w-full max-w-4xl px-6 text-center mt-12 md:mt-20 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[var(--color-latao)] mb-4">Uma Experiência de Preservação e Memória</p>
        
        <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl text-[var(--color-paper)] leading-tight drop-shadow-2xl">
          FERROVIA DO DIABO
        </h1>

        <motion.button
          onClick={acceptLanding}
          className="btn-primary mt-12 inline-flex items-center justify-center gap-3 px-10 py-4 md:px-12 md:py-5 text-lg md:text-xl group active:scale-95 transition-all shadow-[0_0_50px_rgba(212,163,103,0.25)] hover:shadow-[0_0_80px_rgba(212,163,103,0.4)] border-[var(--color-latao)] bg-[color:rgba(212,163,103,0.15)] relative overflow-hidden backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-latao)]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out" />
          <Play size={24} className="group-hover:translate-x-1 group-hover:scale-110 transition-transform text-[var(--color-latao)] relative z-10" />
          <span className="text-[var(--color-paper)] font-serif tracking-widest uppercase relative z-10">Restaurar a Memória</span>
        </motion.button>
      </motion.div>

      {/* BOTTOM CONTENT: Pillars */}
      <motion.div
        className="relative z-10 w-full max-w-5xl px-6 pb-12 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >

        <div className="grid gap-4 md:grid-cols-3 w-full opacity-90 max-w-4xl mx-auto">
          {[
            { icon: Factory, label: "Restauração", desc: "Simule a revitalização técnica e operacional." },
            { icon: ScrollText, label: "História", desc: "Decida o destino de marcos diplomáticos." },
            { icon: Compass, label: "Acervo", desc: "Desvende segredos e reconstrua o museu." },
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              className="rounded-2xl border border-[var(--color-latao)]/20 bg-black/40 p-5 backdrop-blur-2xl text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
            >
              <item.icon className="mx-auto text-[var(--color-latao)] mb-2" size={18} />
              <h3 className="font-serif text-sm text-[var(--color-paper)] mb-1 uppercase tracking-widest">{item.label}</h3>
              <p className="text-[0.65rem] text-[var(--color-muted)] leading-relaxed uppercase tracking-wider">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <p className="mt-8 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-muted)] opacity-50 text-center">
          Madeira-Mamoré Railway • Complexo Cultural Vitalizado • 2026
        </p>
      </motion.div>
    </div>
  );
}
