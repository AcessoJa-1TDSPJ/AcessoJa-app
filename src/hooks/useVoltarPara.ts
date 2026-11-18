import { useLocation } from "react-router";

export function useVoltarPara(padrao = "/avisos"): string {
  const { state } = useLocation();
  const destino = (state as { voltarPara?: string } | null)?.voltarPara;
  return destino && destino.startsWith("/") ? destino : padrao;
}
