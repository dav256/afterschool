// Astra-inspired look settings: accent, motion, clock format
(function () {
  const LS_LOOK = "afterschool:look";
  const defaultLook = {
    accent: null,
    motion: "none",
    speed: "medium",
    showClock: true,
    hour24: false,
    reduceMotion: false
  };

  function loadLook() {
    try {
      return Object.assign({}, defaultLook, JSON.parse(localStorage.getItem(LS_LOOK) || "{}"));
    } catch (e) {
      return Object.assign({}, defaultLook);
    }
  }
  function saveLook(look) {
    try { localStorage.setItem(LS_LOOK, JSON.stringify(look)); } catch (e) {}
  }

  let look = loadLook();
  let particles = [];
  let raf = null;
  let canvas, ctx;

  function applyAccent(hex) {
    if (hex) {
      document.documentElement.style.setProperty("--accent", hex);
      look.accent = hex;
    }
    document.querySelectorAll("#accent-swatches .swatch").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.accent === look.accent);
    });
  }

  function speedFactor() {
    if (look.reduceMotion) return 0;
    return look.speed === "fast" ? 1.6 : look.speed === "low" ? 0.5 : 1;
  }

  function initCanvas() {
    canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    spawn();
  }

  function spawn() {
    particles = [];
    if (look.motion === "none" || look.reduceMotion || !canvas) return;
    const n = look.motion === "stars" ? 80 : look.motion === "rain" ? 60 : 50;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: look.motion === "stars" ? Math.random() * 1.5 + 0.3 : Math.random() * 2.5 + 1,
        s: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.6 + 0.2
      });
    }
  }

  function tick() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const f = speedFactor();
    if (f === 0 || look.motion === "none") {
      raf = requestAnimationFrame(tick);
      return;
    }
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#9fe8d0";
    particles.forEach(p => {
      ctx.beginPath();
      if (look.motion === "rain") {
        ctx.strokeStyle = `rgba(180,200,255,${p.a})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + 12 * f);
        ctx.stroke();
        p.y += (8 + p.s * 4) * f;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      } else if (look.motion === "snow") {
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.s * f;
        p.x += Math.sin(p.y * 0.02) * 0.4;
        if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width; }
      } else if (look.motion === "stars") {
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.s * 0.15 * f;
        if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; }
      }
    });
    raf = requestAnimationFrame(tick);
  }

  function setMotion(m) {
    look.motion = m;
    saveLook(look);
    document.querySelectorAll("[data-motion]").forEach(b => b.classList.toggle("active", b.dataset.motion === m));
    spawn();
  }

  function setSpeed(s) {
    look.speed = s;
    saveLook(look);
    document.querySelectorAll("[data-speed]").forEach(b => b.classList.toggle("active", b.dataset.speed === s));
  }

  // Patch the global updateClock if present
  const origUpdate = window.updateClock;
  window.__lookHour24 = () => look.hour24;
  window.__lookShowClock = () => look.showClock;

  function bind() {
    initCanvas();
    applyAccent(look.accent);
    document.querySelectorAll("[data-motion]").forEach(b => {
      b.classList.toggle("active", b.dataset.motion === look.motion);
      b.addEventListener("click", () => setMotion(b.dataset.motion));
    });
    document.querySelectorAll("[data-speed]").forEach(b => {
      b.classList.toggle("active", b.dataset.speed === look.speed);
      b.addEventListener("click", () => setSpeed(b.dataset.speed));
    });
    document.querySelectorAll("#accent-swatches .swatch").forEach(b => {
      b.addEventListener("click", () => {
        applyAccent(b.dataset.accent);
        saveLook(look);
      });
    });

    const showClock = document.getElementById("opt-show-clock");
    const hour24 = document.getElementById("opt-24h");
    const reduce = document.getElementById("opt-reduce-motion");
    if (showClock) {
      showClock.checked = look.showClock;
      showClock.addEventListener("change", () => {
        look.showClock = showClock.checked;
        saveLook(look);
        const el = document.getElementById("float-clock");
        if (el) el.style.display = look.showClock ? "block" : "none";
      });
    }
    if (hour24) {
      hour24.checked = look.hour24;
      hour24.addEventListener("change", () => {
        look.hour24 = hour24.checked;
        saveLook(look);
        if (typeof updateClock === "function") updateClock();
      });
    }
    if (reduce) {
      reduce.checked = look.reduceMotion;
      reduce.addEventListener("change", () => {
        look.reduceMotion = reduce.checked;
        saveLook(look);
        spawn();
      });
    }

    // Override clock formatting
    if (typeof updateClock === "function") {
      const _updateClock = updateClock;
      window.updateClock = function () {
        const el = document.getElementById("float-clock");
        if (!el) return;
        if (!look.showClock) { el.style.display = "none"; return; }
        const now = new Date();
        const time = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !look.hour24,
          timeZone: "America/Chicago"
        });
        const date = now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "America/Chicago"
        });
        el.textContent = time + "  ·  " + date + " CT";
        el.style.display = "block";
      };
      updateClock();
    }

    if (look.motion !== "none") spawn();
    if (!raf) tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(bind, 50));
  } else {
    setTimeout(bind, 50);
  }
})();
