import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  ShoppingBag, 
  Github, 
  Trophy, 
  Crown, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface GameOverModalProps {
  reason: string;
  score: number;
  distance: number;
  coins: number;
  isNewHighScore: boolean;
  rank: number; // 1 to 10 if qualifies, -1 otherwise
  playerName: string;
  onSaveToLeaderboard: (name: string) => void;
  isSavedToLeaderboard: boolean;
  onRestart: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenGithubDocs: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  score,
  distance,
  coins,
  isNewHighScore,
  rank,
  playerName,
  onSaveToLeaderboard,
  isSavedToLeaderboard,
  onRestart,
  onOpenShop,
  onOpenLeaderboard,
  onOpenGithubDocs,
}) => {
  const [nameInput, setNameInput] = useState(playerName);

  useEffect(() => {
    if (isNewHighScore || rank > 0) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [isNewHighScore, rank]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSavedToLeaderboard) return;
    const clean = nameInput.trim().slice(0, 16) || playerName;
    onSaveToLeaderboard(clean);
    soundManager.playPowerUp('stonks');
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-red-950/80 text-center relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {rank > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider animate-bounce shadow-md">
              <Crown className="w-4 h-4 fill-current" />
              <span>NEW TOP 10 RECORD! RANK #{rank}</span>
            </div>
          )}
          {isNewHighScore && rank <= 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs uppercase tracking-wider shadow-md">
              <Trophy className="w-4 h-4 fill-current" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight uppercase drop-shadow-md mb-1.5">
          WIPED OUT!
        </h2>
        <p className="text-xs sm:text-sm text-red-200/90 font-mono font-bold bg-red-950/60 border border-red-500/30 rounded-xl py-2 px-3 mb-4">
          {reason}
        </p>

        {/* Run Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-2.5">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">
              Final Score
            </span>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-2.5">
            <span className="text-[10px] uppercase font-bold text-cyan-300 block">
              Distance
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {distance}m
            </span>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-2.5">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">
              Dogecoins
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              +{coins}
            </span>
          </div>
        </div>

        {/* Top 10 Save Prompt */}
        {rank > 0 && (
          <div className="bg-amber-950/50 border border-amber-500/40 rounded-2xl p-3 mb-4 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Claim Your Hall of Fame Spot
              </span>
              <span className="text-[10px] text-amber-400/80 font-mono">
                RANK #{rank}
              </span>
            </div>

            {isSavedToLeaderboard ? (
              <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Saved as <strong>{nameInput}</strong>
                </span>
                <button
                  onClick={onOpenLeaderboard}
                  className="underline hover:text-emerald-200 cursor-pointer"
                >
                  View Table
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={16}
                  placeholder="Enter your tag..."
                  className="flex-1 bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                >
                  SAVE
                </button>
              </form>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 hover:from-yellow-300 hover:via-pink-400 hover:to-cyan-300 text-slate-950 font-black text-base tracking-wider uppercase transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>RUN AGAIN</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-yellow-500/30 text-yellow-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Ranks</span>
            </button>

            <button
              onClick={onOpenShop}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
              <span>Locker</span>
            </button>

            <button
              onClick={onOpenGithubDocs}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400" />
              <span>Docs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
