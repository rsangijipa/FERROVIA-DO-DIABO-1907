import type { Metadata } from "next";
import { IntegratedResult } from "@/components/results/IntegratedResult";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Resultado Integrado | Ferrovia do Diabo",
  description: "O impacto final das suas decisões no projeto Trilhos da Memória.",
};

export default function ResultadoIntegradoPage() {
  return (
    <>
      <ModeInitializer mode="resultadoIntegrado" />
      <IntegratedResult />
    </>
  );
}
