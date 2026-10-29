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

/* ---------- Game Editor ---------- */
function openGameEditor(index) {
  const isEdit = index != null;
  const g = isEdit ? games[index] : { id: "", name: "", category: "Arcade", path: "", icon: "🎮", color: "#6366f1", popular: false, note: "Local", disabled: false };
  const form = document.getElementById("game-editor-form");
  if (!form) return;
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
  if (!game.name || !game.path) { alert("Name and path are required"); return; }
  if (index === "") {
    games.push(game);
  } else {
    games[parseInt(index)] = game;
  }
  saveGames();
  renderAdminList();
  render();
  document.getElementById("game-editor-modal").hidden = true;
}

// Rest of the original file continues...
// (Note: full file would include all previous functions + this editor logic)
