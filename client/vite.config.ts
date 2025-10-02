import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.warn('kekeke env.VITE_STEAM_API', env.VITE_STEAM_API);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/game": {
          target: `${env.VITE_STEAM_API}/api/game`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/game/, ""),
        },
        "/proxy": {
          target: `${env.VITE_STEAM_API}/proxy`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy/, ""),
        },
        "/api": {
          target: "https://api.gamalytic.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/steam": {
          target: "https://store.steampowered.com/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/steam/, ""),
        },
      },
    },
  };
});
