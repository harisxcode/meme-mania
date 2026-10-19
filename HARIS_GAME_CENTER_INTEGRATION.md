# 🎮 Haris Game Center Integration Guide

This file provides the ready-to-paste snippets to add **Meme Mania** into the **Haris Game Center** repository.

---

## 1. Markdown Card (for Haris Game Center `README.md`)

Copy and paste this section into your **Haris Game Center** repository's game roster:

```markdown
### 🏃‍♂️ Meme Mania - The Ultimate 3D Meme Temple Runner

[![Play Meme Mania](https://img.shields.io/badge/PLAY_NOW-🎮_Meme_Mania-ff007f?style=for-the-badge)](https://harisxcode.github.io/meme-mania/)
[![GitHub Repo](https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/harisxcode/meme-mania)

- **Genre**: 3D Endless Runner (Temple Run Style)
- **Engine**: Three.js (WebGL 60FPS) + React 19 + Tailwind CSS
- **Features**: 6 Playable Memers (Doge, Gigachad, Pepe, Popcat, Wojak, Capybara), 6 Wild Power-Ups (Much Speed, Stonks 3x, Nyan Magnet, Gigachad Stomp, "This is Fine" Shield, Rickroll Revive), 100% Procedural Web Audio SFX & BGM, Top 10 All-Time Leaderboard, and 7-Day Daily Login Bonus.
- **Controls**: WASD / Arrow Keys / Touch Swipes & Buttons.
- **Live URL**: [https://harisxcode.github.io/meme-mania/](https://harisxcode.github.io/meme-mania/)
```

---

## 2. JSON Entry (for `games.json` or data stores in Haris Game Center)

If **Haris Game Center** uses a `games.json` or data array, add this entry:

```json
{
  "id": "meme-mania",
  "title": "Meme Mania",
  "tagline": "The Ultimate 3D Meme Temple Runner",
  "description": "An action-packed 3D endless runner packed with viral meme characters, wild power-ups, procedural meme sound effects, and 100% 60FPS Three.js kinematics.",
  "category": "Action / 3D Arcade Runner",
  "genre": "Endless Runner",
  "engine": "Three.js + React 19",
  "tags": ["3D", "Runner", "Temple Run", "Memes", "Arcade", "Web Audio", "Vite"],
  "playUrl": "https://harisxcode.github.io/meme-mania/",
  "repositoryUrl": "https://github.com/harisxcode/meme-mania",
  "thumbnail": "https://harisxcode.github.io/meme-mania/preview.png",
  "badge": "FEATURED",
  "featured": true,
  "controls": {
    "desktop": "WASD / Arrow Keys to dodge, jump, and slide. Space to jump.",
    "mobile": "On-screen steering pad & jump/slide buttons, or swipe gestures."
  },
  "rating": 5.0,
  "developer": "Haris"
}
```

---

## 3. HTML / Iframe Embed Snippet (for Web Portals)

If Haris Game Center embeds games directly into a page:

```html
<div class="game-container" style="position: relative; width: 100%; height: 700px; max-width: 1200px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <iframe
    src="https://harisxcode.github.io/meme-mania/"
    title="Meme Mania"
    width="100%"
    height="100%"
    frameborder="0"
    allow="autoplay; fullscreen; gamepad"
    allowfullscreen
    style="border: none;"
  ></iframe>
</div>
```

---

## 4. GitHub Pages Deployment Verification

Once pushed to `https://github.com/harisxcode/meme-mania`:
1. Open repo **Settings** > **Pages**.
2. Select **Source** as **GitHub Actions**.
3. The workflow (`.github/workflows/deploy.yml`) will build and publish to `https://harisxcode.github.io/meme-mania/` automatically!
