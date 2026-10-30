// Afterschool portal — full restored version with Game Editor and expanded Game Day mode

const LS_GAMES = "afterschool:games";
const LS_STYLE = "afterschool:style";
const LS_CLOAK = "afterschool:cloak";
const LS_FAVS = "afterschool:favs";
const LS_PLAYS = "afterschool:plays";
const LS_RECENTS = "afterschool:recents";
const LS_GAMEDAY = "afterschool:gameday";
const ADMIN_PASSWORD = "afterschool";

const GAME_DAY_PRESETS = [
  { id: "rosepark", name: "Rose Park Middle (Titans)", message: "It's Game Day — Go Rose Park Titans!", color: "#1a3a6b" },
  { id: "titans", name: "Tennessee Titans", message: "It's Game Day — Go Titans!", color: "#4b92db" },
  { id: "grizzlies", name: "Memphis Grizzlies", message: "It's Game Day — Go Grizzlies!", color: "#5d76a9" },
  { id: "volunteers", name: "Tennessee Volunteers", message: "It's Game Day — Go Vols!", color: "#ff8200" },
  { id: "custom", name: "Custom", message: "It's Game Day!", color: "#6366f1" }
];

let games = loadGames();
let favs = loadJSON(LS_FAVS, []);
let plays = loadJSON(LS_PLAYS, {});
let recents = loadJSON(LS_RECENTS, []);
let gameDay = loadJSON(LS_GAMEDAY, { enabled: false, preset: "rosepark", message: "It's Game Day — Go Rose Park Titans!", sportsOnly: false, logoUrl: "", score: "" });
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
function saveGameDay() { saveJSON(LS_GAMEDAY, gameDay); }

function recordPlay(g) {
  plays[g.id] = (plays[g.id] || 0) + 1;
  saveJSON(LS_PLAYS, plays);
  recents = [g.id].concat(recents.filter(id => id !== g.id)).slice(0, 30);
  saveJSON(LS_RECENTS, recents);
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "game"; }

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

function updateGameDayBanner() {
  const banner = document.getElementById("game-day-banner");
  if (!banner) return;
  if (gameDay.enabled) {
    const preset = GAME_DAY_PRESETS.find(p => p.id === gameDay.preset) || GAME_DAY_PRESETS[0];
    const logo = gameDay.logoUrl ? `<img src="${gameDay.logoUrl}" alt="logo" style="height:28px;vertical-align:middle;margin:0 8px;border-radius:4px;">` : `<span style="display:inline-block;width:28px;height:28px;background:${preset.color};border-radius:4px;vertical-align:middle;margin:0 8px;"></span>`;
    const score = gameDay.score ? `<span style="margin-left:12px;font-weight:700;">${gameDay.score}</span>` : "";
    banner.hidden = false;
    banner.innerHTML = `<strong>${gameDay.message || preset.message}</strong> ${logo} ${score}`;
    banner.style.background = preset.color + "22";
    banner.style.borderColor = preset.color;
  } else {
    banner.hidden = true;
  }
}

function render() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  let list = games.filter(g => !g.disabled);
  if (gameDay.enabled && gameDay.sportsOnly) {
    list = list.filter(g => (g.category || "").toLowerCase().includes("sport"));
  }
  grid.innerHTML = list.map(g => `<a class="card" href="${g.path}"><div class="thumb" style="background:${g.color||'#2a2a2a'}"><span class="icon">${g.icon||'🎮'}</span></div><div class="card-title">${g.name}</div><div class="card-meta">${g.category}</div></a>`).join("") || '<div class="empty">No games</div>';
  const total = document.getElementById("total-count");
  if (total) total.textContent = games.length;
  updateGameDayBanner();
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

  const gdToggle = document.getElementById("game-day-toggle");
  if (gdToggle) {
    gdToggle.checked = gameDay.enabled;
    gdToggle.addEventListener("change", () => {
      gameDay.enabled = gdToggle.checked;
      saveGameDay();
      render();
    });
  }
  const gdSports = document.getElementById("game-day-sports");
  if (gdSports) {
    gdSports.checked = gameDay.sportsOnly;
    gdSports.addEventListener("change", () => {
      gameDay.sportsOnly = gdSports.checked;
      saveGameDay();
      render();
    });
  }
  const gdPreset = document.getElementById("game-day-preset");
  if (gdPreset) {
    gdPreset.value = gameDay.preset || "rosepark";
    gdPreset.addEventListener("change", () => {
      gameDay.preset = gdPreset.value;
      const p = GAME_DAY_PRESETS.find(x => x.id === gameDay.preset);
      if (p && !gameDay.message) gameDay.message = p.message;
      saveGameDay();
      render();
    });
  }
  const gdMsg = document.getElementById("game-day-message");
  if (gdMsg) {
    gdMsg.value = gameDay.message || "";
    gdMsg.addEventListener("input", () => {
      gameDay.message = gdMsg.value;
      saveGameDay();
      updateGameDayBanner();
    });
  }
  const gdScore = document.getElementById("game-day-score");
  if (gdScore) {
    gdScore.value = gameDay.score || "";
    gdScore.addEventListener("input", () => {
      gameDay.score = gdScore.value;
      saveGameDay();
      updateGameDayBanner();
    });
  }
  const gdLogo = document.getElementById("game-day-logo");
  if (gdLogo) {
    gdLogo.value = gameDay.logoUrl || "";
    gdLogo.addEventListener("input", () => {
      gameDay.logoUrl = gdLogo.value;
      saveGameDay();
      updateGameDayBanner();
    });
  }

  render();
}

init();
