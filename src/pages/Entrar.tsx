import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { Botao } from "../components/Botao";
import { CampoFormulario, ariaCampo } from "../components/CampoFormulario";
import { CampoSenha } from "../components/CampoSenha";
import { Aviso as Mensagem } from "../components/EstadoTela";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useVoltarPara } from "../hooks/useVoltarPara";
import { ErroApi, mensagemDe } from "../services/api";
import type { LoginForm } from "../types";
import { REGEX_EMAIL } from "../utils/formatar";

export default function Entrar() {
  useDocumentTitle("Entrar");
  const { entrar, logado } = useAuth();
  const navegar = useNavigate();
  const voltarPara = useVoltarPara();
  const [erroApi, setErroApi] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ mode: "onTouched" });

  if (logado && !isSubmitting) return <Navigate to={voltarPara} replace />;

  async function enviar(dados: LoginForm) {
    setErroApi(null);
    try {
      await entrar(dados);
      navegar(voltarPara, { replace: true });
    } catch (erro) {
      setErroApi(erro instanceof ErroApi && erro.status === 401 ? "E-mail ou senha incorretos." : mensagemDe(erro));
    }
  }

  return (
    <section className="container-app pt-10 pb-20">
      <div className="cartao mx-auto max-w-[440px] p-6 md:p-8">
        <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]">Entrar</h1>
        <p className="mt-1 text-suave">Bom te ver de novo.</p>

        <form onSubmit={handleSubmit(enviar)} noValidate className="mt-6 space-y-4">
          {erroApi && <Mensagem tipo="erro">{erroApi}</Mensagem>}

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

          <CampoFormulario id="senha" rotulo="Senha" erro={errors.senha?.message}>
            <CampoSenha
              autoComplete="current-password"
              {...ariaCampo("senha", errors.senha?.message)}
              erro={!!errors.senha}
              {...register("senha", { required: "Digite sua senha." })}
            />
          </CampoFormulario>

          <Botao type="submit" carregando={isSubmitting} className="w-full">
            {isSubmitting ? "Entrando…" : "Entrar"}
          </Botao>
        </form>

        <p className="mt-5 text-center text-suave">
          Novo por aqui?{" "}
          <Link to="/cadastro" state={{ voltarPara }} className="font-semibold text-laranja-forte hover:underline">Criar conta</Link>
        </p>
      </div>
    </section>
  );
}
