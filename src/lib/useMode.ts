"use client";

import { useEffect } from "react";

import type { ModeId } from "@/types/game";
import { useGameStore } from "@/store/useGameStore";

export const useMode = (mode: ModeId) => {
  const setMode = useGameStore((state) => state.setMode);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
};
