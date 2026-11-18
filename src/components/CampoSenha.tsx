import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Icone } from "./Icone";

interface CampoSenhaProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  erro?: boolean;
}

export const CampoSenha = forwardRef<HTMLInputElement, CampoSenhaProps>(function CampoSenha({ erro, className = "", ...resto }, ref) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input ref={ref} type={visivel ? "text" : "password"} className={`campo pr-12 ${erro ? "campo-erro" : ""} ${className}`} {...resto} />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        aria-label={visivel ? "Esconder senha" : "Mostrar senha"}
        aria-pressed={visivel}
        title={visivel ? "Esconder senha" : "Mostrar senha"}
        className="absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-suave transition-colors hover:bg-tinta/7 hover:text-tinta"
      >
        <Icone nome={visivel ? "olhoFechado" : "olho"} />
      </button>
    </div>
  );
});
