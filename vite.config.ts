import { defineConfig, loadEnv, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy: Record<string, ProxyOptions> = {
    "/api": {
      target: env.API_PROXY_TARGET || "https://acesso-ja-api.onrender.com",
      changeOrigin: true,
      rewrite: (caminho: string) => caminho.replace(/^\/api/, "/api/v1"),
      configure: (servidor) => {
        servidor.on("proxyReq", (requisicao) => {
          requisicao.removeHeader("origin");
          requisicao.removeHeader("referer");
        });
      },
    },
  };
  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy },
  };
});
