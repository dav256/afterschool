<img src="icon.svg" width="72" alt="Afterschool gamepad icon">

# Afterschool

![last commit](https://img.shields.io/github/last-commit/dav256/afterschool?style=for-the-badge) ![repo size](https://img.shields.io/github/repo-size/dav256/afterschool?style=for-the-badge) ![GitHub stars](https://img.shields.io/github/stars/dav256/afterschool?style=for-the-badge&logo=github) ![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

> **Ready to play:** Eighteen games are included and playable, and more can be added as folders.

**Afterschool is a local games portal with a dark, minimal theme.**

It is designed to run locally: open the page, choose a game, or use the in-page admin to add, remove, and reorder entries.

## Included

- **Retro Bowl** — Sports · full game files under `games/retro-bowl/`
- **2048** — Puzzle · the original open-source 2048 (see Credits)
- **Snake** — Arcade
- **Tetris** — Puzzle
- **Flappy Bird** — Arcade
- **Chrome Dino** — Arcade · the T-Rex runner (see Credits)
- **Pong** — Arcade
- **Breakout** — Arcade
- **Minesweeper** — Puzzle
- **Wordle** — Puzzle · open-source word game (see Credits)
- **Memory Match** — Casual
- **Simon** — Casual
- **Tic-Tac-Toe** — Multiplayer · vs computer or 2 players
- **Asteroids** — Action
- **Chess** — Board · vs computer (see Credits)
- **Checkers** — Board · vs computer (see Credits)
- **Connect Four** — Board · 2 players (see Credits)
- **Battleship** — Board · vs computer (see Credits)

## Credits

Some games are adapted from open-source projects on GitHub, with their licenses kept in each game folder:

- **2048** by Gabriele Cirulli — MIT License (`games/2048/LICENSE.txt`)
- **Wordle** based on the open-source clone by WebDevSimplified — MIT License (`games/wordle/LICENSE`)
- **Chrome Dino** from wayou/t-rex-runner, based on Chromium's T-Rex Runner — BSD 3-Clause License (`games/dino-dash/LICENSE`)
- **Chess** from kbjorklu/chess — MIT License (`games/chess/LICENSE`)
- **Checkers** from stroibot/Checkers — MIT License (`games/checkers/LICENSE.md`)
- **Connect Four** from bryanbraun/connect-four — MIT License (`games/connect-four/LICENSE`)
- **Battleship** (Battleboat) from billmei/battleboat — MIT License (`games/battleship/LICENSE.txt`)

The remaining games were written for this repo.

## Add a Game

Drop the game folder into `games/<name>/` so the path matches (e.g. `games/slope/index.html`), or use the in-page admin to add, remove, or reorder games.

## Run

Open `index.html` or `npx serve .`
