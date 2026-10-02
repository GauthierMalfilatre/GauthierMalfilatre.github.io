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

- **Name, tagline, links:** `src/site.config.ts`
- **Projects:** one Markdown file per project in `src/content/projects/` (frontmatter schema in `src/content.config.ts`)
- **Colors and fonts:** tokens at the top of `src/styles/global.css`

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repo settings, **Pages > Build and deployment > Source** must be set to **GitHub Actions**.
