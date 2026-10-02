# Piggy Bank Quest — Handover

## Status

Playable single-file HTML game: save up for a new bicycle, one spending choice at a time.
No build step and no server; open `index.html` in a browser.

- **Live**: https://shaktinarayanan.com/games/piggy-bank-quest/ (copied in by `../../shakti-website`
  at build time; see `shakti-website/src/data/games.ts`)
- **Local**: `python3 -m http.server 9126` in this folder, then open http://localhost:9126/

## Layout

```
index.html    the entire game — HTML, CSS and JS in one file
```

Fonts load from Google Fonts; everything else is inline.

## Deploying

Rebuild and deploy Shakti's website (`npm run deploy` in `../../shakti-website`); it copies this folder.
