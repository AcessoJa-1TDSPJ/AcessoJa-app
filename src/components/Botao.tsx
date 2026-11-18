import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type Variante = "primario" | "secundario" | "ativo" | "fantasma";
type Tamanho = "md" | "sm" | "icone";

const variantes: Record<Variante, string> = {
  primario: "border-laranja bg-laranja text-white hover:border-laranja-forte hover:bg-laranja-forte dark:hover:text-fundo",
  secundario: "border-linha bg-superficie text-tinta hover:border-tinta",
  ativo: "border-laranja bg-laranja text-white",
  fantasma: "border-transparent bg-transparent text-tinta hover:bg-tinta/7",
};

const tamanhos: Record<Tamanho, string> = {
  md: "min-h-11 px-5 py-2.5",
  sm: "min-h-9 px-3.5 py-1.5 text-sm",
  icone: "size-[42px] p-0",
};

export function classesBotao(variante: Variante = "primario", tamanho: Tamanho = "md", extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] font-semibold transition-[translate,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_-10px_rgba(0,0,0,0.4)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-55 ${variantes[variante]} ${tamanhos[tamanho]} ${extra}`;
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanho?: Tamanho;
  carregando?: boolean;
  children: ReactNode;
}

export function Botao({ variante = "primario", tamanho = "md", carregando = false, children, className = "", disabled, type = "button", ...resto }: BotaoProps) {
  return (
    <button type={type} className={classesBotao(variante, tamanho, className)} disabled={disabled || carregando} aria-busy={carregando || undefined} {...resto}>
      {carregando && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />}
      {children}
    </button>
  );
}

interface BotaoLinkProps {
  para: string;
  variante?: Variante;
  tamanho?: Tamanho;
  children: ReactNode;
  className?: string;
}

export function BotaoLink({ para, variante = "primario", tamanho = "md", children, className = "" }: BotaoLinkProps) {
  return (
    <Link to={para} className={classesBotao(variante, tamanho, className)}>
      {children}
    </Link>
  );
}
