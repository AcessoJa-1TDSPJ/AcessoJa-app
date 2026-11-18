import { useEffect } from "react";

export function useDocumentTitle(titulo: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Acesso Já` : "Acesso Já";
  }, [titulo]);
}
