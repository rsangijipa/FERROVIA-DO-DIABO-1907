"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { getQuizModuleImage, quizAssets } from "@/content/assetManifest";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { quizToMuseum } from "@/lib/campaign/campaignRewards";
import { choiceLetters } from "@/lib/constants";
import { museumAreas } from "@/content/museumContent";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { FeedbackStamp } from "../ui/FeedbackStamp";
import { GameModuleHeader } from "../ui/GameModuleHeader";
import { SectionHero } from "../ui/SectionHero";
import { useSFX } from "@/hooks/useSFX";



const crossfade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
} as const;

export function QuizMode() {
  const quizProgress = useGameStore((store) => store.progress.quiz);
  const answerQuiz = useGameStore((store) => store.answerQuiz);
  const nextQuizQuestion = useGameStore((store) => store.nextQuizQuestion);
  const { playClick, playSuccess, playFailure, playTick } = useSFX();

  const firstModuleId = quizModules.find((module) => module.status === "available")?.id ?? quizModules[0].id;
  const [selectedModuleId, setSelectedModuleId] = useState(firstModuleId);
  const safeSelectedModuleId = quizProgress[selectedModuleId]?.status === "locked" ? firstModuleId : selectedModuleId;
  const selectedModule = quizModules.find((module) => module.id === safeSelectedModuleId) ?? quizModules[0];
  const selectedProgress = quizProgress[selectedModule.id];
  const questions = quizQuestionsByModuleId[selectedModule.id] ?? [];
  const question = questions[selectedProgress.currentQuestionIndex];
  const completedModules = quizModules.filter((module) => quizProgress[module.id].status === "completed").length;

  // Determine the last answered question's result for visual states
  const lastAnswer = selectedProgress.answers[selectedProgress.answers.length - 1];
  const isAnswered = Boolean(selectedProgress.feedback);

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Curadoria em forma de jogo"
        title="Quiz Tematico"
        subtitle="Dois modulos completos na Entrega 1, com dificuldade graduada, referencia curta e desbloqueios conectados ao Museu Vivo."
        imageSrc={quizAssets.hero}
        imageAlt="Quiz Tematico"
        chips={[`${completedModules}/2 modulos concluidos`, `${selectedProgress.answers.length}/${questions.length} respostas no modulo`, selectedModule.title]}
        fallbackArea="quizTematico"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.35fr)]">
        {/* Left: module map */}
        <aside className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Mapa de estudo</p>
          <div className="mt-4 space-y-3">
            {quizModules.map((module) => {
              const progress = quizProgress[module.id];
              const locked = progress.status === "locked";
              const active = module.id === selectedModule.id;
              const questions = quizQuestionsByModuleId[module.id] ?? [];
              const isExcellence = progress.status === "completed" && progress.correct >= Math.ceil(questions.length * 0.9);

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => !locked && setSelectedModuleId(module.id)}
                  aria-pressed={active}
                  aria-label={`Módulo: ${module.title}. Estatuto: ${locked ? "Bloqueado" : isExcellence ? "Excelência" : progress.status === "completed" ? "Concluído" : "Disponível"}`}
                  className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                    active
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.14)] glow-badge"
                      : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.18)]"
                  } ${locked ? "cursor-not-allowed opacity-55" : "hover:border-[color:var(--color-cobre)] hover-lift-game"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl text-[var(--color-paper)]">{module.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{module.summary}</p>
                    </div>
                    <span className={`image-badge ${
                      isExcellence ? "image-badge-gold"
                      : progress.status === "completed" ? "image-badge-gold"
                      : ""
                    }`}>
                      {locked ? "Bloqueado"
                      : isExcellence ? "Excelência"
                      : progress.status === "completed" ? "Concluído"
                      : "Disponível"}
                    </span>
                  </div>
                  {/* Threshold label */}
                  {!locked && (() => {
                    const questions = quizQuestionsByModuleId[module.id] ?? [];
                    const threshold = Math.ceil(questions.length * 0.7);
                    const linkedMuseum = quizToMuseum[module.id];
                    const museumName = linkedMuseum
                      ? museumAreas.find((a) => a.id === linkedMuseum)?.title ?? "Museu"
                      : null;
                    const met = progress.correct >= threshold;
                    return (
                      <div className="mt-3 space-y-1">
                        <p className={`text-[0.6rem] uppercase tracking-[0.14em] ${
                          met ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"
                        }`}>
                          Nota mínima: {threshold}/{questions.length}
                          {museumName ? ` para desbloquear ala ${museumName}` : ""}
                          {met ? " ✓" : ""}
                        </p>
                        {progress.status === "completed" && progress.correct >= Math.ceil(questions.length * 0.9) && (
                          <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-latao)]">
                            Excelência (≥9) → bônus no Resultado
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: question panel */}
        <article className="card-dark overflow-hidden">
          <GameModuleHeader
            kicker={selectedModule.title}
            title="Modulo em andamento"
            imageSrc={getQuizModuleImage(selectedModule.id)}
            imageAlt={selectedModule.title}
            badge={`${selectedProgress.correct} corretas`}
            fallbackArea="quizTematico"
            className="rounded-b-none border-x-0 border-t-0"
          />

          <div className="p-5 md:p-6">
            <p className="text-sm leading-7 text-[var(--color-muted)]">{selectedModule.summary}</p>
            <EditorialSeal
              contentType={selectedModule.contentType}
              sourceRef={selectedModule.sourceRef}
              confidenceNote={selectedModule.confidenceNote}
              className="mt-4"
            />

            <AnimatePresence mode="wait">
              {question ? (
                <motion.div
                  key={question.id}
                  className="mt-5 rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-5"
                  {...crossfade}
                >
                  {/* Progress bar */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:rgba(233,223,201,0.12)]">
                      <motion.div
                        className="h-full rounded-full bg-[var(--color-latao)]"
                        initial={false}
                        animate={{ width: `${((selectedProgress.currentQuestionIndex) / questions.length) * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 16 }}
                      />
                    </div>
                    <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {selectedProgress.currentQuestionIndex + 1}/{questions.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-rust)] bg-[var(--color-rust)]/10 px-2.5 py-1 rounded border border-[var(--color-rust)]/20 shadow-sm">
                      {question.topic} • {question.difficulty}
                    </div>
                  </div>
                  <h2 className="mt-6 font-serif text-2xl md:text-3xl text-[var(--color-paper)] leading-snug drop-shadow-md relative z-10">{question.prompt}</h2>

                  <div className="mt-5 grid gap-3">
                    {question.options.map((option, index) => {
                      const isSelected = lastAnswer?.chosenIndex === index && isAnswered;
                      const isCorrectAnswer = index === question.correctIndex;
                      const showCorrect = isAnswered && isCorrectAnswer;
                      const showWrong = isSelected && isAnswered && !isCorrectAnswer;

                      return (
                        <button
                          key={option}
                          type="button"
                          onMouseEnter={() => !isAnswered && playTick()}
                          onClick={() => {
                            if (isCorrectAnswer) playSuccess();
                            else playFailure();
                            answerQuiz(selectedModule.id, index);
                          }}
                          disabled={isAnswered}
                          aria-pressed={isSelected}
                          aria-label={`Alternativa ${choiceLetters[index]}: ${option}`}
                          className={clsx(
                            "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden group",
                            showCorrect
                              ? "border-[color:var(--color-success)] bg-[color:rgba(94,138,97,0.16)] shadow-[0_0_20px_rgba(94,138,97,0.2)]"
                              : showWrong
                                ? "border-[color:var(--color-danger)] bg-[color:rgba(182,73,50,0.12)]"
                                : isAnswered
                                  ? "cursor-not-allowed border-[color:rgba(233,223,201,0.04)] bg-[color:rgba(12,15,14,0.2)] opacity-50 grayscale pt-5"
                                  : "border-[color:rgba(212,163,103,0.18)] bg-[color:rgba(12,15,14,0.3)] hover:border-[color:var(--color-cobre)] hover:bg-[color:rgba(212,163,103,0.06)] tactical-hover",
                          )}
                        >
                          {showCorrect && <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTEwIDBMOCAyWiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-20 pointer-events-none" />}
                          <span
                            className={clsx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-serif text-sm font-bold",
                              showCorrect
                                ? "border-[color:var(--color-success)] bg-[color:rgba(94,138,97,0.2)] text-[var(--color-success)]"
                                : showWrong
                                  ? "border-[color:var(--color-danger)] bg-[color:rgba(182,73,50,0.2)] text-[var(--color-danger)]"
                                  : "border-[color:rgba(212,163,103,0.25)] bg-[color:rgba(212,163,103,0.08)] text-[var(--color-latao)]",
                            )}
                          >
                            {choiceLetters[index]}
                          </span>
                          <span className="mt-1 text-sm text-[var(--color-paper)]">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered ? (
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <FeedbackStamp type={lastAnswer?.correct ? "correct" : "wrong"} />
                      </div>
                      <div className="rounded-2xl border border-[color:rgba(124,176,183,0.2)] bg-[color:rgba(124,176,183,0.06)] p-4">
                        <p className="text-sm leading-7 text-[var(--color-paper)]">{selectedProgress.feedback}</p>
                        <EditorialSeal
                          contentType={question.contentType}
                          sourceRef={question.sourceRef}
                          confidenceNote={question.confidenceNote}
                          compact
                          className="mt-4"
                        />
                      </div>
                      <button className="btn-primary" onClick={() => { playClick(); nextQuizQuestion(selectedModule.id); }}>
                        {selectedProgress.currentQuestionIndex >= questions.length - 1 ? "Concluir modulo" : "Proxima pergunta"}
                      </button>
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="completed"
                  className="mt-5 rounded-2xl border border-[color:rgba(212,163,103,0.3)] bg-[color:rgba(12,15,14,0.3)] p-8 relative overflow-hidden text-center shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                  {...crossfade}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cobre)]/10 to-transparent pointer-events-none" />
                  
                  <div className="flex flex-col items-center relative z-10">
                    <div className="h-24 w-24 rounded-full border-4 border-[var(--color-latao)] bg-[color:rgba(212,163,103,0.1)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,163,103,0.3)]">
                      <span className="font-serif text-4xl text-[var(--color-latao)]">{selectedProgress.correct}</span>
                      <span className="text-[var(--color-latao)]/50 text-xl font-light mx-1">/</span>
                      <span className="text-xl text-[var(--color-latao)]/70 mt-3">{questions.length}</span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-paper)] chromatic-text">Autenticação Concluída</h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] max-w-md mx-auto">
                      Sua precisão curatorial certificou a veracidade destes fatos históricos e consolidou a narrativa do Museu Vivo.
                    </p>

                    {quizToMuseum[selectedModule.id] && (
                      <div className="mt-8 p-4 bg-black/40 border border-[var(--color-success)]/30 rounded-xl inline-block">
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-success)] mb-1">
                          Recompensa Desbloqueada
                        </p>
                        <p className="text-sm text-[var(--color-paper)]">
                          Ala do Museu liberada para exploração.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </article>
      </div>
    </section>
  );
}
