# 🎮 Sam's Bio Card — Live Discord Presence Website

A sleek, aesthetic personal bio website with **real-time Discord presence**, **avatar decoration support**, **video background**, and a cinematic entrance experience. Built with vanilla HTML/CSS/JS and deployed on Vercel.

---

## ✨ Features

- **Live Discord Presence** — shows what you're playing, listening to, or doing on Discord in real time via WebSocket (no page refresh needed)
- **Avatar Decoration Support** — displays your Discord avatar decoration (animated borders) using the Discord Bot API
- **Real-time Status Dot** — green/yellow/red/grey dot updates instantly as your Discord status changes
- **Video Background** — cinematic looping video background with grain overlay and vignette
- **Background Music** — video audio unlocks on the "click to enter" splash screen
- **Click to Enter Splash** — animated pulsing rings entrance screen
- **Loading Screen** — avatar + name + progress bar loading screen between splash and bio
- **Custom Cursor** — dot cursor with a trailing ring
- **Sound Toggle Button** — mute/unmute button in the top left corner
- **Auto Reconnect** — WebSocket automatically reconnects if connection drops
- **Responsive** — works on all screen sizes

---

## 🗂️ Project Structure

```
BIO-CARD/
├── index.html        ← Main website (all HTML, CSS, JS in one file)
├── bg.mp4            ← Background video with audio
├── vercel.json       ← Vercel routing config
└── api/
    └── presence.js   ← Serverless function (fetches Discord data)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JS | Frontend — no frameworks |
| Vercel | Hosting + serverless functions |
| Lanyard API | Discord presence (status, activity) |
| Lanyard WebSocket | Real-time presence updates |
| Discord Bot API | Avatar decoration data |
| Google Fonts (Outfit) | Typography |

---

## ⚙️ How It Works

### 1. Presence Flow

```
User opens site
      ↓
Splash screen shown (click to enter)
      ↓
User clicks → sound unlocks → loader appears
      ↓
/api/presence called (Vercel serverless function)
      ↓
presence.js fetches:
  ├── Discord Bot API  → avatar decoration URL
  └── Lanyard API      → avatar, status, activity
      ↓
Data returned to frontend → avatar, status, pill rendered
      ↓
Lanyard WebSocket opens → live updates forever
```

### 2. Real-Time Updates (WebSocket)

After the bio loads, the site connects to `wss://api.lanyard.rest/socket` and subscribes to your Discord user ID. Every time your status or activity changes on Discord, Lanyard pushes the update instantly — no refresh required.

```js
// WebSocket connects to Lanyard
const ws = new WebSocket('wss://api.lanyard.rest/socket');

// Subscribe to your user ID
ws.send(JSON.stringify({
  op: 2,
  d: { subscribe_to_id: 'YOUR_DISCORD_USER_ID' }
}));

// Receive live updates
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  // op 0 = event (status/activity changed)
  if (msg.op === 0) updateActivity(msg.d);
};
```

### 3. Avatar Decoration

Discord avatar decorations are fetched via the Discord Bot API (`/users/:id`) which returns `avatar_decoration_data.asset`. This is then built into a CDN URL and overlaid on top of the avatar as an absolutely positioned `<img>` element.

```js
// In presence.js (serverless function)
const userRes = await fetch(`https://discord.com/api/v10/users/${USER_ID}`, {
  headers: { Authorization: `Bot ${token}` }
});
const user = await userRes.json();

if (user.avatar_decoration_data?.asset) {
  decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256&passthrough=true`;
}
```

### 4. Dynamic Favicon

When your Discord avatar loads, it's drawn onto an HTML5 Canvas, clipped into a circle, and set as the browser tab favicon dynamically — so your tab icon always matches your Discord avatar.

---

## 🚀 Deployment Guide

### Prerequisites
- GitHub account
- Vercel account (free)
- Discord account
- A Discord Bot token

### Step 1 — Join Lanyard
Join **discord.gg/lanyard** with your Discord account. This enables Lanyard to track your presence automatically. No setup needed beyond joining.

### Step 2 — Create a Discord Bot
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application** → name it → **Create**
3. Go to **Bot** tab → click **Reset Token** → copy the token
4. Enable **Presence Intent** and **Server Members Intent**
5. Save changes

### Step 3 — Upload to GitHub
Create a new repository and upload files in this structure:
```
repo/
├── index.html
├── bg.mp4
├── vercel.json
└── api/
    └── presence.js
```
> **Tip:** To create the `api/` folder on GitHub web, click **Add file → Create new file** and type `api/presence.js` — the slash auto-creates the folder.

### Step 4 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **Add New → Project** → import your repo
3. Leave all settings default → click **Deploy**

### Step 5 — Add Environment Variable
1. In Vercel → your project → **Settings → Environment Variables**
2. Add:
   - **Key:** `DISCORD_TOKEN`
   - **Value:** your Discord bot token
   - Toggle **Sensitive** ON
3. Click **Save**
4. Go to **Deployments** → click the three dots on latest deployment → **Redeploy**

---

## 🔧 Customisation

### Change Your Name / Handle
In `index.html`, find and edit:
```html
<div class="uname">Sam</div>
<div class="uhandle">@samplaysz</div>
<div class="loader-name">Sam</div>
```

### Change Your Discord User ID
In `presence.js`:
```js
const USER_ID = '864213870494220341'; // ← replace with your ID
```
And in `index.html`:
```js
ws.send(JSON.stringify({
  op: 2,
  d: { subscribe_to_id: 'YOUR_ID_HERE' }
}));
```

### Change Social Links
In `index.html`, find the `.socials` section and update the `href` values:
```html
<a class="soc-btn" href="https://discord.com/users/YOUR_ID">...</a>
<a class="soc-btn" href="https://instagram.com/YOUR_HANDLE">...</a>
<a class="soc-btn" href="https://github.com/YOUR_USERNAME">...</a>
```

### Change Background Video
Replace `bg.mp4` in your repo with any `.mp4` file — keep the same filename.

### Change Volume
In `index.html`, find `vid.volume=0.4` and change `0.4` to any value between `0` (silent) and `1` (full volume).

---

## 🌐 API Reference

### `GET /api/presence`
Returns combined Discord user data including presence and avatar decoration.

**Response:**
```json
{
  "success": true,
  "data": {
    "discord_user": {
      "id": "864213870494220341",
      "username": "samplaysz",
      "global_name": "Sam",
      "avatar": "abc123..."
    },
    "discord_status": "online",
    "activities": [
      {
        "type": 0,
        "name": "Minecraft",
        "details": "Playing survival",
        "state": "In a world",
        "application_id": "...",
        "assets": { "large_image": "..." }
      }
    ]
  },
  "decoration": "https://cdn.discordapp.com/avatar-decoration-presets/..."
}
```

**Activity Types:**
| Type | Meaning |
|---|---|
| 0 | Playing |
| 1 | Streaming |
| 2 | Listening to |
| 3 | Watching |
| 5 | Competing in |

---

## ❓ FAQ

**Why is sound muted when the page first loads?**
This is a browser rule — all browsers block autoplay audio until the user interacts with the page. Clicking "click to enter" is that interaction, which is why sound starts then. This cannot be bypassed.

**Why isn't my avatar decoration showing?**
Make sure your `DISCORD_TOKEN` environment variable is set correctly in Vercel and you've redeployed after adding it.

**Why isn't my presence/status updating?**
Make sure you've joined the Lanyard Discord server (discord.gg/lanyard). Without joining, Lanyard cannot track your presence.

**How do I get my Discord User ID?**
Enable Developer Mode in Discord settings (Settings → Advanced → Developer Mode), then right-click your profile and click **Copy User ID**.

---

## 📄 License

Personal use. Feel free to fork and customise for your own bio site or you can contact me to customize it for you.
