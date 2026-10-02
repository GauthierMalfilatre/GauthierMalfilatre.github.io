import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One Markdown file in src/content/projects/ = one project card on the home page.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    url: z.url().optional(),
    repo: z.url().optional(),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
    // Lower comes first. The first project is shown full width.
    order: z.number().default(100),
  }),
});

export const collections = { projects };
