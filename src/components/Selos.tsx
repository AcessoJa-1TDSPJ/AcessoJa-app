import type { StatusAviso } from "../types";
import { COR_STATUS, ORDEM_STATUS, ROTULO_STATUS } from "../utils/formatar";

export function SeloStatus({ status }: { status: StatusAviso }) {
  return <span className={`pilula ${COR_STATUS[status] ?? COR_STATUS.NAO_RECEBIDA}`}>{ROTULO_STATUS[status] ?? status}</span>;
}

export function TrilhaStatus({ status }: { status: StatusAviso }) {
  const atual = ORDEM_STATUS.indexOf(status);
  const resolvido = status === "RESOLVIDA";
  return (
    <div className="grid grid-cols-4 gap-1.5" role="img" aria-label={`Etapa ${atual + 1} de 4: ${ROTULO_STATUS[status]}`}>
      {ORDEM_STATUS.map((s, i) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-colors duration-500 ${i <= atual ? (resolvido ? "bg-verde" : "bg-laranja") : "bg-linha"}`}
        />
      ))}
    </div>
  );
}
