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

/* ===== Le Bogue : monstre original (goutte verte à antennes) ===== */
const BUG_COLOURS = {
  k: "#000000", g: "#58d854", G: "#00a800", h: "#b8f818",
  w: "#ffffff", y: "#f8d878", r: "#f83800"
};

function line(grid, x0, y0, x1, y1, key) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    grid[y][x] = key;
  }
}

function makeBug(frame) {
  const W = 24;
  const H = 22;
  const grid = Array.from({ length: H }, () => Array(W).fill("."));
  const cx = 12;
  const cy = frame ? 15 : 14.5;
  const rx = frame ? 9.8 : 9;
  const ry = frame ? 6.2 : 6.8;

  // Corps : ellipse à fond plat, ombre en bas à droite, reflet en haut à gauche
  for (let y = 0; y <= 20; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy > 1) continue;
      grid[y][x] = dx * 0.6 + dy * 0.8 > 0.55 ? "G" : "g";
      if ((x - 7.5) ** 2 + (y - 10.5) ** 2 <= 2.2) grid[y][x] = "h";
    }
  }

  // Antennes terminées par une boule jaune
  line(grid, 9, 9, 6, 3, "k");
  line(grid, 14, 9, 17, 3, "k");
  for (const [x, y] of [[5, 1], [6, 1], [5, 2], [6, 2], [17, 1], [18, 1], [17, 2], [18, 2]]) grid[y][x] = "y";

  // Yeux ronds et grand sourire
  for (let y = 12; y <= 14; y++) {
    for (const x of [7, 8, 9, 14, 15, 16]) grid[y][x] = "w";
  }
  for (const y of [13, 14]) {
    grid[y][9] = "k";
    grid[y][14] = "k";
  }
  grid[16][8] = "k";
  grid[16][15] = "k";
  grid[17][9] = "k";
  grid[17][14] = "k";
  for (let x = 10; x <= 13; x++) {
    grid[17][x] = "r";
    grid[18][x] = "k";
  }

  // Contour noir net tout autour
  const copy = grid.map((row) => row.slice());
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
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

const bugFrames = [makeBug(0), makeBug(1)];

function drawBug(canvas, frame) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bugFrames[frame].forEach((row, y) => row.forEach((key, x) => {
    if (key === ".") return;
    ctx.fillStyle = BUG_COLOURS[key];
    ctx.fillRect(x, y, 1, 1);
  }));
}

const screen = document.getElementById("screen");
const monster = document.getElementById("monster");
drawBackdrop(document.getElementById("backdrop"));
drawBug(monster, 0);

// Animation de 2 images, comme les sprites du jeu
if (!reduceMotion) {
  let frame = 0;
  setInterval(() => {
    frame ^= 1;
    drawBug(monster, frame);
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

/* ===== Combat bonus contre le Bogue ===== */
const fightBtn = document.getElementById("fightBtn");
const expEl = document.getElementById("exp");
let exp = 0;
let fighting = false;

async function fight() {
  if (fighting) return;
  fighting = true;

  await sayThenWait("Alexis attaque !", 400);
  hitSound();
  monster.classList.add("hit");
  await wait(750);
  monster.classList.remove("hit");

  await sayThenWait("Coup critique ! Le Bogue perd 12 PV !", 300);
  if (!reduceMotion) {
    screen.classList.add("shake");
    await wait(420);
    screen.classList.remove("shake");
  }

  monster.classList.add("defeated");
  await sayThenWait("Le Bogue est vaincu !", 400);

  exp += 2;
  expEl.textContent = exp;
  fanfare();
  await sayThenWait("Alexis gagne 2 points d'expérience.", 1400);

  monster.classList.remove("defeated");
  await say("Un nouveau Bogue apparaît ! Que doit faire Alexis ?");
  fighting = false;
}

fightBtn.hidden = false;
fightBtn.addEventListener("click", fight);

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
