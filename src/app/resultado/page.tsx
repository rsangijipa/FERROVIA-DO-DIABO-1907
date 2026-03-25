"use client";

import { IntegratedResult } from "@/components/results/IntegratedResult";
import { useMode } from "@/lib/useMode";

export default function ResultadoPage() {
  useMode("resultado");
  return <IntegratedResult />;
}
