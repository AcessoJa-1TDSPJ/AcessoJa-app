import type { ReactNode } from "react";

interface TopoPaginaProps {
  rotulo?: string;
  titulo: string;
  descricao?: string;
  children?: ReactNode;
}

export function TopoPagina({ rotulo, titulo, descricao, children }: TopoPaginaProps) {
  return (
    <section className="container-app flex flex-col gap-5 pt-12 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {rotulo && <p className="mb-2 text-sm font-semibold text-laranja-forte">{rotulo}</p>}
        <h1 className="text-[clamp(32px,5vw,48px)] leading-[1.05] font-bold tracking-[-0.035em] break-words">{titulo}</h1>
        {descricao && <p className="mt-3 max-w-[52ch] text-lg text-suave">{descricao}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </section>
  );
}
