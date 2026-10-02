// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // User site (<user>.github.io) is served from the domain root, so no `base` is needed.
  site: "https://gauthiermalfilatre.github.io",
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    // French lives at /, English at /en/.
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      // Optional. Enables Steam stats in the video games section. Read at build time only, never sent to the browser.
      STEAM_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
