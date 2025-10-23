import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { globSync } from "glob";
import path, { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      // Detects all files in widgets folder as entry points
      input: Object.fromEntries(
        globSync("src/widgets/*.{js,ts,jsx,tsx,html}").map((file) => {
          return [file.match(/^src\/widgets\/(.+)\.tsx$/)?.[1] ?? file.slice(10, -3), resolve(__dirname, file)];
        }),
      ),
      output: {
        entryFileNames: "[name].js", // Necessary to generate consistently named widget entry points
        assetFileNames: "[name][extname]", // Necessary alongside cssCodeSplit: false to generate a unique style.css file
      },
    },
    minify: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
