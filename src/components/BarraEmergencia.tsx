import { useEffect, useState } from "react";
import type { ContatoEmergencia } from "../types";
import { CONTATOS_PADRAO, listarContatosEmergencia } from "../services/emergenciaService";
import { Icone } from "./Icone";

export function BarraEmergencia() {
  const [contatos, setContatos] = useState<ContatoEmergencia[]>(CONTATOS_PADRAO);

  useEffect(() => {
    listarContatosEmergencia().then(setContatos);
  }, []);

  return (
    <div className="bg-tinta text-fundo">
      <div className="container-app flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-[13px]">
        <span className="flex items-center gap-1.5 font-semibold">
          <Icone nome="telefone" tamanho={14} className="text-laranja" /> Emergência agora? Não use o board:
        </span>
        <ul className="flex flex-wrap items-center gap-x-3">
          {contatos.map((c) => (
            <li key={c.numero}>
              <a href={`tel:${c.numero}`} className="rounded px-1 underline-offset-2 hover:underline">
                <b>{c.numero}</b> <span className="opacity-75">{c.nome}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
