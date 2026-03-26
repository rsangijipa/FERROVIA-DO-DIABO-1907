"use client";

import { motion } from "framer-motion";
import { Compass, Factory, ScrollText, Play } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { hubAssets } from "@/content/assetManifest";
import Image from "next/image";

export function LandingPage() {
  const acceptLanding = useGameStore((state) => state.acceptLanding);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[color:rgba(10,12,11,1)]">
      {/* Background Blueprint Layer */}
      <div className="absolute inset-0 min-h-full w-full opacity-20 transition-opacity duration-1000">
        <Image 
          src={hubAssets.heroBlueprint} 
          alt="" 
          fill 
          className="object-cover" 
          priority
          sizes="100vw"
        />
      </div>
      
      {/* Texture Overlays */}
      <div className="noise-overlay opacity-40" />
      <div className="mist-overlay opacity-30" />

      <motion.div 
        className="relative z-10 w-full max-w-4xl px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-latao)] mb-6">Uma Experiência de Preservação e Memória</p>
        
        <h1 className="font-serif text-5xl md:text-7xl text-[var(--color-paper)] leading-tight">
          FERROVIA DO DIABO <br />
          <span className="text-[var(--color-latao)]">1907 — 1912</span>
        </h1>

        <div className="mt-8 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-latao)] to-transparent" />

        <p className="mt-8 text-lg md:text-xl text-[var(--color-muted)] leading-relaxed max-w-2xl mx-auto font-serif italic">
          "Onde outros viram apenas selva, nós traçamos o futuro. Onde outros esqueceram o suor, nós restauramos a história."
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Factory, label: "Restauração", desc: "Simule a revitalização técnica e operacional." },
            { icon: ScrollText, label: "História", desc: "Decida o destino de marcos diplomáticos." },
            { icon: Compass, label: "Acervo", desc: "Desvende segredos e reconstrua o museu." },
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              className="rounded-2xl border border-[color:rgba(212,163,103,0.1)] bg-[color:rgba(12,15,14,0.4)] p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
            >
              <item.icon className="mx-auto text-[var(--color-latao)] mb-3" size={24} />
              <h3 className="font-serif text-lg text-[var(--color-paper)] mb-2">{item.label}</h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={acceptLanding}
          className="btn-primary mt-12 inline-flex items-center gap-3 px-10 py-5 text-lg group active:scale-95 transition-transform"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Play size={20} className="group-hover:translate-x-1 transition-transform" />
          Restaurar a Memória
        </motion.button>
        
        <p className="mt-6 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-muted)] opacity-50">
          Madeira-Mamoré Railway • Complexo Cultural Vitalizado • 2026
        </p>
      </motion.div>
    </div>
  );
}
