import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: true,
    cors: true,
  },
  build: {
    rollupOptions: {
      input: "./src/main.tsx",
      output: {
        entryFileNames: "index.js",
      },
    },
  },
});
