import type { ReactNode } from "react";
import { Botao } from "./Botao";

export function Carregando({ texto = "Carregando dados da API…" }: { texto?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-14 text-suave">
      <span className="size-9 animate-spin rounded-full border-4 border-linha border-t-laranja" aria-hidden="true" />
      <p className="text-sm">{texto}</p>
      <p className="max-w-xs text-center text-xs">A primeira chamada pode levar até 1 minuto enquanto a API acorda no Render.</p>
    </div>
  );
}

export function ErroTela({ mensagem, aoTentar }: { mensagem: string; aoTentar?: () => void }) {
  return (
    <div role="alert" className="cartao flex flex-col items-center gap-3 border-perigo/40 px-6 py-10 text-center">
      <p className="max-w-md font-medium text-perigo">{mensagem}</p>
      {aoTentar && (
        <Botao variante="secundario" tamanho="sm" onClick={aoTentar}>
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}

export function Vazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 px-5 py-12 text-center text-suave">
      <p className="text-lg font-semibold text-tinta">{titulo}</p>
      {children && <div className="max-w-md">{children}</div>}
    </div>
  );
}

export function Aviso({ tipo, children }: { tipo: "sucesso" | "erro"; children: ReactNode }) {
  const cor = tipo === "sucesso" ? "border-verde/50 bg-verde/10 text-verde" : "border-perigo/50 bg-perigo/10 text-perigo";
  return (
    <div role={tipo === "erro" ? "alert" : "status"} aria-live="polite" className={`rounded-xl border-[1.5px] px-4 py-3 text-sm font-medium ${cor}`}>
      {children}
    </div>
  );
}
