import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Tema = "light" | "dark";

interface TemaContextValor {
  tema: Tema;
  alternarTema: () => void;
}

const TemaContext = createContext<TemaContextValor | null>(null);

function temaInicial(): Tema {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem("aj_tema", tema);
    } catch {
    }
  }, [tema]);

  const alternarTema = () => setTema((t) => (t === "dark" ? "light" : "dark"));

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const contexto = useContext(TemaContext);
  if (!contexto) throw new Error("useTema precisa estar dentro de <TemaProvider>.");
  return contexto;
}
