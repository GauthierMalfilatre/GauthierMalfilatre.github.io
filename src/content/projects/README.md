# Projets

Un dossier = un projet. Le nom du dossier devient l'adresse de sa page : `zappy/` → `/projets/zappy/` (et `/en/projects/zappy/`).

```
zappy/
├── index.md        ← infos du projet + texte en français
├── en.md           ← (optionnel) texte en anglais
├── cover.png       ← (optionnel) image de couverture
└── jeu.png, …      ← tes autres images
```

## index.md

```md
---
title: Zappy
description:
  fr: Simulation d’un monde virtuel en trois parties.
  en: Simulation of a virtual world in three parts.
context: school          # personal, school ou grdf (le groupe dans la liste)
team: 6                  # 1 = Solo
tags: [C, C++, Python]
links:
  - url: https://github.com/GauthierMalfilatre/zappy
  - url: https://exemple.com
    label: { fr: Démo, en: Demo }
cover: ./cover.png       # vignette dans la liste + grande image en haut de la page
gallery:                 # images en bas de la page, avec une légende facultative
  - src: ./serveur.png
    caption: { fr: Le serveur en action, en: The server at work }
  - src: ./ia.png
    caption: Même légende dans les deux langues
order: 2                 # place dans son groupe : 1 = en premier (le seul visible avant de déplier)
---

Tout ce qui est écrit ici, sous les `---`, est le texte de la page (en Markdown).

## Ce que j'ai fait

Du **gras**, des listes, des [liens](https://exemple.com), des `bouts de code` :

- point un
- point deux

![Une image au milieu du texte](./schema.png)

> Une citation ou un retour d’expérience.
```

Les images peuvent être en `.png`, `.jpg`, `.webp`, `.gif`… : le site les redimensionne et les compresse tout seul au build, pas besoin de les optimiser.

## Quand est-ce qu'un projet a sa page ?

Dès qu'il a **du texte** (sous les `---` de `index.md`, ou dans `en.md`) **ou une galerie**. Sa ligne devient alors cliquable dans la liste, avec une flèche. Sans ça, il reste une simple ligne (la couverture s'affiche quand même).

## en.md (facultatif)

Juste le texte anglais, sans rien entre `---`. Sans `en.md`, la page anglaise affiche le texte français avec une petite mention « only available in French ».

## Ajouter un projet

Copie un dossier existant, renomme-le (minuscules et tirets : `mon-projet`), puis modifie `index.md`. `npm run dev` affiche le résultat en direct.

## Erreurs d'images

- **« Could not find requested image »** : le chemin dans `index.md` ne correspond à aucun fichier. Vérifie l'orthographe et que l'image est bien dans le dossier du projet.
- **« Local images must be imported »** : le serveur de dev a gardé une ancienne version en cache (souvent après avoir renommé ou supprimé une image). Arrête-le et relance-le avec `npm run dev -- --force`.
