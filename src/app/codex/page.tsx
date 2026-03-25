"use client";

import { CodexView } from "@/components/codex/CodexView";
import { useMode } from "@/lib/useMode";

export default function CodexPage() {
  useMode("codex");
  return <CodexView />;
}
