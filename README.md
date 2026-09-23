# TP-CV-AD – CV web d'Alexis Dominguez

CV en ligne statique (HTML / CSS / JS), réalisé dans le cadre du BTS SIO,
d'après le sujet [fabrice1618/cv_html_statique](https://github.com/fabrice1618/cv_html_statique).

- **Dépôt GitHub** : https://github.com/alexisdm24/TP-CV-AD
- **Site en ligne (GitHub Pages)** : https://alexisdm24.github.io/TP-CV-AD/

## Concept

Thème « paradis » : un ciel très lumineux, des nuages et un petit ange.

- Chaque **nuage** ouvre une partie du CV (Présentation, Expériences,
  Formations, Compétences, Langues, Hobbies).
- Le **petit ange** vole avec un parchemin : un clic dessus déroule le
  **CV complet**, qui peut être imprimé.
- Sans JavaScript, le CV complet reste affiché et les nuages deviennent des
  liens vers chaque section.

## Arborescence

```
.
├─ index.html      contenu du CV + styles (balise <style>, mobile-first)
├─ js/app.js       nuages, ange, parchemin (chargé avec defer)
├─ img/            images optimisées (aucune pour l'instant, l'ange est en SVG)
└─ cv.md           contenu source rédigé en Markdown
```

## Choix techniques

- **HTML sémantique** : un seul `<h1>`, un `<h2>` par section, un `<h3>` par
  expérience ou formation. Balises `header`, `nav`, `main`, `section`,
  `article`, `footer`.
- **Confidentialité** : aucun téléphone, adresse ou e-mail. Seul contact :
  le lien GitHub.
- **Accessibilité** : lien d'évitement, focus visibles, navigation au clavier
  (Tab, Entrée, Échap), police ≥ 16 px, contrastes AA. Les animations sont
  coupées si l'utilisateur a activé « réduire les animations ».
- **Performance** : aucune bibliothèque ni police web (polices système),
  aucune image bitmap, script chargé avec `defer`.

## Auto-évaluation (à compléter)

- **W3C** : … erreur(s) / … avertissement(s) : …
- **Outiref** : H1 unique, hiérarchie H2 → H3 : …
- **PageSpeed (mobile)** : Performance … · Accessibilité … · Bonnes
  pratiques … · SEO …

### Améliorations entre la V1 et la version finale

- V1 en un seul fichier (`index.html` avec le CSS et le JS intégrés), puis
  JavaScript déplacé dans `js/app.js` (chargé avec `defer`). Le CSS reste dans
  `index.html` : la page n'a qu'une feuille de style, ce qui évite une requête
  réseau de plus au chargement.
- Suppression du téléphone, de l'adresse et de l'e-mail. Seul contact : le
  lien GitHub.
- Suppression des polices Google Fonts au profit des polices système.
- Contenu du CV écrit directement dans le HTML (et plus généré en JavaScript),
  pour le référencement et l'affichage sans JavaScript.
- Toutes les tailles de texte passées à 16 px minimum (y compris l'infobulle
  de l'ange, qui héritait des 13 px par défaut des boutons).
- Fenêtre des sections : `aria-labelledby` pointait vers un id absent au
  chargement, remplacé par un `aria-label`.
- `<title>` raccourci à moins de 60 caractères.
- Version « réaliste » : nuages volumétriques et mer de nuages réalisés avec
  des filtres SVG (`feTurbulence` + `feDisplacementMap`), parchemin texturé
  aux bords irréguliers, rouleaux en bois, et un ange en statue de pierre
  style Cupidon (relief et grain de la pierre obtenus avec `feDiffuseLighting`).
  Toujours aucune image ni bibliothèque : tout est généré par le navigateur.
- …
