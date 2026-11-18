import { Link } from "react-router";
import { Icone } from "../components/Icone";
import { TopoPagina } from "../components/TopoPagina";
import { integrantes, TURMA } from "../data/integrantes";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Integrantes() {
  useDocumentTitle("Integrantes");

  return (
    <>
      <TopoPagina rotulo={`Equipe · ${TURMA}`} titulo="Quem faz o Acesso Já" descricao="Cinco estudantes de Análise e Desenvolvimento de Sistemas da FIAP." />
      <section className="container-app pb-20">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrantes.map((i) => (
            <li key={i.id}>
              <Link to={`/integrantes/${i.id}`} className="group cartao cartao-hover flex h-full flex-col items-start gap-3 p-6">
                <img src={i.foto} alt={`Foto de ${i.nome}`} className="size-20 rounded-2xl object-cover" />
                <div>
                  <h2 className="text-xl leading-tight font-semibold tracking-[-0.02em] break-words">{i.nome}</h2>
                  <p className="text-sm text-suave">RM {i.rm} · {i.turma}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 font-semibold text-suave group-hover:text-tinta">
                  Ver perfil <Icone nome="seta" tamanho={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
