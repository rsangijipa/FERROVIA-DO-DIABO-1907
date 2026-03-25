import { restorationEventArt } from "@/content/assetManifest";
import { type GameEvent } from "@/types/game";

export const restorationEvents: GameEvent[] = [
  {
    id: "ev-01",
    title: "Inspecao Inicial da Locomotiva 18",
    description: "A caldeira mostra fadiga estrutural. A equipe pede parada completa para inspeção técnica detalhada.",
    image: restorationEventArt["ev-01"],
    tags: ["locomotiva", "seguranca"],
    choices: [
      {
        id: "ev-01-a",
        label: "Parar e inspecionar com rigor",
        consequence: {
          resources: { progressoTecnico: -8, preservacao: 12, saudeSanitaria: 4 },
          text: "A equipe trabalha com precisão e evita danos irreversíveis.",
          unlocks: ["codex-caldeira"],
        },
      },
      {
        id: "ev-01-b",
        label: "Ajuste rápido para manter cronograma",
        consequence: {
          resources: { progressoTecnico: 6, preservacao: -10, moral: -4 },
          text: "O cronograma respira, mas técnicos alertam para risco acumulado.",
        },
      },
    ],
  },
  {
    id: "ev-02",
    title: "Vazamento na Oficina",
    description: "A umidade amazônica acelerou corrosão no telhado da oficina principal.",
    image: restorationEventArt["ev-02"],
    tags: ["oficina", "clima"],
    choices: [
      {
        id: "ev-02-a",
        label: "Comprar chapa naval e resolver agora",
        consequence: {
          resources: { orcamento: -14, preservacao: 10, moral: 4 },
          text: "A intervenção robusta melhora segurança e confiança da equipe.",
        },
      },
      {
        id: "ev-02-b",
        label: "Remendo provisório",
        consequence: {
          resources: { orcamento: -4, preservacao: -6, progressoTecnico: -3 },
          text: "A solução segura poucos dias e a manutenção volta a atrasar.",
        },
      },
    ],
  },
  {
    id: "ev-03",
    title: "Pressao da Imprensa Local",
    description: "Jornalistas questionam se o projeto é restauro real ou marketing institucional.",
    image: restorationEventArt["ev-03"],
    tags: ["opiniao-publica"],
    choices: [
      {
        id: "ev-03-a",
        label: "Abrir visita guiada técnica",
        consequence: {
          resources: { moral: 8, preservacao: 6, progressoTecnico: -3 },
          text: "A transparência fortalece o prestígio cultural do projeto.",
          unlocks: ["codex-visita-guiada"],
        },
      },
      {
        id: "ev-03-b",
        label: "Evitar exposição e focar no canteiro",
        consequence: {
          resources: { progressoTecnico: 5, moral: -8 },
          text: "A produção acelera, mas surgem críticas públicas sobre opacidade.",
        },
      },
    ],
  },
  {
    id: "ev-04",
    title: "Surto de Gripe na Equipe",
    description: "Quinze trabalhadores apresentam sintomas respiratórios após semana de chuva intensa.",
    image: restorationEventArt["ev-04"],
    tags: ["sanitario"],
    choices: [
      {
        id: "ev-04-a",
        label: "Reduzir jornada e montar posto de triagem",
        consequence: {
          resources: { saudeSanitaria: 14, progressoTecnico: -8, moral: 6 },
          text: "A contenção funciona e a equipe percebe cuidado real.",
        },
      },
      {
        id: "ev-04-b",
        label: "Manter ritmo e distribuir apenas EPIs",
        consequence: {
          resources: { saudeSanitaria: -10, progressoTecnico: 6, moral: -6 },
          text: "O cronograma avança, mas aumentam afastamentos por exaustão.",
        },
      },
    ],
  },
  {
    id: "ev-05",
    title: "Ponte de Santo Antonio",
    description: "O trecho turístico pede reforço estrutural antes da abertura parcial.",
    image: restorationEventArt["ev-05"],
    tags: ["trecho", "infraestrutura"],
    choices: [
      {
        id: "ev-05-a",
        label: "Executar reforço completo",
        consequence: {
          resources: { orcamento: -10, progressoTecnico: 8, preservacao: 8 },
          text: "A ponte ganha vida útil e vira vitrine de restauro responsável.",
        },
      },
      {
        id: "ev-05-b",
        label: "Liberar visita sem reforco total",
        consequence: {
          resources: { moral: 4, preservacao: -12, saudeSanitaria: -6 },
          text: "O público chega cedo, porém os riscos estruturais se acumulam.",
        },
      },
    ],
  },
  {
    id: "ev-06",
    title: "Equipe de Restauro Subdimensionada",
    description: "Técnicos experientes pedem contratação emergencial para cumprir metas.",
    image: restorationEventArt["ev-06"],
    tags: ["equipe"],
    choices: [
      {
        id: "ev-06-a",
        label: "Contratar mestres locais",
        consequence: {
          resources: { orcamento: -12, progressoTecnico: 10, moral: 9 },
          text: "A transferência de saber local acelera decisões críticas.",
          unlocks: ["codex-mestres-locais"],
        },
      },
      {
        id: "ev-06-b",
        label: "Manter equipe atual",
        consequence: {
          resources: { orcamento: 4, progressoTecnico: -8, moral: -7 },
          text: "A contenção de custos compromete prazo e ambiente de trabalho.",
        },
      },
    ],
  },
  {
    id: "ev-07",
    title: "Arquivo Historico Danificado",
    description: "Caixas de documentos da EFMM foram encontradas com mofo e perdas parciais.",
    image: restorationEventArt["ev-07"],
    tags: ["arquivo", "patrimonio"],
    choices: [
      {
        id: "ev-07-a",
        label: "Priorizar digitalizacao e higienizacao",
        consequence: {
          resources: { preservacao: 13, orcamento: -7, progressoTecnico: -2 },
          text: "O acervo ganha proteção e valor educativo imediato.",
          unlocks: ["codex-arquivo-higienizacao"],
        },
      },
      {
        id: "ev-07-b",
        label: "Guardar para etapa futura",
        consequence: {
          resources: { orcamento: 3, preservacao: -9, moral: -3 },
          text: "A equipe percebe que memória documental ficou em segundo plano.",
        },
      },
    ],
  },
  {
    id: "ev-08",
    title: "Pane no Gerador",
    description: "Sem energia estável, a oficina noturna não consegue manter soldas críticas.",
    image: restorationEventArt["ev-08"],
    tags: ["energia"],
    choices: [
      {
        id: "ev-08-a",
        label: "Alugar gerador industrial",
        consequence: {
          resources: { orcamento: -11, progressoTecnico: 9, moral: 3 },
          text: "A produção volta ao ritmo com impacto financeiro relevante.",
        },
      },
      {
        id: "ev-08-b",
        label: "Operar em turnos diurnos",
        consequence: {
          resources: { orcamento: -2, progressoTecnico: -7, saudeSanitaria: 2 },
          text: "Menos custo e menos risco, mas o calendário fica pressionado.",
        },
      },
    ],
  },
  {
    id: "ev-09",
    title: "Demanda Escolar",
    description: "Escolas de Porto Velho pedem visitas regulares e material pedagógico.",
    image: restorationEventArt["ev-09"],
    tags: ["educacao"],
    choices: [
      {
        id: "ev-09-a",
        label: "Criar programa educativo piloto",
        consequence: {
          resources: { moral: 10, preservacao: 5, orcamento: -5 },
          text: "O projeto ganha legitimidade social e nova base de apoiadores.",
          unlocks: ["codex-programa-escolar"],
        },
      },
      {
        id: "ev-09-b",
        label: "Adiar agenda escolar",
        consequence: {
          resources: { progressoTecnico: 4, moral: -9 },
          text: "A equipe ganha tempo, mas perde capital comunitário.",
        },
      },
    ],
  },
  {
    id: "ev-10",
    title: "Conflito de Fornecimento",
    description: "Há atraso no lote de peças importadas para a Locomotiva 50.",
    image: restorationEventArt["ev-10"],
    tags: ["supply"],
    choices: [
      {
        id: "ev-10-a",
        label: "Adaptar peças nacionais",
        consequence: {
          resources: { progressoTecnico: 6, preservacao: -4, moral: 4 },
          text: "A adaptação mantém o ritmo com pequenas perdas de autenticidade.",
        },
      },
      {
        id: "ev-10-b",
        label: "Aguardar padrao original",
        consequence: {
          resources: { progressoTecnico: -8, preservacao: 9, moral: -3 },
          text: "A fidelidade histórica é preservada ao custo de atraso operacional.",
        },
      },
    ],
  },
  {
    id: "ev-11",
    title: "Fiscalizacao Sanitária",
    description: "Auditoria aponta risco de água parada próxima aos dormitórios.",
    image: restorationEventArt["ev-11"],
    tags: ["auditoria", "sanitario"],
    choices: [
      {
        id: "ev-11-a",
        label: "Mutirao imediato de drenagem",
        consequence: {
          resources: { saudeSanitaria: 12, moral: 6, orcamento: -6 },
          text: "A resposta rápida evita penalidades e melhora confiança interna.",
        },
      },
      {
        id: "ev-11-b",
        label: "Ajuste gradual ao longo do mes",
        consequence: {
          resources: { saudeSanitaria: -7, orcamento: 2, progressoTecnico: 2 },
          text: "O custo cai agora, mas o risco sanitário persiste.",
        },
      },
    ],
  },
  {
    id: "ev-12",
    title: "Abertura do Trecho Piloto",
    description: "Chegou a semana final. Decisão estratégica define como o público verá o projeto.",
    image: restorationEventArt["ev-12"],
    tags: ["final"],
    choices: [
      {
        id: "ev-12-a",
        label: "Cerimonia tecnica com memoria dos trabalhadores",
        consequence: {
          resources: { moral: 10, preservacao: 8, progressoTecnico: 4 },
          text: "O lançamento une operação e dignidade histórica.",
          unlocks: ["codex-memorial-trabalhadores"],
        },
      },
      {
        id: "ev-12-b",
        label: "Lancar operacao com foco em velocidade",
        consequence: {
          resources: { progressoTecnico: 10, moral: -6, preservacao: -7 },
          text: "A entrega impressiona no curto prazo, mas deixa ruídos de memória.",
        },
      },
    ],
  },
];
