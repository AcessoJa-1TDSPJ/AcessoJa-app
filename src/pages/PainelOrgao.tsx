import { useState } from "react";
import { Botao } from "../components/Botao";
import { CartaoAviso } from "../components/CartaoAviso";
import { Aviso as Mensagem, Carregando, ErroTela, Vazio } from "../components/EstadoTela";
import { TopoPagina } from "../components/TopoPagina";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { ErroApi, mensagemDe } from "../services/api";
import { atualizarStatus, listarAvisos } from "../services/avisoService";
import type { Aviso, Feedback, StatusAviso } from "../types";
import { ORDEM_STATUS, ROTULO_STATUS, proximoStatus } from "../utils/formatar";

export default function PainelOrgao() {
  useDocumentTitle("Painel do órgão");
  const { ehServidor } = useAuth();
  const [filtro, setFiltro] = useState<StatusAviso | "">("");
  const { estado, setEstado, recarregar } = useRequisicao(() => listarAvisos({ status: filtro || undefined, ordem: "confirmacoes" }), [filtro]);
  const [salvando, setSalvando] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<(Feedback & { id: number }) | null>(null);

  async function avancar(aviso: Aviso) {
    const novo = proximoStatus(aviso.status);
    if (!novo) return;
    setSalvando(aviso.id);
    setFeedback(null);
    try {
      const atualizado = await atualizarStatus(aviso.id, novo);
      if (estado.tipo === "sucesso") {
        setEstado({
          tipo: "sucesso",
          dados: { ...estado.dados, itens: estado.dados.itens.map((a) => (a.id === aviso.id ? { ...a, status: atualizado?.aviso?.status ?? novo } : a)) },
        });
      }
      setFeedback({ id: aviso.id, tipo: "sucesso", mensagem: `Status atualizado: ${ROTULO_STATUS[novo]}.` });
    } catch (erro) {
      const status = erro instanceof ErroApi ? erro.status : 0;
      const mensagem =
        status === 422 ? `Não dá para pular etapas. A próxima é “${ROTULO_STATUS[novo]}”.`
        : status === 403 ? "Este perfil não é do órgão responsável por esta categoria."
        : mensagemDe(erro);
      setFeedback({ id: aviso.id, tipo: "erro", mensagem });
    } finally {
      setSalvando(null);
    }
  }

  const chip = (ativo: boolean) => `chip ${ativo ? "chip-ativo" : ""}`;

  return (
    <>
      <TopoPagina rotulo="Área do órgão" titulo="Painel do órgão" descricao="Avance o andamento dos avisos, uma etapa por vez: Não recebida → Recebida → Resolvendo → Resolvida." />
      <section className="container-app pb-20">
        {!ehServidor && (
          <p className="mb-5 rounded-xl border-[1.5px] border-laranja/50 bg-laranja/10 px-4 py-3 text-sm font-medium">
            Sua conta é de cidadão: você pode acompanhar os avisos, mas só servidores de órgão atualizam o status.
          </p>
        )}

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
          <button type="button" className={chip(filtro === "")} aria-pressed={filtro === ""} onClick={() => setFiltro("")}>Todos</button>
          {ORDEM_STATUS.map((s) => (
            <button key={s} type="button" className={chip(filtro === s)} aria-pressed={filtro === s} onClick={() => setFiltro(s)}>{ROTULO_STATUS[s]}</button>
          ))}
        </div>

        {estado.tipo === "carregando" && <Carregando texto="Carregando avisos…" />}
        {estado.tipo === "erro" && <ErroTela mensagem={estado.mensagem} aoTentar={recarregar} />}
        {estado.tipo === "sucesso" &&
          (estado.dados.itens.length === 0 ? (
            <Vazio titulo="Nenhum aviso neste status" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {estado.dados.itens.map((aviso) => {
                const proximo = proximoStatus(aviso.status);
                return (
                  <div key={aviso.id} className="flex flex-col gap-2">
                    <CartaoAviso
                      aviso={aviso}
                      acoes={
                        proximo && ehServidor && (
                          <Botao tamanho="sm" carregando={salvando === aviso.id} disabled={salvando !== null} onClick={() => avancar(aviso)}>
                            Marcar “{ROTULO_STATUS[proximo]}”
                          </Botao>
                        )
                      }
                    />
                    {feedback?.id === aviso.id && <Mensagem tipo={feedback.tipo}>{feedback.mensagem}</Mensagem>}
                  </div>
                );
              })}
            </div>
          ))}
      </section>
    </>
  );
}
