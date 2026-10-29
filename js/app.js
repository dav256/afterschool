// Afterschool portal — renders the game library from js/games.js (DEFAULT_GAMES),
// with per-device overrides (order, removals, additions, style, favorites,
// recents, cloak) kept in localStorage.

const LS_GAMES = "afterschool:games";
const LS_STYLE = "afterschool:style";
const LS_CLOAK = "afterschool:cloak";
const LS_FAVS = "afterschool:favs";
const LS_PLAYS = "afterschool:plays";
const LS_RECENTS = "afterschool:recents";
const ADMIN_PASSWORD = "afterschool"; // default shown in the admin dialog

let games = loadGames();
let favs = loadJSON(LS_FAVS, []);
let plays = loadJSON(LS_PLAYS, {});
let recents = loadJSON(LS_RECENTS, []);
let segMode = "browse"; // browse | recents | favorites
let chip = "all";       // all | popular | <category>
let query = "";

/* ---------- storage helpers ---------- */

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v == null ? fallback : v;
  } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function loadGames() {
  const stored = loadJSON(LS_GAMES, null);
  if (Array.isArray(stored) && stored.length) {
    const ids = new Set(stored.map((g) => g.id));
    const merged = stored.slice();
    DEFAULT_GAMES.forEach((g) => { if (!ids.has(g.id)) merged.push(g); });
    return merged;
  }
  return DEFAULT_GAMES.slice();
}
function saveGames() { saveJSON(LS_GAMES, games); }

function recordPlay(g) {
  plays[g.id] = (plays[g.id] || 0) + 1;
  saveJSON(LS_PLAYS, plays);
  recents = [g.id].concat(recents.filter((id) => id !== g.id)).slice(0, 30);
  saveJSON(LS_RECENTS, recents);
}

/* ---------- cloak ---------- */

const CLOAKS = [
  { id: "none",      name: "Afterschool",  title: null,                          icon: null },
  { id: "classroom", name: "Google Classroom", title: "Classes",                 icon: "https://ssl.gstatic.com/classroom/favicon.png" },
  { id: "docs",      name: "Google Docs",  title: "Google Docs",                 icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { id: "drive",     name: "Google Drive", title: "My Drive - Google Drive",     icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { id: "google",    name: "Google",       title: "Google",                      icon: "https://www.google.com/favicon.ico" },
  { id: "schoology", name: "Schoology",    title: "Home | Schoology",            icon: "https://www.schoology.com/favicon.ico" },
  { id: "canvas",    name: "Canvas",       title: "Dashboard",                   icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e21687aca37a684712c92911ef29acc4.ico" },
  { id: "khan",      name: "Khan Academy", title: "Khan Academy",                icon: "https://cdn.kastatic.org/images/favicon.ico?v=16b001c73b8b" },
  { id: "wikipedia", name: "Wikipedia",    title: "Wikipedia",                   icon: "https://www.wikipedia.org/static/favicon/wikipedia.ico" },
];

function loadCloak() {
  return Object.assign(
    { preset: "none", customTitle: "", auto: false, panicKey: "`", panicUrl: "https://classroom.google.com/" },
    loadJSON(LS_CLOAK, {})
  );
}
function saveCloak(c) { saveJSON(LS_CLOAK, c); }

function setFavicon(href) {
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.removeAttribute("type");
  link.href = href;
}

function applyCloak() {
  const c = loadCloak();
  const preset = CLOAKS.find((p) => p.id === c.preset) || CLOAKS[0];
  if (c.customTitle) document.title = c.customTitle;
  else if (preset.title) document.title = preset.title;
  if (preset.icon) setFavicon(preset.icon);
  else setFavicon("icon.svg");
}

function panicCheck(e) {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")) return;
  const c = loadCloak();
  if (e.key === c.panicKey && c.panicUrl) {
    window.location.replace(c.panicUrl);
  }
}

function openBlank() {
  const c = loadCloak();
  const preset = CLOAKS.find((p) => p.id === c.preset) || CLOAKS[1];
  const win = window.open("about:blank", "_blank");
  if (!win) { alert("Popup blocked — allow popups for this site and try again."); return; }
  const title = c.customTitle || preset.title || "Classes";
  win.document.write(
    "<!DOCTYPE html><html><head><title>" + title + "</title></head>" +
    '<body style="margin:0;padding:0;overflow:hidden">' +
    '<iframe src="' + window.location.href + '" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>' +
    "</body></html>"
  );
  win.document.close();
}

/* ---------- style ---------- */

function loadStyle() { return loadJSON(LS_STYLE, {}); }

function applyStyle() {
  const s = loadStyle();
  if (s.accent) document.documentElement.style.setProperty("--accent", s.accent);
  if (s.name) {
    const logoEl = document.querySelector(".logo");
    if (s.name !== "afterschool") logoEl.textContent = s.name;
    else if (!logoEl.querySelector("img")) logoEl.innerHTML = '<img src="logo-white.svg" alt="Afterschool" class="logo-img" />';
    document.getElementById("wordmark").textContent = s.name;
    const c = loadCloak();
    if (c.preset === "none" && !c.customTitle) {
      document.title = s.name.charAt(0).toUpperCase() + s.name.slice(1);
    }
  }
  if (s.tagline) document.getElementById("tagline").textContent = s.tagline;
  const accentInput = document.getElementById("style-accent");
  const nameInput = document.getElementById("style-name");
  const taglineInput = document.getElementById("style-tagline");
  if (accentInput && s.accent) accentInput.value = s.accent;
  if (nameInput && s.name) nameInput.value = s.name;
  if (taglineInput && s.tagline) taglineInput.value = s.tagline;
  document.querySelectorAll(".swatch").forEach((sw) => {
    sw.classList.toggle("active", !!s.accent && sw.getAttribute("data-accent") === s.accent);
  });
}

/* ---------- cool features ---------- */

function updateClock() {
  const el = document.getElementById("float-clock");
  if (!el) return;
  const now = new Date();
  const timeOptions = { timeZone: "America/Chicago", hour: "2-digit", minute: "2-digit", hour12: true };
  const dateOptions = { timeZone: "America/Chicago", weekday: "short", month: "short", day: "numeric" };
  const time = now.toLocaleTimeString("en-US", timeOptions);
  const date = now.toLocaleDateString("en-US", dateOptions);
  el.innerHTML = `<div style="font-size:0.75rem;opacity:0.8;margin-bottom:1px">${date}</div><div>${time} CT</div>`;
  el.style.display = "block";
}
setInterval(updateClock, 10000);
updateClock();

function showGameOfTheDay() {
  const banner = document.getElementById("gotd-banner");
  const nameEl = document.getElementById("gotd-name");
  if (!banner || !games.length) return;
  const day = Math.floor(Date.now() / 86400000);
  const g = games[day % games.length];
  nameEl.textContent = g.name;
  banner.style.display = "block";
  banner.onclick = () => { recordPlay(g); location.href = g.path; };
}

let musicAudio = null;
function setupMusic() {
  const track = document.getElementById("music-track");
  const vol = document.getElementById("music-volume");
  if (!track) return;
  const saved = loadJSON("afterschool:music", {});
  if (saved.url) track.value = saved.url;
  if (saved.volume != null) vol.value = saved.volume;

  function play() {
    if (musicAudio) { musicAudio.pause(); musicAudio = null; }
    const url = track.value;
    if (!url) return;
    musicAudio = new Audio(url);
    musicAudio.loop = true;
    musicAudio.volume = (vol.value || 40) / 100;
    musicAudio.play().catch(() => {});
    saveJSON("afterschool:music", { url, volume: +vol.value });
  }
  track.addEventListener("change", play);
  vol.addEventListener("input", () => {
    if (musicAudio) musicAudio.volume = vol.value / 100;
    const cur = loadJSON("afterschool:music", {});
    cur.volume = +vol.value;
    saveJSON("afterschool:music", cur);
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  else document.exitFullscreen();
}

function openShortcuts() {
  document.getElementById("shortcuts-modal").hidden = false;
}

/* ---------- browsing: segments + chips ---------- */

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;",
  }[c]));
}

function visibleGames() {
  let list;
  if (segMode === "recents") {
    const byId = new Map(games.map((g) => [g.id, g]));
    list = recents.map((id) => byId.get(id)).filter(Boolean);
  } else if (segMode === "favorites") {
    list = games.filter((g) => favs.includes(g.id));
  } else {
    list = games.slice();
    if (chip === "popular") list = list.filter((g) => g.popular);
    else if (chip !== "all") list = list.filter((g) => g.category === chip);
  }
  if (query) list = list.filter((g) => g.name.toLowerCase().includes(query));
  return list;
}

function renderChips() {
  const el = document.getElementById("chips");
  el.style.display = segMode === "browse" ? "" : "none";
  if (segMode !== "browse") return;
  const counts = {};
  games.forEach((g) => { counts[g.category] = (counts[g.category] || 0) + 1; });
  const cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const popularCount = games.filter((g) => g.popular).length;
  const defs = [{ id: "all", label: "All Games", n: games.length },
                { id: "popular", label: "Popular", n: popularCount }]
    .concat(cats.map((c) => ({ id: c, label: c, n: counts[c] })));
  el.innerHTML = defs.map((d) =>
    '<button class="chip' + (chip === d.id ? " active" : "") + '" data-chip="' + esc(d.id) + '">' +
    esc(d.label) + '<span class="n">' + d.n + "</span></button>"
  ).join("");
}

function syncNav() {
  document.querySelectorAll(".seg-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-seg") === segMode);
  });
  document.querySelectorAll("[data-filter]").forEach((el) => {
    const f = el.getAttribute("data-filter");
    let on = false;
    if (segMode === "favorites") on = f === "favorites";
    else if (segMode === "browse") on = f === chip;
    el.classList.toggle("active", on);
  });
}

function render() {
  const list = visibleGames();
  document.getElementById("total-count").textContent = games.length;
  document.getElementById("showing-count").textContent =
    "Showing " + list.length + " of " + games.length + " games";
  renderChips();
  syncNav();

  const featuredEl = document.getElementById("featured");
  if (segMode === "browse" && chip === "all" && !query) {
    const picks = games.filter((g) => g.popular).slice(0, 2);
    featuredEl.innerHTML = picks.map((g) =>
      '<a class="featured-card" href="' + esc(g.path) + '">' +
        '<div class="featured-label">Featured</div>' +
        "<h2>" + esc(g.name) + "</h2>" +
        "<p>" + esc(g.note || "Local") + " · " + esc(g.category) + "</p>" +
        '<span class="featured-cta">Play now →</span>' +
      "</a>"
    ).join("");
    featuredEl.style.display = "";
  } else {
    featuredEl.innerHTML = "";
    featuredEl.style.display = "none";
  }

  const grid = document.getElementById("grid");
  if (!list.length) {
    let msg = "No games match. Try a different search or category.";
    if (segMode === "favorites") msg = "No favorites yet. Hover a game and tap the heart to pin it here.";
    if (segMode === "recents") msg = "Nothing here yet — games you play will show up here.";
    grid.innerHTML = '<div class="empty">' + msg + "</div>";
    return;
  }
  grid.innerHTML = list.map((g) => {
    const isFav = favs.includes(g.id);
    return '<a class="card" href="' + esc(g.path) + '" data-id="' + esc(g.id) + '">' +
      '<div class="thumb" style="background:' + esc(g.color || "#2a2a2a") + '">' +
        (g.popular ? '<span class="badge">Popular</span>' : "") +
        '<span class="icon">' + esc(g.icon || "🎮") + "</span>" +
        '<span class="fav' + (isFav ? " active" : "") + '" data-fav="' + esc(g.id) + '" title="Favorite">♥</span>' +
        '<span class="play"><i>▶</i></span>' +
      "</div>" +
      '<div class="card-title">' + esc(g.name) + "</div>" +
      '<div class="card-meta">' + esc(g.category) + " · " + esc(g.note || "Local") + "</div>" +
    "</a>";
  }).join("");
}

function setFilter(f) {
  if (f === "favorites") { segMode = "favorites"; }
  else { segMode = "browse"; chip = f; }
  render();
}

function playRandom() {
  if (!games.length) return;
  const g = games[Math.floor(Math.random() * games.length)];
  recordPlay(g);
  window.location.href = g.path;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "game";
}

/* ---------- public settings ---------- */

function showSettingsTab(name) {
  document.querySelectorAll("#settings-modal .admin-tab").forEach((t) =>
    t.classList.toggle("active", t.getAttribute("data-settings-tab") === name));
  document.getElementById("settings-tab-cloak").hidden = name !== "cloak";
  document.getElementById("settings-tab-style").hidden = name !== "style";
  if (name === "cloak") renderCloakTab();
}

function openSettings(tab) {
  document.getElementById("settings-modal").hidden = false;
  showSettingsTab(tab || "cloak");
}

/* ---------- admin ---------- */

function renderAdminList() {
  const ul = document.getElementById("admin-game-list");
  ul.innerHTML = "";
  games.forEach((g, i) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = i;
    const span = document.createElement("span");
    span.textContent = g.name + " — " + g.category + (plays[g.id] ? " · " + plays[g.id] + " plays" : "");
    const rm = document.createElement("button");
    rm.className = "rm";
    rm.textContent = "Remove";
    rm.addEventListener("click", () => {
      games.splice(i, 1);
      saveGames();
      renderAdminList();
      render();
    });
    li.appendChild(span);
    li.appendChild(rm);
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", String(i));
    });
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (isNaN(from) || from === i) return;
      const moved = games.splice(from, 1)[0];
      games.splice(i, 0, moved);
      saveGames();
      renderAdminList();
      render();
    });
    ul.appendChild(li);
  });
}

function renderCloakTab() {
  const c = loadCloak();
  const grid = document.getElementById("cloak-presets");
  grid.innerHTML = "";
  CLOAKS.forEach((p) => {
    const b = document.createElement("button");
    b.className = "preset" + (p.id === c.preset ? " active" : "");
    if (p.icon) {
      const img = document.createElement("img");
      img.src = p.icon;
      img.alt = "";
      img.width = 18;
      img.height = 18;
      img.style.marginRight = "8px";
      img.style.verticalAlign = "middle";
      img.style.borderRadius = "3px";
      b.appendChild(img);
    }
    b.appendChild(document.createTextNode(p.name));
    b.addEventListener("click", () => {
      const cur = loadCloak();
      cur.preset = p.id;
      saveCloak(cur);
      applyCloak();
      renderCloakTab();
    });
    grid.appendChild(b);
  });
  document.getElementById("cloak-title").value = c.customTitle || "";
  document.getElementById("cloak-auto").checked = !!c.auto;
  document.getElementById("cloak-panic-key").value = c.panicKey || "`";
  document.getElementById("cloak-panic-url").value = c.panicUrl || "https://classroom.google.com/";
}

function showTab(name) {
  document.querySelectorAll("#admin-panel .admin-tab").forEach((t) =>
    t.classList.toggle("active", t.getAttribute("data-tab") === name));
  ["games", "add"].forEach((n) => {
    const el = document.getElementById("tab-" + n);
    if (el) el.hidden = n !== name;
  });
  if (name === "games") renderAdminList();
}

let pendingTab = null;
function openAdmin(tab) {
  document.getElementById("admin-modal").hidden = false;
  const panel = document.getElementById("admin-panel");
  if (!panel.hidden) showTab(tab || "games");
  else pendingTab = tab || "games";
}

/* ---------- init ---------- */

function init() {
  // Cool features
  showGameOfTheDay();
  setupMusic();

  document.getElementById("btn-music")?.addEventListener("click", () => {
    document.getElementById("music-modal").hidden = false;
  });
  document.getElementById("music-close")?.addEventListener("click", () => {
    document.getElementById("music-modal").hidden = true;
  });
  document.getElementById("music-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "music-modal") document.getElementById("music-modal").hidden = true;
  });

  document.getElementById("btn-fullscreen")?.addEventListener("click", toggleFullscreen);
  document.getElementById("btn-shortcuts")?.addEventListener("click", openShortcuts);
  document.getElementById("shortcuts-close")?.addEventListener("click", () => {
    document.getElementById("shortcuts-modal").hidden = true;
  });
  document.getElementById("shortcuts-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "shortcuts-modal") document.getElementById("shortcuts-modal").hidden = true;
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    if (e.key === "/") { e.preventDefault(); document.getElementById("search")?.focus(); }
    if (e.key === "r") playRandom();
    if (e.key === "f") toggleFullscreen();
    if (e.key === "m") document.getElementById("btn-music")?.click();
    if (e.key === "?") openShortcuts();
  });

  // Theme presets
  document.querySelectorAll(".theme-preset").forEach(btn => {
    btn.addEventListener("click", () => {
      const theme = btn.getAttribute("data-theme");
      document.body.className = theme === "default" ? "" : "theme-" + theme;
      saveJSON("afterschool:theme", theme);
    });
  });
  // Load saved theme
  const savedTheme = loadJSON("afterschool:theme", "default");
  if (savedTheme && savedTheme !== "default") document.body.className = "theme-" + savedTheme;

  applyStyle();
  const cloak = loadCloak();
  if (cloak.preset !== "none" || cloak.customTitle) applyCloak();
  render();
  document.addEventListener("keydown", panicCheck);

  // ... rest of the original init code continues below (truncated in original fetch, but preserved in update)
