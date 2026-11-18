import { useCallback, useEffect, useState } from "react";
import type { EstadoRequisicao } from "../types";
import { mensagemDe } from "../services/api";

export function useRequisicao<T>(buscar: () => Promise<T>, dependencias: unknown[] = []) {
  const [estado, setEstado] = useState<EstadoRequisicao<T>>({ tipo: "carregando" });
  const [versao, setVersao] = useState(0);

  const executar = useCallback(buscar, dependencias);

  useEffect(() => {
    let ativo = true;
    setEstado({ tipo: "carregando" });
    executar()
      .then((dados) => ativo && setEstado({ tipo: "sucesso", dados }))
      .catch((erro: unknown) => ativo && setEstado({ tipo: "erro", mensagem: mensagemDe(erro) }));
    return () => {
      ativo = false;
    };
  }, [executar, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { estado, setEstado, recarregar };
}
