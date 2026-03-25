"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { narrativeScenes } from "@/content/narrativeScenes";
import { useGameStore } from "@/store/useGameStore";

import { ChoiceButton } from "../ui/ChoiceButton";
import { NarrativeBarsPanel } from "../ui/NarrativeBarsPanel";

const protagonistLabel = {
  barbadiano: "Trabalhador barbadiano",
  medico: "Médico sanitarista",
} as const;

const endingText = (health: number) => {
  if (health > 60) return "O acampamento sobreviveu ao surto com baixas mínimas.";
  if (health >= 30) return "O surto foi contido, mas as cicatrizes são visíveis.";
  return "O km 88 ficou para sempre conhecido como o km maldito.";
};

export function NarrativeMode() {
  const protagonist = useGameStore((s) => s.protagonist);
  const chooseProtagonist = useGameStore((s) => s.chooseProtagonist);
  const bars = useGameStore((s) => s.narrativeBars);
  const sceneIndex = useGameStore((s) => s.sceneIndex);
  const flags = useGameStore((s) => s.narrativeFlags);
  const pending = useGameStore((s) => s.pendingConsequence);
  const status = useGameStore((s) => s.narrativeStatus);
  const choose = useGameStore((s) => s.chooseNarrativeChoice);
  const advance = useGameStore((s) => s.advanceNarrative);
  const reset = useGameStore((s) => s.resetNarrative);

  const scene = narrativeScenes[sceneIndex];

  if (!protagonist) {
    return (
      <section className="card-light max-w-3xl p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">Campanha Histórica</p>
        <h1 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">Escolha seu ponto de vista</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
          A mesma ferrovia muda de sentido conforme quem vive a decisão no canteiro.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(Object.keys(protagonistLabel) as Array<keyof typeof protagonistLabel>).map((key) => (
            <button key={key} className="btn-secondary" onClick={() => chooseProtagonist(key)}>
              {protagonistLabel[key]}
            </button>
          ))}
        </div>
      </section>
    );
  }

  const choices = scene.choices.filter((choice) => {
    if (choice.requiredFlags?.length && !choice.requiredFlags.every((flag) => flags[flag])) return false;
    if (scene.id === "n-02") {
      if (flags.isolated_sick) return choice.id === "n-02-a" || choice.id === "n-02-b";
      return choice.id === "n-02-c" || choice.id === "n-02-d";
    }
    return true;
  });

  return (
    <section className="space-y-4">
      <NarrativeBarsPanel bars={bars} />

      <AnimatePresence mode="wait">
        {status === "ongoing" ? (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24 }}
            className="card-light p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">
              Capítulo 2 • Cena {sceneIndex + 1}/8
            </p>
            <h1 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{scene.title}</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{scene.text}</p>

            {pending ? (
              <div className="mt-4 rounded-md border border-[color:rgba(161,79,42,0.35)] bg-[color:rgba(161,79,42,0.08)] p-4">
                <p className="text-sm text-[var(--color-ink)]">{pending}</p>
                <button className="btn-primary mt-4" onClick={advance}>
                  Avançar cena
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {choices.map((choice) => {
                  const deltas = Object.entries(choice.delta).map(([label, value]) => ({
                    label,
                    value: value ?? 0,
                  }));
                  return (
                    <ChoiceButton
                      key={choice.id}
                      label={choice.label}
                      deltas={deltas}
                      onClick={() => choose(choice.id)}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="n-end"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-light p-6"
          >
            <h1 className="font-serif text-2xl text-[var(--color-ink)]">
              {status === "won" ? "Fim do Capítulo 2" : "Game Over Narrativo"}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
              {status === "won"
                ? endingText(bars.saude)
                : "Uma barra crítica chegou a zero. O surto e a tensão no canteiro romperam sua liderança."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={reset}>
                Recomeçar capítulo
              </button>
              <Link className="btn-secondary" href="/resultado">
                Ver resultado integrado
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
