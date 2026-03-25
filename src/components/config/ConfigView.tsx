"use client";

import { useGameStore } from "@/store/useGameStore";

export function ConfigView() {
  const settings = useGameStore((s) => s.settings);
  const setFontScale = useGameStore((s) => s.setFontScale);
  const toggleHighContrast = useGameStore((s) => s.toggleHighContrast);
  const toggleReducedMotion = useGameStore((s) => s.toggleReducedMotion);
  const toggleSound = useGameStore((s) => s.toggleSound);

  return (
    <section className="card-dark max-w-3xl p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Acessibilidade e conforto</p>
      <h1 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Configurações</h1>

      <div className="mt-5 space-y-4 text-sm text-[var(--color-paper)]">
        <label className="block">
          Escala de fonte ({settings.fontScale.toFixed(2)}x)
          <input
            type="range"
            min={0.9}
            max={1.3}
            step={0.05}
            value={settings.fontScale}
            onChange={(event) => setFontScale(Number(event.target.value))}
            className="mt-2 w-full"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary" onClick={toggleHighContrast}>
            Alto contraste: {settings.highContrast ? "ON" : "OFF"}
          </button>
          <button className="btn-secondary" onClick={toggleReducedMotion}>
            Reduzir animações: {settings.reducedMotion ? "ON" : "OFF"}
          </button>
          <button className="btn-secondary" onClick={toggleSound}>
            Som ambiente: {settings.soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>
    </section>
  );
}
