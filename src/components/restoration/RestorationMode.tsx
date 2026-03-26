"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Lock, Wrench } from "lucide-react";

import { getRestorationModuleImage, restorationAssets } from "@/content/assetManifest";
import { restorationModules, restorationTasks } from "@/content/restorationModules";
import { historyChapters } from "@/content/historyContent";
import { quizModules } from "@/content/quizContent";
import { museumAreas } from "@/content/museumContent";
import { getRewardsForModule } from "@/lib/campaign/campaignEngine";
import { getPillarScores } from "@/lib/campaign/campaignEngine";
import { useGameStore } from "@/store/useGameStore";
import type { RestorationStage } from "@/types/game";

import { EditorialSeal } from "../ui/EditorialSeal";
import { FeedbackStamp } from "../ui/FeedbackStamp";
import { GameModuleHeader } from "../ui/GameModuleHeader";
import { ArtifactBench } from "../ui/ArtifactBench";
import { BlueprintLine } from "../ui/BlueprintLine";
import { ResourcePanel } from "../ui/ResourcePanel";
import { SectionHero } from "../ui/SectionHero";
import { StagePipeline } from "../ui/StagePipeline";
import { StatusBar } from "../ui/StatusBar";
import { useSFX } from "@/hooks/useSFX";

const stageLabel: Record<RestorationStage, string> = {
  locked: "Locked",
  diagnosis: "Diagnostico",
  prioritization: "Priorizacao",
  contracting: "Contratacao",
  restoration: "Restauro",
  validation: "Validacao",
  released: "Liberado",
};

const stageCopy: Partial<Record<RestorationStage, string>> = {
  diagnosis: "Levante evidencias do trecho e transforme observacao tecnica em base confiavel para as escolhas seguintes.",
  prioritization: "Transforme o diagnostico em escopo, marcos e lote prioritario da Entrega 1.",
  contracting: "Amarre equipe, compra e responsabilidade antes da obra entrar em campo.",
  restoration: "Execute a frente principal equilibrando prazo, leitura patrimonial e seguranca operacional.",
  validation: "Confira o fechamento tecnico e a leitura patrimonial antes da liberacao ao publico.",
};

const resourceLabel: Record<string, string> = {
  orcamento: "Orcamento",
  moral: "Moral",
  saudeSanitaria: "Saude",
  progressoTecnico: "Progresso",
  preservacao: "Preservacao",
};

const crossfade = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.14 } },
} as const;

export function RestorationMode() {
  const resources = useGameStore((store) => store.restorationResources);
  const { playClick, playTick, playIndustrial, playFailure, playSuccess } = useSFX();
  const progress = useGameStore((store) => store.progress.restoration);
  const fullProgress = useGameStore((store) => store.progress);
  const resolveRestorationTaskChoice = useGameStore((state) => state.resolveRestorationTaskChoice);
  const discoverArtifact = useGameStore((state) => state.discoverArtifact);
  const restorationFeedback = useGameStore((state) => state.restorationFeedback);
  const dismissRestorationFeedback = useGameStore((state) => state.dismissRestorationFeedback);

  const [discoveredArtifactId, setDiscoveredArtifactId] = useState<string | null>(null);
  const [activeCrisis, setActiveCrisis] = useState<{ title: string; body: string; choiceA: string; choiceB: string } | null>(null);

  const firstPlayableModule = restorationModules.find((module) => progress[module.id].stage !== "locked")?.id ?? restorationModules[0].id;
  const [selectedModuleId, setSelectedModuleId] = useState(firstPlayableModule);
  const safeSelectedModuleId = progress[selectedModuleId]?.stage === "locked" ? firstPlayableModule : selectedModuleId;
  const selectedModule = restorationModules.find((module) => module.id === safeSelectedModuleId) ?? restorationModules[0];
  const selectedProgress = progress[selectedModule.id];
  const activeTask = restorationTasks.find(
    (task) =>
      task.moduleId === selectedModule.id &&
      task.stage === selectedProgress.stage &&
      !selectedProgress.completedTaskIds.includes(task.id),
  );
  const releasedModules = restorationModules.filter((module) => progress[module.id].stage === "released").length;
  const isCritical = resources.orcamento <= 25 || resources.saudeSanitaria <= 25;

  const moduleReward = getRewardsForModule(selectedModule.id);
  const pillarScores = getPillarScores(fullProgress, resources);

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Programa operacional contemporaneo"
        title="Restauração 2026"
        subtitle="Quatro modulos, uma maquina de estado unica e um vertical slice que assume a revitalizacao como simulacao plausivel sobre base documentada."
        imageSrc={restorationAssets.hero}
        imageAlt="Restauração 2026"
        chips={[`${releasedModules}/4 modulos liberados`, "5 etapas decisorias por modulo", `Estado ${stageLabel[selectedProgress.stage]}`]}
        fallbackArea="restauracao2026"
        preload
      />

      <ResourcePanel resources={resources} />

      {/* Progresso Técnico indicator */}
      <div className="card-dark px-5 py-3">
        <StatusBar label="Progresso Técnico" value={Math.round(pillarScores.tecnico)} colorVar="--color-rust" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        {/* Left: module list */}
        <aside className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Modulos da Entrega 1</p>
          <div className="mt-4 space-y-3">
            {restorationModules.map((module) => {
              const moduleProgress = progress[module.id];
              const locked = moduleProgress.stage === "locked";
              const active = selectedModule.id === module.id;

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => {
                    if (!locked) {
                      playClick();
                      setSelectedModuleId(module.id);
                    } else {
                      playFailure();
                    }
                  }}
                  onMouseEnter={() => !locked && playTick()}
                  aria-pressed={active}
                  aria-label={`${module.kicker}, ${module.title}. Estatuto: ${stageLabel[moduleProgress.stage]}`}
                  className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                    active
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.16)] glow-badge"
                      : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.18)]"
                  } ${locked ? "cursor-not-allowed opacity-55" : "hover:border-[color:var(--color-cobre)] hover-lift-game"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">{module.kicker}</p>
                      <h2 className="mt-1 font-serif text-lg md:text-xl text-[var(--color-paper)]">{module.title}</h2>
                    </div>
                    {locked ? <Lock size={16} className="text-[var(--color-muted)]" /> : <CheckCircle2 size={16} className="text-[var(--color-latao)]" />}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{module.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="image-badge">{stageLabel[moduleProgress.stage]}</span>
                    <span className="image-badge">{moduleProgress.completedTaskIds.length}/{module.taskIds.length} etapas</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: module detail */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={selectedModule.id}
            className="card-dark overflow-hidden relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Module header with artwork */}
            <GameModuleHeader
              kicker={selectedModule.kicker}
              title={selectedModule.title}
              imageSrc={getRestorationModuleImage(selectedModule.id)}
              imageAlt={selectedModule.title}
              badge={stageLabel[selectedProgress.stage]}
              fallbackArea="restauracao2026"
              className="rounded-b-none border-x-0 border-t-0"
            />

            <div className="border-b border-[color:rgba(233,223,201,0.08)] p-5 md:p-6">
              <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{selectedModule.objective}</p>
              <EditorialSeal
                contentType={selectedModule.contentType}
                sourceRef={selectedModule.sourceRef}
                confidenceNote={selectedModule.confidenceNote}
                className="mt-4"
              />
            </div>

            {/* Stage Pipeline */}
            <div className="border-b border-[color:rgba(233,223,201,0.08)] px-5 py-4 md:px-6">
              <StagePipeline currentStage={selectedProgress.stage} />
            </div>

            <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)]">
              <div className="space-y-4">
                {activeTask ? (
                  <div className={`rounded-2xl border p-5 ${isCritical ? "border-[color:var(--color-danger)] pulse-critical" : "border-[color:rgba(233,223,201,0.08)]"} bg-[color:rgba(12,15,14,0.18)]`}>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">
                      <Wrench size={14} />
                      Tarefa em foco
                    </div>
                    <h2 className="mt-3 font-serif text-xl md:text-2xl text-[var(--color-paper)]">{activeTask.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{activeTask.summary}</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {[
                        { key: "Custo", value: activeTask.cost },
                        { key: "Tempo", value: activeTask.time },
                        { key: "Impacto", value: activeTask.impact },
                        { key: "Risco", value: activeTask.risk },
                      ].map((item) => (
                        <div key={item.key} className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(8,10,9,0.18)] p-3 text-sm text-[var(--color-muted)]">
                          <p className="font-semibold text-[var(--color-paper)]">{item.key}</p>
                          <p className="mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <EditorialSeal
                      contentType={activeTask.contentType}
                      sourceRef={activeTask.sourceRef}
                      confidenceNote={activeTask.confidenceNote}
                      className="mt-4"
                    />

                    <BlueprintLine className="mt-6" delay={0.2} />

                    <div className="mt-5 grid gap-3">
                      {activeTask.choices.map((choice) => (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            playIndustrial();
                            resolveRestorationTaskChoice(selectedModule.id, choice.id);
                            
                            // 10% chance for a Crisis Event
                            if (Math.random() < 0.1) {
                              playFailure(); // Crisis sounds bad
                              const potentialCrises = [
                                { 
                                  title: "Surto de Malária", 
                                  body: "Uma frente de trabalho foi atingida por um surto súbito. Você desvia recursos da saúde para manter o prazo ou interrompe a obra?",
                                  choiceA: "Priorizar Saúde (-10 Órgão, +5 Moral)",
                                  choiceB: "Manter Prazo (-10 Moral, +5 Progresso)"
                                },
                                { 
                                  title: "Sabotagem Técnica", 
                                  body: "Ferramentas essenciais foram danificadas. Investigar os culpados ou comprar reposição imediata no mercado negro?",
                                  choiceA: "Investigar (-5 Moral, +5 Preservação)",
                                  choiceB: "Comprar (-15 Orçamento, +5 Progresso)"
                                }
                              ];
                              setActiveCrisis(potentialCrises[Math.floor(Math.random() * potentialCrises.length)]);
                            }

                            // 20% chance to discover a random artifact
                            if (Math.random() < 0.2) {
                              playSuccess();
                              const artifacts = ["artefato-ferramenta-inglesa", "artefato-medalha-ferrovia", "artefato-frasco-quinino"];
                              const randomArtifact = artifacts[Math.floor(Math.random() * artifacts.length)];
                              setDiscoveredArtifactId(randomArtifact);
                              discoverArtifact(randomArtifact);
                            }
                          }}
                          aria-label={`Decisão: ${choice.label}. ${choice.summary}`}
                          className="rounded-2xl border border-[color:rgba(197,154,93,0.3)] bg-[color:rgba(44,42,40,0.74)] p-4 text-left transition-all duration-200 hover:border-[color:var(--color-cobre)] hover-lift-game"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm md:text-base text-[var(--color-paper)]">{choice.label}</h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{choice.summary}</p>
                            </div>
                            <ArrowRight size={16} className="mt-1 text-[var(--color-latao)]" />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/86">{choice.outcome}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Etapa operacional</p>
                    <h2 className="mt-3 font-serif text-2xl text-[var(--color-paper)]">{stageLabel[selectedProgress.stage]}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {selectedProgress.stage === "released"
                        ? "Modulo liberado para uso e leitura publica na Entrega 1."
                        : stageCopy[selectedProgress.stage] ?? "Etapa concluida."}
                    </p>
                    {selectedProgress.stage === "released" ? (
                      <div className="mt-5 flex items-center gap-3">
                        <FeedbackStamp type="completed" />
                        <p className="text-sm text-[var(--color-muted)]">Este modulo agora sustenta os proximos desbloqueios da campanha.</p>
                      </div>
                    ) : null}
                  </div>
                )}

                {restorationFeedback?.moduleId === selectedModule.id ? (
                  <div className="rounded-2xl border border-[color:rgba(212,163,103,0.26)] bg-[color:rgba(212,163,103,0.08)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <FeedbackStamp type="unlocked" />
                          <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">O que mudou agora</p>
                            <h3 className="mt-1 font-serif text-xl text-[var(--color-paper)]">{restorationFeedback.choiceLabel}</h3>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/86">{restorationFeedback.outcome}</p>
                      </div>
                        <button type="button" className="image-badge" onClick={() => { playClick(); dismissRestorationFeedback(); }}>
                        Fechar resumo
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.12)] p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">Impacto de campanha</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{restorationFeedback.impactSummary}</p>
                      </div>
                      <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.12)] p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">Proximo estado</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{stageLabel[restorationFeedback.nextStage]}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.12)] p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">Recursos alterados</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(restorationFeedback.resourceDelta).map(([key, value]) => (
                            <span key={key} className="image-badge">
                              {resourceLabel[key] ?? key} {value && value > 0 ? `+${value}` : value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.12)] p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">Desbloqueios</p>
                        {restorationFeedback.unlockedEntryIds.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {restorationFeedback.unlockedEntryIds.map((entryId) => (
                              <span key={entryId} className="image-badge image-badge-gold">{entryId}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-[var(--color-muted)]">Nenhuma nova entrada destravada nesta decisao.</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{restorationFeedback.timelineNote}</p>
                  </div>
                ) : null}

                {/* Module reward labels */}
                {moduleReward && selectedProgress.stage !== "released" && (
                  <div className="mt-4 rounded-2xl border border-[color:rgba(212,163,103,0.18)] bg-[color:rgba(212,163,103,0.06)] p-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-latao)]">Ao concluir este módulo →</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="image-badge image-badge-gold">{moduleReward.pillarImpact}</span>
                      {moduleReward.historyChapterId && (
                        <span className="image-badge">
                          Parte {historyChapters.find((ch) => ch.id === moduleReward.historyChapterId)?.part ?? "?"} da História
                        </span>
                      )}
                      {moduleReward.quizModuleId && (
                        <span className="image-badge">
                          {quizModules.find((m) => m.id === moduleReward.quizModuleId)?.title ?? "Quiz"}
                        </span>
                      )}
                      {moduleReward.museumAreaId && (
                        <span className="image-badge">
                          Ala {museumAreas.find((a) => a.id === moduleReward.museumAreaId)?.title ?? "Museu"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Subfrentes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedModule.subsystems.map((item) => (
                      <span key={item} className="image-badge hover-lift-game transition-all duration-200 hover:glow-badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Diário operacional</p>
                  <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
                    {selectedProgress.log.length === 0 ? (
                      <li className="italic">O modulo ainda nao registrou decisoes.</li>
                    ) : (
                      selectedProgress.log.map((item, i) => (
                        <li key={item} className="flex gap-3">
                          <span className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-latao)]">
                            #{i + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeCrisis && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:rgba(8,10,9,0.95)] p-4 backdrop-blur-md"
          >
            <motion.article 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="card-dark max-w-sm p-6 border-[color:var(--color-danger)] shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-3 text-[var(--color-danger)]">
                <span className="pulse-critical h-2 w-2 rounded-full bg-current" />
                <p className="text-xs uppercase tracking-[0.24em]">Evento de Crise</p>
              </div>
              <h2 className="mt-4 font-serif text-3xl text-[var(--color-paper)]">{activeCrisis.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{activeCrisis.body}</p>
              <div className="mt-8 flex flex-col gap-3">
                  <button 
                  onClick={() => { playClick(); setActiveCrisis(null); }}
                  className="btn-primary w-full text-center"
                >
                  {activeCrisis.choiceA}
                </button>
                <button 
                  onClick={() => { playClick(); setActiveCrisis(null); }}
                  className="border border-[color:rgba(233,223,201,0.2)] bg-[color:rgba(233,223,201,0.04)] text-[var(--color-paper)] rounded-2xl p-4 text-sm hover:bg-[color:rgba(233,223,201,0.1)] transition-colors"
                >
                  {activeCrisis.choiceB}
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}

        {discoveredArtifactId && (
          <ArtifactBench 
            artifactId={discoveredArtifactId} 
            onClose={() => setDiscoveredArtifactId(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
