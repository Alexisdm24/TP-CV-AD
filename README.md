# TP-CV-AD – CV web d'Alexis Dominguez

CV en ligne statique (HTML / CSS / JS), réalisé dans le cadre du BTS SIO,
d'après le sujet [fabrice1618/cv_html_statique](https://github.com/fabrice1618/cv_html_statique).

- **Dépôt GitHub** : https://github.com/alexisdm24/TP-CV-AD
- **Site en ligne (GitHub Pages)** : https://alexisdm24.github.io/TP-CV-AD/

## Concept

Style des **Dragon Quest classiques** (épisodes I à V et remakes 2D-HD),
hommage non officiel (© Square Enix). Graphismes, monstre et textes sont
**originaux** : aucun sprite, logo ni musique du jeu n'est utilisé.

- **Écran de combat** vu à la première personne : un décor en pixel art
  (ciel en bandes tramées, montagnes enneigées, château royal, prairie et
  chemin de terre) et le **Bogue** (clin d'œil aux bugs informatiques), un
  slime bleu translucide à la pointe recourbée, avec de grands yeux ronds et
  un large sourire, dessiné pixel par pixel et animé sur 2 images (il
  s'écrase légèrement, comme quand il sautille).
  Tout est dessiné en JavaScript sur un `<canvas>` en basse résolution
  (256 × 144), agrandi sans lissage (`image-rendering: pixelated`).
- **Fenêtre d'état** en haut : nom, vocation, NIV, PV, PM et EXP.
- **Menu de commandes** : Présentation, Expériences, Formations,
  Compétences, Langues, Loisirs, CV complet, Combattre. Curseur ▶ qui
  clignote, navigation à la souris ou au clavier (flèches + Entrée).
  Chaque commande ouvre la section dans une fenêtre Dragon Quest : fond noir
  uni, bordure blanche épaisse, coins arrondis, police pixel blanche, ▼
  clignotant.
- **Fenêtre de message** : le texte s'affiche lettre par lettre (un clic
  affiche tout d'un coup). Les lecteurs d'écran reçoivent le texte complet.
- **Combat bonus** : « Combattre » ouvre une fenêtre **Sorts**, avec des sorts
  originaux au thème informatique et leur coût en PM :
  - *Attaque* (gratuit) ;
  - *Ping* (2 PM) : un éclair en pixels frappe le Bogue ;
  - *Pare-feu* (4 PM) : un mur de flammes s'élève ;
  - *Redémarrage* (6 PM) : l'écran flashe en blanc ;
  - *Pause café* (gratuit) : rend 10 PV et 6 PM.

  Chaque monstre riposte à chaque tour. Coups critiques avec tremblement
  d'écran, passage de niveau tous les 10 points d'expérience (PV et PM
  restaurés). Navigation au clavier (flèches, Entrée, Échap pour revenir).
- **Bestiaire** : après chaque victoire, le monstre suivant apparaît, de plus
  en plus coriace (puis on recommence au début). Tous sont originaux, dessinés
  pixel par pixel et animés sur 2 images, sur le thème des menaces
  informatiques :

  | Monstre | PV | EXP | Animation |
  |---|---|---|---|
  | Le Bogue (slime bleu) | 24 | 2 | s'écrase en sautillant |
  | La Chauve-Spam | 28 | 3 | bat des ailes |
  | Le Fantôme 404 | 30 | 4 | flotte, traîne ondulée |
  | Le Ver du Réseau | 34 | 5 | ondule |
  | Le Golem Serveur | 44 | 8 | voyants qui clignotent, bras qui bougent |
- **Son rétro** facultatif (désactivé par défaut) : « bip » du texte, bruit
  d'impact et petite fanfare de victoire, générés avec la Web Audio API.
- Sans JavaScript, le CV complet reste affiché et les commandes deviennent
  des liens vers chaque section.
- **Impression** (bouton « Imprimer le CV » ou Ctrl+P) : une feuille de style
  dédiée produit un **CV standard sur une page A4**, sans le style Dragon
  Quest : police classique, noir sur blanc, en-tête avec nom, poste visé et
  contact, puis deux colonnes (présentation et expériences à gauche ;
  formations, compétences, langues et centres d'intérêt à droite).

## Arborescence

```
.
├─ index.html      contenu du CV + styles (balise <style>, mobile-first)
├─ js/app.js       pixel art, menu, messages, combat, son (chargé avec defer)
├─ img/            images optimisées (aucune : tout est dessiné en code)
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
- Refonte complète dans le style des Dragon Quest classiques : écran de
  combat en pixel art, fenêtres noires à bordure blanche épaisse, menu de
  commandes utilisable au clavier, messages lettre par lettre, combat bonus.
- …
