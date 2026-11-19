import type { Pagina } from "../types";
import { lerSessao } from "./sessao";

export const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export class ErroApi extends Error {
  status: number;
  dados: unknown;
  constructor(mensagem: string, status: number, dados?: unknown) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
    this.dados = dados;
  }
}

const mensagens: Record<number, string> = {
  400: "Confira os dados informados e tente novamente.",
  401: "Entre na sua conta para continuar.",
  403: "Você não tem permissão para esta ação.",
  404: "O registro solicitado não foi encontrado.",
  409: "Esta operação entra em conflito com um registro existente.",
  413: "A foto é maior que 5 MB. Escolha uma imagem menor.",
  422: "Alguns dados não foram aceitos. Revise o formulário.",
  429: "Você atingiu o limite de 5 avisos por dia. Tente novamente amanhã.",
  500: "O servidor encontrou um problema. Tente novamente em instantes.",
  501: "Este recurso ainda não está disponível na API.",
};

const TEMPO_LEITURA_MS = 60000;
const TEMPO_ESCRITA_MS = 150000;

export async function requisicao<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const escrita = (opcoes.method ?? "GET").toUpperCase() !== "GET";
  const controller = new AbortController();
  const tempo = setTimeout(() => controller.abort(), escrita ? TEMPO_ESCRITA_MS : TEMPO_LEITURA_MS);
  const ehFormData = opcoes.body instanceof FormData;
  const sessao = lerSessao();
  const identificacao: Record<string, string> = sessao
    ? { "X-Usuario-Id": String(sessao.usuario.id), ...(sessao.token ? { Authorization: `Bearer ${sessao.token}` } : {}) }
    : {};

  try {
    const resposta = await fetch(API_URL + caminho, {
      ...opcoes,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(opcoes.body && !ehFormData ? { "Content-Type": "application/json" } : {}),
        ...identificacao,
        ...opcoes.headers,
      },
    });

    const texto = resposta.status === 204 ? "" : await resposta.text();
    let dados: unknown;
    try {
      dados = texto ? JSON.parse(texto) : undefined;
    } catch {
      if (resposta.ok) throw new ErroApi("O servidor retornou uma resposta inesperada.", resposta.status);
    }

    if (!resposta.ok) {
      if (resposta.status === 403 && /cors/i.test(texto)) {
        throw new ErroApi("A API recusou a origem deste site (CORS). Peça para liberar este endereço no CORS da API.", 403);
      }
      const erro = dados as { mensagem?: unknown; message?: unknown } | undefined;
      const detalhe = resposta.status < 500 ? erro?.mensagem ?? erro?.message : undefined;
      throw new ErroApi(
        typeof detalhe === "string" && detalhe.trim()
          ? detalhe
          : mensagens[resposta.status] ?? "Não foi possível concluir a operação.",
        resposta.status,
        dados,
      );
    }
    return dados as T;
  } catch (erro) {
    if (erro instanceof ErroApi) throw erro;
    if (escrita) {
      throw new Error("A API não confirmou a tempo, mas a operação pode ter sido registrada. Confira em Ocorrências antes de enviar de novo.");
    }
    if (erro instanceof Error && erro.name === "AbortError") {
      throw new Error("A API demorou para responder. Aguarde alguns instantes e tente novamente.");
    }
    throw new Error("Não foi possível conectar à API. Verifique sua conexão e tente novamente.");
  } finally {
    clearTimeout(tempo);
  }
}

export function query(parametros: Record<string, string | number | undefined>): string {
  const busca = new URLSearchParams();
  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== "") busca.set(chave, String(valor));
  });
  const texto = busca.toString();
  return texto ? `?${texto}` : "";
}

export function paraPagina<T>(dados: unknown): Pagina<T> {
  if (Array.isArray(dados)) {
    return { itens: dados as T[], pagina: 0, totalPaginas: 1, totalItens: dados.length };
  }
  const d = (dados ?? {}) as Record<string, unknown>;
  const itens = (d.itens ?? d.content ?? d.conteudo ?? []) as T[];
  return {
    itens,
    pagina: Number(d.pagina ?? d.number ?? 0),
    totalPaginas: Math.max(1, Number(d.totalPaginas ?? d.totalPages ?? 1)),
    totalItens: Number(d.totalItens ?? d.totalElements ?? itens.length),
  };
}

export function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : "Não foi possível concluir a operação.";
}
