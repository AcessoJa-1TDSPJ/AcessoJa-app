import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { BotaoLink } from "../components/Botao";
import { CartaoAviso } from "../components/CartaoAviso";
import { Carregando, ErroTela, Vazio } from "../components/EstadoTela";
import { Icone } from "../components/Icone";
import { TopoPagina } from "../components/TopoPagina";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { listarAvisos } from "../services/avisoService";
import { listarCategorias } from "../services/categoriaService";
import type { Categoria, FiltrosAvisos, OrdemBoard, StatusAviso } from "../types";
import { ORDEM_STATUS, ROTULO_STATUS, nomeCategoria } from "../utils/formatar";

export default function Avisos() {
  useDocumentTitle("Ocorrências");
  const [params, setParams] = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [bairro, setBairro] = useState(params.get("bairro") ?? "");

  const filtros: FiltrosAvisos = {
    categoriaId: params.get("categoriaId") ? Number(params.get("categoriaId")) : undefined,
    status: (params.get("status") as StatusAviso) || undefined,
    bairro: params.get("bairro") || undefined,
    ordem: (params.get("ordem") as OrdemBoard) || "recentes",
  };

  const { estado, recarregar } = useRequisicao(() => listarAvisos(filtros), [params.toString()]);

  useEffect(() => {
    listarCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  function alterar(chave: string, valor: string) {
    const novos = new URLSearchParams(params);
    if (valor) novos.set(chave, valor);
    else novos.delete(chave);
    setParams(novos, { replace: true });
  }

  const chip = (ativo: boolean) => `chip ${ativo ? "chip-ativo" : ""}`;

  return (
    <>
      <TopoPagina titulo="Ocorrências" descricao="Problemas avisados pelos moradores, com confirmações e o andamento informado pelo órgão.">
        <BotaoLink para="/avisos/novo"><Icone nome="mais" /> Novo aviso</BotaoLink>
      </TopoPagina>

      <section className="container-app pb-20">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoria">
          <button type="button" className={chip(!filtros.categoriaId)} aria-pressed={!filtros.categoriaId} onClick={() => alterar("categoriaId", "")}>
            Todos
          </button>
          {categorias.map((c) => (
            <button key={c.id} type="button" className={chip(filtros.categoriaId === c.id)} aria-pressed={filtros.categoriaId === c.id} onClick={() => alterar("categoriaId", String(c.id))}>
              {nomeCategoria(c)}
            </button>
          ))}
        </div>

        <form
          role="search"
          className="mt-4 mb-6 flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            alterar("bairro", bairro.trim());
          }}
        >
          <select className="chip pr-8" aria-label="Filtrar por status" value={filtros.status ?? ""} onChange={(e) => alterar("status", e.target.value)}>
            <option value="">Qualquer status</option>
            {ORDEM_STATUS.map((s) => <option key={s} value={s}>{ROTULO_STATUS[s]}</option>)}
          </select>
          <select className="chip pr-8" aria-label="Ordenar" value={filtros.ordem} onChange={(e) => alterar("ordem", e.target.value)}>
            <option value="recentes">Mais recentes</option>
            <option value="confirmacoes">Mais confirmados</option>
          </select>
          <div className="flex min-w-0 flex-1 basis-56 items-center gap-2">
            <input className="chip min-w-0 flex-1" placeholder="Bairro (ex.: Mooca)" aria-label="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
            <button type="submit" className="chip chip-ativo">Buscar</button>
          </div>
        </form>

        {estado.tipo === "carregando" && <Carregando texto="Buscando ocorrências…" />}
        {estado.tipo === "erro" && <ErroTela mensagem={estado.mensagem} aoTentar={recarregar} />}
        {estado.tipo === "sucesso" &&
          (estado.dados.itens.length === 0 ? (
            <Vazio titulo="Nenhum aviso por aqui ainda">
              <p>Seja o primeiro a avisar ou tente outro filtro.</p>
              <BotaoLink para="/avisos/novo" className="mt-4">Fazer um aviso</BotaoLink>
            </Vazio>
          ) : (
            <>
              <p className="mb-3 text-sm text-suave" aria-live="polite">
                {estado.dados.itens.length} {estado.dados.itens.length === 1 ? "aviso" : "avisos"}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {estado.dados.itens.map((a) => <CartaoAviso key={a.id} aviso={a} />)}
              </div>
            </>
          ))}
      </section>
    </>
  );
}
