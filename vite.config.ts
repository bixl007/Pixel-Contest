import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://kontests.net',
        changeOrigin: true,
        secure: false,
      },
      '/leetcode-api': {
        target: 'https://leetcode.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/leetcode-api/, ''),
      },
      '/codechef-api': {
        target: 'https://www.codechef.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/codechef-api/, '/api'),
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
