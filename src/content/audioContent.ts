import type { AudioLog } from "@/types/game";

export const audioLogsData: AudioLog[] = [
  {
    id: "log-construction-noise",
    title: "O Som da Selva Metalica",
    speaker: "Frank Reed",
    date: "Junho, 1909",
    transcript: "O som das marretas contra os trilhos é constante. À noite, a selva reclama seu espaço com um silêncio que pesa mais que o barulho das máquinas. Perdi mais três homens hoje para a febre negra.",
    contentType: "historical_fact",
    sourceRef: "construction-1907-1912",
    confidenceNote: "Baseado em relatos reais de engenheiros americanos na EFMM.",
    unlockSource: "Decisão técnica em Restauração",
  },
  {
    id: "log-hospital-whisper",
    title: "Sussurros na Candelária",
    speaker: "Enfermeira Anônima",
    date: "Agosto, 1910",
    transcript: "O quinino acabou de novo. Os homens deliram em sete línguas diferentes. Às vezes, acho que a ferrovia não é feita de ferro, mas de ossos e promessas quebradas.",
    contentType: "historical_fact",
    sourceRef: "hospital-candelaria",
    confidenceNote: "Inspirado em cartas enviadas por trabalhadores do Hospital da Candelária.",
    unlockSource: "Cena da História Interativa",
  },
];

export const audioLogById = Object.fromEntries(audioLogsData.map((log) => [log.id, log]));
