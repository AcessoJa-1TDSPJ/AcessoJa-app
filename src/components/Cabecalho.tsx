import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useTema } from "../context/TemaContext";
import { menuCompleto, menuPrincipal } from "../data/navegacao";
import { BotaoLink, classesBotao } from "./Botao";
import { Icone } from "./Icone";
import { Marca } from "./Marca";
import { MenuUsuario } from "./MenuUsuario";
import { useAuth } from "../context/AuthContext";

function classeLink({ isActive }: { isActive: boolean }) {
  return `block rounded-full px-3.5 py-2 font-medium whitespace-nowrap transition-colors ${
    isActive ? "text-tinta shadow-[inset_0_0_0_1.5px_var(--tinta)]" : "text-suave hover:bg-tinta/7 hover:text-tinta"
  }`;
}

export function Cabecalho() {
  const { tema, alternarTema } = useTema();
  const { logado } = useAuth();
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setAberto(false);
  }, [pathname]);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto]);

  const escuro = tema === "dark";

  return (
    <header className="sticky top-0 z-40 bg-fundo/90 backdrop-blur-md">
      <div className="container-app flex h-[72px] items-center gap-3">
        <Marca />

        <nav aria-label="Menu principal" className="ml-auto hidden lg:block">
          <ul className="flex gap-0.5 text-[15px]">
            {menuPrincipal.map((item) => (
              <li key={item.caminho}>
                <NavLink to={item.caminho} end={item.caminho === "/"} className={classeLink}>
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <button
            type="button"
            onClick={alternarTema}
            className={classesBotao("secundario", "icone")}
            aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
            title={escuro ? "Modo claro" : "Modo escuro"}
          >
            <Icone nome={escuro ? "sol" : "lua"} />
          </button>
          {logado && (
            <div className="hidden md:block">
              <BotaoLink para="/avisos/novo" tamanho="sm" className="min-h-[42px]">
                <Icone nome="mais" tamanho={18} /> Novo aviso
              </BotaoLink>
            </div>
          )}
          <MenuUsuario />
          <button
            type="button"
            className={classesBotao("secundario", "icone")}
            aria-expanded={aberto}
            aria-controls="menu-mobile"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            <Icone nome={aberto ? "fechar" : "menu"} />
          </button>
        </div>
      </div>

      {aberto && (
        <nav id="menu-mobile" aria-label="Todas as páginas" className="border-t border-linha bg-fundo">
          <ul className="container-app grid gap-1 py-3 text-base sm:grid-cols-2 md:grid-cols-3">
            {menuCompleto.map((item) => (
              <li key={item.caminho}>
                <NavLink to={item.caminho} end className={(p) => `${classeLink(p)} py-3`}>
                  {item.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
