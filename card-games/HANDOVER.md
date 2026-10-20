# Card Table — Handover

## Status

Playable static site: rules for 27 card games (17 classics plus 10 made up for this site) for two or three players with one or two ordinary decks.
Each game page has step-by-step rules, card-layout diagrams drawn in HTML/CSS, an "On your turn"
reminder, handicaps for adult-vs-child play, three-player notes and variants. Print button per game.

Games: Crazy Eights, Kings Corner, Rummy, Golf, German Whist, Oh Hell!, Spite and Malice (2 decks),
Speed, Egyptian Ratscrew, Spoons, Maths War, Salute!, Make 24, Target, Number Builder,
Times Table Showdown (chess clock), Casino. Plus a "Before you start" page (#/basics).

Made up here (`games-original.js`, `original: true`, listed first under "Made up here"):
Treasure Dive, Round Numbers, Turnabout, Grab Pairs, Dragon's Hoard, Safe Cracker,
Bridge Builders (co-op), Bunny Race, Ruby Hunt, Card Cricket. None has been played at a real
table yet; Bridge Builders win rates, Card Cricket scoring and Treasure Dive's bonus were tuned
with quick Python simulations. Expect to adjust rules after the first plays.

- **Live**: https://shaktinarayanan.com/games/card-games/ (copied in by `../../shakti-website`;
  first deployed 2026-10-20, made-up games added the same day)
- **Local**: `python3 -m http.server 9127` in this folder, then open http://localhost:9127/

No build step, no server.

## Layout

```
index.html   shell; loads the three scripts below
style.css    all styles, including playing cards, felt tables and print styles
cards.js     helpers that draw cards and table layouts (c, cards, fan, pile, slot, felt, fig, t, table…)
games.js     the GAMES array: rules and figures for the 17 classic games, one object per game
games-original.js  pushes the 10 made-up games onto GAMES
app.js       hash routing (#/, #/basics, #/game/<id>), home filters, page rendering
```

To add a game, append an object to `GAMES` with the same fields as the others (see the comment at
the top of `games.js`). Card codes: `7h`, `10s`, `Kd`, `x` = face down, suffix `!` highlights, `~` fades.

## Next steps

- Play the made-up games and fix rules that don't hold up (note changes here)

## Ideas not done

- Cribbage (needs a paper board), Gin Rummy, Nertz (needs a deck per player)
- Score-sheet page or printable score cards

Last reviewed: 2026-10-20
