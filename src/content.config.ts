import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localized = z.union([z.string(), z.object({ fr: z.string(), en: z.string() })]);

// One folder in src/content/projects/ = one project (how-to in src/content/projects/README.md).
// index.md holds the details and, below them, the French write-up; images sit next to it.
const fromFolder = ({ entry }: { entry: string }) => entry.split("/")[0];

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects", generateId: fromFolder }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: localized,
      context: z.enum(["personal", "school", "grdf"]),
      team: z.number().int().min(1).default(1),
      tags: z.array(z.string()).default([]),
      links: z.array(z.object({ url: z.url(), label: localized.optional() })).default([]),
      // Shown on the card and at the top of the project page.
      cover: image().optional(),
      gallery: z.array(z.object({ src: image(), caption: localized.optional() })).default([]),
      // Position within its context (personal or school): lower comes first.
      order: z.number().default(100),
    }),
});

// Write-ups by language: the body of index.md ("<folder>/fr") and of the optional en.md ("<folder>/en",
// no front matter needed). Both files are read so the collection is never empty.
const projectTexts = defineCollection({
  loader: glob({
    pattern: "*/{index,en}.md",
    base: "./src/content/projects",
    generateId: ({ entry }) => `${fromFolder({ entry })}/${entry.endsWith("/en.md") ? "en" : "fr"}`,
  }),
});

// Bio, one file per language: fr.md, en.md.
const about = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/about" }),
});

export const collections = { projects, projectTexts, about };
