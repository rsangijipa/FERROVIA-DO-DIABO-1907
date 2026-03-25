"use client";

import Link from "next/link";

import { quizQuestions } from "@/content/quizQuestions";
import { useGameStore } from "@/store/useGameStore";

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
      <div className="card-dark p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Quiz Histórico</p>
        <h1 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Pontuação: {score}</h1>
      </div>

      {status === "ongoing" && question ? (
        <div className="card-light p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">
            {question.category} • {index + 1}/{quizQuestions.length}
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{question.prompt}</h2>
          <div className="mt-4 grid gap-3">
            {question.options.map((option, optionIndex) => (
              <button key={option} className="btn-secondary text-left" onClick={() => answer(optionIndex)}>
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 rounded-md border border-[color:rgba(82,122,138,0.35)] bg-[color:rgba(82,122,138,0.12)] p-4">
              <p className="text-sm text-[var(--color-ink)]">{feedback}</p>
              <button className="btn-primary mt-3" onClick={next}>
                Próxima pergunta
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card-light p-6">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Quiz concluído</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Você acertou {score} de {quizQuestions.length}. Entradas de codex foram desbloqueadas conforme seu desempenho.
          </p>
          <div className="mt-4">
            <h3 className="font-serif text-lg text-[var(--color-ink)]">Ranking local</h3>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink-soft)]">
              {ranking.length === 0 ? <li>Sem tentativas salvas.</li> : ranking.map((value, i) => <li key={`${value}-${i}`}>#{i + 1} • {value} pts</li>)}
            </ul>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
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
