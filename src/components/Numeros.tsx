import { useRequisicao } from "../hooks/useRequisicao";
import { buscarEstatisticas } from "../services/avisoService";

export function Numeros() {
  const { estado } = useRequisicao(buscarEstatisticas);
  if (estado.tipo !== "sucesso") return null;
  const itens = [
    { valor: estado.dados.total, rotulo: "avisos" },
    { valor: estado.dados.emAberto, rotulo: "em aberto" },
    { valor: estado.dados.resolvidos, rotulo: "resolvidos" },
  ];
  return (
    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
      {itens.map((i) => (
        <div key={i.rotulo} className="flex flex-col-reverse">
          <dt className="text-suave">{i.rotulo}</dt>
          <dd className="text-4xl leading-none font-bold tracking-[-0.03em]">{i.valor ?? 0}</dd>
        </div>
      ))}
    </dl>
  );
}
