"use client";

import { CodexView } from "@/components/codex/CodexView";
import { useMode } from "@/lib/useMode";

export default function MuseuVivoPage() {
  useMode("museuVivo");
  return <CodexView />;
}
