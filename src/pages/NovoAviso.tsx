import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Botao } from "../components/Botao";
import { CampoFormulario, ariaCampo } from "../components/CampoFormulario";
import { Aviso as Mensagem, Carregando, ErroTela, Vazio } from "../components/EstadoTela";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequisicao } from "../hooks/useRequisicao";
import { ErroApi, mensagemDe } from "../services/api";
import { registrarAviso } from "../services/avisoService";
import { listarCategorias } from "../services/categoriaService";
import type { NovoAvisoForm } from "../types";
import { nomeCategoria, perguntaAcontecendoAgora } from "../utils/formatar";
import { reduzirFoto } from "../utils/imagem";

const LIMITE_FOTO = 20 * 1024 * 1024;
const LIMITE_DESCRICAO = 300;
const DICA_FOTO = "JPG, PNG ou WEBP. A foto é reduzida antes do envio. Mostre o local, sem rostos.";

type Resultado = { tipo: "sucesso"; id: number } | { tipo: "erro"; mensagem: string; idExistente?: number };

export default function NovoAviso() {
  useDocumentTitle("Novo aviso");
  const { usuario } = useAuth();
  const { estado: categorias, recarregar } = useRequisicao(listarCategorias);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NovoAvisoForm>({
    mode: "onTouched",
    defaultValues: { categoriaId: "", descricao: "", endereco: "", bairro: "", acontecendoAgora: "" },
  });

  const categoriaId = watch("categoriaId");
  const descricao = watch("descricao") ?? "";
  const acontecendoAgora = watch("acontecendoAgora");
  const foto = watch("foto");

  const escolhida = categorias.tipo === "sucesso" ? categorias.dados.find((c) => String(c.id) === categoriaId) : undefined;
  const ehDelito = perguntaAcontecendoAgora(escolhida);
  const emergencia = ehDelito && acontecendoAgora === "sim";

  useEffect(() => {
    const arquivo = foto?.[0];
    if (!arquivo || !arquivo.type.startsWith("image/")) {
      setPrevia(null);
      return;
    }
    const url = URL.createObjectURL(arquivo);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

  async function enviar(dados: NovoAvisoForm) {
    setResultado(null);
    if (emergencia) return;
    try {
      const criado = await registrarAviso({
        categoriaId: Number(dados.categoriaId),
        descricao: dados.descricao.trim(),
        endereco: dados.endereco.trim(),
        bairro: dados.bairro.trim(),
        foto: await reduzirFoto(dados.foto[0]),
        acontecendoAgora: ehDelito ? dados.acontecendoAgora === "sim" : undefined,
      });
      const idCriado = criado?.id ?? (criado as unknown as { aviso?: { id: number } })?.aviso?.id;
      setResultado({ tipo: "sucesso", id: idCriado ?? 0 });
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (erro) {
      let mensagem = mensagemDe(erro);
      let idExistente: number | undefined;
      if (erro instanceof ErroApi && erro.status === 409) {
        idExistente = Number(mensagem.match(/\d+/)?.[0]) || undefined;
        mensagem = "Este aviso já foi registrado há pouco. Confirme o aviso existente em vez de criar outro.";
      }
      setResultado({ tipo: "erro", mensagem, idExistente });
    }
  }

  return (
    <section className="container-app pt-10 pb-20">
      <div className="cartao mx-auto max-w-[560px] p-6 md:p-8">
        <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold tracking-[-0.035em]">Novo aviso</h1>
        <p className="mt-1 text-suave">Conte o que viu. Quanto mais claro, mais rápida a resposta.</p>
        {usuario && usuario.perfil !== "CIDADAO" && (
          <p className="mt-3 text-sm text-laranja-forte">Você entrou com uma conta de {usuario.perfil === "SERVIDOR" ? "órgão" : "moderação"}. Avisos são registrados por cidadãos, então a API pode recusar o envio.</p>
        )}

        <div className="mt-5 space-y-3">
          {resultado?.tipo === "sucesso" && (
            <Mensagem tipo="sucesso">
              Aviso publicado com o status “Não recebida”. Agora ele aguarda 3 confirmações.{" "}
              {resultado.id > 0 && <Link to={`/avisos/${resultado.id}`} className="underline">Ver aviso</Link>}
            </Mensagem>
          )}
          {resultado?.tipo === "erro" && (
            <Mensagem tipo="erro">
              {resultado.mensagem}{" "}
              {resultado.idExistente && <Link to={`/avisos/${resultado.idExistente}`} className="underline">Abrir aviso existente</Link>}
            </Mensagem>
          )}
        </div>

        {categorias.tipo === "carregando" && <Carregando texto="Carregando categorias…" />}
        {categorias.tipo === "erro" && <div className="mt-5"><ErroTela mensagem={`Não foi possível carregar as categorias. ${categorias.mensagem}`} aoTentar={recarregar} /></div>}
        {categorias.tipo === "sucesso" && categorias.dados.length === 0 && (
          <Vazio titulo="Nenhuma categoria cadastrada na API">
            <p>O formulário precisa das categorias do banco (transporte, alagamento, delito, zeladoria e outro).</p>
          </Vazio>
        )}

        {categorias.tipo === "sucesso" && categorias.dados.length > 0 && (
          <form onSubmit={handleSubmit(enviar)} noValidate className="mt-5 space-y-5">
            <fieldset className="space-y-2">
              <legend className="mb-1.5 text-[14.5px] font-semibold">
                Tipo <span className="text-laranja-forte" aria-hidden="true">*</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {categorias.dados.map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <input type="radio" value={String(c.id)} className="peer sr-only" {...register("categoriaId", { required: "Escolha o tipo do aviso." })} />
                    <span className="chip peer-checked:border-tinta peer-checked:bg-tinta peer-checked:text-fundo peer-focus-visible:outline-3 peer-focus-visible:outline-laranja">{nomeCategoria(c)}</span>
                  </label>
                ))}
              </div>
              {errors.categoriaId && <p role="alert" className="text-sm text-perigo">{errors.categoriaId.message}</p>}
            </fieldset>

            {ehDelito && (
              <fieldset className="space-y-2">
                <legend className="mb-1.5 text-[14.5px] font-semibold">Está acontecendo agora? <span className="text-laranja-forte" aria-hidden="true">*</span></legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["sim", "nao"] as const).map((v) => (
                    <label key={v} className="flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-linha px-3 py-2.5 font-medium transition-[translate,border-color] hover:-translate-y-0.5 has-checked:border-laranja has-checked:bg-laranja/10">
                      <input type="radio" value={v} className="accent-laranja" {...register("acontecendoAgora", { validate: (valor) => !ehDelito || valor !== "" || "Responda se está acontecendo agora." })} />
                      {v === "sim" ? "Sim" : "Não"}
                    </label>
                  ))}
                </div>
                {errors.acontecendoAgora && <p role="alert" className="text-sm text-perigo">{errors.acontecendoAgora.message}</p>}
                {emergencia ? (
                  <div role="alert" className="rounded-xl bg-perigo p-4 text-white dark:text-fundo">
                    <p className="font-semibold">Emergência não vai para o board.</p>
                    <p className="mt-1 text-sm">Ligue agora: <a href="tel:190" className="font-bold underline">190 (Polícia)</a> ou <a href="tel:193" className="font-bold underline">193 (Bombeiros)</a>.</p>
                  </div>
                ) : (
                  <p className="text-xs text-suave">Fale da rua e do período (ex.: assaltos frequentes nas últimas semanas), nunca de pessoas.</p>
                )}
              </fieldset>
            )}

            <CampoFormulario id="descricao" rotulo="O que aconteceu?" erro={errors.descricao?.message} obrigatorio>
              <textarea
                rows={3}
                maxLength={LIMITE_DESCRICAO}
                placeholder="Ex.: Estação alagada, água chegando na catraca."
                {...ariaCampo("descricao", errors.descricao?.message)}
                className={`campo resize-y ${errors.descricao ? "campo-erro" : ""}`}
                {...register("descricao", {
                  required: "Conte o que aconteceu.",
                  minLength: { value: 10, message: "Conte um pouco mais (mínimo de 10 caracteres)." },
                  maxLength: { value: LIMITE_DESCRICAO, message: `No máximo ${LIMITE_DESCRICAO} caracteres.` },
                })}
              />
              <p className={`text-right text-xs ${descricao.length > LIMITE_DESCRICAO - 20 ? "text-laranja-forte" : "text-suave"}`}>{descricao.length}/{LIMITE_DESCRICAO}</p>
            </CampoFormulario>

            <CampoFormulario id="endereco" rotulo="Local" erro={errors.endereco?.message} obrigatorio>
              <input
                placeholder="Rua, estação ou ponto de referência"
                {...ariaCampo("endereco", errors.endereco?.message)}
                className={`campo ${errors.endereco ? "campo-erro" : ""}`}
                {...register("endereco", {
                  required: "Informe o local.",
                  minLength: { value: 5, message: "Informe um local mais completo." },
                  maxLength: { value: 150, message: "No máximo 150 caracteres." },
                })}
              />
            </CampoFormulario>

            <CampoFormulario id="bairro" rotulo="Bairro" erro={errors.bairro?.message} obrigatorio>
              <input
                placeholder="Ex.: Mooca"
                {...ariaCampo("bairro", errors.bairro?.message)}
                className={`campo ${errors.bairro ? "campo-erro" : ""}`}
                {...register("bairro", {
                  required: "Informe o bairro.",
                  minLength: { value: 2, message: "Bairro muito curto." },
                  maxLength: { value: 80, message: "No máximo 80 caracteres." },
                })}
              />
            </CampoFormulario>

            <CampoFormulario id="foto" rotulo="Prova (foto)" erro={errors.foto?.message} dica={DICA_FOTO} obrigatorio>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                {...ariaCampo("foto", errors.foto?.message, DICA_FOTO)}
                className={`campo file:mr-3 file:rounded-full file:border-0 file:bg-tinta file:px-3 file:py-1 file:text-sm file:font-semibold file:text-fundo ${errors.foto ? "campo-erro" : ""}`}
                {...register("foto", {
                  validate: {
                    obrigatoria: (lista) => (lista && lista.length > 0) || "Anexe uma foto como prova.",
                    tipo: (lista) => !lista?.[0] || lista[0].type.startsWith("image/") || "O arquivo precisa ser uma imagem.",
                    tamanho: (lista) => !lista?.[0] || lista[0].size <= LIMITE_FOTO || "A foto precisa ter no máximo 20 MB.",
                  },
                })}
              />
            </CampoFormulario>
            {previa && <img src={previa} alt="Prévia da foto escolhida" className="h-40 w-full rounded-xl border border-linha object-cover" />}

            <Botao type="submit" carregando={isSubmitting} disabled={emergencia} className="w-full">
              {isSubmitting ? "Publicando…" : "Publicar aviso"}
            </Botao>
          </form>
        )}
      </div>
    </section>
  );
}
