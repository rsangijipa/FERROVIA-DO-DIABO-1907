"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Radar, Wrench } from "lucide-react";

import { restorationModules, restorationTasks } from "@/content/restorationModules";
import { useGameStore } from "@/store/useGameStore";
import type { RestorationStage } from "@/types/game";

import { EditorialSeal } from "../ui/EditorialSeal";
import { ResourcePanel } from "../ui/ResourcePanel";
import { SectionHero } from "../ui/SectionHero";

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
  prioritization: "Transforme o diagnostico em escopo, marcos e lote prioritario da Entrega 1.",
  contracting: "Amarre equipe, compra e responsabilidade antes da obra entrar em campo.",
  validation: "Confira o fechamento tecnico e a leitura patrimonial antes da liberacao ao publico.",
};

export function RestorationMode() {
  const resources = useGameStore((store) => store.restorationResources);
  const progress = useGameStore((store) => store.progress.restoration);
  const advanceModule = useGameStore((store) => store.advanceRestorationModule);
  const resolveChoice = useGameStore((store) => store.resolveRestorationTaskChoice);

  const firstPlayableModule = restorationModules.find((module) => progress[module.id].stage !== "locked")?.id ?? restorationModules[0].id;
  const [selectedModuleId, setSelectedModuleId] = useState(firstPlayableModule);
  const safeSelectedModuleId = progress[selectedModuleId]?.stage === "locked" ? firstPlayableModule : selectedModuleId;
  const selectedModule = restorationModules.find((module) => module.id === safeSelectedModuleId) ?? restorationModules[0];
  const selectedProgress = progress[selectedModule.id];
  const activeTask = restorationTasks.find(
    (task) => task.moduleId === selectedModule.id && task.stage === selectedProgress.stage,
  );
  const releasedModules = restorationModules.filter((module) => progress[module.id].stage === "released").length;

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Programa operacional contemporaneo"
        title="Restauração 2026"
        subtitle="Quatro modulos, uma maquina de estado unica e um vertical slice que assume a revitalizacao como simulacao plausivel sobre base documentada."
        imageSrc={selectedModule.imageSrc}
        imageAlt={selectedModule.title}
        chips={[`${releasedModules}/4 modulos liberados`, "2 tarefas profundas por modulo", `Estado ${stageLabel[selectedProgress.stage]}`]}
        fallbackArea="restauracao2026"
        preload
      />

      <ResourcePanel resources={resources} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
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
                  onClick={() => !locked && setSelectedModuleId(module.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.16)]"
                      : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.18)]"
                  } ${locked ? "cursor-not-allowed opacity-55" : "hover:border-[color:var(--color-cobre)]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">{module.kicker}</p>
                      <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">{module.title}</h2>
                    </div>
                    {locked ? <Lock size={16} className="text-[var(--color-muted)]" /> : <CheckCircle2 size={16} className="text-[var(--color-latao)]" />}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{module.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="image-badge">{stageLabel[moduleProgress.stage]}</span>
                    <span className="image-badge">{moduleProgress.completedTaskIds.length}/2 tarefas</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="card-dark overflow-hidden">
          <div className="border-b border-[color:rgba(233,223,201,0.08)] p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">{selectedModule.kicker}</p>
                <h1 className="mt-2 font-serif text-3xl text-[var(--color-paper)]">{selectedModule.title}</h1>
              </div>
              <span className="image-badge image-badge-gold">{stageLabel[selectedProgress.stage]}</span>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{selectedModule.objective}</p>
            <EditorialSeal
              contentType={selectedModule.contentType}
              sourceRef={selectedModule.sourceRef}
              confidenceNote={selectedModule.confidenceNote}
              className="mt-4"
            />
          </div>

          <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">
                  <Radar size={14} />
                  Maquina de estado
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(stageLabel).map(([key, label]) => (
                    <span
                      key={key}
                      className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                        key === selectedProgress.stage
                          ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)]"
                          : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.28)] text-[var(--color-muted)]"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {activeTask ? (
                <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">
                    <Wrench size={14} />
                    Tarefa em foco
                  </div>
                  <h2 className="mt-3 font-serif text-2xl text-[var(--color-paper)]">{activeTask.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{activeTask.summary}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(8,10,9,0.18)] p-3 text-sm text-[var(--color-muted)]">
                      <p className="font-semibold text-[var(--color-paper)]">Custo</p>
                      <p className="mt-1">{activeTask.cost}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(8,10,9,0.18)] p-3 text-sm text-[var(--color-muted)]">
                      <p className="font-semibold text-[var(--color-paper)]">Tempo</p>
                      <p className="mt-1">{activeTask.time}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(8,10,9,0.18)] p-3 text-sm text-[var(--color-muted)]">
                      <p className="font-semibold text-[var(--color-paper)]">Impacto</p>
                      <p className="mt-1">{activeTask.impact}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(8,10,9,0.18)] p-3 text-sm text-[var(--color-muted)]">
                      <p className="font-semibold text-[var(--color-paper)]">Risco</p>
                      <p className="mt-1">{activeTask.risk}</p>
                    </div>
                  </div>

                  <EditorialSeal
                    contentType={activeTask.contentType}
                    sourceRef={activeTask.sourceRef}
                    confidenceNote={activeTask.confidenceNote}
                    className="mt-4"
                  />

                  <div className="mt-5 grid gap-3">
                    {activeTask.choices.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => resolveChoice(selectedModule.id, choice.id)}
                        className="rounded-2xl border border-[color:rgba(197,154,93,0.3)] bg-[color:rgba(44,42,40,0.74)] p-4 text-left transition hover:border-[color:var(--color-cobre)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-[var(--color-paper)]">{choice.label}</h3>
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
                  {selectedProgress.stage !== "released" ? (
                    <button className="btn-primary mt-5" onClick={() => advanceModule(selectedModule.id)}>
                      Avancar etapa
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Subfrentes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedModule.subsystems.map((item) => (
                    <span key={item} className="image-badge">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Diario operacional</p>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
                  {selectedProgress.log.length === 0 ? (
                    <li>O modulo ainda nao registrou decisoes.</li>
                  ) : (
                    selectedProgress.log.map((item) => <li key={item}>{item}</li>)
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </section>
  );
}
