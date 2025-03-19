import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:10086", // 确保这里是你的后端API地址
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});
