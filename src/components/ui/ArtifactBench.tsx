"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Hammer, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface ArtifactBenchProps {
  artifactId: string;
  onClose: () => void;
}

export function ArtifactBench({ artifactId, onClose }: ArtifactBenchProps) {
  const [isCleaned, setIsCleaned] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [25, -25]);
  const rotateY = useTransform(x, [-150, 150], [-25, 25]);

  const artifactName = artifactId.replace("artefato-", "").replace(/-/g, " ");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="card-dark max-w-2xl w-full p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-muted)] hover:text-[var(--color-paper)] transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-[color:rgba(212,163,103,0.1)] border border-[color:rgba(212,163,103,0.2)] flex items-center justify-center text-[var(--color-latao)]">
              <Sparkles size={40} />
            </div>
          </div>
          
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-latao)] mb-2">Novo Achado Arqueológico</p>
          <h2 className="font-serif text-3xl text-[var(--color-paper)] capitalize">{artifactName}</h2>
          
          <div 
            className="mt-8 relative h-64 bg-black/40 rounded-3xl border border-[color:rgba(233,223,201,0.05)] flex items-center justify-center perspective-[1000px]"
            onPointerMove={(e) => {
              if (!isCleaned) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const cx = rect.left + rect.width / 2;
              const cy = rect.top + rect.height / 2;
              x.set(e.clientX - cx);
              y.set(e.clientY - cy);
            }}
            onPointerLeave={() => {
              x.set(0);
              y.set(0);
            }}
          >
            <motion.div
              layout
              animate={{
                 filter: isCleaned ? "brightness(1.2) contrast(1.1)" : "brightness(0.5) grayscale(1)",
                 scale: isCleaned ? 1.15 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-8xl select-none cursor-pointer drop-shadow-2xl"
              style={{
                rotateX: isCleaned ? rotateX : 0,
                rotateY: isCleaned ? rotateY : 0,
                transformStyle: "preserve-3d",
              }}
            >
              {artifactId.includes("ferramenta") ? "🛠️" : artifactId.includes("medalha") ? "🎖️" : "🧪"}
            </motion.div>
            
            {!isCleaned && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                <p className="text-xs text-[var(--color-muted)] italic">Objeto coberto por terra e musgo...</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            {!isCleaned ? (
              <button
                onClick={() => setIsCleaned(true)}
                className="btn-primary flex items-center gap-2 px-8 py-3"
              >
                <Hammer size={18} />
                Limpar Artefato
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-[var(--color-muted)] leading-relaxed max-w-md mx-auto">
                  Este item foi recuperado nos arredores do antigo leito da ferrovia. 
                  Sua preservação ajudará a contar a história das milhares de vidas que passaram por aqui.
                </p>
                <button
                  onClick={onClose}
                  className="btn-outline px-8 py-2"
                >
                  Adicionar ao Acervo
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
