"use client";

import { NarrativeMode } from "@/components/narrative/NarrativeMode";
import { useMode } from "@/lib/useMode";

export default function HistoriaInterativaPage() {
  useMode("historiaInterativa");
  return <NarrativeMode />;
}
