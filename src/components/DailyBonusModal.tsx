import React from 'react';
import confetti from 'canvas-confetti';
import { DAILY_REWARDS } from '../data/dailyBonus';
import { DailyBonusState } from '../types/game';
import { X, Gift, Check, Flame, Clock, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface DailyBonusModalProps {
  status: DailyBonusState;
  onClaim: () => void;
  onClose: () => void;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  status,
  onClaim,
  onClose,
}) => {
  const currentTargetDay = status.streak;
  const canClaim = status.canClaimToday;

  const handleClaimClick = () => {
    if (!canClaim) return;
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
    });
    soundManager.playPowerUp('stonks');
    onClaim();
  };

  const todayReward = DAILY_REWARDS.find((r) => r.day === currentTargetDay) || DAILY_REWARDS[0];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-950/80 flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Glow behind */}
        <div className="absolute -top-16 inset-x-0 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Daily Login Bonus
                </h2>
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Day {currentTargetDay} Streak
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Log in every day to claim escalating Dogecoins and reach the Day 7 jackpot!
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

        {/* 7-Day Rewards Grid */}
        <div className="flex-1 overflow-y-auto my-4 py-1 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {DAILY_REWARDS.map((item) => {
              // Determine state of this day:
              // Claimed: If !canClaim && item.day <= currentTargetDay OR canClaim && item.day < currentTargetDay
              const isPastClaimed = canClaim
                ? item.day < currentTargetDay
                : item.day <= currentTargetDay;

              const isToday = item.day === currentTargetDay;
              const isFuture = item.day > currentTargetDay;

              const isDay7 = item.day === 7;

              return (
                <div
                  key={item.day}
                  className={`relative rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center justify-between transition-all ${
                    isDay7 ? 'col-span-2 sm:col-span-2 bg-gradient-to-br from-amber-950/70 via-purple-950/60 to-slate-900' : 'bg-slate-950/70'
                  } ${
                    isToday && canClaim
                      ? 'border-2 border-amber-400 ring-4 ring-amber-400/20 bg-amber-950/40 shadow-xl shadow-amber-900/30 animate-pulse'
                      : isPastClaimed
                      ? 'border border-emerald-500/40 opacity-75'
                      : 'border border-slate-800'
                  }`}
                >
                  {/* Status Tag */}
                  <div className="w-full flex justify-between items-center mb-1">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">
                      Day {item.day}
                    </span>
                    {isPastClaimed && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    {isToday && canClaim && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                        READY
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <span className={`my-1 ${isDay7 ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                    {item.emoji}
                  </span>

                  {/* Coin Amount */}
                  <div className="my-1">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] flex items-center justify-center">
                        Ð
                      </span>
                      <span className="font-mono font-black text-amber-300 text-base sm:text-lg">
                        +{item.dogecoins}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 block font-medium">
                      {item.label}
                    </span>
                  </div>

                  {item.specialNote && (
                    <span className="text-[9px] font-black text-pink-400 uppercase tracking-tight mt-1 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-400/30">
                      {item.specialNote}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-3 border-t border-slate-800">
          {canClaim ? (
            <button
              onClick={handleClaimClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-lg tracking-wider uppercase transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>CLAIM DAY {currentTargetDay} BONUS (+{todayReward.dogecoins} Ð)</span>
            </button>
          ) : (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Already claimed today! Return tomorrow to claim <strong>Day {currentTargetDay >= 7 ? 1 : currentTargetDay + 1}</strong> bonus.
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 transition-colors"
              >
                GOT IT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
