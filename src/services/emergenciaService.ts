import type { ContatoEmergencia } from "../types";
import { requisicao } from "./api";

export const CONTATOS_PADRAO: ContatoEmergencia[] = [
  { numero: "190", nome: "Polícia" },
  { numero: "193", nome: "Bombeiros" },
  { numero: "192", nome: "SAMU" },
];

export async function listarContatosEmergencia(): Promise<ContatoEmergencia[]> {
  try {
    const contatos = await requisicao<ContatoEmergencia[]>("/emergencia/contatos");
    return Array.isArray(contatos) && contatos.length ? contatos : CONTATOS_PADRAO;
  } catch {
    return CONTATOS_PADRAO;
  }
}
