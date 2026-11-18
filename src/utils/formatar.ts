import type { Aviso, Categoria, StatusAviso } from "../types";

export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ORDEM_STATUS: StatusAviso[] = ["NAO_RECEBIDA", "RECEBIDA", "RESOLVENDO", "RESOLVIDA"];

export const ROTULO_STATUS: Record<StatusAviso, string> = {
  NAO_RECEBIDA: "Não recebida",
  RECEBIDA: "Recebida",
  RESOLVENDO: "Resolvendo",
  RESOLVIDA: "Resolvida",
};

export const COR_STATUS: Record<StatusAviso, string> = {
  NAO_RECEBIDA: "text-suave",
  RECEBIDA: "text-tinta",
  RESOLVENDO: "text-laranja-forte",
  RESOLVIDA: "text-verde",
};

export const DESCRICAO_STATUS: Record<StatusAviso, string> = {
  NAO_RECEBIDA: "O cidadão publicou o aviso com a prova.",
  RECEBIDA: "O órgão confirmou que viu o aviso.",
  RESOLVENDO: "A equipe do órgão está agindo no local.",
  RESOLVIDA: "O problema foi resolvido e todos veem.",
};

export function haQuantoTempo(iso?: string | null): string {
  const t = iso ? new Date(iso).getTime() : NaN;
  if (Number.isNaN(t)) return "";
  const min = Math.max(1, Math.round((Date.now() - t) / 60000));
  if (min < 60) return `há ${min} min`;
  if (min < 1440) return `há ${Math.round(min / 60)} h`;
  return `há ${Math.round(min / 1440)} d`;
}

export function proximoStatus(atual: StatusAviso): StatusAviso | null {
  const i = ORDEM_STATUS.indexOf(atual);
  return i >= 0 && i < ORDEM_STATUS.length - 1 ? ORDEM_STATUS[i + 1] : null;
}

const ICONES: Record<string, string> = {
  transporte: "🚇",
  alagamento: "🌧️",
  delito: "🚨",
  zeladoria: "🧹",
  outro: "📌",
};

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function iconeCategoria(categoria?: Pick<Categoria, "nome"> | null): string {
  return ICONES[normalizar(categoria?.nome ?? "outro")] ?? "📌";
}

export function nomeCategoria(categoria?: Pick<Categoria, "nome"> | null): string {
  const nome = categoria?.nome ?? "Outro";
  return nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
}

export function perguntaAcontecendoAgora(categoria?: Categoria | null): boolean {
  if (!categoria) return false;
  if (typeof categoria.perguntaEmAndamento === "boolean") return categoria.perguntaEmAndamento;
  return normalizar(categoria.nome) === "delito";
}

export function formatarData(iso?: string | null): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatarDataHora(iso?: string | null): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function diasEmAberto(aviso: Pick<Aviso, "diasEmAberto" | "dataRegistro">): number {
  if (typeof aviso.diasEmAberto === "number") return aviso.diasEmAberto;
  const inicio = new Date(aviso.dataRegistro).getTime();
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.floor((Date.now() - inicio) / 86_400_000));
}

export function textoDias(dias: number): string {
  if (dias === 0) return "aberto hoje";
  return dias === 1 ? "1 dia em aberto" : `${dias} dias em aberto`;
}
