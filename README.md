# Games for Shakti

Small learning games, one folder each. Every game is static (HTML, CSS, JS) and needs no server.
Shakti's website (`../shakti-website`) copies each game in at build time and serves it at
`https://shaktinarayanan.com/games/<slug>/`; the list lives in `shakti-website/src/data/games.ts`.

| Folder | Game | What it teaches | Build | Also hosted at |
|---|---|---|---|---|
| `biogame/` | Body Sticks | Biology (1,000 question sticks, three modes) | `npm run build` (validates content, writes `public/data/sticks.json`) | — |
| `lemonade-tycoon/` | Lemonade Tycoon | Money and running a business | none | Cloudflare Workers: lemonade-tycoon.harayanan.workers.dev |
| `piggy-bank-quest/` | Piggy Bank Quest | Saving towards a goal | none | — |

Each folder has a `HANDOVER.md` with status, layout and how to run it locally.

To publish a change: commit here, then rebuild and deploy the website
(`npm run deploy` in `../shakti-website`).
