# Lemonade Tycoon — Handover

## Status

Playable single-file HTML game. Deployed to Cloudflare Workers (Static Assets).

- **Live**: https://lemonade-tycoon.harayanan.workers.dev
- **Also served at**: https://shaktinarayanan.com/games/lemonade-tycoon/ (copied in by `../../shakti-website`)
- **Local**: `python3 server.py` → port 9114, or `npm run dev` → port 8787 (Workers runtime emulator)

## Layout

```
public/index.html    the entire game — HTML, CSS, JS in one file
wrangler.jsonc       Cloudflare Workers config
server.py            local Python static server (serves from public/)
PLAYTEST-NOTES.md    playtest feedback
```

Everything served publicly must live in `public/`. The Workers assets uploader ships
the whole directory, so keep notes, logs, and scripts at the repo root.

## Deploying

```bash
CLOUDFLARE_ACCOUNT_ID=d30bec7e8f9b55be3edb94dd3d3d7811 CLOUDFLARE_API_TOKEN=$(cat /root/.cf-workers-token) npx wrangler deploy
```

The Workers deploy token ("Edit Cloudflare Workers" template) is in `/root/.cf-workers-token`
(chmod 600). `/root/.cf-token` is a separate zone-only token and cannot deploy. Keep tokens in files rather than pasting it into a
terminal or chat session — token strings persist in shell history and logs.

There is no Worker script. The game is pure static assets served from Cloudflare's
CDN, so requests do not invoke compute and are not billed against the Workers quota.
Adding server-side logic later means adding a `src/index.js` and a `main` entry in
`wrangler.jsonc`; the assets config stays as-is.

## Notes

- Account subdomain `harayanan.workers.dev` was claimed 2026-07-19. A newly claimed
  workers.dev subdomain takes several minutes to get its TLS certificate — DNS
  resolves before HTTPS works, so a handshake failure right after the first deploy
  is expected rather than a misconfiguration.
- `.vercel/` still holds a Vercel project link from an earlier deployment. Harmless;
  delete it if Vercel is retired for this project.
- `not_found_handling: "single-page-application"` means every unknown path serves
  `index.html`. Fine for a one-page game, but it means the site never returns a 404.

## Next steps

- Decide whether to retire the Vercel deployment or keep both.
- Optional: attach a custom domain via `routes` in `wrangler.jsonc` (requires the
  domain to be on Cloudflare DNS).

Last reviewed: 2026-10-02
