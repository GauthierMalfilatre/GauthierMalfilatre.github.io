import type { Localized } from "./i18n/ui";

// Personal details shown across the site. Long-form bio lives in src/content/about/.
export const site = {
  name: "Gauthier Malfilatre",
  role: { fr: "Étudiant à Epitech Nancy", en: "Student at Epitech Nancy" } as Localized,
  avatar: "https://github.com/GauthierMalfilatre.png?size=448",

  email: "gauthier.malfilatre@epitech.eu",
  github: "https://github.com/GauthierMalfilatre",
  linkedin: "https://www.linkedin.com/in/gauthier-malfilatre-648001339/",

  // Duolingo stats are fetched at build time; leave username empty to hide them.
  duolingo: { username: "gzzutier" },

  // CV per language, served from public/cv/. An empty value falls back to the French CV.
  cv: { fr: "/cv/gauthier-malfilatre-cv-fr.pdf", en: "" },

  availability: {
    fr: "Recherche un stage de 5 mois, printemps 2027",
    en: "Looking for a 5-month internship, spring 2027",
  } as Localized,
  tagline: {
    fr: "Étudiant en 3e année à Epitech Nancy, passionné par le bas niveau, l’embarqué et Python.",
    en: "Third-year student at Epitech Nancy, into low-level programming, embedded systems and Python.",
  } as Localized,
  lookingFor: {
    fr: "Je cherche un stage de 5 mois à partir du printemps 2027, en développement bas niveau ou embarqué, idéalement en C, C++ ou Rust. Basé à Nancy, ouvert à Paris et au Luxembourg.",
    en: "I’m looking for a 5-month internship starting in spring 2027, in low-level or embedded development, ideally in C, C++ or Rust. Based in Nancy, open to Paris and Luxembourg.",
  } as Localized,
};
