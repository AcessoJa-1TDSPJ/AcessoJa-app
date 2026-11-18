import { useState } from "react";
import { Link, useParams } from "react-router";
import { BotaoConfirmar } from "../components/BotaoConfirmar";
import { Carregando, ErroTela } from "../components/EstadoTela";
import { Icone } from "../components/Icone";
import { SeloStatus, TrilhaStatus } from "../components/Selos";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { buscarAviso, urlFoto } from "../services/avisoService";
import { listarCategorias } from "../services/categoriaService";
import type { Aviso, Orgao, MudancaStatus } from "../types";
import { DESCRICAO_STATUS, ORDEM_STATUS, ROTULO_STATUS, diasEmAberto, formatarData, formatarDataHora, nomeCategoria, textoDias } from "../utils/formatar";

interface DadosDetalhe {
  aviso: Aviso;
  historico: MudancaStatus[];
  orgao?: Orgao | null;
  euConfirmei: boolean;
  minimo: number;
}

async function carregar(id: number): Promise<DadosDetalhe> {
  const [detalhe, categorias] = await Promise.all([buscarAviso(id), listarCategorias().catch(() => [])]);
  const categoria = categorias.find((c) => c.id === detalhe.aviso.categoria?.id);
  return {
    aviso: detalhe.aviso,
    historico: detalhe.linhaDoTempo ?? [],
    orgao: categoria?.orgaoResponsavel,
    euConfirmei: detalhe.euConfirmei ?? false,
    minimo: detalhe.minimoParaConfirmar ?? 3,
  };
}

export default function AvisoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const idNumero = Number(id);
  const valido = Number.isInteger(idNumero) && idNumero > 0;
  const { estado, recarregar } = useRequisicao(
    () => (valido ? carregar(idNumero) : Promise.reject(new Error("O endereço do aviso é inválido."))),
    [idNumero],
  );
  const [fotoFalhou, setFotoFalhou] = useState(false);
  useDocumentTitle(estado.tipo === "sucesso" ? `Aviso #${estado.dados.aviso.id}` : "Aviso");

  const voltar = (
    <Link to="/avisos" className="inline-flex items-center gap-1 font-semibold text-suave hover:text-tinta">
      <Icone nome="seta" tamanho={16} className="rotate-180" /> Ocorrências
    </Link>
  );

  if (estado.tipo === "carregando") return <div className="container-app py-12"><Carregando texto="Abrindo aviso…" /></div>;
  if (estado.tipo === "erro") {
    return (
      <div className="container-app space-y-6 py-12">
        {voltar}
        <ErroTela mensagem={estado.mensagem} aoTentar={valido ? recarregar : undefined} />
      </div>
    );
  }

  const { aviso, historico, orgao, euConfirmei, minimo } = estado.dados;
  const etapaAtual = ORDEM_STATUS.indexOf(aviso.status);
  const dataDaEtapa = (s: string) => historico.find((h) => h.status === s)?.dataHora;

  return (
    <section className="container-app pt-10 pb-20">
      {voltar}
      <div className="mt-6 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <article className="cartao flex flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="text-sm text-suave">{nomeCategoria(aviso.categoria)} · Aviso #{aviso.id}</span>
            <SeloStatus status={aviso.status} />
          </div>
          <h1 className="text-[clamp(28px,4vw,40px)] leading-[1.05] font-bold tracking-[-0.035em] break-words">{aviso.descricao}</h1>
          {!fotoFalhou && (
            <img src={urlFoto(aviso)} alt={`Prova do aviso: ${aviso.descricao}`} onError={() => setFotoFalhou(true)} className="max-h-96 w-full rounded-xl border border-linha object-cover" />
          )}
          <TrilhaStatus status={aviso.status} />
          <p className="text-suave">{DESCRICAO_STATUS[aviso.status]}</p>
          <dl className="grid gap-4 border-t border-linha pt-4 text-[15px] sm:grid-cols-2">
            <div><dt className="text-sm text-suave">Local</dt><dd className="font-medium break-words">{[aviso.endereco, aviso.bairro].filter(Boolean).join(", ") || "—"}</dd></div>
            <div><dt className="text-sm text-suave">Registrado em</dt><dd className="font-medium">{formatarData(aviso.dataRegistro)}</dd></div>
            <div><dt className="text-sm text-suave">Tempo</dt><dd className="font-medium">{aviso.status === "RESOLVIDA" ? "Resolvido" : textoDias(diasEmAberto(aviso))}</dd></div>
            {orgao && <div><dt className="text-sm text-suave">Órgão responsável</dt><dd className="font-medium">{orgao.sigla ?? orgao.nome}</dd></div>}
            {aviso.validoAte && <div><dt className="text-sm text-suave">Expira em</dt><dd className="font-medium">{formatarData(aviso.validoAte)}</dd></div>}
          </dl>
        </article>

        <aside className="flex flex-col gap-6">
          <div className="cartao space-y-3 p-6">
            <h2 className="text-xl font-semibold">Você também viu?</h2>
            <p className="text-suave">Com {minimo} confirmações de pessoas diferentes, o aviso ganha destaque para o órgão.</p>
            <BotaoConfirmar avisoId={aviso.id} total={aviso.qtdConfirmacoes ?? 0} jaConfirmei={euConfirmei} desabilitado={aviso.status === "RESOLVIDA"} />
          </div>

          <div className="cartao p-6">
            <h2 className="mb-4 text-xl font-semibold">Linha do tempo</h2>
            <ol>
              {ORDEM_STATUS.map((s, i) => {
                const feita = i <= etapaAtual;
                const data = i === 0 ? dataDaEtapa(s) ?? aviso.dataRegistro : dataDaEtapa(s);
                return (
                  <li key={s} className="relative flex gap-3 pb-6 last:pb-0">
                    {i < ORDEM_STATUS.length - 1 && (
                      <span className={`absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 ${i < etapaAtual ? "bg-laranja" : "bg-linha"}`} aria-hidden="true" />
                    )}
                    <span className={`relative grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${feita ? (aviso.status === "RESOLVIDA" ? "bg-verde text-white" : "bg-laranja text-white") : "border-[1.5px] border-linha text-suave"}`}>
                      {feita ? "✓" : i + 1}
                    </span>
                    <div>
                      <p className={feita ? "font-semibold" : "text-suave"}>
                        {ROTULO_STATUS[s]}
                        {i === etapaAtual && <span className="sr-only"> (etapa atual)</span>}
                      </p>
                      <p className="text-xs text-suave">{feita ? formatarDataHora(data) : "Aguardando"}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
