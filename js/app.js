/* CV façon Dragon Quest classique : scène de combat en pixel art, menu de
   commandes pour ouvrir les sections du CV, messages lettre par lettre.
   Sans JavaScript, la page reste lisible : les commandes sont des ancres
   vers les sections du CV affiché en entier. */

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ===== Petit générateur pseudo-aléatoire (décor identique à chaque visite) ===== */
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ===== Décor de combat : plaine, montagnes, château (256 × 144 pixels) ===== */
function drawBackdrop(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const random = seededRandom(7);
  const rect = (x, y, w, h, colour) => {
    ctx.fillStyle = colour;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const dot = (x, y, colour) => rect(x, y, 1, 1, colour);
  const HORIZON = 86;

  // Ciel en bandes de couleur, avec un tramage entre les bandes (pas de dégradé)
  rect(0, 0, W, 28, "#0078f8");
  rect(0, 28, W, 30, "#3cbcfc");
  rect(0, 58, W, HORIZON - 58, "#a4e4fc");
  for (const [y0, a, b] of [[26, "#0078f8", "#3cbcfc"], [56, "#3cbcfc", "#a4e4fc"]]) {
    for (let y = y0; y < y0 + 4; y++) {
      for (let x = 0; x < W; x++) dot(x, y, (x + y) % 2 ? a : b);
    }
  }

  // Nuages en pixels : blancs, avec une ombre bleu clair en bas
  const cloud = (cx, cy, puffs) => {
    for (let y = cy - 12; y < cy + 8; y++) {
      for (let x = cx - 30; x < cx + 30; x++) {
        const inside = puffs.some(([dx, dy, r]) => (x - cx - dx) ** 2 + (y - cy - dy) ** 2 <= r * r);
        if (inside && y <= cy + 4) dot(x, y, y > cy + 1 ? "#a4e4fc" : "#ffffff");
      }
    }
  };
  cloud(40, 18, [[-10, 2, 5], [-3, -1, 7], [6, 1, 6], [13, 3, 4]]);
  cloud(150, 30, [[-8, 2, 5], [0, -1, 7], [9, 2, 5]]);
  cloud(222, 14, [[-6, 2, 4], [1, 0, 6], [8, 2, 4]]);

  // Montagnes : flanc éclairé à gauche, flanc ombré à droite, sommets enneigés
  for (const [cx, height, half] of [[34, 38, 36], [78, 28, 26], [124, 20, 20], [186, 34, 30], [236, 26, 26]]) {
    const top = HORIZON - height;
    for (let y = top; y < HORIZON + 2; y++) {
      const w = ((y - top) / height) * half;
      for (let x = Math.floor(cx - w); x <= cx + w; x++) {
        const snow = y < top + height * 0.28;
        const lit = x < cx;
        dot(x, y, snow ? (lit ? "#ffffff" : "#bcbcbc") : (lit ? "#7c7c7c" : "#585858"));
      }
    }
  }

  // Collines lointaines
  for (let x = 0; x < W; x++) {
    const top = Math.round(HORIZON - 2 + 3 * Math.sin(x / 13) + 2 * Math.sin(x / 5.3));
    rect(x, top, 1, 100 - top, "#00a800");
  }

  // Château royal sur la colline de droite
  const stone = "#bcbcbc";
  const shade = "#7c7c7c";
  const roof = (x, y, w) => {
    for (let i = 0; i < Math.ceil(w / 2); i++) rect(x + i, y - i, w - i * 2, 1, "#f83800");
  };
  rect(198, 68, 28, 18, stone);
  rect(193, 60, 8, 26, stone);
  rect(223, 60, 8, 26, stone);
  rect(205, 54, 14, 16, stone);
  rect(229, 60, 2, 26, shade);
  rect(217, 54, 2, 16, shade);
  roof(192, 59, 10);
  roof(222, 59, 10);
  roof(204, 53, 16);
  for (let x = 198; x < 226; x += 2) dot(x, 67, shade);
  rect(209, 76, 6, 10, "#000000");
  for (const [x, y] of [[196, 66], [226, 66], [208, 60], [215, 60], [196, 74], [226, 74]]) rect(x, y, 1, 2, "#000000");
  rect(211, 40, 1, 6, "#000000");
  rect(212, 40, 4, 3, "#f8d878");

  // Arbres sur les collines
  const tree = (x, y) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = dx * dx + dy * dy;
        if (d <= 16) dot(x + dx, y + dy, d > 10 ? "#005800" : (dx < 0 && dy < 0 ? "#58d854" : "#00a800"));
      }
    }
    rect(x - 1, y + 4, 2, 3, "#ac7c00");
  };
  [[16, 86], [60, 88], [96, 84], [160, 87], [248, 86]].forEach(([x, y]) => tree(x, y));

  // Prairie avec brins d'herbe et fleurs
  for (let x = 0; x < W; x++) {
    const top = Math.round(94 + 2 * Math.sin(x / 20));
    rect(x, top, 1, H - top, "#58d854");
  }
  for (let y = 95; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = random();
      if (n < 0.06) dot(x, y, "#00a800");
      else if (n < 0.064) dot(x, y, n < 0.062 ? "#f8f878" : "#ffffff");
    }
  }

  // Chemin de terre qui file vers l'horizon
  for (let y = 94; y < H; y++) {
    const t = (y - 94) / (H - 94);
    const w = 4 + 84 * t;
    rect(128 - w / 2, y, w, 1, "#fca044");
    dot(128 - w / 2, y, "#c84c0c");
    dot(128 + w / 2 - 1, y, "#c84c0c");
    if (random() < 0.25) dot(128 - w / 2 + random() * w, y, "#c84c0c");
  }
}

/* ===== Bestiaire : monstres originaux en pixel art (24 × 22 pixels) =====
   Chaque monstre est dessiné par une fonction, en 2 images d'animation. */
const SPRITE_W = 24;
const SPRITE_H = 22;
const newGrid = () => Array.from({ length: SPRITE_H }, () => Array(SPRITE_W).fill("."));

function put(grid, x, y, key) {
  x = Math.round(x);
  y = Math.round(y);
  if (y >= 0 && y < SPRITE_H && x >= 0 && x < SPRITE_W) grid[y][x] = key;
}

function fillRect(grid, x0, y0, x1, y1, key) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) put(grid, x, y, typeof key === "function" ? key(x, y) : key);
  }
}

// Ellipse remplie ; la couleur dépend de la position (ombrage en aplats)
function fillEllipse(grid, cx, cy, rx, ry, keyAt) {
  for (let y = 0; y < SPRITE_H; y++) {
    for (let x = 0; x < SPRITE_W; x++) {
      const nx = (x + 0.5 - cx) / rx;
      const ny = (y + 0.5 - cy) / ry;
      if (nx * nx + ny * ny <= 1) grid[y][x] = keyAt(nx, ny);
    }
  }
}

const shaded = (base, shade) => (nx, ny) => (nx * 0.6 + ny * 0.8 > 0.5 ? shade : base);

// Contour noir net tout autour du sprite
function outline(grid) {
  const copy = grid.map((row) => row.slice());
  for (let y = 0; y < SPRITE_H; y++) {
    for (let x = 0; x < SPRITE_W; x++) {
      if (copy[y][x] !== ".") continue;
      const touches = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const v = copy[y + dy]?.[x + dx];
        return v && v !== "." && v !== "k";
      });
      if (touches) grid[y][x] = "k";
    }
  }
  return grid;
}

/* --- Le Bogue : slime bleu translucide à la pointe recourbée --- */
function makeSlime(frame) {
  const grid = newGrid();
  const cx = 12;
  // Image 2 : le slime s'écrase un peu (plus large, plus bas), comme quand il sautille
  const tipY = frame ? 5 : 4;
  const cy = frame ? 14 : 13.5;
  const rx = frame ? 10.8 : 10;
  const ry = frame ? 7 : 7.5;

  for (let y = 0; y <= 19; y++) {
    for (let x = 0; x < SPRITE_W; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      let inside;
      if (py >= cy) {
        inside = ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1;
      } else {
        const t = (py - tipY) / (cy - tipY);
        inside = t >= 0 && Math.abs(px - (cx + (1 - t) * 1.5)) <= rx * t ** 0.75;
      }
      if (!inside) continue;
      const light = ((px - cx) / rx) * 0.6 + ((py - cy) / (cy - tipY)) * 0.8;
      grid[y][x] = light > 0.95 ? "d" : light > 0.55 ? "B" : light < -0.75 ? "l" : "b";
    }
  }
  put(grid, cx + 2, tipY - 1, "b");
  for (const [x, y] of [[7, 10], [8, 10], [7, 11], [9, 8], [10, 7]]) put(grid, x, y + frame, "h");
  fillRect(grid, 8, 11, 10, 14, "w");
  fillRect(grid, 14, 11, 16, 14, "w");
  fillRect(grid, 9, 12, 9, 14, "k");
  fillRect(grid, 15, 12, 15, 14, "k");
  put(grid, 8, 16, "k");
  put(grid, 16, 16, "k");
  put(grid, 9, 17, "k");
  put(grid, 15, 17, "k");
  fillRect(grid, 10, 17, 14, 17, (x) => (x === 10 || x === 14 ? "r" : "p"));
  fillRect(grid, 10, 18, 14, 18, "k");
  return outline(grid);
}

/* --- La Chauve-Spam : chauve-souris violette qui bat des ailes --- */
function makeBat(frame) {
  const grid = newGrid();
  for (let x = 1; x <= 8; x++) {
    const t = (x - 1) / 7;
    const scallop = x % 3 === 0 ? 2 : 0;
    const top = frame ? 9 : Math.round(3 + t * 5);
    const bottom = frame ? Math.round(17 - (1 - t) * 0) - scallop : 12 - scallop;
    for (let y = top; y <= bottom; y++) {
      const key = y <= top ? "M" : "m";
      put(grid, x, y, key);
      put(grid, SPRITE_W - 1 - x, y, key);
    }
  }
  fillEllipse(grid, 12, 12, 4.8, 5.5, shaded("v", "V"));
  for (const [x, y] of [[9, 5], [9, 6], [10, 6], [14, 5], [14, 6], [13, 6]]) put(grid, x + 0.5, y, "v");
  fillRect(grid, 9, 10, 10, 11, "y");
  fillRect(grid, 13, 10, 14, 11, "y");
  put(grid, 10, 11, "k");
  put(grid, 13, 11, "k");
  fillRect(grid, 10, 14, 13, 14, "k");
  put(grid, 10, 15, "w");
  put(grid, 13, 15, "w");
  put(grid, 10, 18, "V");
  put(grid, 13, 18, "V");
  return outline(grid);
}

/* --- Le Fantôme 404 : fantôme blanc à la traîne ondulée --- */
function makeGhost(frame) {
  const grid = newGrid();
  const dy = frame;
  const body = (x, y) => {
    const nx = (x - 12) / 7;
    const ny = (y - 12) / 9;
    return nx * 0.6 + ny * 0.8 > 0.45 ? "G" : "g";
  };
  fillEllipse(grid, 12, 9 + dy, 7.5, 7, (nx, ny) => body(12 + nx * 7, 9 + ny * 7));
  fillRect(grid, 5, 9 + dy, 19, 17 + dy, body);
  for (let x = 5; x <= 19; x++) {
    if ((x + frame * 2) % 4 < 2) put(grid, x, 18 + dy, body(x, 18));
  }
  put(grid, 4, 12 + dy - frame, "g");
  put(grid, 3, 11 + dy - frame, "g");
  put(grid, 20, 12 + dy, "G");
  put(grid, 21, 13 + dy, "G");
  fillRect(grid, 9, 8 + dy, 10, 10 + dy, "k");
  fillRect(grid, 14, 8 + dy, 15, 10 + dy, "k");
  put(grid, 9, 8 + dy, "w");
  put(grid, 14, 8 + dy, "w");
  put(grid, 8, 12 + dy, "p");
  put(grid, 16, 12 + dy, "p");
  fillRect(grid, 11, 12 + dy, 12, 12 + dy, "k");
  put(grid, 10, 13 + dy, "k");
  fillRect(grid, 11, 13 + dy, 12, 13 + dy, "t");
  put(grid, 13, 13 + dy, "k");
  fillRect(grid, 11, 14 + dy, 12, 14 + dy, "k");
  return outline(grid);
}

/* --- Le Ver du Réseau : chenille verte à tête orange qui ondule --- */
function makeWorm(frame) {
  const grid = newGrid();
  for (let i = 0; i < 4; i++) {
    const x = 3.5 + i * 4.2;
    const y = 15 + Math.sin(i * 1.3 + frame * Math.PI) * 1.6;
    const r = 3 + i * 0.2;
    fillEllipse(grid, x, y, r, r * 0.95, shaded("s", "S"));
    put(grid, x - 1, y + r, "S");
    put(grid, x + 1, y + r, "S");
  }
  const hy = 11 + frame;
  fillEllipse(grid, 19, hy, 4.4, 4.2, shaded("h", "H"));
  fillRect(grid, 18, hy - 2, 19, hy - 1, "w");
  put(grid, 19, hy - 1, "k");
  fillRect(grid, 20, hy + 2, 21, hy + 2, "k");
  put(grid, 17, hy - 5, "k");
  put(grid, 16, hy - 6, "y");
  put(grid, 21, hy - 5, "k");
  put(grid, 22, hy - 6, "y");
  return outline(grid);
}

/* --- Le Golem Serveur : tour de serveur en métal, voyants clignotants --- */
function makeGolem(frame) {
  const grid = newGrid();
  const metal = (x) => (x >= 15 ? "G" : "g");
  const arm = frame ? -1 : 0;
  fillRect(grid, 2, 8 + arm, 5, 14 + arm, metal);
  fillRect(grid, 18, 8 - arm, 21, 14 - arm, "G");
  fillRect(grid, 6, 2, 17, 18, metal);
  fillRect(grid, 7, 19, 10, 20, "G");
  fillRect(grid, 13, 19, 16, 20, "G");
  fillRect(grid, 8, 5, 15, 5, "d");
  fillRect(grid, 8, 6, 9, 7, "e");
  fillRect(grid, 14, 6, 15, 7, "e");
  fillRect(grid, 9, 10, 14, 10, "d");
  fillRect(grid, 9, 12, 14, 12, "d");
  fillRect(grid, 8, 14, 15, 16, "d");
  put(grid, 9, 15, frame ? "L" : "l");
  put(grid, 11, 15, frame ? "l" : "L");
  put(grid, 13, 15, frame ? "L" : "l");
  return outline(grid);
}

const MONSTERS = [
  {
    a: "Un Bogue", the: "Le Bogue", fem: false, pv: 24, exp: 2, make: makeSlime,
    colours: { k: "#000000", b: "#3cbcfc", B: "#0078f8", d: "#0058f8", l: "#a4e4fc", h: "#ffffff", w: "#ffffff", r: "#a80020", p: "#f85898" },
    moves: [
      ["Le Bogue fait des bulles. Rien ne se passe.", 0],
      ["Le Bogue provoque une erreur 404 ! Alexis perd 3 PV.", 3],
      ["Le Bogue saute sur Alexis ! Alexis perd 4 PV.", 4],
      ["Le Bogue tente de se dupliquer… mais ce n'était qu'un reflet.", 0]
    ]
  },
  {
    a: "Une Chauve-Spam", the: "La Chauve-Spam", fem: true, pv: 28, exp: 3, make: makeBat,
    colours: { k: "#000000", v: "#6844fc", V: "#4428bc", m: "#9878f8", M: "#6844fc", y: "#f8d878", w: "#ffffff" },
    moves: [
      ["La Chauve-Spam envoie 50 courriels ! Alexis perd 3 PV.", 3],
      ["La Chauve-Spam mord Alexis ! Alexis perd 4 PV.", 4],
      ["La Chauve-Spam tourne en rond dans la boîte de réception.", 0]
    ]
  },
  {
    a: "Un Fantôme 404", the: "Le Fantôme 404", fem: false, pv: 30, exp: 4, make: makeGhost,
    colours: { k: "#000000", g: "#fcfcfc", G: "#a4e4fc", w: "#ffffff", p: "#f8b8f8", t: "#f85898" },
    moves: [
      ["Le Fantôme 404 devient introuvable… puis réapparaît.", 0],
      ["Le Fantôme 404 hante le réseau ! Alexis perd 5 PV.", 5],
      ["Le Fantôme 404 fait « Bouh ! ». Alexis perd 2 PV.", 2]
    ]
  },
  {
    a: "Un Ver du Réseau", the: "Le Ver du Réseau", fem: false, pv: 34, exp: 5, make: makeWorm,
    colours: { k: "#000000", s: "#58d854", S: "#00a800", h: "#fca044", H: "#c84c0c", w: "#ffffff", y: "#f8d878" },
    moves: [
      ["Le Ver du Réseau se propage ! Alexis perd 4 PV.", 4],
      ["Le Ver du Réseau creuse un tunnel. Rien ne se passe.", 0],
      ["Le Ver du Réseau ronge un câble ! Alexis perd 3 PV.", 3]
    ]
  },
  {
    a: "Un Golem Serveur", the: "Le Golem Serveur", fem: false, pv: 44, exp: 8, make: makeGolem,
    colours: { k: "#000000", g: "#bcbcbc", G: "#7c7c7c", d: "#3c3c3c", e: "#3cbcfc", l: "#58d854", L: "#f83800" },
    moves: [
      ["Le Golem Serveur surchauffe ! Alexis perd 6 PV.", 6],
      ["Le Golem Serveur redémarre. Il faut patienter…", 0],
      ["Le Golem Serveur lance une mise à jour ! Alexis perd 5 PV.", 5]
    ]
  }
];
MONSTERS.forEach((m) => (m.frames = [m.make(0), m.make(1)]));

let foeIndex = 0;
let spriteFrame = 0;
const foe = () => MONSTERS[foeIndex];

function drawMonster(canvas) {
  const ctx = canvas.getContext("2d");
  const { frames, colours } = foe();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frames[spriteFrame].forEach((row, y) => row.forEach((key, x) => {
    if (key === ".") return;
    ctx.fillStyle = colours[key];
    ctx.fillRect(x, y, 1, 1);
  }));
}

const screen = document.getElementById("screen");
const monster = document.getElementById("monster");
drawBackdrop(document.getElementById("backdrop"));
drawMonster(monster);

// Animation de 2 images, comme les sprites du jeu
if (!reduceMotion) {
  setInterval(() => {
    spriteFrame ^= 1;
    drawMonster(monster);
  }, 450);
}

/* ===== Son rétro (désactivé par défaut) ===== */
const soundBtn = document.getElementById("soundBtn");
let audio = null;
let soundOn = false;

function tone(freq, duration, delay = 0, volume = 0.04) {
  if (!soundOn || !audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain).connect(audio.destination);
  const start = audio.currentTime + delay;
  osc.start(start);
  osc.stop(start + duration);
}

const blip = () => tone(880, 0.025, 0, 0.02);
const hitSound = () => tone(110, 0.15, 0, 0.06);
const fanfare = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.14, i * 0.13, 0.05));

soundBtn.hidden = false;
soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  if (soundOn && !audio) audio = new AudioContext();
  soundBtn.setAttribute("aria-pressed", String(soundOn));
  soundBtn.textContent = `♪ Son : ${soundOn ? "oui" : "non"}`;
  tone(1047, 0.08);
});

/* ===== Fenêtre de message : texte lettre par lettre, puis ▼ ===== */
const messageEl = document.getElementById("message");
const liveText = document.createElement("span");
const typedText = document.createElement("span");
liveText.className = "sr-only";
liveText.setAttribute("aria-live", "polite");
typedText.setAttribute("aria-hidden", "true");
const introText = messageEl.textContent;
messageEl.textContent = "";
messageEl.append(liveText, typedText);

let typing = null;

function finishTyping() {
  if (!typing) return;
  clearInterval(typing.timer);
  typedText.textContent = typing.text;
  messageEl.classList.add("more");
  const { resolve } = typing;
  typing = null;
  resolve();
}

function say(text) {
  finishTyping();
  liveText.textContent = text;
  messageEl.classList.remove("more");
  return new Promise((resolve) => {
    typing = { text, resolve, timer: null };
    if (reduceMotion) {
      finishTyping();
      return;
    }
    let i = 0;
    typedText.textContent = "";
    typing.timer = setInterval(() => {
      i++;
      typedText.textContent = text.slice(0, i);
      if (i % 2 === 0 && text[i - 1] !== " ") blip();
      if (i >= text.length) finishTyping();
    }, 28);
  });
}

const sayThenWait = (text, ms) => say(text).then(() => wait(ms));

// Un clic sur la fenêtre de message affiche tout le texte d'un coup
document.querySelector(".message-win").addEventListener("click", finishTyping);

say(introText);

/* ===== Fenêtre d'une section ===== */
const sectionDialog = document.getElementById("sectionDialog");
const sectionContent = document.getElementById("sectionContent");
let lastTrigger = null;

function openSection(section, trigger) {
  // Copie de la section sans les id (pour éviter les doublons)
  sectionContent.replaceChildren(...[...section.children].map((el) => el.cloneNode(true)));
  sectionContent.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  sectionContent.querySelector("h2").id = "dialogTitle";
  sectionDialog.setAttribute("aria-labelledby", "dialogTitle");
  lastTrigger = trigger;
  sectionDialog.showModal();
  say(`Alexis ouvre la fenêtre ${trigger.textContent.toUpperCase()}.`);
}

document.getElementById("closeSection").addEventListener("click", () => sectionDialog.close());
sectionDialog.addEventListener("click", (event) => {
  if (event.target === sectionDialog) sectionDialog.close();
});
sectionDialog.addEventListener("close", () => lastTrigger && lastTrigger.focus());

/* ===== CV complet ===== */
const cv = document.getElementById("cv");
const closeCv = document.getElementById("closeCv");
const printBtn = document.getElementById("printBtn");
const background = [screen, document.querySelector(".site-footer")];
let cvTrigger = null;

function openCv(trigger) {
  cvTrigger = trigger;
  root.classList.add("cv-open");
  background.forEach((el) => (el.inert = true));
  closeCv.focus({ preventScroll: true });
  cv.scrollTop = 0;
}

function closeCvPanel() {
  root.classList.remove("cv-open");
  background.forEach((el) => (el.inert = false));
  if (cvTrigger) cvTrigger.focus();
}

closeCv.hidden = false;
printBtn.hidden = false;
closeCv.addEventListener("click", closeCvPanel);
printBtn.addEventListener("click", () => window.print());

cv.addEventListener("click", (event) => {
  if (event.target === cv) closeCvPanel();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && root.classList.contains("cv-open")) closeCvPanel();
});
document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  openCv(null);
});

/* ===== Combat : sorts, PV, PM, expérience ===== */
const fightBtn = document.getElementById("fightBtn");
const spellWin = document.getElementById("spellWin");
const spellList = document.getElementById("spellList");
const scene = document.getElementById("scene");
const fx = document.getElementById("fx");
const fxCtx = fx.getContext("2d");
const stat = {
  niv: document.getElementById("niv"),
  pv: document.getElementById("pv"),
  pm: document.getElementById("pm"),
  exp: document.getElementById("exp")
};

const HERO = { niv: 1, pv: 42, pvMax: 42, pm: 12, pmMax: 12, exp: 0 };
let bugPv = foe().pv;
let busy = false;

// Sorts originaux au thème informatique
const SPELLS = [
  { name: "Attaque", cost: 0, effect: "hit", damage: [4, 7], text: "Alexis attaque !" },
  { name: "Ping", cost: 2, effect: "bolt", damage: [7, 10], text: "Alexis lance Ping ! Un éclair jaillit !" },
  { name: "Pare-feu", cost: 4, effect: "fire", damage: [10, 14], text: "Alexis lance Pare-feu ! Un mur de flammes s'élève !" },
  { name: "Redémarrage", cost: 6, effect: "flash", damage: [16, 20], text: "Alexis lance Redémarrage ! Tout devient blanc !" },
  { name: "Pause café", cost: 0, effect: "heal", text: "Alexis prend une pause café…" }
];


const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function updateStats() {
  for (const key of Object.keys(stat)) stat[key].textContent = HERO[key];
}

/* --- Effets visuels des sorts, dessinés en pixels sur le canvas fx --- */
const fxDot = (x, y, w, h, colour) => {
  fxCtx.fillStyle = colour;
  fxCtx.fillRect(Math.round(x), Math.round(y), w, h);
};
const clearFx = () => fxCtx.clearRect(0, 0, fx.width, fx.height);
const TARGET = { x: 128, y: 98 };

async function flashScene() {
  scene.classList.add("flash");
  await wait(460);
  scene.classList.remove("flash");
}

async function boltEffect() {
  for (let n = 0; n < 3; n++) {
    let x = TARGET.x + randomInt(-20, 20);
    for (let y = 0; y < TARGET.y; y += 6) {
      const nx = y + 6 >= TARGET.y ? TARGET.x : x + randomInt(-7, 7);
      const steps = 6;
      for (let s = 0; s < steps; s++) {
        const px = x + ((nx - x) * s) / steps;
        fxDot(px - 1, y + s, 3, 1, "#f8d878");
        fxDot(px, y + s, 1, 1, "#ffffff");
      }
      x = nx;
    }
    await wait(90);
    clearFx();
    await wait(60);
  }
}

async function fireEffect() {
  for (let frame = 0; frame < 9; frame++) {
    clearFx();
    for (let k = 0; k < 8; k++) {
      const x = 94 + k * 9;
      const h = 14 + ((k * 7 + frame * 5) % 12);
      const base = 128;
      fxDot(x, base - h, 7, h, "#f83800");
      fxDot(x + 1, base - h * 0.75, 5, h * 0.75, "#fca044");
      fxDot(x + 2, base - h * 0.45, 3, h * 0.45, "#f8d878");
    }
    await wait(70);
  }
  clearFx();
}

async function healEffect() {
  for (let frame = 0; frame < 10; frame++) {
    clearFx();
    for (let k = 0; k < 10; k++) {
      const x = 70 + ((k * 37) % 120);
      const y = 120 - frame * 6 - ((k * 13) % 30);
      fxDot(x - 1, y, 3, 1, "#b8f818");
      fxDot(x, y - 1, 1, 3, "#b8f818");
    }
    await wait(60);
  }
  clearFx();
}

async function playEffect(effect) {
  if (reduceMotion) return;
  if (effect === "bolt") await boltEffect();
  if (effect === "fire") await fireEffect();
  if (effect === "flash") {
    await flashScene();
    await flashScene();
  }
  if (effect === "heal") await healEffect();
}

async function shakeScreen() {
  if (reduceMotion) return;
  screen.classList.add("shake");
  await wait(420);
  screen.classList.remove("shake");
}

/* --- Déroulement d'un tour --- */
async function bugTurn() {
  const { moves } = foe();
  const [text, damage] = moves[randomInt(0, moves.length - 1)];
  await sayThenWait(text, 500);
  if (damage) {
    hitSound();
    await shakeScreen();
    HERO.pv = Math.max(1, HERO.pv - damage);
    updateStats();
  }
}

async function victory() {
  monster.classList.add("defeated");
  const beaten = foe();
  await sayThenWait(`${beaten.the} est vaincu${beaten.fem ? "e" : ""} !`, 400);
  HERO.exp += beaten.exp;
  fanfare();
  updateStats();
  await sayThenWait(`Alexis gagne ${beaten.exp} points d'expérience.`, 900);

  // Un niveau tous les 10 points d'expérience
  if (HERO.exp >= HERO.niv * 10) {
    HERO.niv += 1;
    HERO.pvMax += 5;
    HERO.pmMax += 2;
    HERO.pv = HERO.pvMax;
    HERO.pm = HERO.pmMax;
    updateStats();
    fanfare();
    await sayThenWait(`Alexis passe au niveau ${HERO.niv} ! PV et PM sont restaurés.`, 1200);
  }

  // Monstre suivant du bestiaire (on recommence au début après le dernier)
  foeIndex = (foeIndex + 1) % MONSTERS.length;
  bugPv = foe().pv;
  drawMonster(monster);
  monster.classList.remove("defeated");
  await say(`${foe().a} apparaît ! Que doit faire Alexis ?`);
}

async function cast(spell) {
  closeSpells(false);
  if (busy) return;
  busy = true;

  if (spell.cost > HERO.pm) {
    await sayThenWait("Pas assez de PM ! Une pause café s'impose.", 900);
    busy = false;
    openSpells();
    return;
  }

  HERO.pm -= spell.cost;
  updateStats();
  await sayThenWait(spell.text, 300);
  await playEffect(spell.effect);

  if (spell.effect === "heal") {
    HERO.pv = Math.min(HERO.pvMax, HERO.pv + 10);
    HERO.pm = Math.min(HERO.pmMax, HERO.pm + 6);
    updateStats();
    await sayThenWait("Alexis récupère 10 PV et 6 PM.", 700);
    await bugTurn();
  } else {
    hitSound();
    monster.classList.add("hit");
    await wait(750);
    monster.classList.remove("hit");

    let damage = randomInt(...spell.damage);
    if (Math.random() < 1 / 6) {
      damage = Math.round(damage * 1.5);
      await sayThenWait("Coup critique !", 200);
      await shakeScreen();
    }
    bugPv -= damage;
    await sayThenWait(`${foe().the} perd ${damage} PV !`, 500);

    if (bugPv <= 0) {
      await victory();
      busy = false;
      fightBtn.focus();
      return;
    }
    await bugTurn();
  }

  say("Que doit faire Alexis ?");
  busy = false;
  fightBtn.focus();
}

/* --- Fenêtre des sorts --- */
const spellButtons = SPELLS.map((spell) => {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "spell";
  btn.innerHTML = `<span>${spell.name}</span><span class="spell-cost">${spell.cost ? `${spell.cost} PM` : "—"}</span>`;
  btn.setAttribute("aria-label", `${spell.name}, ${spell.cost ? `${spell.cost} PM` : "gratuit"}`);
  btn.addEventListener("click", () => cast(spell));
  li.append(btn);
  spellList.append(li);
  return btn;
});

const backLi = document.createElement("li");
const backBtn = document.createElement("button");
backBtn.type = "button";
backBtn.className = "spell";
backBtn.textContent = "Retour";
backBtn.addEventListener("click", () => closeSpells(true));
backLi.append(backBtn);
spellList.append(backLi);
spellButtons.push(backBtn);

spellButtons.forEach((btn, i) => {
  btn.addEventListener("keydown", (event) => {
    const moves = { ArrowDown: 1, ArrowUp: -1 };
    if (event.key === "Escape") {
      event.preventDefault();
      closeSpells(true);
    }
    if (!(event.key in moves)) return;
    event.preventDefault();
    spellButtons[(i + moves[event.key] + spellButtons.length) % spellButtons.length].focus();
  });
});

function openSpells() {
  if (busy) return;
  spellWin.hidden = false;
  spellButtons[0].focus();
  say(`Quel sort lancer ? ${foe().the} a ${bugPv} PV. Alexis a ${HERO.pm} PM.`);
}

function closeSpells(returnFocus) {
  spellWin.hidden = true;
  if (returnFocus) fightBtn.focus();
}

fightBtn.hidden = false;
fightBtn.addEventListener("click", openSpells);
updateStats();

/* ===== Menu de commandes : souris, clic et flèches du clavier ===== */
const commands = [...document.querySelectorAll(".command")];
const COLUMNS = 2;

function select(index) {
  commands.forEach((cmd, i) => cmd.classList.toggle("selected", i === index));
}

commands.forEach((cmd, i) => {
  cmd.addEventListener("focus", () => select(i));
  cmd.addEventListener("mouseenter", () => select(i));
  cmd.addEventListener("keydown", (event) => {
    const moves = { ArrowDown: COLUMNS, ArrowUp: -COLUMNS, ArrowRight: 1, ArrowLeft: -1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    commands[(i + moves[event.key] + commands.length) % commands.length].focus();
  });

  if (cmd === fightBtn) return;
  cmd.addEventListener("click", (event) => {
    event.preventDefault();
    if (cmd.hasAttribute("data-full")) {
      openCv(cmd);
      say("Alexis déroule le CV complet !");
    } else {
      openSection(document.querySelector(cmd.getAttribute("href")), cmd);
    }
  });
});

select(0);
