import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";

export type Project = CollectionEntry<"projects">;

/** The groups of the projects list, in display order. */
export const CONTEXTS = ["personal", "school", "grdf"] as const;

/** Group by group, then by `order`, which counts from 1 within each group. */
export const getProjects = async (): Promise<Project[]> =>
  (await getCollection("projects")).sort(
    (a, b) => CONTEXTS.indexOf(a.data.context) - CONTEXTS.indexOf(b.data.context) || a.data.order - b.data.order,
  );

/** Projects that get their own page: those with a write-up (French or English) or a gallery. */
export async function getPageIds(): Promise<Set<string>> {
  const texts = await getCollection("projectTexts");
  return new Set([
    ...(await getProjects()).filter((p) => p.data.gallery.length).map((p) => p.id),
    ...texts.filter((text) => text.body?.trim()).map((text) => text.id.split("/")[0]),
  ]);
}

export const projectUrl = (id: string, lang: Lang) => (lang === "fr" ? `/projets/${id}/` : `/en/projects/${id}/`);
