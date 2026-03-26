"use client";

import { useMode } from "@/lib/useMode";
import type { ModeId } from "@/types/game";

export function ModeInitializer({ mode }: { mode: ModeId }) {
  useMode(mode);
  return null;
}
