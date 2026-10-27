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

function svgIcon(letter, bg, fg) {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
    "<rect width='64' height='64' rx='12' fill='" + bg + "'/>" +
    "<text x='32' y='44' font-family='Arial,sans-serif' font-size='34' font-weight='bold' " +
    "fill='" + fg + "' text-anchor='middle'>" + letter + "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const CLOAKS = [
  { id: "none",      name: "Afterschool",  title: null,                          icon: null },
  { id: "classroom", name: "Classroom",    title: "Classes",                     icon: svgIcon("C", "#0f9d58", "#ffffff") },
  { id: "docs",      name: "Google Docs",  title: "Google Docs",                 icon: svgIcon("D", "#2684fc", "#ffffff") },
  { id: "drive",     name: "Google Drive", title: "My Drive - Google Drive",     icon: svgIcon("D", "#0f9d58", "#ffffff") },
  { id: "google",    name: "Google",       title: "Google",                      icon: svgIcon("G", "#4285f4", "#ffffff") },
  { id: "canvas",    name: "Canvas",       title: "Dashboard",                   icon: svgIcon("C", "#e72429", "#ffffff") },
  { id: "wikipedia", name: "Wikipedia",    title: "Wikipedia",                   icon: svgIcon("W", "#ffffff", "#202122") },
  { id: "khan",      name: "Khan Academy", title: "Khan Academy",                icon: svgIcon("K", "#14bf96", "#ffffff") },
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
    document.querySelector(".logo").textContent = s.name;
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

/* ---------- browsing: segments + chips ---------- */

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
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
    b.textContent = p.name;
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
  document.querySelectorAll(".admin-tab").forEach((t) =>
    t.classList.toggle("active", t.getAttribute("data-tab") === name));
  ["games", "add", "style", "cloak"].forEach((n) => {
    document.getElementById("tab-" + n).hidden = n !== name;
  });
  if (name === "games") renderAdminList();
  if (name === "cloak") renderCloakTab();
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
  applyStyle();
  const cloak = loadCloak();
  if (cloak.preset !== "none" || cloak.customTitle) applyCloak();
  render();
  document.addEventListener("keydown", panicCheck);

  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("click", () => setFilter(el.getAttribute("data-filter")));
  });
  document.querySelectorAll(".seg-btn").forEach((b) => {
    b.addEventListener("click", () => { segMode = b.getAttribute("data-seg"); render(); });
  });
  document.getElementById("chips").addEventListener("click", (e) => {
    const c = e.target.closest("[data-chip]");
    if (c) { chip = c.getAttribute("data-chip"); render(); }
  });
  document.getElementById("btn-random").addEventListener("click", playRandom);
  document.getElementById("btn-hero-random").addEventListener("click", playRandom);
  document.getElementById("search").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    render();
  });

  // favorites + play tracking (event delegation)
  document.getElementById("grid").addEventListener("click", (e) => {
    const favEl = e.target.closest("[data-fav]");
    if (favEl) {
      e.preventDefault();
      const id = favEl.getAttribute("data-fav");
      if (favs.includes(id)) favs = favs.filter((f) => f !== id);
      else favs.push(id);
      saveJSON(LS_FAVS, favs);
      render();
      return;
    }
    const card = e.target.closest("a.card");
    if (card) {
      const g = games.find((x) => x.id === card.getAttribute("data-id"));
      if (g) recordPlay(g);
    }
  });
  document.getElementById("featured").addEventListener("click", (e) => {
    const card = e.target.closest("a.featured-card");
    if (card) {
      const g = games.find((x) => x.path === card.getAttribute("href"));
      if (g) recordPlay(g);
    }
  });

  // quick cloak
  document.getElementById("btn-quick-cloak").addEventListener("click", function () {
    const c = loadCloak();
    if (c.preset === "none" && !c.customTitle) { c.preset = "classroom"; saveCloak(c); }
    applyCloak();
    const btn = this;
    const old = btn.textContent;
    btn.textContent = "Cloaked ✓";
    setTimeout(() => { btn.textContent = old; }, 1500);
  });

  // admin open/close
  const modal = document.getElementById("admin-modal");
  document.getElementById("btn-admin").addEventListener("click", () => openAdmin("games"));
  document.getElementById("btn-cloak-nav").addEventListener("click", () => openAdmin("cloak"));
  document.getElementById("admin-close").addEventListener("click", () => { modal.hidden = true; });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

  document.getElementById("admin-login-btn").addEventListener("click", () => {
    const pass = document.getElementById("admin-pass").value;
    if (pass === ADMIN_PASSWORD) {
      document.getElementById("admin-login").hidden = true;
      document.getElementById("admin-panel").hidden = false;
      showTab(pendingTab || "games");
      pendingTab = null;
    } else {
      document.getElementById("admin-pass").value = "";
      document.getElementById("admin-pass").placeholder = "Wrong password — try again";
    }
  });

  document.querySelectorAll(".admin-tab").forEach((t) =>
    t.addEventListener("click", () => showTab(t.getAttribute("data-tab"))));

  document.getElementById("add-save").addEventListener("click", () => {
    const name = document.getElementById("add-name").value.trim();
    if (!name) return;
    const category = document.getElementById("add-category").value;
    let path = document.getElementById("add-path").value.trim();
    if (!path) path = "games/" + slug(name) + "/index.html";
    games.push({
      id: slug(name) + "-" + Date.now().toString(36),
      name: name,
      category: category,
      popular: document.getElementById("add-popular").checked,
      path: path,
      note: "Local",
      icon: "🎮",
      color: "#2a2a2a",
    });
    saveGames();
    document.getElementById("add-name").value = "";
    document.getElementById("add-path").value = "";
    document.getElementById("add-popular").checked = false;
    showTab("games");
    render();
  });

  // style tab
  document.querySelectorAll(".swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      document.getElementById("style-accent").value = sw.getAttribute("data-accent");
      const s = loadStyle();
      s.accent = sw.getAttribute("data-accent");
      saveJSON(LS_STYLE, s);
      applyStyle();
    });
  });
  document.getElementById("style-save").addEventListener("click", () => {
    const s = {
      accent: document.getElementById("style-accent").value,
      name: document.getElementById("style-name").value.trim(),
      tagline: document.getElementById("style-tagline").value.trim(),
    };
    saveJSON(LS_STYLE, s);
    applyStyle();
  });

  // data tools
  document.getElementById("data-export").addEventListener("click", () => {
    const data = {
      games: loadJSON(LS_GAMES, null),
      style: loadStyle(),
      cloak: loadCloak(),
      favs: favs,
      plays: plays,
      recents: recents,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "afterschool-library.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const importInput = document.getElementById("data-import");
  document.getElementById("data-import-btn").addEventListener("click", () => importInput.click());
  importInput.addEventListener("change", () => {
    const file = importInput.files[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.games) saveJSON(LS_GAMES, data.games);
        if (data.style) saveJSON(LS_STYLE, data.style);
        if (data.cloak) saveJSON(LS_CLOAK, data.cloak);
        if (data.favs) saveJSON(LS_FAVS, data.favs);
        if (data.plays) saveJSON(LS_PLAYS, data.plays);
        if (data.recents) saveJSON(LS_RECENTS, data.recents);
        location.reload();
      } catch (e) { alert("That file could not be imported."); }
    });
  });
  document.getElementById("data-reset").addEventListener("click", () => {
    if (!confirm("Reset games, style, cloak, favorites, recents, and play counts on this device?")) return;
    [LS_GAMES, LS_STYLE, LS_CLOAK, LS_FAVS, LS_PLAYS, LS_RECENTS].forEach((k) => localStorage.removeItem(k));
    location.reload();
  });

  // cloak tab controls
  document.getElementById("cloak-title").addEventListener("input", (e) => {
    const c = loadCloak();
    c.customTitle = e.target.value.trim();
    saveCloak(c);
    applyCloak();
  });
  document.getElementById("cloak-auto").addEventListener("change", (e) => {
    const c = loadCloak();
    c.auto = e.target.checked;
    saveCloak(c);
  });
  document.getElementById("cloak-panic-key").addEventListener("change", (e) => {
    const c = loadCloak();
    c.panicKey = e.target.value;
    saveCloak(c);
  });
  document.getElementById("cloak-panic-url").addEventListener("input", (e) => {
    const c = loadCloak();
    c.panicUrl = e.target.value.trim();
    saveCloak(c);
  });
  document.getElementById("btn-blank").addEventListener("click", openBlank);

  document.getElementById("admin-logout").addEventListener("click", () => {
    document.getElementById("admin-panel").hidden = true;
    document.getElementById("admin-login").hidden = false;
    document.getElementById("admin-pass").value = "";
    modal.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", init);
