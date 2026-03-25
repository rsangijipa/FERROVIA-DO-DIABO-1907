import { type CodexEntry } from "@/types/game";

export const codexEntries: CodexEntry[] = [
  {
    id: "codex-tratado-petropolis",
    type: "documento",
    title: "Tratado de Petropolis (1903)",
    body: "Acordo diplomático que redesenhou fronteiras e conectou decisões territoriais a infraestrutura estratégica na Amazônia ocidental.",
    tags: ["diplomacia", "fronteira"],
  },
  {
    id: "codex-caldeira",
    type: "locomotiva",
    title: "Caldeira e segurança operacional",
    body: "Sem inspeção correta, a recuperação de locomotivas pode comprometer vidas e patrimônio técnico.",
    tags: ["oficina", "seguranca"],
  },
  {
    id: "codex-brathwaite",
    type: "personagem",
    title: "Joseph Brathwaite",
    body: "Liderança barbadiana fictícia inspirada nas vozes caribenhas que tensionaram trabalho, crença e dignidade na obra.",
    tags: ["trabalhadores", "caribe"],
  },
  {
    id: "codex-hospital-candelaria",
    type: "marco",
    title: "Hospital Candelaria",
    body: "Referência sanitária crucial no enfrentamento de surtos durante a construção da Madeira-Mamoré.",
    tags: ["saneamento", "saude"],
  },
  {
    id: "codex-protocolo-quinino",
    type: "fato",
    title: "Triagem com quinino escasso",
    body: "Quando o recurso não cobre todos, critérios de prioridade se tornam decisões morais e políticas.",
    tags: ["medicina", "etica"],
  },
  {
    id: "codex-km-maldito",
    type: "marco",
    title: "Km maldito",
    body: "Expressão que simboliza o acúmulo de perdas humanas e medo coletivo em trechos de alta mortalidade.",
    tags: ["memoria", "luto"],
  },
  {
    id: "codex-locomotiva-18",
    type: "locomotiva",
    title: "Locomotiva 18",
    body: "Ativo de alto valor simbólico e técnico no ciclo de restauro do complexo ferroviário.",
    tags: ["restauro", "acervo"],
  },
  {
    id: "codex-arquivo-higienizacao",
    type: "documento",
    title: "Higienizacao de arquivo historico",
    body: "Tratamento documental reduz perda de informação e fortalece pesquisa e educação.",
    tags: ["arquivo", "preservacao"],
  },
  {
    id: "codex-mestres-locais",
    type: "personagem",
    title: "Mestres locais de oficina",
    body: "Saber técnico regional acelera restauro e cria continuidade cultural entre gerações.",
    tags: ["oficio", "tecnica"],
  },
  {
    id: "codex-programa-escolar",
    type: "fato",
    title: "Programa educativo piloto",
    body: "Aproximação com escolas transforma patrimônio em experiência de pertencimento.",
    tags: ["educacao", "comunidade"],
  },
  {
    id: "codex-memorial-trabalhadores",
    type: "marco",
    title: "Memorial dos trabalhadores",
    body: "Reconhecer nomes, trajetórias e perdas humaniza a narrativa da ferrovia.",
    tags: ["memorial", "dignidade"],
  },
  {
    id: "codex-visita-guiada",
    type: "fato",
    title: "Visita guiada técnica",
    body: "Transparência pública aumenta confiança e abre espaço para apoio de longo prazo.",
    tags: ["prestigio", "museu"],
  },
];

export const starterCodexIds = ["codex-tratado-petropolis", "codex-locomotiva-18"];
