# Muzan Archive

An unofficial, fan-made, high-fidelity WebGL character archive for Muzan Kibutsuji.

> **Fan project notice:** Demon Slayer: Kimetsu no Yaiba and its characters belong to their respective rights holders. This repository contains original procedural visuals only; no official art is bundled.

## Live site

GitHub Pages deployment is configured at:

`https://tbnrdj2336.github.io/game-code/`

## Project structure

- `index.html`, `styles.css`, `app.js` — responsive static frontend and original offline WebGL scene
- `server.js` — dependency-free local JavaScript API/static server
- `archive_engine.c` — optional C companion service
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment workflow

## Development

Requires Node.js 18 or newer.

```bash
npm run check
npm start
```

Open `http://localhost:4173` after starting the local server.

### Optional C companion

```bash
gcc -O2 -o archive_engine archive_engine.c
./archive_engine stats
```

On Windows, compile to `archive_engine.exe`. The JavaScript server detects the executable automatically.

## GitHub Pages

The workflow deploys the static frontend. Ensure the repository's **Settings → Pages → Source** is set to **GitHub Actions**.
