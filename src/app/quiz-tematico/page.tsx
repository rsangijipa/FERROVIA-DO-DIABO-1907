"use client";

import { QuizMode } from "@/components/quiz/QuizMode";
import { useMode } from "@/lib/useMode";

export default function QuizTematicoPage() {
  useMode("quizTematico");
  return <QuizMode />;
}
