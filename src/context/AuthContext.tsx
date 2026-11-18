import { createContext, useContext, useState, type ReactNode } from "react";
import * as authService from "../services/authService";
import { lerSessao, limparSessao, salvarSessao } from "../services/sessao";
import type { CadastroForm, LoginForm, Usuario } from "../types";

interface AuthContextValor {
  usuario: Usuario | null;
  logado: boolean;
  ehServidor: boolean;
  entrar: (dados: LoginForm) => Promise<Usuario>;
  cadastrar: (dados: CadastroForm) => Promise<Usuario>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => lerSessao()?.usuario ?? null);

  async function entrar(dados: LoginForm) {
    const sessao = await authService.entrar(dados);
    salvarSessao(sessao);
    setUsuario(sessao.usuario);
    return sessao.usuario;
  }

  async function cadastrar(dados: CadastroForm) {
    const sessao = await authService.cadastrar(dados);
    salvarSessao(sessao);
    setUsuario(sessao.usuario);
    return sessao.usuario;
  }

  async function sair() {
    await authService.sair();
    limparSessao();
    setUsuario(null);
  }

  const valor: AuthContextValor = {
    usuario,
    logado: usuario !== null,
    ehServidor: usuario?.perfil === "SERVIDOR",
    entrar,
    cadastrar,
    sair,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return contexto;
}
