import { Link } from "react-router";
import { LINKS_PROJETO, menuCompleto } from "../data/navegacao";
import { TURMA } from "../data/integrantes";
import { Marca } from "./Marca";

export function Rodape() {
  return (
    <footer className="mt-10 border-t border-linha">
      <div className="container-app grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Marca />
          <p className="max-w-xs text-suave">O cidadão avisa, o órgão responde, todo mundo acompanha.</p>
        </div>

        <nav aria-label="Mapa do site">
          <h2 className="mb-3 text-sm font-semibold text-suave">Navegação</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[15px]">
            {menuCompleto.map((item) => (
              <li key={item.caminho}>
                <Link to={item.caminho} className="hover:text-laranja-forte">{item.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2 text-[15px]">
          <h2 className="mb-3 text-sm font-semibold text-suave">Projeto</h2>
          <p>Global Solution 2026/2 · CitizenTech</p>
          <p className="text-suave">FIAP · {TURMA}</p>
          <p className="flex flex-wrap gap-4 pt-1 font-semibold">
            <a href={LINKS_PROJETO.github} target="_blank" rel="noreferrer" className="hover:text-laranja-forte">GitHub</a>
          </p>
        </div>
      </div>
      <p className="container-app pb-8 text-sm text-suave">© 2026 Acesso Já · Emergências: 190 · 193 · 192</p>
    </footer>
  );
}
