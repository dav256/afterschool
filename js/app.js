// Afterschool portal — ESPN live scores for all NFL / NBA / college teams
const LS_GAMES = "afterschool:games";
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

const ESPN_LEAGUES = {
  nfl: { sport: "football", league: "nfl", label: "NFL" },
  nba: { sport: "basketball", league: "nba", label: "NBA" },
  cfb: { sport: "football", league: "college-football", label: "College Football" }
};

// Common FBS teams + all NFL/NBA loaded dynamically when possible
const CFB_TEAMS = [
  { abbr: "ALA", name: "Alabama" }, { abbr: "ARK", name: "Arkansas" }, { abbr: "AUB", name: "Auburn" },
  { abbr: "BAY", name: "Baylor" }, { abbr: "CLEM", name: "Clemson" }, { abbr: "COLO", name: "Colorado" },
  { abbr: "DUKE", name: "Duke" }, { abbr: "FLA", name: "Florida" }, { abbr: "FSU", name: "Florida State" },
  { abbr: "UGA", name: "Georgia" }, { abbr: "IU", name: "Indiana" }, { abbr: "IOWA", name: "Iowa" },
  { abbr: "KU", name: "Kansas" }, { abbr: "UK", name: "Kentucky" }, { abbr: "LSU", name: "LSU" },
  { abbr: "MICH", name: "Michigan" }, { abbr: "MSU", name: "Michigan State" }, { abbr: "MINN", name: "Minnesota" },
  { abbr: "MISS", name: "Ole Miss" }, { abbr: "MIZZ", name: "Missouri" }, { abbr: "NEB", name: "Nebraska" },
  { abbr: "UNC", name: "North Carolina" }, { abbr: "ND", name: "Notre Dame" }, { abbr: "OHIO", name: "Ohio State" },
  { abbr: "OKLA", name: "Oklahoma" }, { abbr: "OKST", name: "Oklahoma State" }, { abbr: "ORE", name: "Oregon" },
  { abbr: "PSU", name: "Penn State" }, { abbr: "PITT", name: "Pittsburgh" }, { abbr: "SC", name: "South Carolina" },
  { abbr: "TENN", name: "Tennessee" }, { abbr: "TEX", name: "Texas" }, { abbr: "TA&M", name: "Texas A&M" },
  { abbr: "USC", name: "USC" }, { abbr: "UTAH", name: "Utah" }, { abbr: "UVA", name: "Virginia" },
  { abbr: "VT", name: "Virginia Tech" }, { abbr: "WASH", name: "Washington" }, { abbr: "WIS", name: "Wisconsin" },
  { abbr: "WVU", name: "West Virginia" }
];

const THEMES = {
  default: { accent: "#9fe8d0", bg: "#070707" },
  cyber: { accent: "#00ff9f", bg: "#0a0a12" },
  retro: { accent: "#ff6b35", bg: "#1a120b" },
  ocean: { accent: "#4ecdc4", bg: "#0a1628" },
  spirit: { accent: "#f5c542", bg: "#0f0a1a" },
  midnight: { accent: "#a78bfa", bg: "#05050a" }
};

let games = loadGames();
let favs = loadJSON(LS_FAVS, []);
let plays = loadJSON(LS_PLAYS, {});
let recents = loadJSON(LS_RECENTS, []);
let scores = loadJSON(LS_SCORES, {});
let badges = loadJSON(LS_BADGES, []);
let suggestions = loadJSON(LS_SUGGEST, []);
let gameDay = loadJSON(LS_GAMEDAY, {
  enabled: false,
  mode: "pro", // pro | school
  league: "nfl",
  teamAbbr: "TEN",
  teamName: "Titans",
  message: "It's Game Day — Go Titans!",
  sportsOnly: false,
  logoUrl: "",
  score: "",
  autoScore: true,
  schoolName: "Rose Park Titans"
});
let streak = loadJSON(LS_STREAK, { count: 0, lastDate: "" });
let currentTheme = localStorage.getItem(LS_THEME) || "default";
let chip = "all";
let query = "";
let musicOn = false;
let espnTimer = null;
let teamCache = { nfl: null, nba: null, cfb: CFB_TEAMS };

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
      merged.forEach(g => { if (!g.image && defaults[g.id]?.image) g.image = defaults[g.id].image; });
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
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yKey = y.getFullYear() + "-" + String(y.getMonth()+1).padStart(2,"0") + "-" + String(y.getDate()).padStart(2,"0");
  streak.count = streak.lastDate === yKey ? streak.count + 1 : 1;
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
  document.querySelectorAll("[data-theme]").forEach(btn => btn.classList.toggle("active", btn.dataset.theme === id));
}

function getPlayOfDay() {
  if (!games.length) return null;
  return games[Math.floor(Date.now() / 86400000) % games.length];
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

// ——— Teams list from ESPN ———
async function loadTeams(leagueKey) {
  if (teamCache[leagueKey] && leagueKey !== "cfb") return teamCache[leagueKey];
  if (leagueKey === "cfb") return CFB_TEAMS;
  const cfg = ESPN_LEAGUES[leagueKey];
  if (!cfg) return [];
  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${cfg.sport}/${cfg.league}/teams?limit=50`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const teams = (data.sports?.[0]?.leagues?.[0]?.teams || []).map(t => ({
      abbr: t.team?.abbreviation || "",
      name: t.team?.displayName || t.team?.name || t.team?.shortDisplayName || "",
      short: t.team?.shortDisplayName || t.team?.name || "",
      logo: t.team?.logos?.[0]?.href || ""
    })).filter(t => t.abbr);
    teams.sort((a, b) => a.name.localeCompare(b.name));
    teamCache[leagueKey] = teams;
    return teams;
  } catch (e) {
    console.warn("Team list failed", e);
    return teamCache[leagueKey] || [];
  }
}

async function populateTeamSelect() {
  const sel = document.getElementById("gd-team");
  if (!sel) return;
  const league = gameDay.league || "nfl";
  sel.innerHTML = `<option value="">Loading…</option>`;
  const teams = await loadTeams(league);
  sel.innerHTML = teams.map(t =>
    `<option value="${escAttr(t.abbr)}" data-name="${escAttr(t.short || t.name)}" ${t.abbr === gameDay.teamAbbr ? "selected" : ""}>${escAttr(t.name)}</option>`
  ).join("") || `<option value="">No teams</option>`;
  if (gameDay.teamAbbr) sel.value = gameDay.teamAbbr;
}

// ——— ESPN score for any team ———
async function fetchEspnScoreForTeam(leagueKey, teamAbbr, teamName) {
  const cfg = ESPN_LEAGUES[leagueKey];
  if (!cfg || !teamAbbr) return null;
  const url = `https://site.api.espn.com/apis/site/v2/sports/${cfg.sport}/${cfg.league}/scoreboard`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("ESPN " + res.status);
    const data = await res.json();
    const events = data.events || [];
    const abbrU = teamAbbr.toUpperCase();
    const nameL = (teamName || "").toLowerCase();
    const match = events.find(ev => {
      const comps = ev.competitions?.[0]?.competitors || [];
      return comps.some(c => {
        const a = (c.team?.abbreviation || "").toUpperCase();
        const n = (c.team?.shortDisplayName || c.team?.displayName || "").toLowerCase();
        return a === abbrU || a.includes(abbrU) || (nameL && n.includes(nameL));
      });
    });
    if (!match) return { text: "No game today", status: "none", state: "none" };
    const competitors = match.competitions[0].competitors || [];
    const home = competitors.find(c => c.homeAway === "home") || competitors[0];
    const away = competitors.find(c => c.homeAway === "away") || competitors[1];
    const hs = home?.score != null ? home.score : "-";
    const as = away?.score != null ? away.score : "-";
    const ha = home?.team?.abbreviation || home?.team?.shortDisplayName || "HOME";
    const aa = away?.team?.abbreviation || away?.team?.shortDisplayName || "AWAY";
    const status = match.status?.type?.shortDetail || match.status?.type?.description || "";
    const state = match.status?.type?.state || "";
    return { text: `${aa} ${as} – ${hs} ${ha}`, status, state };
  } catch (e) {
    console.warn("ESPN fetch failed", e);
    return { text: "Score unavailable", status: "error", state: "error" };
  }
}

async function refreshEspnScore() {
  const btn = document.getElementById("gd-fetch-score");
  const statusEl = document.getElementById("gd-score-status");
  if (gameDay.mode === "school") {
    if (statusEl) statusEl.textContent = "School mode — enter score manually";
    return;
  }
  if (!gameDay.teamAbbr) {
    if (statusEl) statusEl.textContent = "Pick a team first";
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = "Fetching…"; }
  if (statusEl) statusEl.textContent = "Loading…";
  const result = await fetchEspnScoreForTeam(gameDay.league, gameDay.teamAbbr, gameDay.teamName);
  if (btn) { btn.disabled = false; btn.textContent = "Fetch live score"; }
  if (result) {
    gameDay.score = result.text + (result.status && result.status !== "none" ? " · " + result.status : "");
    saveGameDay();
    const scoreInput = document.getElementById("game-day-score");
    if (scoreInput) scoreInput.value = gameDay.score;
    updateGameDayBanner();
    if (statusEl) {
      statusEl.textContent = result.state === "in" ? "Live" : result.state === "post" ? "Final" : result.state === "pre" ? "Upcoming" : (result.status || "");
    }
  } else if (statusEl) statusEl.textContent = "Could not load";
}

function startEspnPolling() {
  stopEspnPolling();
  if (!gameDay.enabled || !gameDay.autoScore || gameDay.mode === "school" || !gameDay.teamAbbr) return;
  refreshEspnScore();
  espnTimer = setInterval(refreshEspnScore, 60000);
}
function stopEspnPolling() {
  if (espnTimer) { clearInterval(espnTimer); espnTimer = null; }
}

function updateGameDayBanner() {
  const banner = document.getElementById("game-day-banner");
  if (!banner) return;
  if (!gameDay.enabled) { banner.hidden = true; return; }
  const color = gameDay.league === "nba" ? "#5d76a9" : gameDay.league === "cfb" ? "#ff8200" : "#4b92db";
  const title = gameDay.message || (gameDay.mode === "school"
    ? `It's Game Day — Go ${gameDay.schoolName || "Team"}!`
    : `It's Game Day — Go ${gameDay.teamName || gameDay.teamAbbr}!`);
  const logo = gameDay.logoUrl
    ? `<img src="${escAttr(gameDay.logoUrl)}" alt="logo" class="gd-logo">`
    : `<span class="gd-logo-fallback" style="background:${color}"></span>`;
  const score = gameDay.score ? `<span class="gd-score">${escAttr(gameDay.score)}</span>` : "";
  banner.hidden = false;
  banner.innerHTML = `<div class="gd-left"><span class="gd-label">GAME DAY</span><strong>${escAttr(title)}</strong></div>${logo}${score}`;
  banner.style.borderColor = color;
  banner.style.background = `linear-gradient(135deg, ${color}22, transparent)`;
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
      <div class="potd-info"><div class="potd-name">${g.name}</div><div class="potd-meta">${g.category} · Tap to play</div></div>
    </a>`;
}
function renderStreak() {
  const el = document.getElementById("streak-badge");
  if (!el) return;
  if (streak.count > 0) { el.hidden = false; el.textContent = `🔥 ${streak.count} day streak`; }
  else el.hidden = true;
}
function renderLeaderboard() {
  const el = document.getElementById("leaderboard");
  if (!el) return;
  const top = getTopScores(5);
  el.innerHTML = top.length
    ? top.map((t, i) => `<div class="lb-row"><span class="lb-rank">#${i+1}</span><span class="lb-name">${t.game.name}</span><span class="lb-score">${t.score}</span></div>`).join("")
    : `<div class="lb-empty">Play games to set high scores</div>`;
}
function renderChips() {
  const el = document.getElementById("chips");
  if (!el) return;
  const cats = ["all", "popular", "favorites", ...new Set(games.map(g => g.category).filter(Boolean))];
  el.innerHTML = cats.map(c => {
    const label = c === "all" ? "All" : c === "popular" ? "Popular" : c === "favorites" ? "Favorites" : c;
    return `<button class="chip ${chip === c ? "active" : ""}" data-chip="${c}">${label}</button>`;
  }).join("");
  el.querySelectorAll("[data-chip]").forEach(btn => btn.addEventListener("click", () => { chip = btn.dataset.chip; render(); }));
}

function render() {
  const grid = document.getElementById("grid");
  if (!grid) return;
  let list = games.filter(g => !g.disabled);
  if (gameDay.enabled && gameDay.sportsOnly) list = list.filter(g => (g.category || "").toLowerCase().includes("sport"));
  if (chip && chip !== "all") {
    if (chip === "popular") list = list.filter(g => g.popular);
    else if (chip === "favorites") list = list.filter(g => favs.includes(g.id));
    else list = list.filter(g => (g.category || "").toLowerCase() === chip.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(g => (g.name + " " + (g.category || "")).toLowerCase().includes(q));
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
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.fav;
      favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
      saveJSON(LS_FAVS, favs); checkBadges(); render();
    });
  });
  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const g = games.find(x => x.id === card.dataset.id);
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
  if (gameDay.enabled && gameDay.autoScore) startEspnPolling();
  else stopEspnPolling();
}

function surpriseMe() {
  const list = games.filter(g => !g.disabled);
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
  ["id","name","category","path","icon","note"].forEach(k => {
    const el = document.getElementById("editor-" + k);
    if (el) el.value = g[k] || (k === "icon" ? "🎮" : k === "category" ? "Arcade" : k === "note" ? "Local" : "");
  });
  document.getElementById("editor-color").value = g.color || "#6366f1";
  document.getElementById("editor-popular").checked = !!g.popular;
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
  if (index !== "" && games[parseInt(index)]?.image) game.image = games[parseInt(index)].image;
  if (!game.name || !game.path) { alert("Name and path required"); return; }
  if (index === "") games.push(game); else games[parseInt(index)] = game;
  saveGames(); renderAdminList(); render();
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
  if (!input?.value.trim()) return;
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

function syncGameDayUI() {
  const modePro = document.getElementById("gd-mode-pro");
  const modeSchool = document.getElementById("gd-mode-school");
  const proFields = document.getElementById("gd-pro-fields");
  const schoolFields = document.getElementById("gd-school-fields");
  if (modePro) modePro.checked = gameDay.mode !== "school";
  if (modeSchool) modeSchool.checked = gameDay.mode === "school";
  if (proFields) proFields.hidden = gameDay.mode === "school";
  if (schoolFields) schoolFields.hidden = gameDay.mode !== "school";
  const leagueSel = document.getElementById("gd-league");
  if (leagueSel) leagueSel.value = gameDay.league || "nfl";
  populateTeamSelect();
  const msg = document.getElementById("game-day-message");
  if (msg) msg.value = gameDay.message || "";
  const score = document.getElementById("game-day-score");
  if (score) score.value = gameDay.score || "";
  const logo = document.getElementById("game-day-logo");
  if (logo) logo.value = gameDay.logoUrl || "";
  const school = document.getElementById("gd-school-name");
  if (school) school.value = gameDay.schoolName || "";
}

function init() {
  applyTheme(currentTheme);
  updateClock();
  setInterval(updateClock, 1000);

  document.getElementById("btn-admin")?.addEventListener("click", () => { document.getElementById("admin-modal").hidden = false; });
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
    syncGameDayUI();
  });
  document.getElementById("settings-close")?.addEventListener("click", () => document.getElementById("settings-modal").hidden = true);
  document.querySelectorAll("[data-settings-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#settings-modal .admin-tab-content").forEach(c => c.hidden = true);
      document.querySelectorAll("[data-settings-tab]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("settings-tab-" + btn.dataset.settingsTab).hidden = false;
    });
  });

  // Game Day
  document.getElementById("game-day-toggle")?.addEventListener("change", e => {
    gameDay.enabled = e.target.checked; saveGameDay(); render();
  });
  document.getElementById("game-day-sports")?.addEventListener("change", e => {
    gameDay.sportsOnly = e.target.checked; saveGameDay(); render();
  });
  document.getElementById("game-day-auto-score")?.addEventListener("change", e => {
    gameDay.autoScore = e.target.checked; saveGameDay();
    if (gameDay.autoScore) startEspnPolling(); else stopEspnPolling();
  });
  document.getElementById("gd-mode-pro")?.addEventListener("change", () => {
    if (document.getElementById("gd-mode-pro").checked) {
      gameDay.mode = "pro"; saveGameDay(); syncGameDayUI(); render();
    }
  });
  document.getElementById("gd-mode-school")?.addEventListener("change", () => {
    if (document.getElementById("gd-mode-school").checked) {
      gameDay.mode = "school"; saveGameDay(); syncGameDayUI(); stopEspnPolling(); render();
    }
  });
  document.getElementById("gd-league")?.addEventListener("change", e => {
    gameDay.league = e.target.value;
    gameDay.teamAbbr = "";
    gameDay.teamName = "";
    saveGameDay();
    populateTeamSelect();
  });
  document.getElementById("gd-team")?.addEventListener("change", e => {
    const opt = e.target.selectedOptions[0];
    gameDay.teamAbbr = e.target.value;
    gameDay.teamName = opt?.dataset?.name || opt?.textContent || e.target.value;
    if (!gameDay.message || gameDay.message.includes("Go ")) {
      gameDay.message = `It's Game Day — Go ${gameDay.teamName}!`;
      const msg = document.getElementById("game-day-message");
      if (msg) msg.value = gameDay.message;
    }
    saveGameDay();
    if (gameDay.autoScore) refreshEspnScore();
    updateGameDayBanner();
  });
  document.getElementById("game-day-message")?.addEventListener("input", e => {
    gameDay.message = e.target.value; saveGameDay(); updateGameDayBanner();
  });
  document.getElementById("game-day-score")?.addEventListener("input", e => {
    gameDay.score = e.target.value; saveGameDay(); updateGameDayBanner();
  });
  document.getElementById("game-day-logo")?.addEventListener("input", e => {
    gameDay.logoUrl = e.target.value; saveGameDay(); updateGameDayBanner();
  });
  document.getElementById("gd-school-name")?.addEventListener("input", e => {
    gameDay.schoolName = e.target.value;
    gameDay.message = `It's Game Day — Go ${e.target.value || "Team"}!`;
    const msg = document.getElementById("game-day-message");
    if (msg) msg.value = gameDay.message;
    saveGameDay(); updateGameDayBanner();
  });
  document.getElementById("gd-fetch-score")?.addEventListener("click", refreshEspnScore);

  document.querySelectorAll("[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });
  document.getElementById("search")?.addEventListener("input", e => { query = e.target.value; render(); });
  document.getElementById("btn-surprise")?.addEventListener("click", surpriseMe);
  document.getElementById("suggest-btn")?.addEventListener("click", submitSuggestion);
  document.getElementById("btn-music")?.addEventListener("click", () => {
    musicOn = !musicOn;
    document.getElementById("btn-music").classList.toggle("active", musicOn);
  });

  const gdToggle = document.getElementById("game-day-toggle");
  if (gdToggle) gdToggle.checked = !!gameDay.enabled;
  const gdSports = document.getElementById("game-day-sports");
  if (gdSports) gdSports.checked = !!gameDay.sportsOnly;
  const gdAuto = document.getElementById("game-day-auto-score");
  if (gdAuto) gdAuto.checked = gameDay.autoScore !== false;

  render();
}

init();
