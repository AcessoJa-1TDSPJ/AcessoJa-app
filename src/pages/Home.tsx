import { Link } from "react-router";
import { BotaoLink } from "../components/Botao";
import { CartaoAviso } from "../components/CartaoAviso";
import { Carregando, ErroTela, Vazio } from "../components/EstadoTela";
import { Icone, type NomeIcone } from "../components/Icone";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { listarAvisos } from "../services/avisoService";
import { Numeros } from "../components/Numeros";

const atalhos: { icone: NomeIcone; titulo: string; texto: string; para: string }[] = [
  { icone: "lista", titulo: "Ocorrências", texto: "Veja o que está acontecendo agora.", para: "/avisos" },
  { icone: "megafone", titulo: "Comunicados", texto: "Avisos oficiais dos órgãos públicos.", para: "/ocorrencias" },
  { icone: "mais", titulo: "Novo aviso", texto: "Conte o que viu, com uma foto.", para: "/avisos/novo" },
];

function MaisConfirmados() {
  const { estado, recarregar } = useRequisicao(() => listarAvisos({ ordem: "confirmacoes" }));
  if (estado.tipo === "carregando") return <Carregando />;
  if (estado.tipo === "erro") return <ErroTela mensagem={estado.mensagem} aoTentar={recarregar} />;
  const avisos = estado.dados.itens.slice(0, 4);
  if (!avisos.length) {
    return (
      <Vazio titulo="Nenhum aviso no board ainda">
        <p>Seja a primeira pessoa a avisar sobre um problema do seu bairro.</p>
        <BotaoLink para="/avisos/novo" className="mt-4">Fazer o primeiro aviso</BotaoLink>
      </Vazio>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {avisos.map((a) => <CartaoAviso key={a.id} aviso={a} />)}
    </div>
  );
}

export default function Home() {
  useDocumentTitle("Início");

  return (
    <div className="container-app pb-20">
      <section className="grid items-center gap-10 pt-10 pb-6 md:grid-cols-[1fr_auto] md:pt-[72px]">
        <div>
          <h1 className="mb-5 text-[clamp(40px,6.4vw,76px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
            Viu algo errado na cidade? Avise já.
          </h1>
          <p className="mb-7 max-w-[44ch] text-[19px] text-suave">
            Um quadro de avisos feito por cidadãos, com prova, e atualizado pelos órgãos responsáveis.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <BotaoLink para="/avisos">Ver ocorrências</BotaoLink>
            <BotaoLink para="/como-funciona" variante="secundario">Como funciona</BotaoLink>
          </div>
        </div>
        <div
          className="-order-1 grid aspect-square w-[150px] -rotate-4 place-items-center rounded-[28%] bg-laranja text-[66px] font-extrabold tracking-[-0.05em] text-white transition-transform duration-500 ease-mola hover:scale-105 hover:rotate-3 md:order-none md:w-[230px] md:text-[104px]"
          aria-hidden="true"
        >
          <span>
            j<b className="marca-ja font-extrabold before:!bg-tinta">a</b>
          </span>
        </div>
      </section>

      <nav aria-label="Atalhos" className="mt-6 grid gap-4 md:grid-cols-3">
        {atalhos.map((a) => (
          <Link key={a.para} to={a.para} className="group cartao cartao-hover block p-6">
            <span className="mb-14 grid size-10 place-items-center rounded-xl bg-laranja/15 text-laranja-forte transition-colors group-hover:bg-laranja group-hover:text-white">
              <Icone nome={a.icone} />
            </span>
            <h2 className="text-xl font-semibold tracking-[-0.02em]">{a.titulo}</h2>
            <p className="text-suave">{a.texto}</p>
          </Link>
        ))}
      </nav>

      <Numeros />

      <section className="mt-16" aria-labelledby="destaques">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="destaques" className="text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]">Mais confirmados</h2>
            <p className="text-suave">Avisos reais, direto da API do Acesso Já.</p>
          </div>
          <BotaoLink para="/avisos" variante="secundario" tamanho="sm">
            Ver todos <Icone nome="seta" tamanho={16} />
          </BotaoLink>
        </div>
        <MaisConfirmados />
      </section>
    </div>
  );
}
