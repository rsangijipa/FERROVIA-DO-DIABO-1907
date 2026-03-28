"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Archive, BookOpenText, Factory, ScrollText, Settings2, Trophy } from "lucide-react";

import { hubAssets, modeCovers } from "@/content/assetManifest";
import { museumAreas } from "@/content/museumContent";
import { getCampaignState } from "@/lib/campaign/campaignEngine";
import { modeRoutes } from "@/lib/constants";
import { type PillarId } from "@/lib/campaign/campaignTypes";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { ModeCard } from "../ui/ModeCard";
import { SectionHero } from "../ui/SectionHero";
import { AudioLogs } from "../ui/AudioLogs";
import { TemporalMap } from "../ui/TemporalMap";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { useSFX } from "@/hooks/useSFX";
import { AlertTriangle, Activity, ShieldAlert } from "lucide-react";
import { buildDynamicObjective } from "@/lib/campaign/incidentEngine";

const timeline = [
  { year: "1903", title: "Tratado de Petrópolis", type: "historical_fact" as const, sourceRef: "treaty-1903" },
  { year: "1907", title: "Início das obras e Farquhar", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "1910", title: "Intervenção de Oswaldo Cruz", type: "historical_fact" as const, sourceRef: "candelaria" },
  { year: "1912", title: "Inauguração e 366 km", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "1913", title: "Colapso do Ciclo da Borracha", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "1943", title: "Soldados da Borracha", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "1972", title: "Desativação e último trem", type: "historical_fact" as const, sourceRef: "construction-1907-1912" },
  { year: "2006", title: "Tombamento pelo Iphan", type: "historical_fact" as const, sourceRef: "iphan-2008" },
  { year: "2024-26", title: "Reabertura PPP (Amazon Fort)", type: "contemporary_fact" as const, sourceRef: "reopening-2024" },
];

const currentComplex = [
  {
    title: "Parceria Público-Privada",
    body: "A Amazon Fort assumiu a infraestrutura e turismo na reabertura de 2024, em gestão compartilhada do museu.",
    sourceRef: "reopening-2024",
  },
  {
    title: "Locomotivas 18 e 50",
    body: "Enquanto a 18 circula no pátio central da capital, a Locomotiva 50 inicia sua restauração integral em SC.",
    sourceRef: "activation-2025-2026",
  },
  {
    title: "Museu de Guajará-Mirim",
    body: "No km 366 (ponta da linha), a Jirau Energia atua para revitalizar a estação original até o final de 2026.",
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
  const director = useGameStore((store) => store.progress.director);
  const dynamicMission = director ? buildDynamicObjective(director, progress, resources) : null;

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
    <section className="space-y-4">
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

      {/* Unified Campaign Dashboard */}
      <article className="play-gradient rounded-2xl p-6 md:p-8 shadow-2xl border border-[color:rgba(212,163,103,0.3)]">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[var(--color-latao)] animate-pulse" />
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-paper)] font-bold">Comando de Campanha 2026</p>
            </div>
            
            {!tutorial.completed ? (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-paper)]">Missão Guiada: {tutorialProgress}%</h2>
                <p className="text-base leading-relaxed text-[var(--color-paper)]/80 max-w-2xl">
                  {nextTutorialStep.label}. Complete os 4 pilares da revitalização para liberar o museu completo.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href={nextTutorialStep.href} onClick={() => { playClick(); startTutorial(); }} className="btn-primary px-8 py-3 text-lg font-serif">
                    {tutorial.started ? "Continuar missão" : "Iniciar revitalização"}
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 border border-white/10">
                    <span className="text-sm text-[var(--color-paper)]/60">Passo atual:</span>
                    <span className="text-sm font-bold text-[var(--color-latao)]">{tutorial.activeStep}</span>
                  </div>
                </div>
              </div>
            ) : campaign.currentMission ? (
              <div className="space-y-4">
                {dynamicMission ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-[var(--color-rust)]" size={24} />
                      <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-paper)]">{dynamicMission.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] uppercase text-[var(--color-rust)] mb-1 font-bold">Risco Tático</p>
                        <p className="text-sm text-[var(--color-paper)]/80">{dynamicMission.primaryRisk}</p>
                        <p className="text-xs text-[var(--color-paper)]/50 mt-2">Falha: {dynamicMission.consequenceIfIgnored}</p>
                      </div>
                      <div className="bg-[var(--color-latao)]/10 p-4 rounded-xl border border-[var(--color-latao)]/20">
                        <p className="text-[10px] uppercase text-[var(--color-latao)] mb-1 font-bold">Ação Recomendada</p>
                        <p className="text-sm text-[var(--color-paper)]/90">{dynamicMission.recommendedAction}</p>
                      </div>
                    </div>
                    <Link
                      href={modeRoutes.find((m) => m.id === dynamicMission.targetModuleId)?.href ?? "/"}
                      onClick={() => playClick()}
                      className="btn-primary mt-4 px-8 py-3 text-lg font-serif inline-block"
                    >
                      Executar ação
                    </Link>
                  </>
                ) : (
                  <p className="text-[var(--color-paper)]/60 italic">Carregando diretrizes de comando...</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-success)]">Revitalização Concluída</h2>
                <p className="text-base leading-relaxed text-[var(--color-paper)]/80">
                  O complexo da EFMM está totalmente restaurado. Explore as alas do museu para ver o resultado final.
                </p>
              </div>
            )}
          </div>

          <div className="lg:w-80 flex flex-col justify-center gap-6 p-6 rounded-2xl bg-black/30 border border-white/5 backdrop-blur-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-latao)] mb-2">Progresso Geral</p>
              <div className="flex items-end gap-2">
                <span className="font-serif text-5xl font-bold text-[var(--color-latao)]"><AnimatedNumber value={campaign.overallProgress} />%</span>
                <span className="text-xs text-[var(--color-paper)]/60 mb-2">Concluído</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-latao)]">Radares Estratégicos</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--color-paper)]/60">
                    <span>Opinião Púb.</span>
                    <span>{director?.publicOpinion ?? 0}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${director?.publicOpinion ?? 0}%` }} className="h-full bg-[var(--color-info)]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--color-paper)]/60">
                    <span>Confiança</span>
                    <span>{director?.institutionalTrust ?? 0}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${director?.institutionalTrust ?? 0}%` }} className="h-full bg-[var(--color-success)]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--color-paper)]/60">
                    <span className="text-[var(--color-rust)] font-bold flex items-center gap-1"><ShieldAlert size={10} /> Fadiga</span>
                    <span>{director?.operationalFatigue ?? 0}%</span>
                  </div>
                  <div className="h-1 w-full bg-[var(--color-rust)]/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${director?.operationalFatigue ?? 0}%` }} className="h-full bg-[var(--color-rust)]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[var(--color-paper)]/60">
                    <span className="text-[var(--color-danger)] font-bold flex items-center gap-1"><Activity size={10} /> R. Sanitário</span>
                    <span>{director?.sanitaryRisk ?? 0}%</span>
                  </div>
                  <div className="h-1 w-full bg-[var(--color-danger)]/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${director?.sanitaryRisk ?? 0}%` }} className="h-full bg-[var(--color-danger)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Zona 3: Trilha de Campanha */}
      <div className="bg-black/30 border border-[color:rgba(212,163,103,0.1)] rounded-2xl p-6 overflow-hidden relative">
        <div className="absolute inset-0 blueprint-bg opacity-30" />
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-latao)] mb-6 relative z-10">Desdobramento Mestre</p>
        <div className="relative z-10 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          {[
            { label: "Canteiro Base", status: campaign.pillarScores.tecnico > 10 ? "done" : "current" },
            { label: "Trilhos 2026", status: campaign.pillarScores.tecnico > 50 ? "done" : campaign.pillarScores.tecnico > 10 ? "current" : "locked" },
            { label: "Acervo Resgatado", status: campaign.pillarScores.acervo > 30 ? "done" : "locked" },
            { label: "História Reaberta", status: progress.history.completedChapterIds.length > 0 ? "done" : "locked" },
            { label: "Comitê do Quiz", status: progress.quiz["modulo-1"]?.correct > 0 ? "done" : "locked" },
            { label: "Museu Curado", status: progress.museum.unlockedEntryIds.length > 3 ? "done" : "locked" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center gap-2 flex-1 min-w-max">
              <div className={`flex flex-col items-center gap-2 ${node.status === "locked" ? "opacity-40" : ""}`}>
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  node.status === 'done' ? 'bg-[var(--color-latao)] border-[var(--color-latao)] text-black' :
                  node.status === 'current' ? 'bg-[var(--color-rust)]/20 border-[var(--color-rust)] text-[var(--color-rust)] interactive-glow' :
                  'bg-black/50 border-white/10 text-white/20'
                }`}>
                  <span className="text-xs font-bold">{node.status === 'done' ? '✓' : i + 1}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider text-center max-w-[80px] ${node.status === 'current' ? 'text-[var(--color-rust)] font-bold' : 'text-white/60'}`}>
                  {node.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="flex-1 h-[2px] w-8 lg:w-full bg-white/10 relative overflow-hidden">
                  {node.status === 'done' && <motion.div className="absolute inset-0 bg-[var(--color-latao)]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: 'left' }} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Module Cards Grid */}
        <motion.div
          className="grid gap-4 md:grid-cols-2"
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
                compact
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Zona 4: Acontecimentos Recentes */}
        <div className="card-dark p-6 flex flex-col h-full max-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="text-[var(--color-latao)]" size={16} />
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-latao)]">Despachos Recentes</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 font-mono text-xs">
            {director?.incidentHistory && director.incidentHistory.length > 0 ? (
              [...director.incidentHistory].reverse().map((log, i) => (
                <div key={i} className="p-3 bg-black/40 border-l border-l-[var(--color-rust)] rounded-r-lg text-[var(--color-paper)]/80 leading-relaxed shadow-inner">
                  {log}
                </div>
              ))
            ) : (
              <div className="p-3 bg-black/20 border border-[var(--color-latao)]/20 border-dashed rounded-lg text-[var(--color-paper)]/50 italic text-center">
                Sem ocorrências graves na campanha até o momento. Operações normais.
              </div>
            )}
            {progress.museum.unlockedEntryIds.length > 0 && (
              <div className="p-3 bg-[var(--color-moss)]/20 border-l border-l-[var(--color-success)] rounded-r-lg text-[var(--color-paper)]/80 leading-relaxed">
                [SISTEMA]: Catálogo patrimonial reativado. {progress.museum.unlockedEntryIds.length} peça(s) catalogada(s).
              </div>
            )}
            <div className="p-3 bg-[var(--color-info)]/10 border-l border-l-[var(--color-info)] rounded-r-lg text-[var(--color-paper)]/80 leading-relaxed">
              [SISTEMA]: Comando de Campanha inicializado.
            </div>
          </div>
        </div>
      </div>

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
          compact
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
          compact
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
