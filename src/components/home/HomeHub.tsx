"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Archive, BookOpenText, Factory, ScrollText, Settings2, Target, Trophy } from "lucide-react";

import { hubAssets, modeCovers } from "@/content/assetManifest";
import { museumAreas } from "@/content/museumContent";
import { getCampaignState } from "@/lib/campaign/campaignEngine";
import { PILLAR_COLORS, PILLAR_LABELS, type PillarId } from "@/lib/campaign/campaignTypes";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { GameArtwork } from "../ui/GameArtwork";
import { ModeCard } from "../ui/ModeCard";
import { SectionHero } from "../ui/SectionHero";
import { StatusBar } from "../ui/StatusBar";

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
};

const fadeUpItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};

export function HomeHub() {
  const playerProgress = useGameStore((store) => store.player.progress);
  const unlockedEntries = useGameStore((store) => store.progress.museum.unlockedEntryIds.length);
  const completedAreas = useGameStore((store) =>
    museumAreas.filter((area) => area.status === "available").filter((area) =>
      area.entryIds.every((entryId) => store.progress.museum.viewedEntryIds.includes(entryId)),
    ).length,
  );
  const progress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);
  const campaign = getCampaignState(progress, resources);

  const modeRoutes: Record<string, string> = {
    restauracao2026: "/restauracao-2026",
    historiaInterativa: "/historia-interativa",
    quizTematico: "/quiz-tematico",
    museuVivo: "/museu-vivo",
    resultadoIntegrado: "/resultado-integrado",
    hub: "/",
    config: "/config",
  };

  const cards = [
    {
      href: "/restauracao-2026",
      title: "Restauração 2026",
      description: "Programa operacional contemporaneo em 4 modulos, com etapas e validacao tecnica.",
      icon: Factory,
      imageSrc: hubAssets.cards.restauracao2026,
      fallbackArea: "restauracao2026" as const,
      metrics: ["4 modulos", "2 tarefas por modulo", "Simulacao 2026"],
    },
    {
      href: "/historia-interativa",
      title: "Historia Interativa",
      description: "Vertical slice com 2 partes completas e escolhas ligadas a saude, moral e progresso.",
      icon: ScrollText,
      imageSrc: hubAssets.cards.historiaInterativa,
      fallbackArea: "historiaInterativa" as const,
      metrics: ["2 partes ativas", "8 cenas", "Base historica"],
    },
    {
      href: "/quiz-tematico",
      title: "Quiz Tematico",
      description: "Dois modulos robustos, dificuldade graduada e desbloqueios conectados ao museu.",
      icon: BookOpenText,
      imageSrc: hubAssets.cards.quizTematico,
      fallbackArea: "quizTematico" as const,
      metrics: ["20 perguntas", "2 modulos", "Selos editoriais"],
    },
    {
      href: "/museu-vivo",
      title: "Museu Vivo",
      description: "Mapa inicial com 3 alas operacionais e fichas que ligam jogo, uso historico e memoria atual.",
      icon: Archive,
      imageSrc: hubAssets.cards.museuVivo,
      fallbackArea: "museuVivo" as const,
      metrics: ["3 alas ativas", `${unlockedEntries} entradas`, "Progressao visual"],
    },
  ];

  return (
    <section className="space-y-6">
      {/* Main hero */}
      <SectionHero
        eyebrow="Hub editorial e centro de operacoes da memoria"
        title="Madeira-Mamore: Trilhos da Memoria"
        subtitle="Uma experiencia patrimonial jogavel que liga diplomacia, trabalho, memoria e revitalizacao do complexo da EFMM."
        imageSrc={hubAssets.heroMain}
        imageAlt="Patio ferroviario da Madeira-Mamore"
        chips={[`Progresso ${playerProgress}%`, `${unlockedEntries} entradas no Museu`, `${completedAreas} alas completas`]}
        actions={[
          { href: "/restauracao-2026", label: "Comecar Jornada" },
          { href: "#linha-do-tempo", label: "Explorar a EFMM em 60 segundos", variant: "secondary" },
        ]}
        fallbackArea="hub"
        preload
      />

      {/* Mission Panel */}
      <article className="card-dark p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Target size={14} className="shrink-0 text-[var(--color-cobre)]" />
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-cobre)]">Missão atual</p>
            </div>
            {campaign.currentMission ? (
              <>
                <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">{campaign.currentMission.title}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Recompensa</p>
                    <p className="mt-1 text-sm text-[var(--color-paper)]">{campaign.currentMission.reward}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Impacto</p>
                    <p className="mt-1 text-sm text-[var(--color-paper)]">{campaign.currentMission.impact}</p>
                  </div>
                  <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Próximo desbloqueio</p>
                    <p className="mt-1 text-sm text-[var(--color-paper)]">{campaign.nextUnlock ?? "—"}</p>
                  </div>
                </div>
                <Link
                  href={modeRoutes[campaign.recommendedModule] ?? "/"}
                  className="btn-primary mt-4 inline-flex items-center gap-2"
                >
                  Ir para o módulo recomendado
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
            <p className="mb-3 font-serif text-3xl font-bold text-[var(--color-latao)]">{campaign.overallProgress}%</p>
          </div>
        </div>

        {/* 4 Pillar Bars */}
        <div className="mt-5 grid gap-3 grid-cols-2 lg:grid-cols-4">
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

      {/* EFMM historica / hoje */}
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card-light relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-[0.06]">
            <Image src={hubAssets.efmmHistorica} alt="" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-moss)]">EFMM historica</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">Ferrovia estrategica da borracha</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              1907-1912, 366 km, Porto Velho-Guajara-Mirim. O jogo trata a origem da EFMM como encontro entre
              diplomacia, territorio, engenharia e custo humano.
            </p>
            <EditorialSeal
              contentType="historical_fact"
              sourceRef="construction-1907-1912"
              confidenceNote="Fato historico documentado sobre cronologia e funcao da ferrovia."
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
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">EFMM hoje</p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Complexo revitalizado e ativado</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Museu, visitacao, litorina, agenda cultural e exibicoes da Locomotiva 18 sustentam a camada contemporanea
              do produto e legitimam a simulacao de 2026.
            </p>
            <EditorialSeal
              contentType="contemporary_fact"
              sourceRef="activation-2025-2026"
              confidenceNote="Situacao contemporanea documentada sobre o uso atual do complexo."
              compact
              className="mt-4"
            />
          </div>
        </article>
      </div>

      {/* Mode cards with stagger */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
      >
        {cards.map((card) => (
          <motion.div key={card.href} variants={fadeUpItem}>
            <ModeCard
              href={card.href}
              title={card.title}
              description={card.description}
              icon={card.icon}
              imageSrc={card.imageSrc}
              imageAlt={card.title}
              fallbackArea={card.fallbackArea}
              metrics={card.metrics}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline with rail image */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
        <section id="linha-do-tempo" className="card-dark relative overflow-hidden p-6">
          {/* Rail background */}
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
                  className="rounded-2xl border border-[color:rgba(233,223,201,0.12)] bg-[color:rgba(12,15,14,0.26)] p-4 hover-lift-game"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">{item.year}</p>
                  <h3 className="mt-2 font-serif text-lg text-[var(--color-paper)]">{item.title}</h3>
                  <EditorialSeal
                    contentType={item.type}
                    sourceRef={item.sourceRef}
                    confidenceNote={item.type === "historical_fact" ? "Fato historico documentado." : "Situacao contemporanea documentada."}
                    compact
                    className="mt-3"
                  />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <aside className="space-y-4">
          <article className="card-light p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Hoje no complexo</p>
                <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">Status do ecossistema cultural</h2>
              </div>
              <Settings2 className="text-[var(--color-rio)]" size={20} />
            </div>
            <div className="mt-4 space-y-3">
              {currentComplex.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[color:rgba(183,106,60,0.18)] bg-[color:rgba(31,35,32,0.04)] p-4">
                  <h3 className="font-serif text-lg text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{item.body}</p>
                  <EditorialSeal
                    contentType="contemporary_fact"
                    sourceRef={item.sourceRef}
                    confidenceNote="Situacao contemporanea documentada."
                    compact
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </article>

          <article className="card-dark p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Colecao desbloqueada</p>
            <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">Museu Vivo em progresso</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Cada modulo jogado desbloqueia entradas que respondem a quatro perguntas: o que e, como era usado, onde
              aparece no jogo e por que isso importa hoje.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="image-badge image-badge-gold">{unlockedEntries} entradas liberadas</span>
              <span className="image-badge">{completedAreas} alas completas</span>
            </div>
          </article>
        </aside>
      </div>

      {/* Footer cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <ModeCard
          href="/resultado-integrado"
          title="Resultado Integrado"
          description="Dossie parcial da campanha com formula por peso e leitura do seu perfil final."
          icon={Trophy}
          imageSrc={modeCovers.resultadoIntegrado}
          imageAlt="Resultado integrado"
          fallbackArea="resultadoIntegrado"
          metrics={["Restauração 35%", "Historia 25%", "Museu + Quiz 40%"]}
        />
        <ModeCard
          href="/config"
          title="Config"
          description="Acessibilidade, conforto visual e ajustes de leitura para manter o tom do patrimonio legivel."
          icon={Settings2}
          imageSrc={hubAssets.heroMain}
          imageAlt="Configuracoes"
          fallbackArea="hub"
          metrics={["Fonte", "Contraste", "Reducao de movimento"]}
        />
      </div>
    </section>
  );
}
