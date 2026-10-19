import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Layers, 
  Sparkles,
  GitBranch,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface GitHubRepoModalProps {
  onClose: () => void;
}

export const GitHubRepoModal: React.FC<GitHubRepoModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'setup' | 'architecture' | 'readme'>('docs');
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const cloneCommand = 'git clone https://github.com/your-username/meme-mania.git';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id === 'clone') {
      setCopiedClone(true);
      setTimeout(() => setCopiedClone(false), 2000);
    } else {
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md select-none pointer-events-auto">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/80 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Github className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
                  meme-mania
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                  PUBLIC REPO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official GitHub Project Documentation & Deployment Hub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clone Snippet Bar */}
        <div className="my-3 bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 overflow-x-auto">
            <Terminal className="w-4 h-4 shrink-0 text-slate-500" />
            <span>{cloneCommand}</span>
          </div>

          <button
            onClick={() => handleCopy(cloneCommand, 'clone')}
            className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 border border-emerald-500/30"
          >
            {copiedClone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedClone ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 text-xs sm:text-sm">
          {[
            { id: 'docs', label: '📖 Game Docs & Lore', icon: BookOpen },
            { id: 'setup', label: '🚀 GitHub Setup', icon: Terminal },
            { id: 'architecture', label: '🏗️ Architecture', icon: Layers },
            { id: 'readme', label: '📄 README.md', icon: GitBranch },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2 px-3.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-300">
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
                  <span>🎮 Gameplay Lore: The Meme Temple Run</span>
                </h3>
                <p className="leading-relaxed mb-3">
                  In <strong>Meme Mania</strong>, you sprint down the infinite synthwave cyberway, pursued by the terrifying 
                  <strong> Buff Meme Beast</strong>. Dodge 404 Firewalls, leap over &quot;Touch Grass&quot; hurdles, slide under 
                  overhead Cringe Lasers, and hoard Dogecoins to unlock viral icons and upgrade wild meme power-ups!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Lanes</span>
                    <span className="font-black text-white text-base">3 Lanes (3D)</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Characters</span>
                    <span className="font-black text-amber-400 text-base">6 Memers</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Power-Ups</span>
                    <span className="font-black text-pink-400 text-base">6 Types</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Audio</span>
                    <span className="font-black text-emerald-400 text-base">100% Web Audio</span>
                  </div>
                </div>
              </div>

              {/* Power-Ups Guide */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-base font-black text-white mb-3">
                  ⚡ Meme Power-Ups Guide
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-amber-500/20">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <strong className="text-amber-300 text-xs block">Much Speed (Doge)</strong>
                      <p className="text-[11px] text-slate-300">
                        2x hypersonic sprint with full invincibility, golden speed trail, and obstacle obliteration!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-2xl">📈</span>
                    <div>
                      <strong className="text-emerald-300 text-xs block">Stonks Multiplier</strong>
                      <p className="text-[11px] text-slate-300">
                        Graphs only go up! Triples (3x) all gathered Dogecoins and distance points during its active duration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-pink-500/20">
                    <span className="text-2xl">🧲</span>
                    <div>
                      <strong className="text-pink-300 text-xs block">Nyan Rainbow Magnet</strong>
                      <p className="text-[11px] text-slate-300">
                        Summons an interstellar rainbow aura that draws every coin and diamond across all three lanes directly into you.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-purple-500/20">
                    <span className="text-2xl">🗿</span>
                    <div>
                      <strong className="text-purple-300 text-xs block">Gigachad Stomp</strong>
                      <p className="text-[11px] text-slate-300">
                        Grow giant scale, jawline chiseled to perfection, kicking obstacles into confetti with heavy bass synth chords.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-orange-500/20">
                    <span className="text-2xl">☕</span>
                    <div>
                      <strong className="text-orange-300 text-xs block">&quot;This Is Fine&quot; Shield</strong>
                      <p className="text-[11px] text-slate-300">
                        A peaceful coffee cup forcefield that completely absorbs your next fatal crash without ending the run.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-blue-500/20">
                    <span className="text-2xl">🕺</span>
                    <div>
                      <strong className="text-blue-300 text-xs block">Rickroll Revive</strong>
                      <p className="text-[11px] text-slate-300">
                        Never gonna give you up! Grants 1 automatic resurrection when you wipe out, rewinding you back onto track.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-base font-black text-white mb-2">
                  🕹️ Controls & Mechanics
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="font-mono text-cyan-400 font-bold block">A / ← Left Arrow</span>
                    <span className="text-slate-400">Switch lane to Left</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="font-mono text-cyan-400 font-bold block">D / → Right Arrow</span>
                    <span className="text-slate-400">Switch lane to Right</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="font-mono text-cyan-400 font-bold block">W / ↑ Up / Space</span>
                    <span className="text-slate-400">Jump over low hurdles</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl">
                    <span className="font-mono text-cyan-400 font-bold block">S / ↓ Down Arrow</span>
                    <span className="text-slate-400">Slide under cringe lasers</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-base font-black text-white mb-2">
                  🐙 Host on GitHub: Step-by-Step Instructions
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Follow these steps to initialize and push this complete <strong>Meme Mania</strong> repository to your GitHub account:
                </p>

                <div className="space-y-3">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      Step 1: Create a New GitHub Repository
                    </span>
                    <p className="text-xs text-slate-300 mb-2">
                      Go to GitHub.com, click &quot;New Repository&quot;, and name it <strong>meme-mania</strong>. Keep it Public and do not initialize with a README (this project already includes a full README.md).
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      Step 2: Initialize Git and Commit
                    </span>
                    <div className="bg-black/60 rounded-lg p-2 font-mono text-xs text-slate-300 flex items-center justify-between">
                      <code>
                        git init<br />
                        git add .<br />
                        git commit -m &quot;feat: initial commit for Meme Mania endless runner&quot;
                      </code>
                      <button
                        onClick={() => handleCopy('git init\ngit add .\ngit commit -m "feat: initial commit for Meme Mania endless runner"', 'cmd1')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {copiedCommand === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      Step 3: Link Remote and Push to Main
                    </span>
                    <div className="bg-black/60 rounded-lg p-2 font-mono text-xs text-slate-300 flex items-center justify-between">
                      <code>
                        git branch -M main<br />
                        git remote add origin https://github.com/YOUR_USERNAME/meme-mania.git<br />
                        git push -u origin main
                      </code>
                      <button
                        onClick={() => handleCopy('git branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/meme-mania.git\ngit push -u origin main', 'cmd2')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {copiedCommand === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      Step 4: Enable GitHub Pages in Repo Settings
                    </span>
                    <p className="text-xs text-slate-300">
                      Go to your GitHub repo <strong>Settings</strong> &gt; <strong>Pages</strong>, and under <em>Build and deployment / Source</em>, choose <strong>GitHub Actions</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 block mb-1">
                      Step 5: Automated Build & Deploy (Live Game!)
                    </span>
                    <p className="text-xs text-slate-300">
                      The repo includes <code>.github/workflows/deploy.yml</code> and <code>package-lock.json</code>. Your game will automatically build and publish to:
                      <br />
                      <code className="text-emerald-400 font-bold">https://&lt;your-username&gt;.github.io/meme-mania/</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <h3 className="text-base font-black text-white mb-2">
                  🏗️ Project Architecture & File Tree
                </h3>
                <div className="bg-black/70 p-3 rounded-xl font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-emerald-400">meme-mania/</div>
                  <div>├── .github/workflows/</div>
                  <div>│   ├── ci.yml              <span className="text-slate-500"># GitHub Actions CI build check</span></div>
                  <div>│   └── deploy.yml          <span className="text-slate-500"># Automated GitHub Pages deployment</span></div>
                  <div>├── package-lock.json       <span className="text-slate-500"># Fixed npm dependencies lockfile</span></div>
                  <div>├── src/</div>
                  <div>│   ├── audio/</div>
                  <div>│   │   └── soundManager.ts     <span className="text-slate-500"># Procedural Web Audio synth & BGM</span></div>
                  <div>│   ├── components/</div>
                  <div>│   │   ├── HUDOverlay.tsx       <span className="text-slate-500"># In-game stats, powerup bars & chaser alert</span></div>
                  <div>│   │   ├── StartMenu.tsx        <span className="text-slate-500"># Main menu & character carousel</span></div>
                  <div>│   │   ├── GameOverModal.tsx    <span className="text-slate-500"># Recap, score celebration & retry</span></div>
                  <div>│   │   ├── ShopModal.tsx        <span className="text-slate-500"># Character locker & upgrades</span></div>
                  <div>│   │   ├── QuestsModal.tsx      <span className="text-slate-500"># Quests & bounty rewards</span></div>
                  <div>│   │   ├── GitHubRepoModal.tsx  <span className="text-slate-500"># In-game repository documentation hub</span></div>
                  <div>│   │   └── MobileControls.tsx   <span className="text-slate-500"># Ergonomic touch buttons</span></div>
                  <div>│   ├── data/</div>
                  <div>│   │   └── characters.ts        <span className="text-slate-500"># Characters, powerups & quests specs</span></div>
                  <div>│   ├── three/</div>
                  <div>│   │   ├── characterModels.ts   <span className="text-slate-500"># Procedural multi-part 3D rigs</span></div>
                  <div>│   │   ├── trackAndObstacles.ts <span className="text-slate-500"># Procedural 3D track, obstacles & items</span></div>
                  <div>│   │   └── ThreeRunnerScene.ts  <span className="text-slate-500"># Three.js 60FPS runner engine</span></div>
                  <div>│   ├── types/game.ts            <span className="text-slate-500"># TypeScript definitions</span></div>
                  <div>│   ├── App.tsx                  <span className="text-slate-500"># Top-level React state orchestrator</span></div>
                  <div>│   └── main.tsx                 <span className="text-slate-500"># Application mount</span></div>
                  <div>├── README.md                   <span className="text-slate-500"># Comprehensive project documentation</span></div>
                  <div>├── LICENSE                     <span className="text-slate-500"># MIT License</span></div>
                  <div>└── package.json                <span className="text-slate-500"># Dependencies & build scripts</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 font-mono text-xs leading-relaxed space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">README.md Preview</span>
                <span className="text-slate-500 text-[11px]">Markdown format</span>
              </div>
              <div className="text-slate-300 space-y-2 whitespace-pre-wrap">
{`# 🏃‍♂️ Meme Mania - The Ultimate Meme Temple Runner 🐕💨

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black.svg)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

**Meme Mania** is a 3D endless runner built with Three.js and React. Inspired by classic arcade runners like Temple Run and Subway Surfers, Meme Mania reimagines the genre through internet meme culture.

Sprint down the neon cyber highway, jump over "Touch Grass" lawnmowers, duck beneath Cringe Lasers, dodge 404 Firewalls, and collect Dogecoins while being relentlessly chased by the Buff Meme Beast!

## ✨ Features

- **🎮 High-Performance 3D Engine**: Built on Three.js with PBR materials, dynamic studio lighting, smooth kinematics, and camera tilt.
- **🔊 100% Procedural Audio**: Authentic meme sound effects (Vine Boom, Bruh, Wow, Dogecoin ding, Gigachad brass flex) and an energetic synthwave runner BGM synthesized in real-time via Web Audio API. Zero external audio file 404 dependencies!
- **🐕 6 Playable Meme Characters**: Doge, Gigachad, FeelsGoodMan Pepe, Popcat, Diamond Hands Wojak, and Chill Capybara.
- **⚡ 6 Iconic Meme Power-Ups**: Much Speed (Doge supersonic sprint), Stonks Multiplier (3x coin boost), Nyan Rainbow Magnet, Gigachad Stomp, "This is Fine" Shield, and Rickroll Revive!
- **📱 Universal Controls**: Seamless keyboard controls (WASD / Arrows / Space) and responsive mobile touch buttons.
- **🎁 7-Day Daily Login Bonus**: Consecutive daily check-in rewards tracking via localStorage from 50 Ð up to the 500 Ð Day 7 jackpot!
- **💎 Economy & Quests**: Earn Dogecoins to recruit characters and upgrade power-up duration in the Meme Locker.

## 🚀 Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/meme-mania.git

# 2. Navigate to project folder
cd meme-mania

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
\`\`\`

## 📜 License

Distributed under the MIT License. See \`LICENSE\` for more information.`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
