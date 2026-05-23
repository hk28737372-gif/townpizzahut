import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          radix: ['@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-tooltip', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
          animations: ['framer-motion'],
          icons: ['lucide-react', 'react-icons'],
          utils: ['date-fns', 'clsx', 'tailwind-merge', 'zod', 'react-hook-form']
        }
      }
    }
  }
});
