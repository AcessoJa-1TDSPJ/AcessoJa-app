import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { BotaoLink } from "./Botao";
import { Icone } from "./Icone";

const ROTULO_PERFIL = { CIDADAO: "Cidadão", SERVIDOR: "Órgão público", MODERADOR: "Moderador" } as const;

export function MenuUsuario() {
  const { usuario, sair } = useAuth();
  const navegar = useNavigate();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => caixa.current && !caixa.current.contains(e.target as Node) && setAberto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  if (!usuario) {
    return (
      <div className="flex items-center gap-2">
        <BotaoLink para="/entrar" variante="secundario" tamanho="sm" className="min-h-[42px]">Entrar</BotaoLink>
        <div className="hidden sm:block">
          <BotaoLink para="/cadastro" tamanho="sm" className="min-h-[42px]">Criar conta</BotaoLink>
        </div>
      </div>
    );
  }

  async function encerrar() {
    setAberto(false);
    await sair();
    navegar("/");
  }

  const inicial = (usuario.nome.trim()[0] ?? "?").toUpperCase();

  return (
    <div className="relative" ref={caixa}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="menu"
        aria-label={`Conta de ${usuario.nome}`}
        className="grid size-[42px] place-items-center rounded-full bg-tinta text-base font-semibold text-fundo transition-transform hover:-translate-y-0.5"
      >
        {inicial}
      </button>

      {aberto && (
        <div role="menu" className="cartao absolute top-[calc(100%+8px)] right-0 z-50 w-[min(280px,calc(100vw-32px))] p-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)]">
          <div className="px-3 py-2">
            <p className="font-semibold break-words">{usuario.nome}</p>
            <p className="text-sm break-words text-suave">{usuario.email}</p>
            <p className="mt-1 text-sm text-laranja-forte">
              {ROTULO_PERFIL[usuario.perfil] ?? usuario.perfil}
              {usuario.orgao && ` · ${usuario.orgao.sigla ?? usuario.orgao.nome}`}
            </p>
          </div>
          <div className="my-1 h-px bg-linha" />
          <Link role="menuitem" to="/avisos/novo" onClick={() => setAberto(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-tinta/7">
            <Icone nome="mais" tamanho={18} /> Novo aviso
          </Link>
          {usuario.perfil === "SERVIDOR" && (
            <Link role="menuitem" to="/orgao" onClick={() => setAberto(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-tinta/7">
              <Icone nome="predio" tamanho={18} /> Painel do órgão
            </Link>
          )}
          <button role="menuitem" type="button" onClick={encerrar} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-perigo hover:bg-perigo/10">
            <Icone nome="seta" tamanho={18} /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
