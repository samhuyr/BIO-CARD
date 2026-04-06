# sam ✦ — bio card

> personal bio page with discord presence, cinematic intro, and live view counter.

## stack
- vanilla HTML / CSS / JS — no frameworks
- [Lanyard](https://github.com/phineas/lanyard) — real-time discord presence via websocket
- [CounterAPI](https://counterapi.dev) — view counter
- Vercel — hosting

## features
- cinematic splash → intro video → identity reveal → main bio
- live discord status, activity, and badges
- real-time presence updates via websocket
- unique visitor counter (once per browser)
- custom cursor with trail
- ambient video background with sound toggle
- avatar, decoration, and status dot pulled from discord

## files
```
BIO-CARD/
├── index.html      # everything
├── bg.mp4          # background video
├── intro.mp4       # intro video
└── api/
    └── presence.js # lanyard proxy
```

## setup
just deploy to vercel. no env vars needed.
make sure `bg.mp4` and `intro.mp4` are in the root directory.

---

inspired by [msedge](https://msedge.elricc.site/)
