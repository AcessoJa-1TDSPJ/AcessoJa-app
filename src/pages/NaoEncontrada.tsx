import { BotaoLink } from "../components/Botao";
import { PinoMarca } from "../components/Marca";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NaoEncontrada() {
  useDocumentTitle("Página não encontrada");
  return (
    <section className="container-app flex flex-col items-center gap-5 py-24 text-center">
      <PinoMarca className="h-20 w-auto -rotate-6" />
      <p className="text-7xl font-extrabold tracking-[-0.05em] text-laranja">404</p>
      <h1 className="text-3xl font-bold tracking-[-0.03em]">Este endereço não existe</h1>
      <p className="max-w-md text-suave">O link pode estar errado ou a página foi removida.</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <BotaoLink para="/">Ir para o início</BotaoLink>
        <BotaoLink para="/avisos" variante="secundario">Ver ocorrências</BotaoLink>
      </div>
    </section>
  );
}
