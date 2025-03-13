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
      "/api/v1": {
        target: "http://localhost:10086",
        changeOrigin: true,
        rewrite: (path) => path,
        // 移除日志记录
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.error("proxy error", err);
          });
          // 删除以下两个事件监听器
          // proxy.on('proxyReq', (proxyReq, req, _res) => {
          //   console.log('发送请求:', req.method, req.url);
          // });
          // proxy.on('proxyRes', (proxyRes, req, _res) => {
          //   console.log('收到响应:', proxyRes.statusCode, req.url);
          // });
        },
      },
    },
  },
});
