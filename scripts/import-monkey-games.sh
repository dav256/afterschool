#!/usr/bin/env bash
# Import selected MonkeyGG2 games into afterschool (run on a computer or Replit)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP=$(mktemp -d)
cd "$TMP"
git clone --depth 1 --filter=blob:none --sparse https://github.com/MonkeyGG2/monkeygg2.github.io.git m
cd m
git sparse-checkout set games
GAMES=(
  duck-life-4 friday-night-funkin core-ball doge-miner smash-karts sandspiel
  babel-tower n-gon fireboy-and-watergirl-3 fireboy-and-watergirl-4
  particle-clicker tanuki-sunset subway-surfers-ny geometry-dash-remastered
  breaklock aground amidst-the-sky
)
for g in "${GAMES[@]}"; do
  if [ -d "games/$g" ]; then
    echo "Copying $g..."
    rm -rf "$ROOT/games/$g"
    cp -R "games/$g" "$ROOT/games/"
  else
    echo "Skip missing: $g"
  fi
done
echo "Done. Add entries to js/games.js, commit, and push."
