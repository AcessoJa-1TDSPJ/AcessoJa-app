import type { ItemNavegacao } from "../types";

export const menuPrincipal: ItemNavegacao[] = [
  { rotulo: "Início", caminho: "/" },
  { rotulo: "Como funciona", caminho: "/como-funciona" },
  { rotulo: "Ocorrências", caminho: "/avisos" },
  { rotulo: "Comunicados", caminho: "/ocorrencias" },
];

export const menuCompleto: ItemNavegacao[] = [
  ...menuPrincipal,
  { rotulo: "Novo aviso", caminho: "/avisos/novo" },
  { rotulo: "Painel do órgão", caminho: "/orgao" },
  { rotulo: "Sobre", caminho: "/sobre" },
  { rotulo: "Integrantes", caminho: "/integrantes" },
  { rotulo: "FAQ", caminho: "/faq" },
  { rotulo: "Contato", caminho: "/contato" },
];

export const LINKS_PROJETO = {
  github: "https://github.com/AcessoJa-1TDSPJ/AcessoJa-app",
  youtube: "https://youtu.be/vq6LTrvuNKI",
  api: "https://acesso-ja-api.onrender.com/api/v1",
};
