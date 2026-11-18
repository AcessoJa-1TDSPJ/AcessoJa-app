import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { BarraEmergencia } from "./BarraEmergencia";
import { Cabecalho } from "./Cabecalho";
import { Rodape } from "./Rodape";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a href="#conteudo" className="sr-only z-50 rounded-lg bg-superficie px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2">
        Pular para o conteúdo
      </a>
      <BarraEmergencia />
      <Cabecalho />
      <main id="conteudo" className="flex-1">
        <div key={pathname} className="pagina">
          <Outlet />
        </div>
      </main>
      <Rodape />
    </div>
  );
}
