import React from 'react';
import { Quest } from '../types/game';
import { X, Award, CheckCircle2, Gift } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface QuestsModalProps {
  quests: Quest[];
  onClaimQuest: (questId: string, reward: number) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  onClaimQuest,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/80 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Meme Quests & Bounties
              </h2>
              <p className="text-xs text-cyan-300">
                Complete hilarious milestones to earn free Dogecoins!
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

        {/* Quests List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {quests.map((q) => {
            const pct = Math.min(100, Math.floor((q.progress / q.target) * 100));

            return (
              <div
                key={q.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-black text-white text-sm sm:text-base">
                      {q.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {q.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/40 rounded-xl px-2.5 py-1 text-amber-300 font-bold text-xs">
                    <span>+{q.reward}</span>
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[10px] flex items-center justify-center font-black">
                      Ð
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Progress</span>
                    <span>{q.progress} / {q.target} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Claim button */}
                <div className="flex justify-end pt-1">
                  {q.claimed ? (
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> CLAIMED
                    </span>
                  ) : q.completed ? (
                    <button
                      onClick={() => {
                        onClaimQuest(q.id, q.reward);
                        soundManager.playPowerUp('stonks');
                      }}
                      className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 shadow-md shadow-amber-500/20 animate-pulse"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>CLAIM {q.reward} Ð</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
