# AGENTS.md — Projet CV Web statique

## Contexte

Ce projet est un TP de BTS SIO (1ère année) : créer un CV web statique,
simple et responsive, publié via GitHub Pages. Basé sur le sujet du dépôt
`fabrice1618/cv_html_statique`.

## ⚠️ Confidentialité (contrainte non négociable)

- Ne jamais générer, afficher ou conserver dans le code : numéro de téléphone,
  adresse postale, e-mail personnel.
- Le seul moyen de contact autorisé est un lien vers le profil GitHub de
  l'étudiant.

## Structure du projet

```
.
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js      (facultatif)
├─ img/           (images optimisées)
└─ cv.md          (contenu source en Markdown, rédigé avant le HTML)
```

## Étapes de travail (dans l'ordre)

1. Rédiger le contenu dans `cv.md` (présentation, compétences, formation,
   expériences/projets, contact) avant d'écrire une ligne de HTML.
2. Construire `index.html` à partir de ce contenu, avec une structure
   sémantique.
3. Styliser en mobile-first dans `css/style.css`.
4. Vérifier UX / accessibilité / SEO / performance (checklists ci-dessous).
5. Valider avec les outils listés, corriger les erreurs.
6. Publier sur GitHub Pages.
7. Documenter l'auto-évaluation dans le README.

## Règles HTML sémantique

- Un seul `<h1>` par page (le nom de la personne).
- Hiérarchie de titres cohérente `<h2>` → `<h6>`, sans sauter de niveau.
- Utiliser les balises structurelles : `<header>`, `<nav>` (si pertinent),
  `<main>`, `<section>`, `<article>` (pour un projet/une expérience),
  `<footer>`.
- Listes de compétences en `<ul>/<li>`, jamais en `<p>` empilés.
- Liens avec un texte explicite (ex. "Voir mes projets GitHub"), jamais
  "cliquez ici".

## Règles responsive / UX / accessibilité

- Approche mobile-first ; aucun scroll horizontal à aucune largeur d'écran.
- Utiliser CSS Grid/Flexbox ou Bootstrap (`.container`, `.row`, `.col`).
- Contraste de couleurs suffisant (WCAG AA minimum).
- Taille de police de base ≥ 16px, espacements réguliers.
- Navigation complète au clavier (Tab), focus visibles, ordre logique.
- Attribut `alt` descriptif sur toutes les images.
- `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## Règles SEO minimum

- `<title>` descriptif et unique.
- `<meta name="description">` renseignée.
- Une seule `<h1>` pertinente.
- Contenu clair, structuré par les balises sémantiques ci-dessus.

## Règles de performance

- Images optimisées (WebP/JPEG), taille adaptée à l'affichage, viser
  150–300 Ko max par image.
- Scripts JS chargés avec l'attribut `defer`.
- CSS minimal, pas de librairie non utilisée.
- Éviter les polices web multiples ; privilégier les polices système.

## Validation (avant de considérer une tâche terminée)

- HTML : https://validator.w3.org/ → 0 erreur bloquante.
- Structure des titres H1–H6 : https://www.outiref.fr/
- Performance mobile : https://pagespeed.web.dev/?hl=fr
- Optionnel : https://gtmetrix.com/

## Livrables attendus

- URL du dépôt GitHub.
- URL du site publié sur GitHub Pages.
- Section "Auto-évaluation" dans le README : résultats des outils de
  validation + corrections effectuées entre la V1 et la version finale.

## Critères notés (grille d'évaluation du prof)

Chaque critère est noté de 0 à 4 ; viser le niveau maximal décrit :
- **Contenu** : clair, concis, orienté résultats (réalisations mesurables).
- **HTML sémantique** : H1 unique, hiérarchie propre, balises structurelles.
- **Responsive** : rendu stable et soigné mobile/desktop, sans rupture.
- **UX/Accessibilité** : contrastes ok, focus visibles, navigation clavier,
  liens explicites.
- **SEO** : title/meta pertinents, structure claire.
- **Performance** : images optimisées, `defer`, CSS minimal.
- **Validation & corrections** : W3C/Outiref/PageSpeed ok, corrections
  documentées entre V1 et version finale.
- **Publication GitHub Pages** : site en ligne, stable, testé sur mobile.
- **Auto-évaluation** : résultats + analyse des causes + actions correctives.
- **Confidentialité** : aucune donnée sensible exposée.
- **Qualité du dépôt** : arborescence claire, README utile, commits
  informatifs.
