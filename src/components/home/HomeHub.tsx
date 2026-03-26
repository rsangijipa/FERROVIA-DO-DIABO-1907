"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Archive, BookOpenText, CheckCircle2, Circle, Factory, ScrollText, Settings2, Target, Trophy } from "lucide-react";

import { hubAssets, modeCovers } from "@/content/assetManifest";
import { museumAreas } from "@/content/museumContent";
import { getCampaignState } from "@/lib/campaign/campaignEngine";
import { modeRoutes } from "@/lib/constants";
import { PILLAR_COLORS, PILLAR_LABELS, type PillarId } from "@/lib/campaign/campaignTypes";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { ModeCard } from "../ui/ModeCard";
import { SectionHero } from "../ui/SectionHero";
import { StatusBar } from "../ui/StatusBar";
import { AudioLogs } from "../ui/AudioLogs";
import { TemporalMap } from "../ui/TemporalMap";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { useSFX } from "@/hooks/useSFX";
import { CuratorJournal } from "./CuratorJournal";
import { Book } from "lucide-react";

const timeline = [
  { year: "1903", title: "Tratado de Petropolis", type: "historical_fact" as const, sourceRef: "treaty-1903" },
  { year: "1907", title: "Inicio das obras", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "1912", title: "Inauguracao da ferrovia", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "2008", title: "Tombamento pelo Iphan", type: "historical_fact" as const, sourceRef: "iphan-2008" },
  { year: "2024", title: "Reabertura do complexo", type: "contemporary_fact" as const, sourceRef: "reopening-2024" },
  { year: "2025-26", title: "Ativacao cultural e turistica", type: "contemporary_fact" as const, sourceRef: "activation-2025-2026" },
];

const currentComplex = [
  {
    title: "Museu e visitacao",
    body: "O complexo reaberto em 2024 sustenta o eixo de patrimonio vivo com visita guiada e leitura publica.",
    sourceRef: "reopening-2024",
  },
  {
    title: "Litorina e exibicoes",
    body: "A agenda contemporanea legitima o modulo de material rodante e a camada de simulacao 2026.",
    sourceRef: "activation-2025-2026",
  },
  {
    title: "Programacao cultural",
    body: "Eventos como noites no museu ajudam o hub a falar de memoria e operacao no mesmo produto.",
    sourceRef: "activation-2025-2026",
  },
];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
} as const;

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
} as const;

const tutorialStepMeta = {
  restoration: {
    label: "Tomar 1 decisão em Restauração",
    href: "/restauracao-2026",
  },
  history: {
    label: "Avançar 1 cena da História",
    href: "/historia-interativa",
  },
  quiz: {
    label: "Responder 1 pergunta do Quiz",
    href: "/quiz-tematico",
  },
  museum: {
    label: "Abrir 1 entrada do Museu",
    href: "/museu-vivo",
  },
} as const;

export function HomeHub() {
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const playerProgress = useGameStore((store) => store.player.progress);
  const unlockedEntries = useGameStore((store) => store.progress.museum.unlockedEntryIds.length);
  const completedAreas = useGameStore((store) =>
    museumAreas.filter((area) => area.status === "available").filter((area) =>
      area.entryIds.every((entryId) => store.progress.museum.viewedEntryIds.includes(entryId)),
    ).length,
  );
  const progress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);
  const tutorial = useGameStore((store) => store.tutorial);
  const startTutorial = useGameStore((store) => store.startTutorial);
  const campaign = getCampaignState(progress, resources);
  const nextTutorialStep = tutorialStepMeta[tutorial.activeStep];
  const tutorialProgress = Math.round((tutorial.completedSteps.length / 4) * 100);
  const { playClick } = useSFX();

  const cards = [
    {
      href: "/restauracao-2026",
      title: "Restauração 2026",
      description: "Tome decisões técnicas e avance o trecho-piloto da campanha.",
      icon: Factory,
      imageSrc: hubAssets.cards.restauracao2026,
      fallbackArea: "restauracao2026" as const,
      metrics: ["4 módulos ativos"],
    },
    {
      href: "/historia-interativa",
      title: "História Interativa",
      description: "Leia a cena atual e escolha o próximo passo da jornada.",
      icon: ScrollText,
      imageSrc: hubAssets.cards.historiaInterativa,
      fallbackArea: "historiaInterativa" as const,
      metrics: ["2 partes disponíveis"],
    },
    {
      href: "/quiz-tematico",
      title: "Quiz Tematico",
      description: "Responda perguntas curtas e desbloqueie novas alas do museu.",
      icon: BookOpenText,
      imageSrc: hubAssets.cards.quizTematico,
      fallbackArea: "quizTematico" as const,
      metrics: ["20 perguntas"],
    },
    {
      href: "/museu-vivo",
      title: "Museu Vivo",
      description: "Abra entradas já liberadas e veja o payoff da campanha.",
      icon: Archive,
      imageSrc: hubAssets.cards.museuVivo,
      fallbackArea: "museuVivo" as const,
      metrics: [`${unlockedEntries} entradas abertas`],
    },
  ];

  return (
    <section className="space-y-6">
      <SectionHero
        eyebrow="Painel de Controle — Piloto 2026"
        title="Ferrovia do Diabo — 1907"
        subtitle="O Complexo da Estrada de Ferro Madeira-Mamore foi reaberto. Explore o museu, recupere o patrimonio material e reviva a historia interativa da maior obra de engenharia da selva."
        imageSrc={hubAssets.heroBlueprint}
        imageAlt="Blueprint do complexo"
        actions={
          tutorial.completed
            ? [{ href: "/restauracao-2026", label: "Continuar campanha" }]
            : [{ href: nextTutorialStep.href, label: tutorial.started ? "Continuar missão guiada" : "Começar missão guiada" }]
        }
        fallbackArea="hub"
        compact
      />

      {!tutorial.completed ? (
        <article className="card-dark p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Jogue agora</p>
              <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Missão guiada em 4 passos</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                Siga a trilha principal sem precisar ler tudo antes: decida, avance, responda e veja o payoff no museu.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="image-badge image-badge-gold">{tutorialProgress}% da missão inicial</span>
                <span className="image-badge">Próximo passo: {nextTutorialStep.label}</span>
              </div>
            </div>
            <Link href={nextTutorialStep.href} onClick={() => { playClick(); startTutorial(); }} className="btn-primary w-full sm:w-auto text-center shrink-0 transition-transform active:scale-95">
              {tutorial.started ? "Continuar missão guiada" : "Começar missão guiada"}
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(["restoration", "history", "quiz", "museum"] as const).map((stepId) => {
              const completed = tutorial.completedSteps.includes(stepId);
              const step = tutorialStepMeta[stepId];
              const Icon = completed ? CheckCircle2 : Circle;
              return (
                <div
                  key={stepId}
                  className={`rounded-2xl border p-4 transition-all duration-300 ${
                    completed
                      ? "border-[color:rgba(94,138,97,0.32)] bg-[color:rgba(94,138,97,0.1)]"
                      : tutorial.activeStep === stepId
                        ? "border-[color:rgba(212,163,103,0.4)] bg-[color:rgba(12,15,14,0.48)] shadow-[0_0_15px_rgba(212,163,103,0.05)]"
                        : "border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.24)] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={completed ? "text-[var(--color-success)]" : "text-[var(--color-latao)]"} />
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-muted)]">Passo</p>
                  </div>
                  <h3 className={`mt-2 font-serif text-lg ${completed ? "text-[var(--color-paper)]/60" : "text-[var(--color-paper)]"}`}>{step.label}</h3>
                </div>
              );
            })}
          </div>
        </article>
      ) : null}

      <article className="card-dark p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Target size={14} className="shrink-0 text-[var(--color-cobre)]" />
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-cobre)]">Próxima jogada</p>
            </div>
            {campaign.currentMission ? (
              <>
                <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">{campaign.currentMission.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {campaign.currentMission.impact}. Recompensa: {campaign.currentMission.reward}.
                </p>
                <Link
                  href={modeRoutes.find((m) => m.id === campaign.recommendedModule)?.href ?? "/"}
                  onClick={() => playClick()}
                  className="btn-primary mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2"
                >
                  Jogar etapa recomendada
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-2 font-serif text-2xl text-[var(--color-success)]">Campanha concluída</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Todos os objetivos da revitalização foram alcançados.</p>
              </>
            )}
          </div>

          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Revitalização da EFMM</p>
            <p className="mb-3 font-serif text-3xl font-bold text-[var(--color-latao)]">
              <AnimatedNumber value={campaign.overallProgress} />%
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(["tecnico", "historico", "conhecimento", "acervo"] as PillarId[]).map((pillar) => (
            <StatusBar
              key={pillar}
              label={PILLAR_LABELS[pillar]}
              value={Math.round(campaign.pillarScores[pillar])}
              colorVar={PILLAR_COLORS[pillar]}
            />
          ))}
        </div>
      </article>

      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
      >
        {cards.map((card) => (
          <motion.div key={card.href} variants={fadeUpItem} className="min-w-0">
            <ModeCard
              href={card.href}
              title={card.title}
              description={card.description}
              icon={card.icon}
              imageSrc={card.imageSrc}
              imageAlt={card.title}
              fallbackArea={card.fallbackArea}
              metrics={card.metrics}
              actionLabel="Entrar"
              priority={card.href.includes("restauracao") || card.href.includes("historia")}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <AudioLogs />
        <TemporalMap />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ModeCard
          href="/resultado-integrado"
          title="Resultado Integrado"
          description="Veja seu perfil atual e descubra onde vale continuar jogando."
          icon={Trophy}
          imageSrc={modeCovers.resultadoIntegrado}
          imageAlt="Resultado integrado"
          fallbackArea="resultadoIntegrado"
          metrics={["Perfil da campanha"]}
          actionLabel="Ver resultado"
        />
        <ModeCard
          href="/config"
          title="Config"
          description="Ajuste fonte, contraste e movimento para jogar com mais conforto."
          icon={Settings2}
          imageSrc={hubAssets.heroMain}
          imageAlt="Configuracoes"
          fallbackArea="hub"
          metrics={["Acessibilidade"]}
          actionLabel="Ajustar"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card-dark relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-[0.06]">
            <Image src={hubAssets.efmmHistorica} alt="" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-latao)]">Contexto histórico</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Ferrovia estratégica da borracha</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              1907-1912, 366 km, Porto Velho-Guajara-Mirim. O jogo cruza diplomacia, território, engenharia e custo humano.
            </p>
            <EditorialSeal
              contentType="historical_fact"
              sourceRef="construction-1907-1912"
              confidenceNote="Fato histórico documentado sobre cronologia e função da ferrovia."
              compact
              className="mt-4"
            />
          </div>
        </article>

        <article className="card-dark relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-[0.08]">
            <Image src={hubAssets.efmmHoje} alt="" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Contexto atual</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Complexo revitalizado e ativo</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Museu, visitação, litorina e agenda cultural sustentam a camada contemporânea da campanha.
            </p>
            <EditorialSeal
              contentType="contemporary_fact"
              sourceRef="activation-2025-2026"
              confidenceNote="Situação contemporânea documentada sobre o uso atual do complexo."
              compact
              className="mt-4"
            />
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)] items-stretch">
        <section id="linha-do-tempo" className="card-dark relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-[0.04]">
            <Image src={hubAssets.timeline.rail} alt="" fill className="object-cover" sizes="65vw" />
          </div>

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Linha do tempo curta</p>
            <motion.div
              className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.1 }}
            >
              {timeline.map((item) => (
                <motion.article
                  key={item.year + item.title}
                  variants={fadeUpItem}
                  className="rounded-2xl border border-[color:rgba(233,223,201,0.12)] bg-[color:rgba(12,15,14,0.26)] p-4 hover-lift-game flex flex-col h-full"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">{item.year}</p>
                  <h3 className="mt-2 font-serif text-lg text-[var(--color-paper)]">{item.title}</h3>
                  <EditorialSeal
                    contentType={item.type}
                    sourceRef={item.sourceRef}
                    confidenceNote={item.type === "historical_fact" ? "Fato histórico documentado." : "Situação contemporânea documentada."}
                    compact
                    className="mt-3"
                  />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <article className="card-dark p-5 h-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Hoje no complexo</p>
                <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">Status do ecossistema cultural</h2>
              </div>
              <Settings2 className="text-[var(--color-latao)] opacity-60" size={20} />
            </div>
            <div className="mt-4 space-y-3">
              {currentComplex.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.22)] p-4">
                  <h3 className="font-serif text-lg text-[var(--color-paper)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.body}</p>
                  <EditorialSeal
                    contentType="contemporary_fact"
                    sourceRef={item.sourceRef}
                    confidenceNote="Situação contemporânea documentada."
                    compact
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </article>

          <article className="card-dark p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Museu em progresso</p>
            <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">Payoff desbloqueado</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Cada módulo jogado libera entradas que explicam o que era, como era usado e por que ainda importa hoje.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="image-badge image-badge-gold">{unlockedEntries} entradas liberadas</span>
              <span className="image-badge">{completedAreas} alas completas</span>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
