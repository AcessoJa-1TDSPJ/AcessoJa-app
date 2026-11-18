import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ErroApi, mensagemDe } from "../services/api";
import { confirmarAviso } from "../services/avisoService";
import type { ResumoConfirmacoes } from "../types";
import { Botao, classesBotao } from "./Botao";
import { Icone } from "./Icone";

interface BotaoConfirmarProps {
  avisoId: number;
  total: number;
  desabilitado?: boolean;
  jaConfirmei?: boolean;
  aoConfirmar?: (resumo: ResumoConfirmacoes) => void;
}

export function BotaoConfirmar({ avisoId, total, desabilitado, jaConfirmei = false, aoConfirmar }: BotaoConfirmarProps) {
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(jaConfirmei);
  const [contagem, setContagem] = useState(total);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const { logado } = useAuth();
  const local = useLocation();

  if (!logado) {
    return (
      <Link
        to="/entrar"
        state={{ voltarPara: local.pathname + local.search }}
        className={classesBotao("secundario", "sm", "self-start")}
        title="Entre para confirmar este aviso"
      >
        <Icone nome="olho" tamanho={16} /> Eu também vi · {total}
      </Link>
    );
  }

  async function confirmar() {
    setEnviando(true);
    setMensagem(null);
    try {
      const resumo = await confirmarAviso(avisoId);
      setConfirmado(true);
      setContagem(resumo?.total ?? contagem + 1);
      setMensagem({ tipo: "ok", texto: resumo?.confirmado ? "Confirmado! O aviso chegou a 3 confirmações." : "Confirmação registrada." });
      aoConfirmar?.(resumo);
    } catch (erro) {
      const status = erro instanceof ErroApi ? erro.status : 0;
      if (status === 409) setConfirmado(true);
      setMensagem({
        tipo: "erro",
        texto: status === 403 ? "Você não pode confirmar o próprio aviso." : status === 409 ? "Você já confirmou este aviso." : mensagemDe(erro),
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Botao
        variante={confirmado ? "ativo" : "secundario"}
        tamanho="sm"
        carregando={enviando}
        disabled={desabilitado || confirmado}
        onClick={confirmar}
        className="self-start"
      >
        {!enviando && <Icone nome="olho" tamanho={16} />}
        {confirmado ? "Confirmado" : "Eu também vi"} · {contagem}
      </Botao>
      {mensagem && (
        <p role={mensagem.tipo === "erro" ? "alert" : "status"} className={`text-xs font-medium ${mensagem.tipo === "erro" ? "text-perigo" : "text-verde"}`}>
          {mensagem.texto}
        </p>
      )}
    </div>
  );
}
