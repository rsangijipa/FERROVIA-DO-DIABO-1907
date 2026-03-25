"use client";

import { IntegratedResult } from "@/components/results/IntegratedResult";
import { useMode } from "@/lib/useMode";

export default function ResultadoIntegradoPage() {
  useMode("resultadoIntegrado");
  return <IntegratedResult />;
}
