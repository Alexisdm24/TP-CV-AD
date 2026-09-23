/* CV « paradis » : nuages -> sections, ange -> parchemin complet.
   Sans JavaScript, la page reste lisible : les nuages sont des ancres
   vers les sections du CV affiché en entier. */

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Nuages : ouvrent une section dans une fenêtre ===== */
const sectionDialog = document.getElementById("sectionDialog");
const sectionContent = document.getElementById("sectionContent");
let lastTrigger = null;

document.querySelectorAll(".cloud").forEach((cloud) => {
  cloud.addEventListener("click", (event) => {
    event.preventDefault();
    const section = document.querySelector(cloud.getAttribute("href"));

    // Copie de la section sans les id (pour éviter les doublons)
    sectionContent.replaceChildren(...[...section.children].map((el) => el.cloneNode(true)));
    sectionContent.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    sectionContent.querySelector("h2").id = "dialogTitle";
    sectionDialog.setAttribute("aria-labelledby", "dialogTitle");

    lastTrigger = cloud;
    sectionDialog.showModal();
  });
});

document.getElementById("closeSection").addEventListener("click", () => sectionDialog.close());
sectionDialog.addEventListener("click", (event) => {
  if (event.target === sectionDialog) sectionDialog.close();
});
sectionDialog.addEventListener("close", () => lastTrigger && lastTrigger.focus());

/* ===== Parchemin : CV complet ===== */
const cv = document.getElementById("cv");
const closeCv = document.getElementById("closeCv");
const printBtn = document.getElementById("printBtn");
const angel = document.getElementById("angel");
const background = [document.querySelector(".site-header"), document.querySelector(".site-footer"), angel];

function openCv() {
  root.classList.add("cv-open");
  background.forEach((el) => (el.inert = true));
  closeCv.focus({ preventScroll: true });
  cv.scrollTop = 0;
}

function closeCvPanel() {
  root.classList.remove("cv-open");
  background.forEach((el) => (el.inert = false));
  angel.focus();
}

closeCv.hidden = false;
printBtn.hidden = false;
angel.hidden = false;

angel.addEventListener("click", openCv);
closeCv.addEventListener("click", closeCvPanel);
printBtn.addEventListener("click", () => window.print());

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  openCv();
});

// Clic en dehors du parchemin ou touche Échap pour fermer
cv.addEventListener("click", (event) => {
  if (event.target === cv) closeCvPanel();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && root.classList.contains("cv-open")) closeCvPanel();
});

/* ===== Vol de l'ange (trajectoire en 8, pause au survol) ===== */
let paused = false;
let t = 0;
let last = performance.now();

["mouseenter", "focus"].forEach((type) => angel.addEventListener(type, () => (paused = true)));
["mouseleave", "blur"].forEach((type) => angel.addEventListener(type, () => (paused = false)));

function fly(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (!paused && !reduceMotion) t += dt;

  const rangeX = (window.innerWidth - angel.offsetWidth) / 2;
  const rangeY = (window.innerHeight - angel.offsetHeight) / 2;
  const x = rangeX + rangeX * 0.9 * Math.sin(t * 0.18);
  const y = rangeY + rangeY * 0.75 * Math.sin(t * 0.31) + 10 * Math.sin(t * 2.2);

  angel.style.transform = `translate(${x}px, ${y}px)`;
  angel.classList.toggle("facing-left", Math.cos(t * 0.18) < 0);
  requestAnimationFrame(fly);
}
requestAnimationFrame(fly);

/* ===== Ailes de pierre : trois rangées de plumes sculptées, en éventail ===== */
const SVG_NS = "http://www.w3.org/2000/svg";
const featherRows = [
  { count: 9, from: -5, to: 80, length: [0.9, 1.3], width: 1.3 },  // rémiges
  { count: 7, from: 10, to: 74, length: [0.6, 0.8], width: 1.2 },  // couvertures
  { count: 6, from: 20, to: 68, length: [0.35, 0.45], width: 1.1 } // petites plumes
];

document.querySelectorAll(".angel .wing").forEach((wing) => {
  featherRows.forEach((row) => {
    for (let i = 0; i < row.count; i++) {
      const k = i / (row.count - 1);
      const angle = row.from + (row.to - row.from) * k;
      const length = row.length[0] + (row.length[1] - row.length[0]) * k;
      const plume = document.createElementNS(SVG_NS, "use");
      plume.setAttribute("href", "#a-plume");
      plume.setAttribute("fill", "url(#s-stone)");
      plume.setAttribute("stroke", "#8f897d");
      plume.setAttribute("stroke-width", "0.7");
      plume.setAttribute("transform", `rotate(${angle.toFixed(1)}) scale(${length.toFixed(2)} ${row.width})`);
      wing.appendChild(plume);
    }
  });
});

/* ===== Décor : particules de lumière qui montent ===== */
const sky = document.getElementById("sky");

for (let i = 0; i < 24; i++) {
  const mote = document.createElement("span");
  mote.className = "mote";
  mote.style.left = `${Math.random() * 100}%`;
  mote.style.animationDuration = `${18 + Math.random() * 22}s`;
  mote.style.animationDelay = `${Math.random() * -40}s`;
  sky.appendChild(mote);
}
