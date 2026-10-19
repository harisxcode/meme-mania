import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Github } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenGithubDocs: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  onOpenGithubDocs,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl shadow-purple-950/80 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1">
          GAME PAUSED
        </h2>
        <p className="text-xs text-purple-300 mb-6">
          Take a breath, the Meme Beast is waiting!
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-400 text-slate-950 font-black text-base uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>RESUME RUN</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART RUN</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onToggleMute}
              className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'UNMUTE' : 'MUTE'}</span>
            </button>

            <button
              onClick={onOpenGithubDocs}
              className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              <Github className="w-4 h-4 text-emerald-400" />
              <span>DOCS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
