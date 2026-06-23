import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // В dev-режиме запросы к /api проксируются на Go-бэкенд (порт 8080).
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
