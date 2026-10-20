# Card Table — Handover

## Status

Playable static site: rules for 17 card games for two or three players with one or two ordinary decks.
Each game page has step-by-step rules, card-layout diagrams drawn in HTML/CSS, an "On your turn"
reminder, handicaps for adult-vs-child play, three-player notes and variants. Print button per game.

Games: Crazy Eights, Kings Corner, Rummy, Golf, German Whist, Oh Hell!, Spite and Malice (2 decks),
Speed, Egyptian Ratscrew, Spoons, Maths War, Salute!, Make 24, Target, Number Builder,
Times Table Showdown (chess clock), Casino. Plus a "Before you start" page (#/basics).

- **Live**: https://shaktinarayanan.com/games/card-games/ once added to `shakti-website/src/data/games.ts`
  and the site is redeployed
- **Local**: `python3 -m http.server 9127` in this folder, then open http://localhost:9127/

No build step, no server.

## Layout

```
index.html   shell; loads the three scripts below
style.css    all styles, including playing cards, felt tables and print styles
cards.js     helpers that draw cards and table layouts (c, cards, fan, pile, slot, felt, fig, t, table…)
games.js     the GAMES array: every game's rules and figures, one object per game
app.js       hash routing (#/, #/basics, #/game/<id>), home filters, page rendering
```

To add a game, append an object to `GAMES` with the same fields as the others (see the comment at
the top of `games.js`). Card codes: `7h`, `10s`, `Kd`, `x` = face down, suffix `!` highlights, `~` fades.

## Ideas not done

- Cribbage (needs a paper board), Gin Rummy, Nertz (needs a deck per player)
- Score-sheet page or printable score cards

Last reviewed: 2026-10-20
