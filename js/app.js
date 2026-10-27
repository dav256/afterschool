// Afterschool portal — renders the game library from js/games.js (DEFAULT_GAMES),
// with per-browser overrides (order, removals, additions, style) kept in localStorage.

const LS_GAMES = "afterschool:games";
const LS_STYLE = "afterschool:style";
const ADMIN_PASSWORD = "afterschool"; // default shown in the admin dialog

let games = loadGames();
let currentFilter = "all";
let query = "";

function loadGames() {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_GAMES) || "null");
    if (Array.isArray(stored) && stored.length) {
      const ids = new Set(stored.map((g) => g.id));
      const merged = stored.slice();
      DEFAULT_GAMES.forEach((g) => { if (!ids.has(g.id)) merged.push(g); });
      return merged;
    }
  } catch (e) { /* fall through to defaults */ }
  return DEFAULT_GAMES.slice();
}

function saveGames() {
  try { localStorage.setItem(LS_GAMES, JSON.stringify(games)); } catch (e) {}
}

function loadStyle() {
  try { return JSON.parse(localStorage.getItem(LS_STYLE) || "null") || {}; } catch (e) { return {}; }
}

function applyStyle() {
  const s = loadStyle();
  if (s.accent) document.documentElement.style.setProperty("--accent", s.accent);
  if (s.name) {
    document.querySelector(".logo").textContent = s.name;
    document.title = s.name.charAt(0).toUpperCase() + s.name.slice(1);
  }
  const accentInput = document.getElementById("style-accent");
  const nameInput = document.getElementById("style-name");
  if (accentInput && s.accent) accentInput.value = s.accent;
  if (nameInput && s.name) nameInput.value = s.name;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function visibleGames() {
  return games.filter((g) => {
    if (currentFilter === "popular" && !g.popular) return false;
    if (currentFilter !== "all" && currentFilter !== "popular" && g.category !== currentFilter) return false;
    if (query && !g.name.toLowerCase().includes(query)) return false;
    return true;
  });
}

function render() {
  const list = visibleGames();
  document.getElementById("total-count").textContent = games.length;
  document.getElementById("showing-count").textContent =
    "Showing " + list.length + " of " + games.length + " games";

  const featuredEl = document.getElementById("featured");
  if (currentFilter === "all" && !query) {
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
    grid.innerHTML = '<div class="empty">No games match. Try a different search or category.</div>';
    return;
  }
  grid.innerHTML = list.map((g) =>
    '<a class="card" href="' + esc(g.path) + '">' +
      '<div class="card-thumb">' +
        (g.popular ? '<span class="badge">Popular</span>' : "") +
        '<span class="icon" style="background:' + esc(g.color || "#7dffa3") + '">' + esc(g.icon || "🎮") + "</span>" +
      "</div>" +
      '<div class="card-body"><h3>' + esc(g.name) + "</h3>" +
      '<div class="card-meta">' + esc(g.category) + " · " + esc(g.note || "Local") + "</div></div>" +
    "</a>"
  ).join("");
}

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-filter") === f);
  });
  render();
}

function playRandom() {
  if (!games.length) return;
  const g = games[Math.floor(Math.random() * games.length)];
  window.location.href = g.path;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "game";
}

/* ---------- Admin ---------- */

function renderAdminList() {
  const ul = document.getElementById("admin-game-list");
  ul.innerHTML = "";
  games.forEach((g, i) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.index = i;
    const span = document.createElement("span");
    span.textContent = g.name + " — " + g.category;
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

function showTab(name) {
  document.querySelectorAll(".admin-tab").forEach((t) =>
    t.classList.toggle("active", t.getAttribute("data-tab") === name));
  ["games", "add", "style"].forEach((n) => {
    document.getElementById("tab-" + n).hidden = n !== name;
  });
  if (name === "games") renderAdminList();
}

function init() {
  applyStyle();
  render();

  document.querySelectorAll("[data-filter]").forEach((el) => {
    el.addEventListener("click", () => setFilter(el.getAttribute("data-filter")));
  });
  document.getElementById("btn-random").addEventListener("click", playRandom);
  document.getElementById("btn-hero-random").addEventListener("click", playRandom);
  document.getElementById("search").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    render();
  });

  const modal = document.getElementById("admin-modal");
  document.getElementById("btn-admin").addEventListener("click", () => { modal.hidden = false; });
  document.getElementById("admin-close").addEventListener("click", () => { modal.hidden = true; });
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.hidden = true; });

  document.getElementById("admin-login-btn").addEventListener("click", () => {
    const pass = document.getElementById("admin-pass").value;
    if (pass === ADMIN_PASSWORD) {
      document.getElementById("admin-login").hidden = true;
      document.getElementById("admin-panel").hidden = false;
      showTab("games");
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
      color: "#7dffa3",
    });
    saveGames();
    document.getElementById("add-name").value = "";
    document.getElementById("add-path").value = "";
    document.getElementById("add-popular").checked = false;
    showTab("games");
    render();
  });

  document.getElementById("style-save").addEventListener("click", () => {
    const s = {
      accent: document.getElementById("style-accent").value,
      name: document.getElementById("style-name").value.trim(),
    };
    try { localStorage.setItem(LS_STYLE, JSON.stringify(s)); } catch (e) {}
    applyStyle();
  });

  document.getElementById("admin-logout").addEventListener("click", () => {
    document.getElementById("admin-panel").hidden = true;
    document.getElementById("admin-login").hidden = false;
    document.getElementById("admin-pass").value = "";
    modal.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", init);
