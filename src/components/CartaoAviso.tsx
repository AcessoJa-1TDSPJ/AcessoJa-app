import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import type { Aviso } from "../types";
import { urlFoto } from "../services/avisoService";
import { diasEmAberto, haQuantoTempo, nomeCategoria, textoDias } from "../utils/formatar";
import { BotaoConfirmar } from "./BotaoConfirmar";
import { SeloStatus, TrilhaStatus } from "./Selos";

interface CartaoAvisoProps {
  aviso: Aviso;
  acoes?: ReactNode;
}

export function CartaoAviso({ aviso, acoes }: CartaoAvisoProps) {
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const resolvido = aviso.status === "RESOLVIDA";
  const local = [aviso.endereco, aviso.bairro].filter(Boolean).join(", ") || "Local não informado";
  const tempo = resolvido ? haQuantoTempo(aviso.dataRegistro) : textoDias(diasEmAberto(aviso));

  return (
    <article className="cartao cartao-hover flex flex-col gap-3 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-sm text-suave">{nomeCategoria(aviso.categoria)}</span>
          <h3 className="mt-0.5 text-xl leading-tight font-semibold tracking-[-0.02em] break-words">
            <Link to={`/avisos/${aviso.id}`} className="hover:text-laranja-forte">
              {aviso.descricao}
            </Link>
          </h3>
        </div>
        <SeloStatus status={aviso.status} />
      </div>

      {!fotoFalhou && (
        <img
          src={urlFoto(aviso)}
          alt={`Prova do aviso: ${aviso.descricao}`}
          loading="lazy"
          onError={() => setFotoFalhou(true)}
          className="h-40 w-full rounded-xl border border-linha object-cover"
        />
      )}

      <TrilhaStatus status={aviso.status} />

      <p className="text-sm text-suave">
        {local} · {tempo}
      </p>

      <div className="mt-auto flex flex-wrap items-start gap-2 pt-1">
        <BotaoConfirmar avisoId={aviso.id} total={aviso.qtdConfirmacoes ?? 0} desabilitado={resolvido} />
        {acoes}
      </div>
    </article>
  );
}
