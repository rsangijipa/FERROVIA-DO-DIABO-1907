"use client";

import { motion } from "framer-motion";
import { Compass, Map as MapIcon } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { restorationModules } from "@/content/restorationModules";

export function TemporalMap() {
  const restorationProgress = useGameStore((state) => state.progress.restoration) || {};
  
  const totalSteps = restorationModules.length;
  const completedSteps = restorationModules.filter(
    (m) => restorationProgress[m.id]?.stage === "released"
  ).length;

  return (
    <div className="card-dark p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <MapIcon size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="text-[var(--color-latao)] animate-pulse" size={20} />
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-latao)]">Lente do Tempo</p>
            <h2 className="font-serif text-xl text-[var(--color-paper)]">Mapa de Ativação</h2>
          </div>
        </div>

        <div className="relative h-24 bg-black/40 rounded-2xl border border-[color:rgba(233,223,201,0.05)] flex items-center px-6">
          <div className="absolute left-6 right-6 h-0.5 bg-[color:rgba(233,223,201,0.1)]" />
          
          <div className="relative flex justify-between w-full">
            {restorationModules.map((module) => {
              const status = restorationProgress[module.id]?.stage === "released" 
                ? "completed" 
                : restorationProgress[module.id]?.stage !== "locked" 
                ? "active" 
                : "locked";

              return (
                <div key={module.id} className="relative flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: status === "active" ? 1.2 : 1,
                      backgroundColor: status === "completed" ? "var(--color-latao)" : status === "active" ? "var(--color-paper)" : "rgba(233,223,201,0.2)",
                    }}
                    className="h-3 w-3 rounded-full border border-black/50 z-10"
                  />
                  <div className="absolute top-6 whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px]">
                    <p className={`text-[0.6rem] uppercase tracking-wider ${status === 'locked' ? 'text-[var(--color-muted)]' : 'text-[var(--color-paper)]'}`}>
                      {module.id.split('-')[0]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span>{completedSteps} de {totalSteps} trechos operacionais</span>
          <span className="text-[var(--color-latao)] font-semibold">{Math.round((completedSteps / totalSteps) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
