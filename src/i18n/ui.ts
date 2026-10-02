export const languages = { fr: "Français", en: "English" } as const;
export type Lang = keyof typeof languages;

/** A string that is either the same in every language, or translated per language. */
export type Localized = string | Record<Lang, string>;

export const l = (value: Localized, lang: Lang): string =>
  typeof value === "string" ? value : value[lang];

const fr = {
  "nav.about": "À propos",
  "nav.projects": "Projets",
  "nav.journey": "Parcours",
  "nav.skills": "Compétences",
  "nav.contact": "Contact",
  "lang.switch": "Read in English",
  "theme.toggle": "Changer de thème",
  "life.pause": "Mettre le fond animé en pause",
  "cta.cv": "Télécharger le CV",
  "cta.cvFallback": "Télécharger le CV",
  "cta.contact": "Contact",
  "projects.personal": "Projet perso",
  "projects.school": "Projet Epitech",
  "projects.solo": "Solo",
  "projects.team": "Équipe de {n}",
  "projects.link": "Code",
  "journey.experience": "Expérience",
  "journey.education": "Formation",
  "contact.title": "Un stage à proposer ?",
  "contact.titleAccent": "Parlons-en.",
  "duolingo.xp": "Duolingo : {xp} XP",
  "duolingo.streak": "série de {n} jours",
  "duolingo.streakOne": "série de 1 jour",
  "games.title": "Jeux vidéo",
  "games.intro": "Mes jeux du moment.",
  "games.profile": "Profil Steam",
  "games.achievements": "{unlocked}/{total} succès",
  "github.total": "{n} contributions sur 12 mois",
  "github.dayNone": "Aucune contribution le {date}",
  "github.dayOne": "1 contribution le {date}",
  "github.dayMany": "{n} contributions le {date}",
  "footer.built": "Site construit avec Astro.",
};

const en: Record<keyof typeof fr, string> = {
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.journey": "Background",
  "nav.skills": "Skills",
  "nav.contact": "Contact",
  "lang.switch": "Lire en français",
  "theme.toggle": "Toggle theme",
  "life.pause": "Pause the animated background",
  "cta.cv": "Download CV",
  "cta.cvFallback": "CV (in French)",
  "cta.contact": "Contact",
  "projects.personal": "Personal project",
  "projects.school": "Epitech project",
  "projects.solo": "Solo",
  "projects.team": "Team of {n}",
  "projects.link": "Code",
  "journey.experience": "Experience",
  "journey.education": "Education",
  "contact.title": "Have an internship to offer?",
  "contact.titleAccent": "Let’s talk.",
  "duolingo.xp": "Duolingo: {xp} XP",
  "duolingo.streak": "{n}-day streak",
  "duolingo.streakOne": "1-day streak",
  "games.title": "Video games",
  "games.intro": "What I’m playing at the moment.",
  "games.profile": "Steam profile",
  "games.achievements": "{unlocked}/{total} achievements",
  "github.total": "{n} contributions in 12 months",
  "github.dayNone": "No contributions on {date}",
  "github.dayOne": "1 contribution on {date}",
  "github.dayMany": "{n} contributions on {date}",
  "footer.built": "Built with Astro.",
};

const ui = { fr, en };

export const useTranslations = (lang: Lang) => (key: keyof typeof fr) => ui[lang][key];

/** "2025-08" → "août 2025" / "Aug 2025"; "2024" stays "2024". */
export function formatPeriod(start: string, end: string | undefined, lang: Lang): string {
  const format = (date: string) =>
    date.length === 4
      ? date
      : new Intl.DateTimeFormat(lang, { month: "short", year: "numeric", timeZone: "UTC" }).format(
          new Date(`${date}-01T00:00:00Z`),
        );
  return !end || end === start ? format(start) : `${format(start)} - ${format(end)}`;
}
