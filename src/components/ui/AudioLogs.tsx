"use client";

import { motion } from "framer-motion";
import { Mic2, Radio, Volume2 } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { audioLogsData } from "@/content/audioContent";
import { EditorialSeal } from "./EditorialSeal";

export function AudioLogs() {
  const unlockedIds = useGameStore((state) => state.progress.audioLogs) || [];
  const unlockedLogs = audioLogsData.filter((log) => unlockedIds.includes(log.id));

  if (unlockedLogs.length === 0) return null;

  return (
    <article className="card-dark p-5 md:p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Radio size={80} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(212,163,103,0.2)] bg-[color:rgba(212,163,103,0.1)] text-[var(--color-latao)]">
            <Mic2 size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Ecos do Madeira</p>
            <h2 className="font-serif text-2xl text-[var(--color-paper)]">Logs de Áudio</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {unlockedLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.24)] p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    <span>{log.speaker}</span>
                    <span className="opacity-40">•</span>
                    <span>{log.date}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg text-[var(--color-paper)]">{log.title}</h3>
                  <div className="mt-4 relative bg-[color:rgba(8,10,9,0.3)] rounded-xl p-4 italic text-sm leading-7 text-[var(--color-muted)] border-l-2 border-[color:var(--color-latao)]">
                    <div className="absolute top-2 right-3 opacity-20">
                      <Volume2 size={16} />
                    </div>
                    {log.transcript}
                  </div>
                </div>
              </div>
              
              <EditorialSeal
                contentType={log.contentType}
                sourceRef={log.sourceRef}
                confidenceNote={log.confidenceNote}
                compact
                className="mt-4"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </article>
  );
}
