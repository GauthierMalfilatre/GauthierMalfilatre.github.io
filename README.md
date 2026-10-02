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
- **Video games:** `src/data/games.ts`
- **Colors and fonts:** tokens at the top of `src/styles/global.css`

## Live data

Fetched at build time; the site rebuilds daily to keep it fresh. If a source fails, its part is hidden or falls back, and the build still succeeds.

- **GitHub contributions** (graph next to the photo): read from the `github` URL in `src/site.config.ts`. No key needed.
- **Duolingo:** set `duolingo.username` in `src/site.config.ts`. No key needed.
- **Steam** (cover art needs nothing; your achievements need a key):
  1. Get a key at https://steamcommunity.com/dev/apikey (domain: `gauthiermalfilatre.github.io`).
  2. In Steam, set **Edit Profile > Privacy Settings > Game details** to **Public**.
  3. Set `steam.profile` in `src/site.config.ts` to your profile URL.
  4. Locally: put `STEAM_API_KEY=your-key` in a `.env` file (git-ignored).
  5. On GitHub: add a repository secret named `STEAM_API_KEY` (Settings > Secrets and variables > Actions), or run `gh secret set STEAM_API_KEY`.

  Without a key, the cards show cover art without achievements.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repo settings, **Pages > Build and deployment > Source** must be set to **GitHub Actions**.
