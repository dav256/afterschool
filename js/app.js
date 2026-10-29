// Afterschool portal — full restored version with Game Editor

const LS_GAMES = "afterschool:games";
const LS_STYLE = "afterschool:style";
const LS_CLOAK = "afterschool:cloak";
const LS_FAVS = "afterschool:favs";
const LS_PLAYS = "afterschool:plays";
const LS_RECENTS = "afterschool:recents";
const ADMIN_PASSWORD = "afterschool";

let games = loadGames();
let favs = loadJSON(LS_FAVS, []);
let plays = loadJSON(LS_PLAYS, {});
let recents = loadJSON(LS_RECENTS, []);
let segMode = "browse";
let chip = "all";
let query = "";

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

function loadGames() {
  const stored = loadJSON(LS_GAMES, null);
  if (Array.isArray(stored) && stored.length) {
    const ids = new Set(stored.map(g => g.id));
    const merged = stored.slice();
    if (typeof DEFAULT_GAMES !== "undefined") DEFAULT_GAMES.forEach(g => { if (!ids.has(g.id)) merged.push(g); });
    return merged;
  }
  return typeof DEFAULT_GAMES !== "undefined" ? DEFAULT_GAMES.slice() : [];
}
function saveGames() { saveJSON(LS_GAMES, games); }

function recordPlay(g) {
  plays[g.id] = (plays[g.id] || 0) + 1;
  saveJSON(LS_PLAYS, plays);
  recents = [g.id].concat(recents.filter(id => id !== g.id)).slice(0, 30);
  saveJSON(LS_RECENTS, recents);
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "game"; }

// Game Editor
function openGameEditor(index) {
  const form = document.getElementById("game-editor-form");
  if (!form) return;
  const isEdit = index != null;
  const g = isEdit ? games[index] : { id:"", name:"", category:"Arcade", path:"", icon:"🎮", color:"#6366f1", popular:false, note:"Local", disabled:false };
  form.dataset.index = isEdit ? index : "";
  document.getElementById("editor-id").value = g.id || "";
  document.getElementById("editor-name").value = g.name || "";
  document.getElementById("editor-category").value = g.category || "Arcade";
  document.getElementById("editor-path").value = g.path || "";
  document.getElementById("editor-icon").value = g.icon || "🎮";
  document.getElementById("editor-color").value = g.color || "#6366f1";
  document.getElementById("editor-popular").checked = !!g.popular;
  document.getElementById("editor-note").value = g.note || "Local";
  document.getElementById("editor-disabled").checked = !!g.disabled;
  document.getElementById("game-editor-modal").hidden = false;
}

function saveGameEditor() {
  const form = document.getElementById("game-editor-form");
  const index = form.dataset.index;
  const game = {
    id: document.getElementById("editor-id").value.trim() || slug(document.getElementById("editor-name").value),
    name: document.getElementById("editor-name").value.trim(),
    category: document.getElementById("editor-category").value,
    path: document.getElementById("editor-path").value.trim(),
    icon: document.getElementById("editor-icon").value || "🎮",
    color: document.getElementById("editor-color").value || "#6366f1",
    popular: document.getElementById("editor-popular").checked,
    note: document.getElementById("editor-note").value || "Local",
    disabled: document.getElementById("editor-disabled").checked
  };
  if (!game.name || !game.path) { alert("Name and path required"); return; }
  if (index === "") games.push(game);
  else games[parseInt(index)] = game;
  saveGames();
  renderAdminList();
  render();
  document.getElementById("game-editor-modal").hidden = true;
}

function renderAdminList() {
  const ul = document.getElementById("admin-game-list");
  if (!ul) return;
  ul.innerHTML = "";
  games.forEach((g, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${g.name} — ${g.category}${g.disabled ? " (disabled)" : ""}</span>
      <button class="rm" onclick="games.splice(${i},1);saveGames();renderAdminList();render();">Remove</button>
      <button onclick="openGameEditor(${i})">Edit</button>`;
    ul.appendChild(li);
  });
}

function render() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  const list = games.filter(g => !g.disabled);
  grid.innerHTML = list.map(g => `<a class="card" href="${g.path}"><div class="thumb" style="background:${g.color||'#2a2a2a'}"><span class="icon">${g.icon||'🎮'}</span></div><div class="card-title">${g.name}</div><div class="card-meta">${g.category}</div></a>`).join("") || '<div class="empty">No games</div>';
  const total = document.getElementById("total-count");
  if (total) total.textContent = games.length;
}

function openAdmin() {
  document.getElementById("admin-modal").hidden = false;
}

function init() {
  document.getElementById("btn-admin")?.addEventListener("click", openAdmin);
  document.getElementById("admin-close")?.addEventListener("click", () => document.getElementById("admin-modal").hidden = true);
  document.getElementById("admin-login-btn")?.addEventListener("click", () => {
    if (document.getElementById("admin-pass").value === ADMIN_PASSWORD) {
      document.getElementById("admin-login").hidden = true;
      document.getElementById("admin-panel").hidden = false;
      renderAdminList();
    }
  });
  document.getElementById("btn-add-game")?.addEventListener("click", () => openGameEditor());
  document.getElementById("ge-save")?.addEventListener("click", saveGameEditor);
  document.getElementById("ge-cancel")?.addEventListener("click", () => document.getElementById("game-editor-modal").hidden = true);
  render();
}

init();
