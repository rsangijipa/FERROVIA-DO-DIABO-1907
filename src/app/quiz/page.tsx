"use client";

import { QuizMode } from "@/components/quiz/QuizMode";
import { useMode } from "@/lib/useMode";

export default function QuizPage() {
  useMode("quiz");
  return <QuizMode />;
}
