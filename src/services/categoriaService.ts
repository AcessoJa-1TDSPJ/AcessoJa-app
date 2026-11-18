import type { Categoria } from "../types";
import { requisicao } from "./api";

export function listarCategorias(): Promise<Categoria[]> {
  return requisicao<Categoria[]>("/categorias");
}
