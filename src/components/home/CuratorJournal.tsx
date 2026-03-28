"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, X, Hammer, Shield, LibraryBig } from "lucide-react";
import clsx from "clsx";

import { useGameStore } from "@/store/useGameStore";
import { artifactRegistry } from "@/content/artifactContent";

interface CuratorJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CuratorJournal({ isOpen, onClose }: CuratorJournalProps) {
  const [activeTab, setActiveTab] = useState<"reputation" | "restoration" | "artifacts">("reputation");
  const reputation = useGameStore((s) => s.progress.reputation);
  const foundArtifacts = useGameStore((s) => s.progress.foundArtifacts);

  if (!isOpen) return null;

  const tabs = [
    { id: "reputation", label: "Reputação", icon: Shield },
    { id: "restoration", label: "Obras", icon: Hammer },
    { id: "artifacts", label: "Catálogo", icon: LibraryBig },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="card-dark w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] max-h-[600px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[color:rgba(212,163,103,0.14)] p-4 bg-[color:rgba(20,22,21,0.5)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)]">
                <Book className="text-[var(--color-latao)]" size={20} />
              </div>
              <div>
                <h2 className="font-serif text-lg text-[var(--color-latao)]">Diário do Curador</h2>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Registros da Campanha</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[var(--color-muted)] transition-colors hover:bg-[color:rgba(255,255,255,0.05)] hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[color:rgba(212,163,103,0.1)] px-4 pt-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={clsx(
                    "flex items-center gap-2 rounded-t-lg border-x border-t px-4 py-2 transition-colors",
                    isActive
                      ? "border-[color:rgba(212,163,103,0.2)] bg-[color:rgba(212,163,103,0.08)] text-[var(--color-latao)]"
                      : "border-transparent text-[var(--color-muted)] hover:bg-[color:rgba(255,255,255,0.02)]"
                  )}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium uppercase tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {activeTab === "reputation" && (
              <div className="space-y-6 anim-in">
                <p className="text-sm text-[var(--color-paper)]">O impacto das suas decisões reverbera nas seguintes frentes institucionais:</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "tecnico", label: "Técnico", value: reputation.tecnico, desc: "Avanços em engenharia e estaleiro" },
                    { key: "historico", label: "Histórico", value: reputation.historico, desc: "Resgate da memória operária" },
                    { key: "conhecimento", label: "Conhecimento", value: reputation.conhecimento, desc: "Saber acadêmico e pesquisa" },
                    { key: "acervo", label: "Acervo", value: reputation.acervo, desc: "Preservação material do museu" },
                  ].map((rep) => (
                    <div key={rep.key} className="rounded-xl border border-[color:var(--color-border)] bg-[color:rgba(0,0,0,0.2)] p-4">
                      <div className="flex items-end justify-between">
                        <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">{rep.label}</span>
                        <span className="font-serif text-2xl text-[var(--color-latao)]">{(rep.value * 100).toFixed(0)}</span>
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-muted)]">{rep.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "restoration" && (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-60 anim-in">
                <Hammer size={48} className="mb-4 text-[var(--color-muted)] opacity-50" />
                <p className="text-sm text-[var(--color-paper)]">O Relatório Detalhado de Obras será compilado aqui à medida que os módulos avançarem.</p>
              </div>
            )}

            {activeTab === "artifacts" && (
              <div className="space-y-4 anim-in">
                {foundArtifacts.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center text-center opacity-60">
                    <LibraryBig size={48} className="mb-4 text-[var(--color-muted)] opacity-50" />
                    <p className="text-sm text-[var(--color-paper)]">Nenhum artefato encontrado em campo ainda.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {foundArtifacts.map((id) => {
                      const artifact = artifactRegistry[id as keyof typeof artifactRegistry];
                      if (!artifact) return null;
                      return (
                        <div key={id} className="flex gap-4 rounded-xl border border-[color:rgba(212,163,103,0.15)] bg-[color:rgba(0,0,0,0.25)] p-3">
                          <div className="h-16 w-16 shrink-0 rounded-lg bg-[color:rgba(255,255,255,0.05)] border border-[color:rgba(255,255,255,0.1)]">
                            {/* Placeholder for 3D/Image */}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-[var(--color-latao)]">{artifact.name}</p>
                            <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">{artifact.summary}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
