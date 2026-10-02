import type { Localized } from "../i18n/ui";

export interface Entry {
  title: Localized;
  org: string;
  location: string;
  /** "YYYY-MM" or "YYYY". */
  start: string;
  end?: string;
  summary: Localized;
  highlight?: Localized;
  tags?: string[];
}

// Most recent first.
export const experience: Entry[] = [
  {
    title: { fr: "Assistant Epitech Région (AER)", en: "Teaching assistant (AER)" },
    org: "Epitech",
    location: "Nancy",
    start: "2026-09",
    end: "2027-02",
    summary: {
      fr: "Encadrement des étudiants des promotions inférieures, mise en application de la pédagogie Epitech et jury de présentation de projets.",
      en: "Mentoring students from earlier years, applying Epitech’s project-based teaching, and sitting on project review juries.",
    },
  },
  {
    title: { fr: "Développeur, stage", en: "Software developer intern" },
    org: "GRDF",
    location: "Nancy",
    start: "2025-08",
    end: "2025-12",
    summary: {
      fr: "Maintien en conditions opérationnelles d’un outil interne de pilotage du programme travaux. Développement d’un outil d’optimisation en Python pour raccorder les stations de biométhane au réseau de gaz existant à moindre coût.",
      en: "Maintained an internal tool used to manage the works programme. Built a Python optimization tool to connect biomethane plants to the existing gas network at the lowest cost.",
    },
    highlight: {
      fr: "Lauréat du challenge Ki-Oz Innovation",
      en: "Won the Ki-Oz Innovation challenge",
    },
    tags: ["Angular", "PHP Symfony", "Python"],
  },
  {
    title: { fr: "Manutentionnaire, CDD", en: "Warehouse and sales assistant, fixed-term" },
    org: "Troc",
    location: "Nancy-Pulnoy",
    start: "2025-07",
    summary: {
      fr: "Gestion des stocks, accueil clientèle, entretien et montage de meubles.",
      en: "Stock management, customer service, furniture repair and assembly.",
    },
  },
];

export const education: Entry[] = [
  {
    title: "Programme Grande École",
    org: "Epitech",
    location: "Nancy",
    start: "2024",
    end: "2029",
    summary: {
      fr: "Diplôme d’expert en technologies de l’information (RNCP niveau 7). Pédagogie par projets, orientée développement bas niveau. Actuellement en 3e année.",
      en: "Information technology expert degree (RNCP level 7, Master’s equivalent). Project-based learning with a focus on low-level development. Currently in 3rd year.",
    },
  },
  {
    title: { fr: "Baccalauréat général", en: "French Baccalauréat, general track" },
    org: "Lycée Notre-Dame Saint-Sigisbert",
    location: "Nancy",
    start: "2024",
    summary: {
      fr: "Spécialités Mathématiques et Numérique et Sciences de l’Informatique (NSI).",
      en: "Majors in Mathematics and Computer Science (NSI).",
    },
  },
];
