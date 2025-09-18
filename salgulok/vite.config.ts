import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
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
