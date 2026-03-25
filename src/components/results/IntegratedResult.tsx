"use client";

import { useMemo } from "react";

import { modeCovers } from "@/content/assetManifest";
import { quizQuestions } from "@/content/quizQuestions";
import { useGameStore } from "@/store/useGameStore";

import { SectionHero } from "../ui/SectionHero";

const restorationEndingText = {
  bom: "Você liderou um restauro firme: preservou acervo, sustentou equipe e entregou operação com legitimidade cultural.",
  mediano: "Você segurou o projeto até o fim, mas pagou custos relevantes em confiança, prazo ou patrimônio.",
  ruim: "A restauração perdeu coerência. O complexo avançou com fissuras técnicas e sociais difíceis de recompor.",
};

const narrativeHealthText = (health: number) => {
  if (health > 60) return "No surto, suas decisões evitaram mortalidade em massa e estabilizaram o acampamento.";
  if (health >= 30) return "Você conteve o pior, mas deixou marcas profundas no corpo e na memória dos trabalhadores.";
  return "O capítulo terminou em trauma coletivo: o km maldito virou símbolo de custo humano extremo.";
};

const quizTierText = (score: number, total: number) => {
  const ratio = score / total;
  if (ratio >= 0.8) return "Curadoria histórica de excelência";
  if (ratio >= 0.5) return "Leitura histórica consistente";
  return "Base histórica em formação";
};

const profileTitle = (restoration: "bom" | "mediano" | "ruim", narrativeStatus: "ongoing" | "won" | "lost", quizRatio: number) => {
  if (restoration === "bom" && narrativeStatus === "won" && quizRatio >= 0.7) {
    return "Guardião da Memória Viva";
  }
  if (restoration === "ruim" || narrativeStatus === "lost") {
    return "Gestor em Tempo de Ruptura";
  }
  return "Curador de Equilíbrios Difíceis";
};

export function IntegratedResult() {
  const restorationStatus = useGameStore((s) => s.restorationStatus);
  const evaluateRestorationEnding = useGameStore((s) => s.evaluateRestorationEnding);
  const restorationResources = useGameStore((s) => s.restorationResources);

  const narrativeStatus = useGameStore((s) => s.narrativeStatus);
  const narrativeBars = useGameStore((s) => s.narrativeBars);
  const narrativeHistory = useGameStore((s) => s.narrativeHistory);

  const quizStatus = useGameStore((s) => s.quizStatus);
  const quizScore = useGameStore((s) => s.quizScore);

  const codexCount = useGameStore((s) => s.unlockedCodexIds.length);
  const playerName = useGameStore((s) => s.player.name);

  const restorationEnding = evaluateRestorationEnding();
  const quizTotal = quizQuestions.length;
  const quizRatio = quizScore / quizTotal;
  const quizTier = quizTierText(quizScore, quizTotal);
  const finalProfile = profileTitle(restorationEnding, narrativeStatus, quizRatio);

  const worldSummary = useMemo(() => {
    const strongest = Object.entries(restorationResources).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (strongest === "preservacao") return "O patrimônio foi o eixo dominante da sua gestão.";
    if (strongest === "progressoTecnico") return "O avanço técnico liderou suas prioridades de reconstrução.";
    if (strongest === "moral") return "A coesão humana sustentou suas decisões mais difíceis.";
    if (strongest === "saudeSanitaria") return "O cuidado sanitário orientou seu comando sob pressão.";
    return "A disciplina orçamentária moldou o ritmo da revitalização.";
  }, [restorationResources]);

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Epílogo Integrado"
        title={finalProfile}
        subtitle={`Perfil de ${playerName}. ${worldSummary}`}
        imageSrc={modeCovers.resultado}
        imageAlt="Encerramento patrimonial da campanha"
        chips={["Perfil final", `${codexCount} entradas no Codex`]}
        fallbackArea="resultado"
        preload
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">Restauração</p>
          <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">
            {restorationStatus === "ongoing" ? "Em andamento" : restorationStatus === "won" ? "Concluída" : "Colapso"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{restorationEndingText[restorationEnding]}</p>
        </article>

        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">Narrativa</p>
          <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">
            {narrativeStatus === "won" ? "Capítulo superado" : narrativeStatus === "lost" ? "Derrota no capítulo" : "Em andamento"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{narrativeHealthText(narrativeBars.saude)}</p>
          <p className="mt-2 text-xs text-[var(--color-ink-soft)]">Decisões registradas: {narrativeHistory.length}</p>
        </article>

        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">Quiz</p>
          <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">
            {quizStatus === "finished" ? `${quizScore}/${quizTotal}` : `${quizScore}/${quizTotal} (parcial)`}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">{quizTier}</p>
          <p className="mt-2 text-xs text-[var(--color-ink-soft)]">Entradas no codex: {codexCount}</p>
        </article>
      </div>

      <article className="card-dark p-5">
        <h3 className="font-serif text-2xl text-[var(--color-paper)]">Síntese do Mundo</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          {worldSummary} Entre eficiência, luto e legado, seu percurso mostra que reconstruir a Madeira-Mamoré exige
          técnica e memória na mesma medida.
        </p>
      </article>
    </section>
  );
}
