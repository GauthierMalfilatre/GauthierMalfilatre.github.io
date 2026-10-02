import type { Localized } from "../i18n/ui";

export const skillGroups: { title: Localized; items: Localized[] }[] = [
  {
    title: { fr: "À l’aise avec", en: "Comfortable with" },
    items: ["C", "C++", "Python", "HTML & CSS", "JavaScript"],
  },
  {
    title: { fr: "En apprentissage", en: "Currently learning" },
    items: ["Rust", "Java", "Haskell", { fr: "Assembleur", en: "Assembly" }],
  },
  {
    title: { fr: "Systèmes et outils", en: "Systems and tools" },
    items: ["Linux", "Git", "Bash", "Valgrind", "Make", "CMake", "Bazel", "MySQL"],
  },
];

export const spokenLanguages: { name: Localized; level: Localized }[] = [
  { name: { fr: "Français", en: "French" }, level: { fr: "Langue maternelle", en: "Native" } },
  {
    name: { fr: "Anglais", en: "English" },
    level: { fr: "870/990 au TEPitech (équivalent TOEIC)", en: "870/990 on the TEPitech (TOEIC equivalent)" },
  },
  { name: { fr: "Japonais", en: "Japanese" }, level: { fr: "Notions (3 ans)", en: "Basics (3 years)" } },
];
