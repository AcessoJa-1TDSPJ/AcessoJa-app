import type { CadastroForm, LoginForm, PerfilUsuario, Sessao, Usuario } from "../types";
import { requisicao } from "./api";
import { lerSessao } from "./sessao";

function paraSessao(dados: unknown): Sessao {
  const d = (dados ?? {}) as Record<string, unknown>;
  const u = (d.usuario ?? d.user ?? d) as Record<string, unknown>;
  const orgao = u.orgao as Usuario["orgao"];
  const usuario: Usuario = {
    id: Number(u.id ?? u.idUsuario ?? u.cdUsuario),
    nome: String(u.nome ?? u.name ?? ""),
    email: String(u.email ?? ""),
    perfil: (String(u.perfil ?? "CIDADAO").toUpperCase() as PerfilUsuario) || "CIDADAO",
    orgao: orgao ?? null,
  };
  if (!Number.isInteger(usuario.id) || usuario.id <= 0) {
    throw new Error("A API não devolveu o id do usuário. Tente entrar novamente.");
  }
  return { usuario, token: typeof d.token === "string" ? d.token : undefined };
}

export async function entrar(dados: LoginForm): Promise<Sessao> {
  const resposta = await requisicao<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: dados.email.trim().toLowerCase(), senha: dados.senha }),
  });
  return paraSessao(resposta);
}

export async function cadastrar(dados: CadastroForm): Promise<Sessao> {
  const resposta = await requisicao<unknown>("/auth/cadastro", {
    method: "POST",
    body: JSON.stringify({
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senha: dados.senha,
      confirmarSenha: dados.confirmarSenha,
    }),
  });
  return paraSessao(resposta);
}

export async function sair(): Promise<void> {
  if (!lerSessao()) return;
  await requisicao<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
}
