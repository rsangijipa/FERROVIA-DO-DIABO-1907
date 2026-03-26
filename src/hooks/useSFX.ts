"use client";

import { useCallback } from "react";

export function useSFX() {
  const playTick = useCallback(() => {}, []);
  const playClick = useCallback(() => {}, []);
  const playSuccess = useCallback(() => {}, []);
  const playIndustrial = useCallback(() => {}, []);
  const playFailure = useCallback(() => {}, []);

  return { playTick, playClick, playSuccess, playIndustrial, playFailure };
}
