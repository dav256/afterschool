// Afterschool portal — 100x cooler upgrade
const LS_GAMES = "afterschool:games";
const LS_STYLE = "afterschool:style";
const LS_CLOAK = "afterschool:cloak";
const LS_FAVS = "afterschool:favs";
const LS_PLAYS = "afterschool:plays";
const LS_RECENTS = "afterschool:recents";
const LS_GAMEDAY = "afterschool:gameday";
const LS_STREAK = "afterschool:streak";
const LS_SCORES = "afterschool:scores";
const LS_BADGES = "afterschool:badges";
const LS_THEME = "afterschool:theme";
const LS_SUGGEST = "afterschool:suggestions";
const ADMIN_PASSWORD = "afterschool";

const GAME_DAY_PRESETS = [
  { id: "rosepark", name: "Rose Park Middle (Titans)", message: "It's Game Day — Go Rose Park Titans!", color: "#1a3a6b" },
  { id: "titans", name: "Tennessee Titans", message: "It's Game Day — Go Titans!", color: "#4b92db" },
  { id: "grizzlies", name: "Memphis Grizzlies", message: "It's Game Day — Go Grizzlies!", color: "#5d76a9" },
  { id: "volunteers", name: "Tennessee Volunteers", message: "It's Game Day — Go Vols!", color: "#ff8200" },
  { id: "custom", name: "Custom", message: "It's Game Day!", color: "#6366f1" }
];

const THEMES = {
  default: { accent: "#9fe8d0", bg: "#070707", name: "Default" },
  cyber: { accent: "#00ff9f", bg: "#0a0a12", name: "Cyber" },
  retro: { accent: "#ff6b35", bg: "#1a120b", name: "Retro" },
  ocean: { accent: "#4ecdc4", bg: "#0a1628", name: "Ocean" },
  spirit: { accent: "#f5c542", bg: "#0f0a1a", name: "School Spirit" },
  midnight: { accent: "#a78bfa", bg: "#05050a", name: "Midnight" }
};

let games = loadGames();
let favs = loadJSON(LS_FAVS, []);
let plays = loadJSON(LS_PLAYS, {});
let recents = loadJSON(LS_RECENTS, []);
let scores = loadJSON(LS_SCORES, {});
let badges = loadJSON(LS_BADGES, []);
let suggestions = loadJSON(LS_SUGGEST, []);
let gameDay = loadJSON(LS_GAMEDAY, { enabled: false, preset: "rosepark", message: "It's Game Day — Go Rose Park Titans!", sportsOnly: false, logoUrl: "", score: "" });
let streak = loadJSON(LS_STREAK, { count: 0, lastDate: "" });
let currentTheme = localStorage.getItem(LS_THEME) || "default";
let chip = "all";
let query = "";
let musicOn = false;

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
    if (typeof DEFAULT_GAMES !== "undefined") {
      const defaults = {};
      DEFAULT_GAMES.forEach(g => { defaults[g.id] = g; if (!ids.has(g.id)) merged.push(g); });
      merged.forEach(g => { if (!g.image && defaults[g.id] && defaults[g.id].image) g.image = defaults[g.id].image; });
    }
    return merged;
  }
  return typeof DEFAULT_GAMES !== "undefined" ? DEFAULT_GAMES.slice() : [];
}
function saveGames() { saveJSON(LS_GAMES, games); }
function saveGameDay() { saveJSON(LS_GAMEDAY, gameDay); }

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function updateStreak() {
  const today = todayKey();
  if (streak.lastDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.getFullYear() + "-" + String(yesterday.getMonth()+1).padStart(2,"0") + "-" + String(yesterday.getDate()).padStart(2,"0");
  if (streak.lastDate === yKey) streak.count += 1;
  else streak.count = 1;
  streak.lastDate = today;
  saveJSON(LS_STREAK, streak);
  checkBadges();
}

function checkBadges() {
  const totalPlays = Object.values(plays).reduce((a,b) => a+b, 0);
  const earned = new Set(badges);
  if (streak.count >= 3 && !earned.has("streak3")) badges.push("streak3");
  if (streak.count >= 7 && !earned.has("streak7")) badges.push("streak7");
  if (totalPlays >= 10 && !earned.has("plays10")) badges.push("plays10");
  if (totalPlays >= 50 && !earned.has("plays50")) badges.push("plays50");
  if (favs.length >= 5 && !earned.has("fav5")) badges.push("fav5");
  saveJSON(LS_BADGES, badges);
}

function recordPlay(g) {
  plays[g.id] = (plays[g.id] || 0) + 1;
  saveJSON(LS_PLAYS, plays);
  recents = [g.id].concat(recents.filter(id => id !== g.id)).slice(0, 30);
  saveJSON(LS_RECENTS, recents);
  updateStreak();
  checkBadges();
}

function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "game"; }

function applyTheme(id) {
  currentTheme = id;
  localStorage.setItem(LS_THEME, id);
  const t = THEMES[id] || THEMES.default;
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--bg", t.bg);
  document.body.className = "theme-" + id;
  document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === id);
  });
}

function getPlayOfDay() {
  if (!games.length) return null;
  const day = Math.floor(Date.now() / 86400000);
  const idx = day % games.length;
  return games[idx];
}

function getTopScores(limit = 5) {
  return Object.entries(scores)
    .map(([id, score]) => ({ id, score, game: games.find(g => g.id === id) }))
    .filter(x => x.game)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function escAttr(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function thumbInner(g) {
  const icon = `<span class="icon"${g.image ? " hidden" : ""}>${g.icon||'🎮'}</span>`;
  if (!g.image) return icon;
  return `<img class="thumb-img" src="${escAttr(g.image)}" alt="${escAttr(g.name)}" loading="lazy" decoding="async" onerror="this.nextElementSibling.hidden=false;this.remove()">${icon}`;
}

function updateGameDayBanner() {
  const banner = document.getElementById("game-day-banner");
  if (!banner) return;
  if (gameDay.enabled) {
    const preset = GAME_DAY_PRESETS.find(p => p.id === gameDay.preset) || GAME_DAY_PRESETS[0];
    const logo = gameDay.logoUrl
      ? `<img src="${escAttr(gameDay.logoUrl)}" alt="logo" class="gd-logo">`
      : `<span class="gd-logo-fallback" style="background:${preset.color}"></span>`;
    const score = gameDay.score ? `<span class="gd-score">${escAttr(gameDay.score)}</span>` : "";
    banner.hidden = false;
    banner.innerHTML = `<div class="gd-left"><span class="gd-label">GAME DAY</span><strong>${escAttr(gameDay.message || preset.message)}</strong></div>${logo}${score}`;
    banner.style.borderColor = preset.color;
    banner.style.background = `linear-gradient(135deg, ${preset.color}22, transparent)`;
  } else {
    banner.hidden = true;
  }
}

function renderPlayOfDay() {
  const el = document.getElementById("potd");
  if (!el) return;
  const g = getPlayOfDay();
  if (!g) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `
    <div class="potd-label">Play of the Day</div>
    <a class="potd-card" href="${g.path}" onclick="recordPlay(games.find(x=>x.id==='${g.id}'))">
      <div class="potd-thumb" style="background:${g.color||'#2a2a2a'}">${thumbInner(g)}</div>
      <div class="potd-info">
        <div class="potd-name">${g.name}</div>
        <div class="potd-meta">${g.category} · Tap to play</div>
      </div>
    </a>`;
}

function renderStreak() {
  const el = document.getElementById("streak-badge");
  if (!el) return;
  if (streak.count > 0) {
    el.hidden = false;
    el.textContent = `🔥 ${streak.count} day streak`;
  } else {
    el.hidden = true;
  }
}

function renderLeaderboard() {
  const el = document.getElementById("leaderboard");
  if (!el) return;
  const top = getTopScores(5);
  if (!top.length) {
    el.innerHTML = `<div class="lb-empty">Play games to set high scores</div>`;
    return;
  }
  el.innerHTML = top.map((t, i) => `
    <div class="lb-row">
      <span class="lb-rank">#${i+1}</span>
      <span class="lb-name">${t.game.name}</span>
      <span class="lb-score">${t.score}</span>
    </div>`).join("");
}

function render() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  let list = games.filter(g => !g.disabled);
  if (gameDay.enabled && gameDay.sportsOnly) {
    list = list.filter(g => (g.category || "").toLowerCase().includes("sport"));
  }
  if (chip && chip !== "all") {
    if (chip === "popular") list = list.filter(g => g.popular);
    else if (chip === "favorites") list = list.filter(g => favs.includes(g.id));
    else list = list.filter(g => (g.category || "").toLowerCase() === chip.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(g => (g.name + " " + (g.category||"")).toLowerCase().includes(q));
  }
  grid.innerHTML = list.map(g => {
    const isFav = favs.includes(g.id);
    return `<a class="card" href="${g.path}" data-id="${g.id}">
      <div class="thumb" style="background:${g.color||'#2a2a2a'}">
        ${thumbInner(g)}
        <button class="fav ${isFav ? "active" : ""}" data-fav="${g.id}" title="Favorite">♥</button>
        <div class="play"><i>▶</i></div>
      </div>
      <div class="card-title">${g.name}</div>
      <div class="card-meta">${g.category}${plays[g.id] ? " · " + plays[g.id] + " plays" : ""}</div>
    </a>`;
  }).join("") || '<div class="empty">No games found</div>';

  grid.querySelectorAll("[data-fav]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.fav;
      if (favs.includes(id)) favs = favs.filter(x => x !== id);
      else favs.push(id);
      saveJSON(LS_FAVS, favs);
      checkBadges();
      render();
    });
  });
  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const g = games.find(x => x.id === id);
      if (g) recordPlay(g);
    });
  });

  const total = document.getElementById("total-count");
  if (total) total.textContent = games.filter(g => !g.disabled).length;
  updateGameDayBanner();
  renderPlayOfDay();
  renderStreak();
  renderLeaderboard();
  renderChips();
}

function renderChips() {
  const el = document.getElementById("chips");
  if (!el) return;
  const cats = ["all", "popular", "favorites", ...new Set(games.map(g => g.category).filter(Boolean))];
  el.innerHTML = cats.map(c => {
    const label = c === "all" ? "All" : c === "popular" ? "Popular" : c === "favorites" ? "Favorites" : c;
    return `<button class="chip ${chip === c ? "active" : ""}" data-chip="${c}">${label}</button>`;
  }).join("");
  el.querySelectorAll("[data-chip]").forEach(btn => {
    btn.addEventListener("click", () => { chip = btn.dataset.chip; render(); });
  });
}

function surpriseMe() {
  let list = games.filter(g => !g.disabled);
  if (!list.length) return;
  const g = list[Math.floor(Math.random() * list.length)];
  recordPlay(g);
  window.location.href = g.path;
}

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
  if (index !== "" && games[parseInt(index)] && games[parseInt(index)].image) game.image = games[parseInt(index)].image;
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

function submitSuggestion() {
  const input = document.getElementById("suggest-input");
  if (!input || !input.value.trim()) return;
  suggestions.unshift({ text: input.value.trim(), at: Date.now() });
  suggestions = suggestions.slice(0, 50);
  saveJSON(LS_SUGGEST, suggestions);
  input.value = "";
  const msg = document.getElementById("suggest-msg");
  if (msg) { msg.hidden = false; setTimeout(() => msg.hidden = true, 2000); }
}

function updateClock() {
  const el = document.getElementById("float-clock");
  if (!el) return;
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/Chicago" });
  const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" });
  el.textContent = time + "  ·  " + date + " CT";
  el.style.display = "block";
}

function init() {
  applyTheme(currentTheme);
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById("btn-admin")?.addEventListener("click", () => {
    document.getElementById("admin-modal").hidden = false;
  });
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

  document.getElementById("btn-settings")?.addEventListener("click", () => {
    document.getElementById("settings-modal").hidden = false;
  });
  document.getElementById("settings-close")?.addEventListener("click", () => {
    document.getElementById("settings-modal").hidden = true;
  });
  document.querySelectorAll("[data-settings-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#settings-modal .admin-tab-content").forEach(c => c.hidden = true);
      document.querySelectorAll("[data-settings-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("settings-tab-" + btn.dataset.settingsTab).hidden = false;
    });
  });

  // Game Day controls
  const gdToggle = document.getElementById("game-day-toggle");
  if (gdToggle) {
    gdToggle.checked = gameDay.enabled;
    gdToggle.addEventListener("change", () => { gameDay.enabled = gdToggle.checked; saveGameDay(); render(); });
  }
  const gdSports = document.getElementById("game-day-sports");
  if (gdSports) {
    gdSports.checked = gameDay.sportsOnly;
    gdSports.addEventListener("change", () => { gameDay.sportsOnly = gdSports.checked; saveGameDay(); render(); });
  }
  const gdPreset = document.getElementById("game-day-preset");
  if (gdPreset) {
    gdPreset.value = gameDay.preset || "rosepark";
    gdPreset.addEventListener("change", () => {
      gameDay.preset = gdPreset.value;
      const p = GAME_DAY_PRESETS.find(x => x.id === gameDay.preset);
      if (p) gameDay.message = p.message;
      const msgEl = document.getElementById("game-day-message");
      if (msgEl) msgEl.value = gameDay.message;
      saveGameDay(); render();
    });
  }
  const gdMsg = document.getElementById("game-day-message");
  if (gdMsg) {
    gdMsg.value = gameDay.message || "";
    gdMsg.addEventListener("input", () => { gameDay.message = gdMsg.value; saveGameDay(); updateGameDayBanner(); });
  }
  const gdScore = document.getElementById("game-day-score");
  if (gdScore) {
    gdScore.value = gameDay.score || "";
    gdScore.addEventListener("input", () => { gameDay.score = gdScore.value; saveGameDay(); updateGameDayBanner(); });
  }
  const gdLogo = document.getElementById("game-day-logo");
  if (gdLogo) {
    gdLogo.value = gameDay.logoUrl || "";
    gdLogo.addEventListener("input", () => { gameDay.logoUrl = gdLogo.value; saveGameDay(); updateGameDayBanner(); });
  }

  // Themes
  document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Search
  const search = document.getElementById("search");
  if (search) search.addEventListener("input", () => { query = search.value; render(); });

  // Surprise Me
  document.getElementById("btn-surprise")?.addEventListener("click", surpriseMe);

  // Suggestions
  document.getElementById("suggest-btn")?.addEventListener("click", submitSuggestion);

  // Music toggle (ambient placeholder)
  document.getElementById("btn-music")?.addEventListener("click", () => {
    musicOn = !musicOn;
    document.getElementById("btn-music").classList.toggle("active", musicOn);
    // Ambient audio can be wired to a real file later
  });

  render();
}

init();
