import type { ReactNode } from "react";

interface CampoFormularioProps {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
  obrigatorio?: boolean;
  children: ReactNode;
}

export function CampoFormulario({ id, rotulo, erro, dica, obrigatorio, children }: CampoFormularioProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14.5px] font-semibold">
        {rotulo}
        {obrigatorio && <span className="text-laranja-forte" aria-hidden="true"> *</span>}
      </label>
      {children}
      {dica && !erro && <p id={`${id}-dica`} className="text-xs text-suave">{dica}</p>}
      {erro && (
        <p id={`${id}-erro`} role="alert" className="text-sm text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
}

export function ariaCampo(id: string, erro?: string, dica?: string) {
  return {
    id,
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": erro ? `${id}-erro` : dica ? `${id}-dica` : undefined,
  } as const;
}
