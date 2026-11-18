import { useState } from "react";
import { TopoPagina } from "../components/TopoPagina";
import { perguntasFaq } from "../data/faq";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Faq() {
  useDocumentTitle("FAQ");
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <>
      <TopoPagina titulo="Perguntas frequentes" descricao="Como o board funciona, o que pode ser avisado e como protegemos quem denuncia." />
      <section className="container-app max-w-[760px] pb-20">
        <ul className="space-y-3">
          {perguntasFaq.map((item, indice) => {
            const estaAberta = aberta === indice;
            return (
              <li key={item.pergunta} className={`cartao overflow-hidden transition-colors ${estaAberta ? "border-laranja" : ""}`}>
                <h2>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold"
                    aria-expanded={estaAberta}
                    aria-controls={`resposta-${indice}`}
                    onClick={() => setAberta(estaAberta ? null : indice)}
                  >
                    {item.pergunta}
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xl transition-[rotate,background-color] ${estaAberta ? "rotate-45 bg-laranja text-white" : "bg-tinta/7"}`} aria-hidden="true">+</span>
                  </button>
                </h2>
                <div id={`resposta-${indice}`} hidden={!estaAberta} className="px-6 pb-6 text-suave">
                  {item.resposta}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
