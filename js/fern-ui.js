// Fern-inspired UI helpers: bottom nav, coins, playables filter
(function () {
  const COINS_KEY = "afterschool:coins";

  function getCoins() {
    try { return parseInt(localStorage.getItem(COINS_KEY) || "0", 10) || 0; } catch (e) { return 0; }
  }
  function setCoins(n) {
    try { localStorage.setItem(COINS_KEY, String(Math.max(0, n))); } catch (e) {}
    const el = document.getElementById("coins-count");
    if (el) el.textContent = String(getCoins());
  }
  function addCoins(n) { setCoins(getCoins() + n); }

  // Award coins when a game card is clicked
  document.addEventListener("click", function (e) {
    const card = e.target.closest(".card");
    if (card) addCoins(5);
  });

  function bindBottomNav() {
    const nav = document.getElementById("bottom-nav");
    if (!nav) return;
    nav.querySelectorAll(".bn-item").forEach(btn => {
      btn.addEventListener("click", () => {
        nav.querySelectorAll(".bn-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.dataset.bn;
        if (tab === "settings") {
          const s = document.getElementById("btn-settings");
          if (s) s.click();
          else document.getElementById("settings-modal").hidden = false;
        } else if (tab === "music") {
          const m = document.getElementById("btn-music");
          if (m) m.click();
        } else if (tab === "playables") {
          const p = document.getElementById("btn-playables");
          if (p) p.click();
          // also try chip
          const chip = [...document.querySelectorAll(".chip")].find(c => /board/i.test(c.textContent));
          if (chip) chip.click();
        } else if (tab === "games") {
          const all = document.querySelector('.nav-item[data-filter="all"]');
          if (all) all.click();
          const chip = [...document.querySelectorAll(".chip")].find(c => /^all$/i.test(c.textContent.trim()));
          if (chip) chip.click();
        }
      });
    });
  }

  // Default starfield if look.js supports it
  try {
    const look = JSON.parse(localStorage.getItem("afterschool:look") || "{}");
    if (!look.motion) {
      look.motion = "stars";
      localStorage.setItem("afterschool:look", JSON.stringify(look));
    }
  } catch (e) {}

  function init() {
    setCoins(getCoins());
    bindBottomNav();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
