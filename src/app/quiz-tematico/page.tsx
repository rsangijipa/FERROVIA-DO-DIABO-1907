import type { Metadata } from "next";
import { QuizMode } from "@/components/quiz/QuizMode";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Quiz Temático | Ferrovia do Diabo",
  description: "Teste seus conhecimentos para desbloquear alas da restauração.",
};

export default function QuizTematicoPage() {
  return (
    <>
      <ModeInitializer mode="quizTematico" />
      <QuizMode />
    </>
  );
}
