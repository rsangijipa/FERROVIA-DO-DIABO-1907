"use client";

import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules } from "@/content/restorationModules";
import { useGameStore } from "@/store/useGameStore";

import { SectionHero } from "../ui/SectionHero";
import { StatusBar } from "../ui/StatusBar";

const clampPercent = (value: number) => Math.round(Math.max(0, Math.min(100, value)));

const resolveProfile = (restoration: number, history: number, quiz: number, museum: number) => {
  if (restoration >= 75 && museum >= 55 && restoration >= history && restoration >= quiz) {
    return "Engenheiro da Revitalizacao";
  }
  if (history >= 70 && museum >= 60) {
    return "Curador da Memoria";
  }
  if (quiz >= 75 && museum >= 65) {
    return "Guardiao do Acervo";
  }
  if (museum >= 60 && history >= 55) {
    return "Mediador do Patrimonio";
  }
  return "Operador do Legado";
};

export function IntegratedResult() {
  const player = useGameStore((store) => store.player);
  const resources = useGameStore((store) => store.restorationResources);
  const progress = useGameStore((store) => store.progress);

  const releasedModules = restorationModules.filter((module) => progress.restoration[module.id].stage === "released").length;
  const averageResource = (resources.orcamento + resources.moral + resources.saudeSanitaria + resources.progressoTecnico + resources.preservacao) / 5;
  const restorationScore = clampPercent((releasedModules / restorationModules.length) * 55 + averageResource * 0.45);

  const totalHistoryScenes = 8;
  const historyScore = clampPercent((progress.history.completedSceneIds.length / totalHistoryScenes) * 70 + ((progress.history.bars.saude + progress.history.bars.moral + progress.history.bars.progresso) / 3) * 0.3);

  const availableQuizModules = quizModules.filter((module) => module.status === "available");
  const quizCorrect = availableQuizModules.reduce((acc, module) => acc + progress.quiz[module.id].correct, 0);
  const totalQuizQuestions = availableQuizModules.reduce((acc, module) => acc + (quizQuestionsByModuleId[module.id]?.length ?? 0), 0);
  const quizScore = totalQuizQuestions === 0 ? 0 : clampPercent((quizCorrect / totalQuizQuestions) * 100);

  const availableMuseumEntries = museumAreas.filter((area) => area.status === "available").reduce((acc, area) => acc + area.entryIds.length, 0);
  const museumScore = availableMuseumEntries === 0
    ? 0
    : clampPercent(((progress.museum.unlockedEntryIds.length / availableMuseumEntries) * 60) + ((progress.museum.viewedEntryIds.length / availableMuseumEntries) * 40));

  const weightedScore = clampPercent((restorationScore * 0.35) + (historyScore * 0.25) + (quizScore * 0.2) + (museumScore * 0.2));
  const profile = resolveProfile(restorationScore, historyScore, quizScore, museumScore);

  const timeline = [
    `${releasedModules}/4 modulos de restauração liberados`,
    `${progress.history.completedChapterIds.length}/2 partes historicas concluidas`,
    `${quizCorrect}/${totalQuizQuestions} acertos no quiz tematico`,
    `${progress.museum.unlockedEntryIds.length}/${availableMuseumEntries} entradas do Museu Vivo desbloqueadas`,
  ];

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Dossie final da Entrega 1"
        title={profile}
        subtitle={`Perfil de ${player.name}. O resultado cruza restauracao, historia, quiz e museu com pesos fixos e leitura de predominancia.`}
        imageSrc="/game-assets/backgrounds/patio.jpg"
        imageAlt="Resultado Integrado"
        chips={[`Score ponderado ${weightedScore}%`, `Perfil ${profile}`, `Progresso geral ${player.progress}%`]}
        fallbackArea="resultadoIntegrado"
        preload
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Pesos oficiais</p>
          <div className="mt-4 space-y-4">
            <StatusBar label="Restauração 35%" value={restorationScore} colorVar="--color-rust" />
            <StatusBar label="Historia 25%" value={historyScore} colorVar="--color-latao" />
            <StatusBar label="Quiz 20%" value={quizScore} colorVar="--color-info" />
            <StatusBar label="Museu 20%" value={museumScore} colorVar="--color-success" />
          </div>
        </article>

        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Leitura da jornada</p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Timeline do seu slice</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
            {timeline.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Predominancia</p>
          <h3 className="mt-2 font-serif text-xl text-[var(--color-ink)]">{profile}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            O perfil nasce da area mais forte da sua campanha combinada ao nivel de maturidade do museu.
          </p>
        </article>

        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Museu e replay</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            Ainda existem alas planejadas e entradas nao vistas. O replay muda o dossie porque destrava outras leituras de memoria.
          </p>
        </article>

        <article className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Entrega 1</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            Este resultado e parcial por desenho: ele ja funciona com o vertical slice atual e cresce sem quebrar a formula quando novos lotes entrarem.
          </p>
        </article>
      </div>
    </section>
  );
}
