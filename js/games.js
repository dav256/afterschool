// Full catalog — path = local folder when available
const DEFAULT_GAMES = [
  // ===== LOCAL (included) =====
  { id:"retro-bowl", name:"Retro Bowl", category:"Sports", popular:true, path:"games/retro-bowl/index.html", note:"Local · saves progress", icon:"RB", color:"#4ade80" },
  { id:"2048", name:"2048", category:"Puzzle", popular:true, path:"games/2048/index.html", note:"Local", icon:"2048", color:"#fbbf24" },

  // ===== ARCADE =====
  { id:"slope", name:"Slope", category:"Arcade", popular:true, path:"games/slope/index.html", note:"Add local folder", icon:"S", color:"#60a5fa" },
  { id:"tunnel-rush", name:"Tunnel Rush", category:"Arcade", path:"games/tunnel-rush/index.html", note:"Add local folder", icon:"TR", color:"#34d399" },
  { id:"run-3", name:"Run 3", category:"Arcade", popular:true, path:"games/run-3/index.html", note:"Add local folder", icon:"R3", color:"#818cf8" },
  { id:"flappy-bird", name:"Flappy Bird", category:"Arcade", path:"games/flappy-bird/index.html", note:"Add local folder", icon:"FB", color:"#4ade80" },
  { id:"pacman", name:"Pac-Man", category:"Arcade", path:"games/pacman/index.html", note:"Add local folder", icon:"PM", color:"#fbbf24" },
  { id:"snake", name:"Snake", category:"Arcade", path:"games/snake/index.html", note:"Add local folder", icon:"SN", color:"#a3e635" },
  { id:"subway-surfers", name:"Subway Surfers", category:"Arcade", popular:true, path:"games/subway-surfers/index.html", note:"Add local folder", icon:"SS", color:"#38bdf8" },
  { id:"crossy-road", name:"Crossy Road", category:"Arcade", path:"games/crossy-road/index.html", note:"Add local folder", icon:"CR", color:"#f472b6" },
  { id:"geometry-dash", name:"Geometry Dash", category:"Arcade", popular:true, path:"games/geometry-dash/index.html", note:"Add local folder", icon:"GD", color:"#a855f7" },
  { id:"dino-run", name:"Chrome Dino", category:"Arcade", path:"games/dino-run/index.html", note:"Add local folder", icon:"DR", color:"#94a3b8" },
  { id:"stack", name:"Stack", category:"Arcade", path:"games/stack/index.html", note:"Add local folder", icon:"ST", color:"#f59e0b" },
  { id:"helix-jump", name:"Helix Jump", category:"Arcade", path:"games/helix-jump/index.html", note:"Add local folder", icon:"HJ", color:"#ec4899" },
  { id:"color-switch", name:"Color Switch", category:"Arcade", path:"games/color-switch/index.html", note:"Add local folder", icon:"CS", color:"#22d3ee" },
  { id:"cut-the-rope", name:"Cut the Rope", category:"Arcade", path:"games/cut-the-rope/index.html", note:"Add local folder", icon:"CTR", color:"#84cc16" },

  // ===== SPORTS =====
  { id:"retro-bowl-college", name:"Retro Bowl College", category:"Sports", popular:true, path:"games/retro-bowl-college/index.html", note:"Add local folder", icon:"RBC", color:"#4ade80" },
  { id:"basketball-stars", name:"Basketball Stars", category:"Sports", path:"games/basketball-stars/index.html", note:"Add local folder", icon:"BS", color:"#fb923c" },
  { id:"soccer-skills", name:"Soccer Skills", category:"Sports", path:"games/soccer-skills/index.html", note:"Add local folder", icon:"SK", color:"#22c55e" },
  { id:"football-legends", name:"Football Legends", category:"Sports", path:"games/football-legends/index.html", note:"Add local folder", icon:"FL", color:"#16a34a" },
  { id:"basket-random", name:"Basket Random", category:"Sports", popular:true, path:"games/basket-random/index.html", note:"Add local folder", icon:"BR", color:"#f97316" },
  { id:"volley-random", name:"Volley Random", category:"Sports", path:"games/volley-random/index.html", note:"Add local folder", icon:"VR", color:"#eab308" },
  { id:"boxing-random", name:"Boxing Random", category:"Sports", path:"games/boxing-random/index.html", note:"Add local folder", icon:"BX", color:"#ef4444" },

  // ===== RACING =====
  { id:"smash-karts", name:"Smash Karts", category:"Racing", popular:true, path:"games/smash-karts/index.html", note:"Add local folder", icon:"SK", color:"#fb923c" },
  { id:"drift-boss", name:"Drift Boss", category:"Racing", path:"games/drift-boss/index.html", note:"Add local folder", icon:"DB", color:"#f87171" },
  { id:"drift-hunters", name:"Drift Hunters", category:"Racing", path:"games/drift-hunters/index.html", note:"Add local folder", icon:"DH", color:"#dc2626" },
  { id:"moto-x3m", name:"Moto X3M", category:"Racing", popular:true, path:"games/moto-x3m/index.html", note:"Add local folder", icon:"MX", color:"#ea580c" },
  { id:"madalin-stunt-cars", name:"Madalin Stunt Cars 2", category:"Racing", path:"games/madalin-stunt-cars/index.html", note:"Add local folder", icon:"MSC", color:"#b91c1c" },
  { id:"eggycar", name:"Eggy Car", category:"Racing", path:"games/eggycar/index.html", note:"Add local folder", icon:"EC", color:"#fbbf24" },

  // ===== MULTIPLAYER =====
  { id:"1v1-lol", name:"1v1.LOL", category:"Multiplayer", popular:true, path:"games/1v1-lol/index.html", note:"Add local folder", icon:"1v1", color:"#f472b6" },
  { id:"shell-shockers", name:"Shell Shockers", category:"Multiplayer", popular:true, path:"games/shell-shockers/index.html", note:"Add local folder", icon:"SS", color:"#a78bfa" },
  { id:"krunker", name:"Krunker.io", category:"Multiplayer", popular:true, path:"games/krunker/index.html", note:"Add local folder", icon:"K", color:"#38bdf8" },
  { id:"among-us", name:"Among Us", category:"Multiplayer", path:"games/among-us/index.html", note:"Add local folder", icon:"AU", color:"#f87171" },
  { id:"roblox", name:"Roblox", category:"Multiplayer", path:"games/roblox/index.html", note:"Add local folder", icon:"R", color:"#ef4444" },
  { id:"surviv-io", name:"Surviv.io", category:"Multiplayer", path:"games/surviv-io/index.html", note:"Add local folder", icon:"SV", color:"#10b981" },
  { id:"zombs-royale", name:"Zombs Royale", category:"Multiplayer", path:"games/zombs-royale/index.html", note:"Add local folder", icon:"ZR", color:"#059669" },
  { id:"ev-io", name:"Ev.io", category:"Multiplayer", path:"games/ev-io/index.html", note:"Add local folder", icon:"EV", color:"#0ea5e9" },

  // ===== PUZZLE =====
  { id:"tetris", name:"Tetris", category:"Puzzle", path:"games/tetris/index.html", note:"Add local folder", icon:"T", color:"#22d3ee" },
  { id:"wordle", name:"Wordle", category:"Puzzle", path:"games/wordle/index.html", note:"Add local folder", icon:"W", color:"#65a30d" },
  { id:"sudoku", name:"Sudoku", category:"Puzzle", path:"games/sudoku/index.html", note:"Add local folder", icon:"SU", color:"#6366f1" },
  { id:"minesweeper", name:"Minesweeper", category:"Puzzle", path:"games/minesweeper/index.html", note:"Add local folder", icon:"MS", color:"#64748b" },
  { id:"solitaire", name:"Solitaire", category:"Puzzle", path:"games/solitaire/index.html", note:"Add local folder", icon:"SO", color:"#0f766e" },
  { id:"mahjong", name:"Mahjong", category:"Puzzle", path:"games/mahjong/index.html", note:"Add local folder", icon:"MJ", color:"#b45309" },

  // ===== CASUAL =====
  { id:"cookie-clicker", name:"Cookie Clicker", category:"Casual", popular:true, path:"games/cookie-clicker/index.html", note:"Add local folder", icon:"CC", color:"#c4a574" },
  { id:"bitlife", name:"BitLife", category:"Casual", path:"games/bitlife/index.html", note:"Add local folder", icon:"BL", color:"#c084fc" },
  { id:"idle-breakout", name:"Idle Breakout", category:"Casual", path:"games/idle-breakout/index.html", note:"Add local folder", icon:"IB", color:"#a78bfa" },
  { id:"agar-io", name:"Agar.io", category:"Casual", path:"games/agar-io/index.html", note:"Add local folder", icon:"AG", color:"#f472b6" },
  { id:"slither-io", name:"Slither.io", category:"Casual", path:"games/slither-io/index.html", note:"Add local folder", icon:"SL", color:"#34d399" },
  { id:"paper-io", name:"Paper.io 2", category:"Casual", path:"games/paper-io/index.html", note:"Add local folder", icon:"PI", color:"#60a5fa" },

  // ===== ADVENTURE / ACTION =====
  { id:"minecraft-classic", name:"Minecraft Classic", category:"Adventure", path:"games/minecraft-classic/index.html", note:"Add local folder", icon:"MC", color:"#86efac" },
  { id:"temple-run-2", name:"Temple Run 2", category:"Adventure", path:"games/temple-run-2/index.html", note:"Add local folder", icon:"TR", color:"#f59e0b" },
  { id:"happy-wheels", name:"Happy Wheels", category:"Action", path:"games/happy-wheels/index.html", note:"Add local folder", icon:"HW", color:"#94a3b8" },
  { id:"fireboy-watergirl", name:"Fireboy & Watergirl", category:"Adventure", popular:true, path:"games/fireboy-watergirl/index.html", note:"Add local folder", icon:"FW", color:"#ef4444" },
  { id:"stickman-hook", name:"Stickman Hook", category:"Action", path:"games/stickman-hook/index.html", note:"Add local folder", icon:"SH", color:"#3b82f6" },
  { id:"getaway-shootout", name:"Getaway Shootout", category:"Action", path:"games/getaway-shootout/index.html", note:"Add local folder", icon:"GS", color:"#f43f5e" },
  { id:"rooftop-snipers", name:"Rooftop Snipers", category:"Action", path:"games/rooftop-snipers/index.html", note:"Add local folder", icon:"RS", color:"#8b5cf6" },
  { id:"tanuki-sunset", name:"Tanuki Sunset", category:"Action", path:"games/tanuki-sunset/index.html", note:"Add local folder", icon:"TS", color:"#f97316" },
];
