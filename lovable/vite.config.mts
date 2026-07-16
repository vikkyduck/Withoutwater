import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  build: {
    outDir: "dist",
    // vendor-чанки: react/motion меняются только при обновлении зависимостей,
    // между частыми деплоями сайта браузеры повторных посетителей берут их из кэша.
    // Для SSR-сборки пререндера (prerender.mjs) чанкинг не нужен.
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id: string) {
              if (!id.includes("node_modules")) return undefined;
              if (id.includes("motion")) return "motion"; // motion + framer-motion
              return "vendor"; // react, react-dom, lucide-react и пр.
            },
          },
        },
  },
}));
