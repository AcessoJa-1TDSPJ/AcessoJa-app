import type {
  Aviso, DetalheAviso, Estatisticas, FiltrosAvisos, MudancaStatus,
  Pagina, ResumoConfirmacoes, StatusAviso,
} from "../types";
import { API_URL, paraPagina, query, requisicao } from "./api";

export async function listarAvisos(filtros: FiltrosAvisos = {}): Promise<Pagina<Aviso>> {
  const dados = await requisicao<unknown>(`/avisos${query({ ...filtros })}`);
  return paraPagina<Aviso>(dados);
}

export function buscarAviso(id: number): Promise<DetalheAviso> {
  return requisicao<DetalheAviso>(`/avisos/${id}`);
}

export function buscarHistorico(id: number): Promise<MudancaStatus[]> {
  return requisicao<MudancaStatus[]>(`/avisos/${id}/historico`);
}

export function urlFoto(aviso: Pick<Aviso, "id" | "fotoUrl">): string {
  if (aviso.fotoUrl && /^https?:\/\//.test(aviso.fotoUrl)) return aviso.fotoUrl;
  return `${API_URL}/avisos/${aviso.id}/foto`;
}

export function buscarEstatisticas(): Promise<Estatisticas> {
  return requisicao<Estatisticas>("/avisos/estatisticas");
}

export function registrarAviso(dados: {
  categoriaId: number;
  descricao: string;
  endereco: string;
  bairro: string;
  foto: File;
  acontecendoAgora?: boolean;
}): Promise<Aviso> {
  const corpo = new FormData();
  corpo.append("categoriaId", String(dados.categoriaId));
  corpo.append("descricao", dados.descricao);
  corpo.append("endereco", dados.endereco);
  corpo.append("bairro", dados.bairro);
  corpo.append("foto", dados.foto);
  if (dados.acontecendoAgora !== undefined) {
    corpo.append("acontecendoAgora", String(dados.acontecendoAgora));
  }
  return requisicao<Aviso>("/avisos", { method: "POST", body: corpo });
}

export function buscarConfirmacoes(id: number): Promise<ResumoConfirmacoes> {
  return requisicao<ResumoConfirmacoes>(`/avisos/${id}/confirmacoes`);
}

export function confirmarAviso(id: number): Promise<ResumoConfirmacoes> {
  return requisicao<ResumoConfirmacoes>(`/avisos/${id}/confirmacoes`, { method: "POST" });
}

export function atualizarStatus(id: number, status: StatusAviso): Promise<DetalheAviso> {
  return requisicao<DetalheAviso>(`/avisos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
