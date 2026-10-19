import React, { useState } from 'react';
import { LeaderboardEntry } from '../types/game';
import { 
  Trophy, 
  X, 
  Medal, 
  Crown, 
  User, 
  RotateCcw, 
  Check, 
  Edit2, 
  Sparkles,
  Flame
} from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  playerName: string;
  onUpdatePlayerName: (newName: string) => void;
  onResetLeaderboard: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  playerName,
  onUpdatePlayerName,
  onResetLeaderboard,
  onClose,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = nameInput.trim().slice(0, 16) || 'Anon Memer';
    setNameInput(clean);
    onUpdatePlayerName(clean);
    setEditingName(false);
    soundManager.playCoin();
  };

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-yellow-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-yellow-950/80 flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Top Glow */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-yellow-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Meme Leaderboard
                </h2>
                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-yellow-500/40">
                  TOP 10 ALL-TIME
                </span>
              </div>
              <p className="text-xs text-yellow-200/80">
                The most legendary runners in Meme Mania history!
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

        {/* Player Name Profile Card */}
        <div className="my-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Your Player Tag
              </span>
              {editingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-0.5">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={16}
                    autoFocus
                    className="bg-slate-900 border border-yellow-500/50 rounded-lg px-2 py-0.5 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="submit"
                    className="p-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-md transition-colors"
                    title="Save Name"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white font-mono">
                    {playerName}
                  </span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-slate-400 hover:text-yellow-400 transition-colors p-0.5"
                    title="Edit Name"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
              Local Records
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-end">
              <Sparkles className="w-3 h-3" /> Stored in Browser
            </span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {sortedEntries.map((entry, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            const isCurrent = entry.isCurrentPlayer;

            let rankBadge = null;
            if (rank === 1) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-yellow-400 text-yellow-950 flex items-center justify-center font-black text-xs shadow-md shadow-yellow-500/40">
                  <Crown className="w-4 h-4 fill-current" />
                </div>
              );
            } else if (rank === 2) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-black text-xs shadow-md">
                  <Medal className="w-4 h-4" />
                </div>
              );
            } else if (rank === 3) {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-xs shadow-md">
                  <Medal className="w-4 h-4" />
                </div>
              );
            } else {
              rankBadge = (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs font-mono">
                  #{rank}
                </div>
              );
            }

            return (
              <div
                key={entry.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-purple-950/40 border-pink-500/70 shadow-lg shadow-purple-950/50'
                    : isTop3
                    ? 'bg-slate-950/80 border-yellow-500/30'
                    : 'bg-slate-950/50 border-slate-800/80'
                }`}
              >
                {/* Rank & Player Info */}
                <div className="flex items-center gap-3">
                  {rankBadge}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">
                        {entry.playerName}
                      </span>
                      {isCurrent && (
                        <span className="bg-pink-500/20 text-pink-300 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-pink-500/40">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{entry.characterEmoji} {entry.characterName}</span>
                      <span>•</span>
                      <span>{entry.distance.toLocaleString()}m</span>
                      <span>•</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-amber-950 text-[9px] flex items-center justify-center font-black">
                      Ð
                    </span>
                    <span className="text-base sm:text-lg font-black text-yellow-300 font-mono">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    POINTS
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold">Reset all scores?</span>
              <button
                onClick={() => {
                  onResetLeaderboard();
                  setShowConfirmReset(false);
                  soundManager.playVineBoom();
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-slate-500 hover:text-slate-400 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Records</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
