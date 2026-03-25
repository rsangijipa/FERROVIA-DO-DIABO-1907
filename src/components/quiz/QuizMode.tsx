"use client";

import Link from "next/link";

import { modeCovers } from "@/content/assetManifest";
import { quizQuestions } from "@/content/quizQuestions";
import { useGameStore } from "@/store/useGameStore";

import { SectionHero } from "../ui/SectionHero";

export function QuizMode() {
  const index = useGameStore((s) => s.quizIndex);
  const score = useGameStore((s) => s.quizScore);
  const feedback = useGameStore((s) => s.quizFeedback);
  const status = useGameStore((s) => s.quizStatus);
  const ranking = useGameStore((s) => s.rankingLocal);
  const answer = useGameStore((s) => s.answerQuiz);
  const next = useGameStore((s) => s.nextQuiz);
  const reset = useGameStore((s) => s.resetQuiz);

  const question = quizQuestions[index];

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Quiz Histórico"
        title="Curadoria em forma de jogo"
        subtitle="Use o conhecimento histórico como ferramenta de leitura crítica do patrimônio e avance no metajogo cultural da Madeira-Mamoré."
        imageSrc={modeCovers.quiz}
        imageAlt="Banner do quiz histórico"
        chips={[
          `Pontuação: ${score}`,
          status === "ongoing" && question ? `Pergunta ${index + 1}/${quizQuestions.length}` : `${quizQuestions.length} questões`,
        ]}
        fallbackArea="quiz"
        preload
      />

      {status === "ongoing" && question ? (
        <div className="card-light p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">
            {question.category} • {index + 1}/{quizQuestions.length}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[var(--color-ink)] md:text-3xl">{question.prompt}</h2>
          <div className="mt-5 grid gap-3">
            {question.options.map((option, optionIndex) => (
              <button key={option} className="btn-secondary text-left" onClick={() => answer(optionIndex)}>
                {option}
              </button>
            ))}
          </div>

          {feedback ? (
            <div className="mt-5 rounded-xl border border-[color:rgba(82,122,138,0.35)] bg-[color:rgba(82,122,138,0.12)] p-4">
              <p className="text-sm leading-7 text-[var(--color-ink)]">{feedback}</p>
              <button className="btn-primary mt-4" onClick={next}>
                Próxima pergunta
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="card-light p-6 md:p-7">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Quiz concluído</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            Você acertou {score} de {quizQuestions.length}. Entradas de codex foram desbloqueadas conforme seu desempenho.
          </p>
          <div className="mt-5">
            <h3 className="font-serif text-lg text-[var(--color-ink)]">Ranking local</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ink-soft)]">
              {ranking.length === 0 ? (
                <li>Sem tentativas salvas.</li>
              ) : (
                ranking.map((value, i) => <li key={`${value}-${i}`}>#{i + 1} • {value} pts</li>)
              )}
            </ul>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={reset}>
              Jogar novamente
            </button>
            <Link className="btn-secondary" href="/resultado">
              Ver resultado integrado
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
