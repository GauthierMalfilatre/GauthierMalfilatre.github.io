import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localized = z.union([z.string(), z.object({ fr: z.string(), en: z.string() })]);

// One Markdown file in src/content/projects/ = one project card.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: localized,
    context: z.enum(["personal", "school"]),
    team: z.number().int().min(1).default(1),
    tags: z.array(z.string()).default([]),
    links: z.array(z.object({ url: z.url(), label: localized.optional() })).default([]),
    // Lower comes first.
    order: z.number().default(100),
  }),
});

// Bio, one file per language: fr.md, en.md.
const about = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/about" }),
});

export const collections = { projects, about };
