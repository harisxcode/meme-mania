import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ShoppingBag, Github, Trophy, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  reason: string;
  score: number;
  distance: number;
  coins: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onOpenShop: () => void;
  onOpenGithubDocs: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  score,
  distance,
  coins,
  isNewHighScore,
  onRestart,
  onOpenShop,
  onOpenGithubDocs,
}) => {
  useEffect(() => {
    if (isNewHighScore) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isNewHighScore]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/80 text-center relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* High Score Badge */}
        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs uppercase tracking-wider mb-4 animate-bounce shadow-md">
            <Trophy className="w-4 h-4 fill-current" />
            <span>NEW HIGH SCORE! WOW!</span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-red-500 tracking-tight uppercase drop-shadow-md mb-2">
          WIPED OUT!
        </h2>
        <p className="text-xs sm:text-sm text-red-200/90 font-mono font-bold bg-red-950/60 border border-red-500/30 rounded-xl py-2 px-3 mb-6">
          {reason}
        </p>

        {/* Run Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-3">
            <span className="text-[10px] uppercase font-bold text-purple-300 block">
              Final Score
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3">
            <span className="text-[10px] uppercase font-bold text-cyan-300 block">
              Distance
            </span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              {distance}m
            </span>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-3">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">
              Dogecoins
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              +{coins}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 hover:from-yellow-300 hover:via-pink-400 hover:to-cyan-300 text-slate-950 font-black text-lg tracking-wider uppercase transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>RUN AGAIN</span>
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={onOpenShop}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-purple-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Meme Locker</span>
            </button>

            <button
              onClick={onOpenGithubDocs}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-200 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span>Repo Docs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
