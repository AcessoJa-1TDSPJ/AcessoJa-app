import { useState } from "react";
import { BotaoLink } from "../components/Botao";
import { SeloStatus, TrilhaStatus } from "../components/Selos";
import { TopoPagina } from "../components/TopoPagina";
import { Numeros } from "../components/Numeros";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import type { StatusAviso } from "../types";
import { DESCRICAO_STATUS, ORDEM_STATUS, ROTULO_STATUS } from "../utils/formatar";

const regras = [
  { titulo: "Prova obrigatória", texto: "Todo aviso tem foto do local, sem rostos de pessoas." },
  { titulo: "3 confirmações", texto: "O aviso ganha destaque quando 3 pessoas diferentes confirmam." },
  { titulo: "Ordem fixa", texto: "O órgão avança uma etapa por vez, sem pular nenhuma." },
  { titulo: "Emergência fora", texto: "Crime acontecendo agora? Ligue 190 ou 193, não use o board." },
];

export default function ComoFunciona() {
  useDocumentTitle("Como funciona");
  const [etapa, setEtapa] = useState<StatusAviso>("NAO_RECEBIDA");

  return (
    <>
      <TopoPagina titulo="Como funciona" descricao="Cada aviso passa por quatro etapas. Clique em uma para ver." />
      <section className="container-app pb-20">
        <div className="cartao p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-[-0.02em]">Metrô com velocidade reduzida</h2>
              <span className="text-sm text-suave">Aviso de exemplo</span>
            </div>
            <SeloStatus status={etapa} />
          </div>
          <div className="mt-6 mb-3">
            <TrilhaStatus status={etapa} />
          </div>
          <p className="text-suave" aria-live="polite">{DESCRICAO_STATUS[etapa]}</p>
        </div>

        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Etapas do aviso">
          {ORDEM_STATUS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setEtapa(s)}
              aria-pressed={etapa === s}
              className={`cartao cartao-hover p-[18px] text-left ${etapa === s ? "border-laranja" : ""}`}
            >
              <span className="text-sm font-semibold text-laranja-forte">Etapa {i + 1}</span>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{ROTULO_STATUS[s]}</h3>
              <small className="mt-1 block leading-snug text-suave">{DESCRICAO_STATUS[s]}</small>
            </button>
          ))}
        </div>

        <Numeros />

        <h2 className="mt-16 mb-6 text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]">As regras do board</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {regras.map((r) => (
            <li key={r.titulo} className="cartao p-6">
              <h3 className="text-lg font-semibold">{r.titulo}</h3>
              <p className="text-suave">{r.texto}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-2.5">
          <BotaoLink para="/avisos/novo">Fazer um aviso</BotaoLink>
          <BotaoLink para="/avisos" variante="secundario">Ver ocorrências</BotaoLink>
        </div>
      </section>
    </>
  );
}
