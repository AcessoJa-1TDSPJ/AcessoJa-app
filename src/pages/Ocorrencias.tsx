import { useState } from "react";
import { useForm } from "react-hook-form";
import { Botao } from "../components/Botao";
import { CampoFormulario, ariaCampo } from "../components/CampoFormulario";
import { Aviso as Mensagem, Carregando, ErroTela, Vazio } from "../components/EstadoTela";
import { BotaoLink } from "../components/Botao";
import { TopoPagina } from "../components/TopoPagina";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { mensagemDe } from "../services/api";
import { listarOcorrencias, publicarOcorrencia } from "../services/ocorrenciaService";
import type { Feedback, NovaOcorrenciaForm } from "../types";
import { haQuantoTempo } from "../utils/formatar";

export default function Ocorrencias() {
  useDocumentTitle("Comunicados oficiais");
  const { estado, recarregar } = useRequisicao(() => listarOcorrencias());
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { logado, ehServidor } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NovaOcorrenciaForm>({ mode: "onTouched" });

  async function publicar(dados: NovaOcorrenciaForm) {
    setFeedback(null);
    try {
      await publicarOcorrencia({ titulo: dados.titulo.trim(), descricao: dados.descricao.trim() });
      setFeedback({ tipo: "sucesso", mensagem: "Comunicado publicado e já visível para os cidadãos." });
      reset();
      recarregar();
    } catch (erro) {
      setFeedback({ tipo: "erro", mensagem: mensagemDe(erro) });
    }
  }

  return (
    <>
      <TopoPagina titulo="Comunicados oficiais" descricao="Avisos publicados diretamente pelos órgãos: interdições, obras e alertas da Defesa Civil." />
      <section className="container-app grid gap-6 pb-20 lg:grid-cols-[3fr_2fr] lg:items-start">
        <div>
          {estado.tipo === "carregando" && <Carregando texto="Buscando comunicados…" />}
          {estado.tipo === "erro" && <ErroTela mensagem={estado.mensagem} aoTentar={recarregar} />}
          {estado.tipo === "sucesso" &&
            (estado.dados.itens.length === 0 ? (
              <Vazio titulo="Nenhum comunicado ainda">Quando um órgão publicar uma ocorrência oficial, ela aparece aqui.</Vazio>
            ) : (
              <ul className="space-y-4">
                {estado.dados.itens.map((o) => (
                  <li key={o.id} className="cartao cartao-hover flex flex-col gap-2 p-6">
                    <span className="text-sm text-suave">
                      <span className="font-semibold text-laranja-forte">Oficial</span> · {o.orgao?.sigla ?? o.orgao?.nome ?? "Órgão público"}
                      {o.dataPublicacao && ` · ${haQuantoTempo(o.dataPublicacao)}`}
                    </span>
                    <h2 className="text-xl font-semibold tracking-[-0.02em] break-words">{o.titulo}</h2>
                    <p className="break-words text-suave">{o.descricao}</p>
                  </li>
                ))}
              </ul>
            ))}
        </div>

        {!ehServidor ? (
          <aside className="cartao space-y-3 p-6 lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold tracking-[-0.03em]">É de um órgão público?</h2>
            <p className="text-suave">Só servidores de órgão publicam comunicados oficiais. Contas de órgão são liberadas pela moderação.</p>
            {!logado && <BotaoLink para="/entrar" variante="secundario">Entrar</BotaoLink>}
          </aside>
        ) : (
        <form onSubmit={handleSubmit(publicar)} noValidate className="cartao space-y-4 p-6 lg:sticky lg:top-24">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.03em]">Publicar comunicado</h2>
            <p className="text-sm text-suave">Publicado em nome do seu órgão.</p>
          </div>
          {feedback && <Mensagem tipo={feedback.tipo}>{feedback.mensagem}</Mensagem>}
          <CampoFormulario id="titulo" rotulo="Título" erro={errors.titulo?.message} obrigatorio>
            <input
              maxLength={100}
              placeholder="Ex.: Interdição na Rua Augusta"
              {...ariaCampo("titulo", errors.titulo?.message)}
              className={`campo ${errors.titulo ? "campo-erro" : ""}`}
              {...register("titulo", {
                required: "Informe o título.",
                minLength: { value: 5, message: "Use pelo menos 5 caracteres." },
                maxLength: { value: 100, message: "No máximo 100 caracteres." },
              })}
            />
          </CampoFormulario>
          <CampoFormulario id="descricao-oc" rotulo="Descrição" erro={errors.descricao?.message} dica="Até 300 caracteres." obrigatorio>
            <textarea
              rows={4}
              maxLength={300}
              {...ariaCampo("descricao-oc", errors.descricao?.message, "Até 300 caracteres.")}
              className={`campo resize-y ${errors.descricao ? "campo-erro" : ""}`}
              {...register("descricao", {
                required: "Descreva o comunicado.",
                minLength: { value: 10, message: "Use pelo menos 10 caracteres." },
                maxLength: { value: 300, message: "No máximo 300 caracteres." },
              })}
            />
          </CampoFormulario>
          <Botao type="submit" carregando={isSubmitting} className="w-full">
            {isSubmitting ? "Publicando…" : "Publicar"}
          </Botao>
        </form>
        )}
      </section>
    </>
  );
}
