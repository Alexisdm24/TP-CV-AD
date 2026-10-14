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
  uni, bordure blanche épaisse, coins arrondis, texte blanc en police à chasse fixe, ▼
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
- **Options** : boutons « Son » et « Animations » dans la fenêtre d'état.
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
├─ index.html      structure et contenu du CV (HTML sémantique)
├─ css/style.css   mise en page mobile-first + feuille d'impression
├─ js/app.js       pixel art, menu, messages, combat, son (facultatif, chargé avec defer)
├─ img/            images optimisées (aucune : tout est dessiné en code)
├─ cv.md           contenu source rédigé en Markdown
└─ .gitignore      fichiers locaux exclus du dépôt
```

## Choix techniques

- **HTML sémantique** : un seul `<h1>`, un `<h2>` par section, un `<h3>` par
  expérience ou formation. Balises `header`, `nav`, `main`, `section`,
  `article`, `footer`.
- **Confidentialité** : aucun téléphone, adresse ou e-mail. Seul contact :
  le lien GitHub.
- **Accessibilité** : lien d'évitement, focus visibles, navigation au clavier
  (Tab, flèches, Entrée, Échap), texte ≥ 16 px, contraste blanc sur noir.
  Un bouton **« Animations : oui / non »** permet d'arrêter le clignotement et
  les animations (WCAG 2.2.2) ; elles sont aussi coupées si le système demande
  de réduire les animations. Les messages animés sont lus en entier par les
  lecteurs d'écran.
- **Sans JavaScript** : le CV complet s'affiche, les commandes deviennent des
  liens vers chaque section, et la scène (dessinée en JS) est masquée.
- **Performance** : aucune bibliothèque, aucune police web (polices système à
  chasse fixe : Consolas, Lucida Console, Courier New), aucune image bitmap,
  aucune requête vers un site externe, script chargé avec `defer`.
- **Cache** : les liens vers `css/style.css` et `js/app.js` portent un numéro
  de version (`?v=…`), à augmenter à chaque modification pour que les
  navigateurs ne gardent pas l'ancienne version.

## Auto-évaluation

### Résultats des outils

- **W3C (validator.w3.org)** : V1 publiée → **1 erreur** (ligne 11 : l'icône
  d'onglet en `data:` contenait des espaces non encodés). Corrigée (espaces
  encodés en `%20`). À revalider après publication : 0 erreur attendue.
- **Structure des titres (Outiref)** : 1 seul `<h1>` (le nom), puis 6 `<h2>`
  (une par section) et des `<h3>` pour chaque expérience et formation, sans
  saut de niveau. Vérifié automatiquement : aucun identifiant en double,
  aucune référence ARIA cassée.
- **PageSpeed (mobile)** : Performance … · Accessibilité … · Bonnes
  pratiques … · SEO … *(à compléter après publication)*
- **Vérifications complémentaires** (outils de développement du navigateur) :
  aucun texte sous 16 px, aucun contraste insuffisant, aucune zone cliquable
  sous 24 px, aucun défilement horizontal à 320, 375, 480, 600, 760, 900 et
  1024 px, aucune erreur dans la console, impression sur **une page A4**.

### Analyse et corrections

| Problème constaté | Cause | Correction |
|---|---|---|
| Erreur W3C sur l'icône d'onglet | espaces non encodés dans l'URL `data:` | espaces encodés en `%20` |
| CSS dans `index.html` | regroupement initial dans un seul fichier | CSS déplacé dans `css/style.css`, conforme à l'arborescence |
| Police web (Google Fonts) | police pixel pour l'ambiance du jeu | remplacée par des polices système (conseil du sujet) |
| Menu qui débordait sur petits écrans | police à chasse fixe plus large | une colonne sur téléphone, deux colonnes à partir de 480 px |
| Animations sans moyen de les arrêter | curseur et monstres animés en continu | bouton « Animations : oui / non » (WCAG 2.2.2) |
| Scène vide sans JavaScript | décor dessiné uniquement en JS | scène masquée quand le JS est absent |
| Ancien script gardé en cache après publication | cache du navigateur (GitHub Pages) | numéro de version dans les liens CSS et JS |
| Fichiers inutiles dans le dépôt | `gitkeep` parasite, configuration locale | supprimés, `.gitignore` ajouté |

### Améliorations entre la V1 et la version finale

- Suppression du téléphone, de l'adresse et de l'e-mail : seul contact, le
  lien GitHub.
- Contenu du CV écrit directement dans le HTML (et non généré en JavaScript),
  pour le référencement et l'affichage sans JavaScript.
- Toutes les tailles de texte passées à 16 px minimum ; `<title>` raccourci à
  moins de 60 caractères ; `aria-labelledby` qui pointait vers un id absent
  remplacé par un `aria-label`.
- Plusieurs thèmes essayés (paradis, version « réaliste » en filtres SVG,
  Dragon Quest IX), puis refonte finale dans le style des **Dragon Quest
  classiques** : écran de combat en pixel art, fenêtres noires à bordure
  blanche, menu de commandes au clavier, messages lettre par lettre, combat
  bonus avec sorts et bestiaire de 5 monstres originaux.
- Feuille de style d'impression : CV standard sur une page A4.
- Mise en conformité finale avec les consignes (voir le tableau ci-dessus).
