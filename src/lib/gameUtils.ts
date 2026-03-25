import { type Resources } from "@/types/game";

export const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

export const applyResourceDelta = (
  resources: Resources,
  delta: Partial<Resources>,
): Resources => ({
  orcamento: clamp(resources.orcamento + (delta.orcamento ?? 0)),
  moral: clamp(resources.moral + (delta.moral ?? 0)),
  saudeSanitaria: clamp(resources.saudeSanitaria + (delta.saudeSanitaria ?? 0)),
  progressoTecnico: clamp(resources.progressoTecnico + (delta.progressoTecnico ?? 0)),
  preservacao: clamp(resources.preservacao + (delta.preservacao ?? 0)),
});

export const stateFromResources = (resources: Resources) => {
  const critical = Math.min(
    resources.orcamento,
    resources.moral,
    resources.saudeSanitaria,
    resources.progressoTecnico,
    resources.preservacao,
  );

  if (critical <= 0) return "colapso" as const;
  if (critical <= 25) return "crise" as const;
  if (critical <= 50) return "pressionado" as const;
  return "estavel" as const;
};

export const formatPercent = (value: number) => `${Math.round(value)}%`;
