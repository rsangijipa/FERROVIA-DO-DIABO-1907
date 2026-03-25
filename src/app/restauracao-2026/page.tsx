"use client";

import { RestorationMode } from "@/components/restoration/RestorationMode";
import { useMode } from "@/lib/useMode";

export default function Restauracao2026Page() {
  useMode("restauracao2026");
  return <RestorationMode />;
}
