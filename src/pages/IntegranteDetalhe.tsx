import { Link, useParams } from "react-router";
import { BotaoLink, classesBotao } from "../components/Botao";
import { Vazio } from "../components/EstadoTela";
import { Icone } from "../components/Icone";
import { integrantes } from "../data/integrantes";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function IntegranteDetalhe() {
  const { id } = useParams<{ id: string }>();
  const integrante = integrantes.find((i) => i.id === id);
  useDocumentTitle(integrante?.nome ?? "Integrante não encontrado");

  if (!integrante) {
    return (
      <div className="container-app py-16">
        <Vazio titulo="Integrante não encontrado">
          <BotaoLink para="/integrantes" variante="secundario" className="mt-3">Ver a equipe</BotaoLink>
        </Vazio>
      </div>
    );
  }

  return (
    <section className="container-app pt-10 pb-20">
      <Link to="/integrantes" className="inline-flex items-center gap-1 font-semibold text-suave hover:text-tinta">
        <Icone nome="seta" tamanho={16} className="rotate-180" /> Equipe
      </Link>
      <article className="cartao mt-6 grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
        <img src={integrante.foto} alt={`Foto de ${integrante.nome}`} className="aspect-square w-44 -rotate-3 rounded-[28%] object-cover md:w-56" />
        <div className="space-y-4">
          <h1 className="text-[clamp(30px,4.5vw,48px)] leading-[1.02] font-bold tracking-[-0.04em] break-words">{integrante.nome}</h1>
          <dl className="flex flex-wrap gap-x-10 gap-y-2">
            <div><dt className="text-sm text-suave">RM</dt><dd className="text-lg font-semibold">{integrante.rm}</dd></div>
            <div><dt className="text-sm text-suave">Turma</dt><dd className="text-lg font-semibold">{integrante.turma}</dd></div>
          </dl>
          <p className="max-w-[56ch] text-lg text-suave">{integrante.bio}</p>
          <div className="flex flex-wrap gap-2.5">
            <a href={integrante.github} target="_blank" rel="noreferrer" className={classesBotao("primario")}>GitHub</a>
            <a href={integrante.linkedin} target="_blank" rel="noreferrer" className={classesBotao("secundario")}>LinkedIn</a>
          </div>
        </div>
      </article>
    </section>
  );
}
