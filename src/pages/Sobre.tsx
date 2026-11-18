import { BotaoLink } from "../components/Botao";
import { TopoPagina } from "../components/TopoPagina";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const dores = [
  { titulo: "Denúncia sem retorno", texto: "O cidadão registra o problema e não sabe o que aconteceu depois." },
  { titulo: "Sem informação na hora", texto: "Quando uma rua alaga, ninguém sabe se o problema já foi comunicado." },
  { titulo: "Duplicidade", texto: "Sem confirmação, o órgão não distingue um relato isolado de um problema coletivo." },
  { titulo: "Prazos opacos", texto: "Ninguém vê há quanto tempo um caso está parado." },
];

const protecoes = [
  "A identidade de quem denuncia fica visível só para o órgão.",
  "Fotos não podem mostrar rostos; placas só aparecem para o órgão.",
  "Avisos de delito falam da rua e do período, nunca de pessoas, e expiram após 30 dias sem nova confirmação.",
  "Limite de 5 avisos por dia por pessoa e bloqueio de avisos repetidos.",
  "Crimes em andamento, incêndios e brigas ficam fora do board: o app orienta ligar 190, 193 ou 192.",
];

const ods = [
  { numero: "11", nome: "Cidades e comunidades sustentáveis", texto: "Participação dos moradores na gestão da cidade." },
  { numero: "10", nome: "Redução das desigualdades", texto: "Qualquer pessoa com celular pode ser ouvida." },
  { numero: "13", nome: "Ação contra a mudança do clima", texto: "Registro compartilhado de alagamentos e eventos extremos." },
];

const titulo2 = "text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]";

export default function Sobre() {
  useDocumentTitle("Sobre");

  return (
    <>
      <TopoPagina
        rotulo="Sobre o projeto"
        titulo="Transparência para o que a cidade denuncia"
        descricao="Um board público em que o cidadão denuncia com prova, os vizinhos confirmam e o órgão responde à vista de todos."
      />

      <section className="container-app grid gap-8 pb-14 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className={titulo2}>O problema</h2>
          <p className="text-lg text-suave">
            Quem mora em cidade grande convive com metrô com falha, ruas alagadas, delitos recorrentes e problemas de zeladoria. As pessoas denunciam, mas raramente sabem se o poder público recebeu, está resolvendo ou resolveu. Quem não vê resposta deixa de denunciar.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {dores.map((d) => (
            <li key={d.titulo} className="cartao p-5">
              <h3 className="text-lg font-semibold">{d.titulo}</h3>
              <p className="mt-1 text-suave">{d.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-app grid gap-8 pb-14 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className={titulo2}>A solução</h2>
          <p className="text-lg text-suave">
            O cidadão avisa em uma de cinco categorias (transporte, alagamento, delito, zeladoria e outro) com descrição, local e foto. Com 3 confirmações de pessoas diferentes, o aviso ganha destaque. O órgão atualiza o status em quatro etapas, sem pular nenhuma.
          </p>
          <p className="text-lg text-suave">Modelo B2B2C: o cidadão usa de graça e o órgão público contrata o painel de gestão por assinatura anual.</p>
        </div>
        <div className="cartao p-6">
          <h3 className="mb-3 text-xl font-semibold">Proteção e segurança</h3>
          <ul className="space-y-2.5">
            {protecoes.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-laranja" aria-hidden="true" />
                <span className="text-suave">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-app pb-20">
        <h2 className={`${titulo2} mb-6`}>Objetivos de Desenvolvimento Sustentável</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {ods.map((o) => (
            <li key={o.numero} className="cartao cartao-hover flex gap-4 p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-laranja text-lg font-extrabold text-white">{o.numero}</span>
              <div>
                <h3 className="font-semibold">{o.nome}</h3>
                <p className="text-sm text-suave">{o.texto}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-2.5">
          <BotaoLink para="/avisos">Ver ocorrências</BotaoLink>
          <BotaoLink para="/integrantes" variante="secundario">Conhecer a equipe</BotaoLink>
        </div>
      </section>
    </>
  );
}
