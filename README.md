# 🏃‍♂️ Meme Mania - The Ultimate Meme Temple Runner 🐕💨

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black.svg)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Web Audio](https://img.shields.io/badge/Web_Audio_API-100%25_Procedural-purple.svg)]()

> **"Much Speed. Very Obstacle. So Jump. Wow."**

**Meme Mania** is a 3D endless runner built with **Three.js** and **React 19**. Inspired by classic arcade games like *Temple Run* and *Subway Surfers*, Meme Mania transforms the experience into a celebration of internet meme culture.

Sprint down the neon synthwave cyber highway, dodge **404 Firewalls**, leap over **"Touch Grass"** lawnmower hurdles, slide under **Cringe Lasers**, and hoard **Dogecoins** while being relentlessly pursued by the **Buff Meme Beast**!

---

## 📸 Screenshots & Highlights

```
┌─────────────────────────────────────────────────────────────┐
│   [ 🪙 1,420 Ð ]      [ 🏃 1,840m ]     [ 📈 3X STONKS ]    │
│                                                             │
│                      3D RUNNER TRACK                        │
│                 [404 NOT FOUND FIREWALL]                    │
│                                                             │
│                  🐕  (Doge running 60fps)                   │
│                                                             │
│                 👹  (Buff Beast pursuing!)                  │
│                                                             │
│   [ ◄ LEFT (A) ]   [ SLIDE (S) ]   [ JUMP (W) ]  [ RIGHT (D) ]
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **🎮 60 FPS 3D Endless Runner Engine**: Real-time rendering with Three.js, studio PBR materials, dynamic soft shadows, responsive camera banking, jump arcs, and slide squashing.
- **🐕 6 Playable Viral Meme Characters**:
  - **Doge (The OG)**: Agility boost, faster lane transitions, and coin bonuses.
  - **Gigachad**: The Absolute Unit. +30% power-up durations & 1 free stumble buffer.
  - **FeelsGoodMan Pepe**: Rare frog luck! +35% Dogecoin value & higher diamond spawn rate.
  - **Popcat**: Animated rhythmic mouth popping with +60% baseline coin attraction radius.
  - **Diamond Hands Wojak**: Hodl master! Double score rate and massive multipliers.
  - **Chill Capybara**: "Ok I Pull Up" zen master with high stumble tolerance.
- **⚡ 6 Meme-Themed Power-Ups**:
  - **🚀 Much Speed (Doge)**: Hypersonic 2x sprint, supersonic golden trail, and obstacle obliteration!
  - **📈 Stonks Multiplier**: Graphs only go up! 3x score and Dogecoin value multiplier.
  - **🧲 Nyan Rainbow Magnet**: Pulls in all coins and gems from all 3 lanes automatically.
  - **🗿 Gigachad Stomp**: Grow to titan scale, flexing jawline, smashing obstacles into celebratory confetti.
  - **☕ "This is Fine" Shield**: Coffee mug aura that negates one fatal obstacle crash.
  - **🕺 Rickroll Revive**: "Never Gonna Give You Up" — 1 automatic respawn rewind on wipe out!
- **🔊 100% Procedural Web Audio API**:
  - Iconic sound effects generated in real-time (Vine Boom sub-bass drop, Bruh vocal formant synth, Doge Wow twinkles, coin chimes, jump boings, slide whooshes, and Game Over trumpet).
  - Dynamic procedural synthwave runner soundtrack that accelerates with speed boosts!
  - Zero external MP3/WAV dependencies — no missing files, no 404s.
- **🎁 7-Day Daily Login Bonus**:
  - Rewarding daily login system tracking consecutive check-in streaks via `localStorage`. Earn escalating Dogecoin rewards from Day 1 (50 Ð) all the way to the Day 7 jackpot (500 Ð)!
- **🛍️ Meme Locker & Upgrade Economy**:
  - Bank earned Dogecoins to unlock new memers and upgrade power-up durations.
- **🏆 Quests & Bounties System**:
  - Complete daily and milestone challenges to claim extra Dogecoins.
- **📱 Responsive Controls**:
  - Desktop: Keyboard (WASD, Arrow Keys, Space).
  - Mobile & Tablet: Ergonomic on-screen directional and jump/slide buttons.

---

## 🕹️ Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move Left** | `A` or `← Left Arrow` | Tap Left Arrow Button |
| **Move Right** | `D` or `→ Right Arrow` | Tap Right Arrow Button |
| **Jump** | `W` or `↑ Up Arrow` or `Space` | Tap Jump Button |
| **Slide** | `S` or `↓ Down Arrow` | Tap Slide Button |
| **Pause** | `P` or `Esc` | Tap Pause Icon |

---

## 🚀 Quick Start & Installation

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/meme-mania.git

# 2. Enter directory
cd meme-mania

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to play!

### Building for Production

```bash
npm run build
```

The production-ready artifacts will be generated in the `dist/` directory.

---

## 🐙 Pushing to Your GitHub Repository

To host this repository on your GitHub account under the name `meme-mania`:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage and commit all files (including package-lock.json)
git add .
git commit -m "feat: initial commit for Meme Mania endless runner"

# 3. Create a repo named 'meme-mania' on GitHub, then link it
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/meme-mania.git

# 4. Push to GitHub
git push -u origin main
```

### 🌐 Deploying to GitHub Pages

This repository includes automated GitHub Actions deployment workflows configured for GitHub Pages!

1. Go to your repository on GitHub.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. That's it! Every push to `main` will automatically build and publish your game to:
   ```
   https://<YOUR_USERNAME>.github.io/meme-mania/
   ```

---

## 🏗️ Architecture & Project Structure

```
meme-mania/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated CI test & build workflow
│       └── deploy.yml           # Automated GitHub Pages deployment workflow
├── src/
│   ├── audio/
│   │   └── soundManager.ts      # Web Audio procedural sound synth & BGM
│   ├── components/
│   │   ├── HUDOverlay.tsx        # In-game stats, power-up bars, threat meter
│   │   ├── StartMenu.tsx         # Title screen & character carousel
│   │   ├── GameOverModal.tsx     # Score recap, confetti & restart
│   │   ├── ShopModal.tsx         # Character unlock locker & power-up upgrades
│   │   ├── QuestsModal.tsx       # Achievement bounties & Dogecoin rewards
│   │   ├── GitHubRepoModal.tsx   # Interactive repository docs viewer
│   │   ├── MobileControls.tsx    # Ergonomic touch button pad
│   │   └── PauseModal.tsx        # Pause menu & sound toggles
│   ├── data/
│   │   └── characters.ts         # Character configs, power-ups & quests data
│   ├── three/
│   │   ├── characterModels.ts    # Procedural 3D character rigs & kinematics
│   │   ├── trackAndObstacles.ts  # Procedural 3D track chunks & obstacle models
│   │   └── ThreeRunnerScene.ts   # Three.js 60FPS runner engine
│   ├── types/
│   │   └── game.ts               # Core TypeScript interfaces & types
│   ├── App.tsx                   # Top-level React state manager
│   ├── index.css                 # Global Tailwind styles
│   └── main.tsx                  # React DOM root entry
├── index.html                    # HTML entry point with metadata
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build configuration
├── LICENSE                       # MIT License
└── README.md                     # You are here!
```

---

## 🛠️ Tech Stack

- **Renderer**: [Three.js](https://threejs.org/) (r170+)
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Engine**: Native Web Audio API (Dual-Oscillator Sub Synthesizers & Formant Filters)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Confetti**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingMeme`)
3. Commit your Changes (`git commit -m 'feat: Add Doge space helmet'`)
4. Push to the Branch (`git push origin feature/AmazingMeme`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<p align="center">
  Built with ❤️ for meme connoisseurs everywhere. <i>"Never gonna give you up!"</i>
</p>
