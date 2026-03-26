"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";

import { configAssets } from "@/content/assetManifest";
import { useGameStore } from "@/store/useGameStore";

import { SectionHero } from "../ui/SectionHero";

export function ConfigView() {
  const settings = useGameStore((s) => s.settings);
  const setFontScale = useGameStore((s) => s.setFontScale);
  const toggleHighContrast = useGameStore((s) => s.toggleHighContrast);
  const toggleReducedMotion = useGameStore((s) => s.toggleReducedMotion);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const resetCampaign = useGameStore((s) => s.resetCampaign);

  const [resetStep, setResetStep] = useState<0 | 1 | 2>(0);

  const handleReset = () => {
    resetCampaign();
    setResetStep(0);
  };

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Acessibilidade e conforto"
        title="Configurações"
        subtitle="Ajustes de leitura, conforto visual e preferências de animação para manter o tom do patrimônio legível."
        imageSrc={configAssets.hero}
        imageAlt="Configurações"
        fallbackArea="hub"
      />

      <div className="card-dark max-w-3xl p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Ajustes visuais</p>

        <div className="mt-6 space-y-6 text-sm text-[var(--color-paper)]">
          {/* Font scale slider with glow track */}
          <div>
            <label className="block">
              <span className="flex items-center justify-between">
                <span>Escala de fonte</span>
                <span className="font-mono text-[var(--color-latao)]">{settings.fontScale.toFixed(2)}x</span>
              </span>
              <div className="relative mt-3">
                <input
                  type="range"
                  min={0.9}
                  max={1.3}
                  step={0.05}
                  value={settings.fontScale}
                  onChange={(event) => setFontScale(Number(event.target.value))}
                  className="w-full accent-[var(--color-latao)]"
                  style={{
                    background: `linear-gradient(90deg, var(--color-latao) ${((settings.fontScale - 0.9) / 0.4) * 100}%, rgba(236,227,209,0.12) ${((settings.fontScale - 0.9) / 0.4) * 100}%)`,
                    height: "4px",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </label>
          </div>

          {/* Toggle buttons with spring */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Alto contraste", active: settings.highContrast, onClick: toggleHighContrast },
              { label: "Reduzir animações", active: settings.reducedMotion, onClick: toggleReducedMotion },
              { label: "Som ambiente", active: settings.soundEnabled, onClick: toggleSound },
            ].map((item) => (
              <motion.button
                key={item.label}
                className={`rounded-full border px-5 py-3 text-sm transition-colors ${
                  item.active
                    ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)] glow-badge"
                    : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.4)] text-[var(--color-muted)]"
                }`}
                onClick={item.onClick}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full transition-colors ${
                      item.active ? "bg-[var(--color-latao)]" : "bg-[var(--color-muted)]"
                    }`}
                  />
                  {item.label}: {item.active ? "ON" : "OFF"}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-10 border-t border-[color:rgba(233,223,201,0.08)] pt-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-danger)]">Zona de Risco</p>
          <div className="mt-4 rounded-2xl border border-[color:rgba(182,73,50,0.2)] bg-[color:rgba(182,73,50,0.05)] p-5">
            <h3 className="font-serif text-lg text-[var(--color-paper)]">Resetar progresso</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Apaga todo o progresso da campanha, incluindo etapas de restauro, cenas de história lidas, notas no quiz e alas do museu descobertas. Esta ação é irreversível.
            </p>

            <div className="mt-6">
              {resetStep === 0 && (
                <button
                  type="button"
                  onClick={() => setResetStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-danger)] bg-[color:rgba(182,73,50,0.15)] px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[color:var(--color-danger)] hover:text-white"
                >
                  <RotateCcw size={16} />
                  Resetar campanha
                </button>
              )}
              {resetStep === 1 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-danger)]">
                    <AlertCircle size={16} /> Tem certeza?
                  </span>
                  <button
                    type="button"
                    onClick={() => setResetStep(2)}
                    className="rounded-full border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Sim, quero apagar
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetStep(0)}
                    className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {resetStep === 2 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex animate-pulse items-center gap-2 text-sm font-bold text-red-500">
                    <AlertCircle size={16} /> Última chance: Ação irreversível!
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-red-600 bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
                  >
                    Confirmar Reset Permanente
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetStep(0)}
                    className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
