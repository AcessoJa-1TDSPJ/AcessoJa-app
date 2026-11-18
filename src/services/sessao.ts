import type { Sessao } from "../types";

const CHAVE = "aj_sessao";

export function lerSessao(): Sessao | null {
  try {
    const salva = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Sessao | null;
    if (salva && Number.isInteger(salva.usuario?.id) && salva.usuario.id > 0) return salva;
  } catch {
  }
  return null;
}

export function salvarSessao(sessao: Sessao) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(sessao));
  } catch {
  }
}

export function limparSessao() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
  }
}
