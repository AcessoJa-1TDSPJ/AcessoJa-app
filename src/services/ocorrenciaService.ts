import type { NovaOcorrenciaForm, OcorrenciaOficial, Pagina } from "../types";
import { paraPagina, query, requisicao } from "./api";

export async function listarOcorrencias(orgaoId?: number): Promise<Pagina<OcorrenciaOficial>> {
  const dados = await requisicao<unknown>(`/ocorrencias-oficiais${query({ orgaoId })}`);
  return paraPagina<OcorrenciaOficial>(dados);
}

export function publicarOcorrencia(dados: NovaOcorrenciaForm): Promise<OcorrenciaOficial> {
  return requisicao<OcorrenciaOficial>("/ocorrencias-oficiais", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
