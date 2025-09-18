import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }, // alias 객체 닫기
  }, // resolve 객체 닫기
  server: {
    proxy: {
      // 커뮤니티 API만 로컬 백엔드로 프록시
      '/community': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});