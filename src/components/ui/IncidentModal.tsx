"use client";

import { useGameStore } from "@/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";



export function IncidentModal() {
  const activeIncident = useGameStore((state) => state.progress.director?.activeIncident);
  const resolveIncident = useGameStore((state) => state.resolveIncident);

  return (
    <AnimatePresence>
      {activeIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-rust)]/30 bg-[color:rgba(12,15,14,0.95)] shadow-2xl"
          >
            <div className="flex items-center gap-4 bg-[var(--color-rust)]/10 p-6 border-b border-[var(--color-rust)]/20">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-rust)]/20 text-[var(--color-rust)]">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-rust)] font-bold mb-1">
                  Crise Ativa — {activeIncident.type}
                </p>
                <h2 className="font-serif text-2xl text-[var(--color-paper)]">{activeIncident.title}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-lg leading-relaxed text-[var(--color-paper)]/90 mb-8 font-serif">
                {activeIncident.description}
              </p>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-latao)]/60 mb-2">Decisão de Comando exigida</p>
                {activeIncident.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => resolveIncident(option.id)}
                    className="w-full text-left rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-[var(--color-latao)]/10 hover:border-[var(--color-latao)]/30 transition-colors group flex gap-4 items-start"
                  >
                    <div className="mt-1 h-5 w-5 rounded-full border border-white/20 group-hover:border-[var(--color-latao)] flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-[var(--color-latao)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[var(--color-paper)] group-hover:text-[var(--color-latao)] transition-colors">
                        {option.label}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--color-paper)]/60">
                        {option.consequence}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(option.resourceDelta ?? {}).map(([key, val]) => (
                          <span key={key} className={`text-[10px] px-2 py-1 rounded bg-black/40 border border-white/10 uppercase font-mono ${Number(val) > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                            {key}: {Number(val) > 0 ? '+' : ''}{val}
                          </span>
                        ))}
                        {Object.entries(option.directorDelta ?? {}).map(([key, val]) => (
                          <span key={key} className={`text-[10px] px-2 py-1 rounded bg-black/40 border border-[var(--color-info)]/20 text-[var(--color-info)] uppercase font-mono`}>
                            {key}: {Number(val) > 0 ? '+' : ''}{val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
