import { useState } from "react";
import { useForm } from "react-hook-form";
import { Botao } from "../components/Botao";
import { CampoFormulario, ariaCampo } from "../components/CampoFormulario";
import { Aviso } from "../components/EstadoTela";
import { TopoPagina } from "../components/TopoPagina";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { ContatoForm } from "../types";

const assuntos = ["Dúvida sobre o board", "Quero o Acesso Já no meu órgão", "Problema técnico", "Outro"];

export default function Contato() {
  useDocumentTitle("Contato");
  const [enviado, setEnviado] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContatoForm>({ mode: "onTouched" });

  async function enviar(dados: ContatoForm) {
    await new Promise((r) => setTimeout(r, 600));
    setEnviado(`Obrigado, ${dados.nome.split(" ")[0]}! Recebemos sua mensagem e responderemos em ${dados.email}.`);
    reset();
  }

  return (
    <>
      <TopoPagina titulo="Fale com a equipe"descricao="Dúvidas, sugestões ou interesse em levar o Acesso Já para o seu órgão." />
      <section className="container-app grid gap-6 pb-20 lg:grid-cols-[1fr_2fr] lg:items-start">
        <aside className="space-y-4">
          <div className="cartao space-y-1 p-6">
            <h2 className="text-xl font-semibold">Atendimento</h2>
            <p className="text-suave">Segunda a sexta, das 8h às 18h (horário de Brasília).</p>
          </div>
          <div className="cartao space-y-1 border-perigo/40 p-6">
            <h2 className="text-xl font-semibold text-perigo">Emergência?</h2>
            <p className="text-suave">Este formulário não atende emergências. Ligue 190 (polícia), 193 (bombeiros) ou 192 (SAMU).</p>
          </div>
        </aside>

        <form onSubmit={handleSubmit(enviar)} noValidate className="cartao space-y-5 p-6 md:p-8">
          {enviado && <Aviso tipo="sucesso">{enviado}</Aviso>}

          <div className="grid gap-5 sm:grid-cols-2">
            <CampoFormulario id="nome" rotulo="Nome completo" erro={errors.nome?.message} obrigatorio>
              <input
                {...ariaCampo("nome", errors.nome?.message)}
                className={`campo ${errors.nome ? "campo-erro" : ""}`}
                autoComplete="name"
                {...register("nome", {
                  required: "Informe seu nome.",
                  minLength: { value: 3, message: "O nome precisa de pelo menos 3 letras." },
                })}
              />
            </CampoFormulario>

            <CampoFormulario id="email" rotulo="E-mail" erro={errors.email?.message} obrigatorio>
              <input
                type="email"
                {...ariaCampo("email", errors.email?.message)}
                className={`campo ${errors.email ? "campo-erro" : ""}`}
                autoComplete="email"
                {...register("email", {
                  required: "Informe seu e-mail.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Digite um e-mail válido, como nome@email.com." },
                })}
              />
            </CampoFormulario>
          </div>

          <CampoFormulario id="assunto" rotulo="Assunto" erro={errors.assunto?.message} obrigatorio>
            <select {...ariaCampo("assunto", errors.assunto?.message)} className={`campo ${errors.assunto ? "campo-erro" : ""}`} defaultValue="" {...register("assunto", { required: "Escolha um assunto." })}>
              <option value="" disabled>Selecione…</option>
              {assuntos.map((a) => <option key={a}>{a}</option>)}
            </select>
          </CampoFormulario>

          <CampoFormulario id="mensagem" rotulo="Mensagem" erro={errors.mensagem?.message} dica="Entre 10 e 500 caracteres." obrigatorio>
            <textarea
              rows={5}
              {...ariaCampo("mensagem", errors.mensagem?.message, "Entre 10 e 500 caracteres.")}
              className={`campo resize-y ${errors.mensagem ? "campo-erro" : ""}`}
              {...register("mensagem", {
                required: "Escreva sua mensagem.",
                minLength: { value: 10, message: "A mensagem precisa de pelo menos 10 caracteres." },
                maxLength: { value: 500, message: "A mensagem pode ter no máximo 500 caracteres." },
              })}
            />
          </CampoFormulario>

          <Botao type="submit" carregando={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Enviando…" : "Enviar mensagem"}
          </Botao>
        </form>
      </section>
    </>
  );
}
