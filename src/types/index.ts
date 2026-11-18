export type StatusAviso = "NAO_RECEBIDA" | "RECEBIDA" | "RESOLVENDO" | "RESOLVIDA";

export type OrdemBoard = "recentes" | "confirmacoes";

export interface Orgao {
  id: number;
  nome: string;
  sigla?: string;
  esfera?: string;
  emailContato?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  orgaoResponsavel?: Orgao | null;
  diasExpiracao?: number | null;
  perguntaEmAndamento?: boolean;
}

export interface Aviso {
  id: number;
  descricao: string;
  endereco: string;
  bairro: string;
  status: StatusAviso;
  categoria: Categoria;
  fotoUrl?: string | null;
  dataRegistro: string;
  qtdConfirmacoes: number;
  confirmado: boolean;
  diasEmAberto?: number;
  validoAte?: string | null;
}

export interface MudancaStatus {
  id?: number;
  status: StatusAviso;
  dataHora: string;
  atualizadoPor?: string;
}

export interface DetalheAviso {
  aviso: Aviso;
  linhaDoTempo: MudancaStatus[];
  euConfirmei?: boolean;
  minimoParaConfirmar?: number;
}

export interface ResumoConfirmacoes {
  total: number;
  minimo: number;
  confirmado: boolean;
  euConfirmei?: boolean;
}

export interface Estatisticas {
  total: number;
  emAberto: number;
  resolvidos: number;
}

export interface OcorrenciaOficial {
  id: number;
  titulo: string;
  descricao: string;
  dataPublicacao?: string;
  orgao?: Orgao | null;
}

export interface ContatoEmergencia {
  numero: string;
  nome: string;
  descricao?: string;
}

export interface Pagina<T> {
  itens: T[];
  pagina: number;
  totalPaginas: number;
  totalItens: number;
}

export interface FiltrosAvisos {
  categoriaId?: number;
  status?: StatusAviso;
  bairro?: string;
  ordem?: OrdemBoard;
}

export interface NovoAvisoForm {
  categoriaId: string;
  descricao: string;
  endereco: string;
  bairro: string;
  foto: FileList;
  acontecendoAgora: "" | "sim" | "nao";
}

export interface NovaOcorrenciaForm {
  titulo: string;
  descricao: string;
}

export type PerfilUsuario = "CIDADAO" | "SERVIDOR" | "MODERADOR";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  orgao?: Orgao | null;
}

export interface Sessao {
  usuario: Usuario;
  token?: string;
}

export interface LoginForm {
  email: string;
  senha: string;
}

export type CadastroForm = LoginForm & {
  nome: string;
  confirmarSenha: string;
};

export interface ContatoForm {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export interface Integrante {
  id: string;
  nome: string;
  rm: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
  bio: string;
}

export interface PerguntaFaq {
  pergunta: string;
  resposta: string;
}

export interface ItemNavegacao {
  rotulo: string;
  caminho: string;
}

export type EstadoRequisicao<T> =
  | { tipo: "carregando" }
  | { tipo: "erro"; mensagem: string }
  | { tipo: "sucesso"; dados: T };

export type Feedback = { tipo: "sucesso" | "erro"; mensagem: string } & { detalhe?: string };
