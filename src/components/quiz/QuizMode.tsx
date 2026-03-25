"use client";

import { useState } from "react";

import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { SectionHero } from "../ui/SectionHero";

export function QuizMode() {
  const quizProgress = useGameStore((store) => store.progress.quiz);
  const answerQuiz = useGameStore((store) => store.answerQuiz);
  const nextQuizQuestion = useGameStore((store) => store.nextQuizQuestion);

  const firstModuleId = quizModules.find((module) => module.status === "available")?.id ?? quizModules[0].id;
  const [selectedModuleId, setSelectedModuleId] = useState(firstModuleId);
  const safeSelectedModuleId = quizProgress[selectedModuleId]?.status === "locked" ? firstModuleId : selectedModuleId;
  const selectedModule = quizModules.find((module) => module.id === safeSelectedModuleId) ?? quizModules[0];
  const selectedProgress = quizProgress[selectedModule.id];
  const questions = quizQuestionsByModuleId[selectedModule.id] ?? [];
  const question = questions[selectedProgress.currentQuestionIndex];
  const completedModules = quizModules.filter((module) => quizProgress[module.id].status === "completed").length;

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Curadoria em forma de jogo"
        title="Quiz Tematico"
        subtitle="Dois modulos completos na Entrega 1, com dificuldade graduada, referencia curta e desbloqueios conectados ao Museu Vivo."
        imageSrc="/game-assets/modes/quiz.jpg"
        imageAlt="Quiz Tematico"
        chips={[`${completedModules}/2 modulos concluidos`, `${selectedProgress.answers.length}/${questions.length} respostas no modulo`, selectedModule.title]}
        fallbackArea="quizTematico"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.35fr)]">
        <aside className="card-light p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Mapa de estudo</p>
          <div className="mt-4 space-y-3">
            {quizModules.map((module) => {
              const progress = quizProgress[module.id];
              const locked = progress.status === "locked";
              const active = module.id === selectedModule.id;

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => !locked && setSelectedModuleId(module.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[color:rgba(183,106,60,0.3)] bg-[color:rgba(183,106,60,0.08)]"
                      : "border-[color:rgba(183,106,60,0.14)] bg-[color:rgba(31,35,32,0.04)]"
                  } ${locked ? "cursor-not-allowed opacity-55" : "hover:border-[color:var(--color-cobre)]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl text-[var(--color-ink)]">{module.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{module.summary}</p>
                    </div>
                    <span className="image-badge">{locked ? "Planejado" : progress.status === "completed" ? "Concluido" : "Ativo"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="card-light p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">{selectedModule.title}</p>
          <h1 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">Modulo em andamento</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{selectedModule.summary}</p>
          <EditorialSeal
            contentType={selectedModule.contentType}
            sourceRef={selectedModule.sourceRef}
            confidenceNote={selectedModule.confidenceNote}
            className="mt-4"
          />

          {question ? (
            <div className="mt-5 rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">
                  {question.topic} • {question.difficulty} • {selectedProgress.currentQuestionIndex + 1}/{questions.length}
                </div>
                <span className="image-badge">{selectedProgress.correct} corretas</span>
              </div>
              <h2 className="mt-4 font-serif text-2xl text-[var(--color-ink)]">{question.prompt}</h2>

              <div className="mt-5 grid gap-3">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answerQuiz(selectedModule.id, index)}
                    disabled={Boolean(selectedProgress.feedback)}
                    className="rounded-2xl border border-[color:rgba(183,106,60,0.2)] bg-[color:rgba(255,255,255,0.6)] p-4 text-left transition hover:border-[color:var(--color-cobre)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedProgress.feedback ? (
                <div className="mt-5 rounded-2xl border border-[color:rgba(82,122,138,0.24)] bg-[color:rgba(82,122,138,0.1)] p-5">
                  <p className="text-sm leading-7 text-[var(--color-ink)]">{selectedProgress.feedback}</p>
                  <EditorialSeal
                    contentType={question.contentType}
                    sourceRef={question.sourceRef}
                    confidenceNote={question.confidenceNote}
                    compact
                    className="mt-4"
                  />
                  <button className="btn-primary mt-4" onClick={() => nextQuizQuestion(selectedModule.id)}>
                    {selectedProgress.currentQuestionIndex >= questions.length - 1 ? "Concluir modulo" : "Proxima pergunta"}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-5">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">Modulo concluido</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                Voce fechou este modulo com {selectedProgress.correct} acertos em {questions.length} perguntas.
              </p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
