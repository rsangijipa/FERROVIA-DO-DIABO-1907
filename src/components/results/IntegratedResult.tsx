"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { getProfileImage, resultAssets } from "@/content/assetManifest";
import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules } from "@/content/restorationModules";
import { getCampaignReading, getCampaignState, getPillarScores } from "@/lib/campaign/campaignEngine";
import { PILLAR_LABELS, type PillarId } from "@/lib/campaign/campaignTypes";
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
import { AnimatedNumber } from "../ui/AnimatedNumber";

export function IntegratedResult() {
  const progress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);
  const player = useGameStore((store) => store.player);
  const playerProgress = player.progress;

  const pillarScores = getPillarScores(progress, resources);
  const campaign = getCampaignState(progress, resources);
  const campaignReading = getCampaignReading(pillarScores, campaign.overallProgress);

  const pillarEntries: [PillarId, number][] = [
    ["tecnico", pillarScores.tecnico],
    ["historico", pillarScores.historico],
    ["conhecimento", pillarScores.conhecimento],
    ["acervo", pillarScores.acervo],
  ];
  const weakestPillar = pillarEntries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];

  const profile = resolveProfile(
    pillarScores.tecnico,
    pillarScores.historico,
    pillarScores.conhecimento,
    pillarScores.acervo,
  );

  const whatUnlockedMost = progress.museum.unlockedEntryIds.length > 0
    ? campaign.dominantPillar === "tecnico" ? "Restauração 2026"
    : campaign.dominantPillar === "historico" ? "História Interativa"
    : campaign.dominantPillar === "conhecimento" ? "Quiz Temático"
    : "Museu Vivo"
    : "nenhum módulo ainda";

  const availableQuizModules = quizModules.filter((module) => module.status === "available");
  const totalQuizQuestions = availableQuizModules.reduce((acc: number, module) => acc + (quizQuestionsByModuleId[module.id]?.length ?? 0), 0);
  const availableMuseumEntries = museumAreas.filter((area) => area.status === "available").reduce((acc: number, area) => acc + area.entryIds.length, 0);

  const timeline = [
    `${restorationModules.filter((m) => progress.restoration[m.id].stage === "released").length}/4 módulos de restauração liberados`,
    `${progress.history.completedChapterIds.length}/2 partes históricas concluídas`,
    `${availableQuizModules.reduce((acc: number, m) => acc + progress.quiz[m.id].correct, 0)} acertos no quiz temático`,
    `${progress.museum.unlockedEntryIds.length}/${availableMuseumEntries} entradas do Museu Vivo desbloqueadas`,
  ];

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Dossie final da Entrega 1"
        title={profile}
        subtitle={`Perfil de ${player.name}. O resultado cruza restauracao, historia, quiz e museu com pesos fixos e leitura de predominancia.`}
        imageSrc={resultAssets.hero}
        imageAlt="Resultado Integrado"
        chips={[`Score ponderado ${campaign.overallProgress}%`, `Perfil ${profile}`, `Progresso geral ${playerProgress}%`]}
        fallbackArea="resultadoIntegrado"
        preload
      />

      {/* Campaign reading */}
      <article className="card-dark p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Leitura da campanha</p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]">{campaignReading}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Pilar dominante</p>
            <p className="mt-1 text-sm text-[var(--color-paper)]">{PILLAR_LABELS[campaign.dominantPillar]}</p>
          </div>
          <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Pilar mais fraco</p>
            <p className="mt-1 text-sm text-[var(--color-paper)]">{PILLAR_LABELS[weakestPillar]}</p>
          </div>
          <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Mais desbloqueou</p>
            <p className="mt-1 text-sm text-[var(--color-paper)]">{whatUnlockedMost}</p>
          </div>
        </div>
      </article>

      {/* Reputation Reflection */}
      <article className="card-dark p-5 md:p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={80} strokeWidth={1} />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Reflexo da Reputação</p>
          <h2 className="mt-2 font-serif text-xl md:text-2xl text-[var(--color-paper)]">Como o mundo vê sua curadoria</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] max-w-2xl">
            Suas escolhas na história e na manutenção técnica moldam sua imagem perante a posteridade e a comunidade local.
          </p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(progress.reputation).map(([key, val]) => (
              <div key={key} className="rounded-2xl border border-[color:rgba(212,163,103,0.12)] bg-[color:rgba(12,15,14,0.3)] p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">{PILLAR_LABELS[key as PillarId]}</p>
                <p className="mt-2 font-serif text-2xl text-[var(--color-paper)]">{Math.round(val)} <span className="text-xs font-sans text-[var(--color-latao)]">PTS</span></p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[color:rgba(94,138,97,0.2)] bg-[color:rgba(94,138,97,0.06)] p-4">
            <p className="text-xs italic text-[var(--color-paper)] opacity-80">
              {Object.entries(progress.reputation).reduce((a, b) => (b[1] > a[1] ? b : a))[1] > 0
                ? `Seu destaque no pilar ${PILLAR_LABELS[Object.entries(progress.reputation).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as PillarId]} indica uma abordagem focada em ${
                   Object.entries(progress.reputation).reduce((a, b) => (b[1] > a[1] ? b : a))[0] === "tecnico" ? "eficiência e pragmatismo"
                   : Object.entries(progress.reputation).reduce((a, b) => (b[1] > a[1] ? b : a))[0] === "historico" ? "humanidade e justiça"
                   : "educação e preservação"
                  }.`
                : "Sua reputação ainda está sendo construída através de suas decisões no campo."}
            </p>
          </div>
        </div>
      </article>

      {/* Profile card with image and animated score */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1fr)]">
        <motion.article
          className="card-dark relative overflow-hidden p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl border-2 border-[color:rgba(212,163,103,0.3)] glow-badge">
            <Image
              src={getProfileImage(profile)}
              alt={profile}
              fill
              className="object-cover"
              sizes="160px"
              priority
              onError={() => {}}
            />
          </div>
          <div className="mt-5 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Perfil da campanha</p>
            <h2 className="mt-2 font-serif text-xl md:text-2xl text-[var(--color-paper)]">{profile}</h2>
            <p className="mt-4 font-serif text-5xl font-bold text-[var(--color-latao)]">
              <AnimatedNumber value={campaign.overallProgress} />%
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Score ponderado</p>
          </div>
        </motion.article>

        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Pesos oficiais</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {pillarEntries.map(([pillar, score]) => (
              <StatusBar
                key={pillar}
                label={`${PILLAR_LABELS[pillar]} (${Math.round(score)}%)`}
                value={Math.round(score)}
                colorVar={
                  pillar === campaign.dominantPillar
                    ? "--color-success"
                    : pillar === weakestPillar
                      ? "--color-warning"
                      : "--color-latao"
                }
              />
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Leitura da jornada</p>
          <h2 className="mt-2 font-serif text-xl md:text-2xl text-[var(--color-paper)]">Timeline do seu slice</h2>
          <ul className="mt-4 space-y-3">
            {timeline.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-start gap-3 text-sm leading-7 text-[var(--color-muted)]"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.3, ease: "easeOut" }}
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-latao)]" />
                {item}
              </motion.li>
            ))}
          </ul>
        </article>

        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Predominância</p>
          <h3 className="mt-2 font-serif text-xl text-[var(--color-paper)]">{profile}</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            O perfil nasce da area mais forte da sua campanha combinada ao nivel de maturidade do museu.
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Museu e replay</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Ainda existem alas planejadas e entradas nao vistas. O replay muda o dossie porque destrava outras leituras de memoria.
          </p>
        </article>

        <article className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Entrega 1</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Este resultado e parcial por desenho: ele ja funciona com o vertical slice atual e cresce sem quebrar a formula quando novos lotes entrarem.
          </p>
        </article>
      </div>
    </section>
  );
}
