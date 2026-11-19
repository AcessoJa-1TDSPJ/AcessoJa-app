import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { Botao } from "../components/Botao";
import { CampoFormulario, ariaCampo } from "../components/CampoFormulario";
import { CampoSenha } from "../components/CampoSenha";
import { Aviso as Mensagem } from "../components/EstadoTela";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { ErroApi, mensagemDe } from "../services/api";
import { useVoltarPara } from "../hooks/useVoltarPara";
import type { CadastroForm } from "../types";
import { REGEX_EMAIL } from "../utils/formatar";

const MIN_SENHA = 8;

export default function Cadastro() {
  useDocumentTitle("Criar conta");
  const { cadastrar, logado } = useAuth();
  const navegar = useNavigate();
  const voltarPara = useVoltarPara();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CadastroForm>({ mode: "onTouched" });

  if (logado && !isSubmitting) return <Navigate to={voltarPara} replace />;

  async function enviar(dados: CadastroForm) {
    setErroApi(null);
    try {
      await cadastrar(dados);
      navegar(voltarPara, { replace: true });
    } catch (erro) {
      setErroApi(erro instanceof ErroApi && erro.status === 409 ? "Este e-mail já tem conta. Use Entrar." : mensagemDe(erro));
    }
  }

  return (
    <section className="container-app pt-10 pb-20">
      <div className="cartao mx-auto max-w-[440px] p-6 md:p-8">
        <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]">Criar conta</h1>
        <p className="mt-1 text-suave">Leva menos de um minuto.</p>

        <form onSubmit={handleSubmit(enviar)} noValidate className="mt-6 space-y-4">
          {erroApi && <Mensagem tipo="erro">{erroApi}</Mensagem>}

          <CampoFormulario id="nome" rotulo="Nome" erro={errors.nome?.message}>
            <input
              autoComplete="name"
              {...ariaCampo("nome", errors.nome?.message)}
              className={`campo ${errors.nome ? "campo-erro" : ""}`}
              {...register("nome", {
                required: "Digite seu nome.",
                validate: (v) => v.trim().length >= 2 || "Digite seu nome.",
                maxLength: { value: 100, message: "No máximo 100 caracteres." },
              })}
            />
          </CampoFormulario>

          <CampoFormulario id="email" rotulo="E-mail" erro={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              {...ariaCampo("email", errors.email?.message)}
              className={`campo ${errors.email ? "campo-erro" : ""}`}
              {...register("email", {
                required: "Digite seu e-mail.",
                pattern: { value: REGEX_EMAIL, message: "Digite um e-mail válido." },
              })}
            />
          </CampoFormulario>

          <CampoFormulario id="senha" rotulo="Senha" erro={errors.senha?.message} dica={`Pelo menos ${MIN_SENHA} caracteres.`}>
            <CampoSenha
              autoComplete="new-password"
              {...ariaCampo("senha", errors.senha?.message, `Pelo menos ${MIN_SENHA} caracteres.`)}
              erro={!!errors.senha}
              {...register("senha", {
                required: "Crie uma senha.",
                minLength: { value: MIN_SENHA, message: `A senha precisa ter pelo menos ${MIN_SENHA} caracteres.` },
              })}
            />
          </CampoFormulario>

          <CampoFormulario id="confirmarSenha" rotulo="Repetir senha" erro={errors.confirmarSenha?.message}>
            <CampoSenha
              autoComplete="new-password"
              {...ariaCampo("confirmarSenha", errors.confirmarSenha?.message)}
              erro={!!errors.confirmarSenha}
              {...register("confirmarSenha", {
                required: "Repita a senha.",
                validate: (v) => v === getValues("senha") || "As senhas não são iguais.",
              })}
            />
          </CampoFormulario>

          <p className="text-xs text-suave">A conta é criada como cidadão. Contas de órgão público são liberadas pela moderação.</p>

          <Botao type="submit" carregando={isSubmitting} className="w-full">
            {isSubmitting ? "Criando conta…" : "Criar conta"}
          </Botao>
        </form>

        <p className="mt-5 text-center text-suave">
          Já tem conta?{" "}
          <Link to="/entrar" state={{ voltarPara }} className="font-semibold text-laranja-forte hover:underline">Entrar</Link>
        </p>
      </div>
    </section>
  );
}
