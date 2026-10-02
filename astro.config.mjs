// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // User site (<user>.github.io) is served from the domain root, so no `base` is needed.
  site: "https://gauthiermalfilatre.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
