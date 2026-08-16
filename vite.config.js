import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@react-three") || id.includes("three") || id.includes("postprocessing")) return "three-runtime";
          if (id.includes("gsap")) return "motion";
          if (id.includes("emailjs")) return "contact";
        },
      },
    },
  },
});
