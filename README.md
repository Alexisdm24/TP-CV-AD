# TP-CV-AD – CV web d'Alexis Dominguez

CV en ligne statique (HTML / CSS / JS), réalisé dans le cadre du BTS SIO,
d'après le sujet [fabrice1618/cv_html_statique](https://github.com/fabrice1618/cv_html_statique).

- **Dépôt GitHub** : https://github.com/alexisdm24/TP-CV-AD
- **Site en ligne (GitHub Pages)** : https://alexisdm24.github.io/TP-CV-AD/

## Concept

Thème inspiré de **Dragon Quest IX** (hommage non officiel, © Square Enix) :
en fond, l'**Observatoire** des Célestelliens, une citadelle flottante en
pierre ocre à étages (socle couvert de verdure et de lianes, arches,
colonnes, tours rondes à colonnades, balcons) qui sort de la mer de nuages,
avec à son sommet l'**Yggdrasil** lumineux et ses sept **Fyggs**, des fruits
dorés en forme de poire à feuilles vertes. Les nuages reprennent le style
peint des illustrations du jeu : sommets blancs, dessous lavande et violet
avec des reflets rosés, petits nuages flottants et traînées de cirrus. Tous les dessins sont originaux (SVG et CSS),
aucune image ni logo du jeu n'est utilisé.

- Chaque **nuage** ouvre une partie du CV (Présentation, Expériences,
  Formations, Compétences, Langues, Hobbies) dans une fenêtre au style de
  Dragon Quest IX : fond anthracite légèrement granuleux, fin liseré blanc
  aux coins arrondis, texte blanc à empattements, titres dans une petite
  fenêtre-onglet, et la ligne sélectionnée en jaune avec la flèche ▶.
- Le **Célestellien** vole avec un parchemin : un clic dessus ouvre le
  **CV complet**, qui peut être imprimé. Son dessin reprend le costume des
  Célestelliens du jeu (sous-pull à col montant, empiècement violet bordé
  d'or, cape et jupe à lanières orange, collants moutarde, bottes à revers),
  avec l'auréole dorée et les ailes blanches.
- Sans JavaScript, le CV complet reste affiché et les nuages deviennent des
  liens vers chaque section.

## Arborescence

```
.
├─ index.html      contenu du CV + styles (balise <style>, mobile-first)
├─ js/app.js       nuages, Célestellien, CV complet (chargé avec defer)
├─ img/            images optimisées (aucune : tout est dessiné en SVG)
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
- **Performance** : aucune bibliothèque, aucune image bitmap, script chargé
  avec `defer`. Une **seule** police web, *DotGothic16* (Google Fonts, licence
  libre OFL), choisie parce qu'elle reproduit les caractères pixel des jeux
  Dragon Quest : chargée avec `preconnect` et `display=swap` (le texte
  s'affiche tout de suite en police de secours), et seuls les caractères
  utilisés sont téléchargés.

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
  aux bords irréguliers, rouleaux en bois, et un ange en statue grecque de
  marbre blanc : relief, reflets et veines du marbre obtenus avec
  `feDiffuseLighting`, `feSpecularLighting` et `feTurbulence`, ailes
  construites en JavaScript à partir d'un bord d'attaque courbe.
  Toujours aucune image ni bibliothèque : tout est généré par le navigateur.
- Changement de thème pour Dragon Quest IX : Yggdrasil en fond, fenêtres
  façon Dragon Quest IX (texte blanc sur fond anthracite, contraste élevé), et un
  Célestellien dessiné en style dessin animé à la place de la statue.
- Décor rapproché des illustrations officielles : ciel bleu profond, soleil
  et rayons venant d'en haut à gauche, Observatoire avec texture de pierre,
  joints de maçonnerie et ombres sous les corniches ; police pixel
  *DotGothic16* façon Dragon Quest (une seule graisse : la mise en valeur se
  fait en jaune, comme dans les dialogues du jeu).
- …
