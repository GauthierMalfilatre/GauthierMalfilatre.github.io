# GauthierMalfilatre.github.io

My portfolio, live at https://gauthiermalfilatre.github.io.

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Develop

Requires Node 22.12+ (`nvm use` picks the version from `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Edit content

The site is bilingual: French at `/`, English at `/en/`. Most text is written as `{ fr: "...", en: "..." }`.

- **Name, tagline, links, CV paths:** `src/site.config.ts`
- **Bio:** `src/content/about/fr.md` and `en.md`
- **Projects:** one Markdown file per project in `src/content/projects/` (schema in `src/content.config.ts`)
- **Experience and education:** `src/data/journey.ts`
- **Skills and spoken languages:** `src/data/skills.ts`
- **Interface labels:** `src/i18n/ui.ts`
- **CV files:** `public/cv/`. Set `cv.en` in `src/site.config.ts` once an English CV exists.
- **Colors and fonts:** tokens at the top of `src/styles/global.css`

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repo settings, **Pages > Build and deployment > Source** must be set to **GitHub Actions**.
