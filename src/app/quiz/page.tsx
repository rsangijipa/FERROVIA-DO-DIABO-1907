import { permanentRedirect } from "next/navigation";

export default function LegacyQuizPage() {
  permanentRedirect("/quiz-tematico");
}
