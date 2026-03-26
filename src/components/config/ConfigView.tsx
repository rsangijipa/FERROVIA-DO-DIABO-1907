"use client";

import { motion } from "framer-motion";
import { configAssets } from "@/content/assetManifest";
import { useGameStore } from "@/store/useGameStore";

import { SectionHero } from "../ui/SectionHero";

export function ConfigView() {
  const settings = useGameStore((s) => s.settings);
  const setFontScale = useGameStore((s) => s.setFontScale);
  const toggleHighContrast = useGameStore((s) => s.toggleHighContrast);
  const toggleReducedMotion = useGameStore((s) => s.toggleReducedMotion);
  const toggleSound = useGameStore((s) => s.toggleSound);

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
      </div>
    </section>
  );
}
