import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig((_env) => {
  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 3001,
      strictPort: true,
      proxy: {
        "/api/v1": {
          target: process.env.API_PROXY_TARGET || "https://127.0.0.1:3443",
          changeOrigin: true,
          secure: false,
        },
        "/openapi.json": {
          target: process.env.API_PROXY_TARGET || "https://127.0.0.1:3443",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
