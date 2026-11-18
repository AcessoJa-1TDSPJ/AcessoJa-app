import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { Layout } from "./components/Layout";
import { RotaProtegida } from "./components/RotaProtegida";
import { AuthProvider } from "./context/AuthContext";
import Entrar from "./pages/Entrar";
import Cadastro from "./pages/Cadastro";
import { TemaProvider } from "./context/TemaContext";
import Home from "./pages/Home";
import ComoFunciona from "./pages/ComoFunciona";
import Sobre from "./pages/Sobre";
import Integrantes from "./pages/Integrantes";
import IntegranteDetalhe from "./pages/IntegranteDetalhe";
import Faq from "./pages/Faq";
import Contato from "./pages/Contato";
import Avisos from "./pages/Avisos";
import AvisoDetalhe from "./pages/AvisoDetalhe";
import NovoAviso from "./pages/NovoAviso";
import Ocorrencias from "./pages/Ocorrencias";
import PainelOrgao from "./pages/PainelOrgao";
import NaoEncontrada from "./pages/NaoEncontrada";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "sobre", element: <Sobre /> },
      { path: "integrantes", element: <Integrantes /> },
      { path: "integrantes/:id", element: <IntegranteDetalhe /> },
      { path: "faq", element: <Faq /> },
      { path: "contato", element: <Contato /> },
      { path: "como-funciona", element: <ComoFunciona /> },
      { path: "avisos", element: <Avisos /> },
      { path: "avisos/novo", element: <RotaProtegida><NovoAviso /></RotaProtegida> },
      { path: "avisos/:id", element: <AvisoDetalhe /> },
      { path: "ocorrencias", element: <Ocorrencias /> },
      { path: "orgao", element: <RotaProtegida><PainelOrgao /></RotaProtegida> },
      { path: "entrar", element: <Entrar /> },
      { path: "cadastro", element: <Cadastro /> },
      { path: "*", element: <NaoEncontrada /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TemaProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TemaProvider>
  </StrictMode>,
);
