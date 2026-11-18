import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { logado } = useAuth();
  const local = useLocation();
  if (!logado) {
    return <Navigate to="/entrar" replace state={{ voltarPara: local.pathname + local.search }} />;
  }
  return <>{children}</>;
}
