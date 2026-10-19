import React from 'react';
import { CharacterConfig } from '../types/game';
import { 
  Play, 
  ShoppingBag, 
  Award, 
  Github, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Zap,
  Lock,
  Gift
} from 'lucide-react';

interface StartMenuProps {
  characters: CharacterConfig[];
  selectedCharacterId: string;
  onSelectCharacter: (charId: string) => void;
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenQuests: () => void;
  onOpenGithubDocs: () => void;
  onOpenDailyBonus: () => void;
  canClaimDailyBonus: boolean;
  highScore: number;
  totalCoins: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  onStartGame,
  onOpenShop,
  onOpenQuests,
  onOpenGithubDocs,
  onOpenDailyBonus,
  canClaimDailyBonus,
  highScore,
  totalCoins,
  isMuted,
  onToggleMute,
}) => {
  const currentIndex = characters.findIndex((c) => c.id === selectedCharacterId);
  const currentChar = characters[currentIndex] || characters[0];

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + characters.length) % characters.length;
    onSelectCharacter(characters[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % characters.length;
    onSelectCharacter(characters[nextIdx].id);
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/95 pointer-events-auto select-none backdrop-blur-[2px]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl">🔥</span>
          <div>
            <h2 className="text-xs font-black tracking-widest text-pink-400 uppercase">
              Temple Runner 3D
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">High Score:</span>
              <span className="text-sm font-black text-cyan-400 font-mono">
                {highScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bank & Top Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenDailyBonus}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer active:scale-95 ${
              canClaimDailyBonus
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 animate-pulse'
                : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/40'
            }`}
            title="Daily Login Bonus"
          >
            <Gift className="w-4 h-4" />
            <span>Daily Bonus</span>
            {canClaimDailyBonus && (
              <span className="w-2 h-2 rounded-full bg-red-600" />
            )}
          </button>

          <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center">
              Ð
            </span>
            <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">
              {totalCoins.toLocaleString()}
            </span>
          </div>

          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Hero Center Section */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-xl mx-auto">
        {/* Title */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-purple-500/30 to-cyan-500/20 blur-xl rounded-full" />
          <h1 className="relative text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 tracking-tight drop-shadow-[0_5px_15px_rgba(236,72,153,0.4)]">
            MEME MANIA
          </h1>
          <p className="text-sm sm:text-base text-purple-200/90 font-medium mt-1 tracking-wide">
            The Viral 3D Temple Run • Dodge Cringe, Collect Dogecoins
          </p>
        </div>

        {/* Character Card Carousel */}
        <div className="w-full bg-slate-900/90 border border-purple-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl shadow-purple-950/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-90"
              title="Previous Character"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-3xl">{currentChar.avatarEmoji}</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {currentChar.name}
                  </h3>
                  {!currentChar.unlocked && (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-pink-300 font-medium">
                  {currentChar.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-90"
              title="Next Character"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Character Perk Pill */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 flex items-center justify-center gap-2 text-center">
            <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>{currentChar.perks.specialDescription}</span>
          </div>

          <p className="text-[11px] text-slate-400 italic mt-2">
            &quot;{currentChar.quote}&quot;
          </p>
        </div>

        {/* Big Start RUN Button */}
        {currentChar.unlocked ? (
          <button
            onClick={onStartGame}
            className="w-full sm:w-80 py-4 px-8 rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 hover:from-yellow-300 hover:via-pink-400 hover:to-cyan-300 text-slate-950 font-black text-xl tracking-wider uppercase transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-pink-500/30 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-6 h-6 fill-current group-hover:translate-x-1 transition-transform" />
            <span>START RUNNING</span>
          </button>
        ) : (
          <button
            onClick={onOpenShop}
            className="w-full sm:w-80 py-4 px-8 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-400/50 text-amber-300 font-black text-lg tracking-wider uppercase transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3 cursor-pointer"
          >
            <Lock className="w-5 h-5" />
            <span>UNLOCK IN SHOP ({currentChar.cost} Ð)</span>
          </button>
        )}
      </div>

      {/* Bottom Menu Navigation Bar */}
      <div className="w-full max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={onOpenDailyBonus}
          className={`flex-1 min-w-[125px] py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
            canClaimDailyBonus
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400 animate-pulse'
              : 'bg-slate-900/80 hover:bg-slate-800 text-amber-300/90 border-amber-500/30'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" />
          <span>Daily Bonus</span>
          {canClaimDailyBonus && (
            <span className="w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        <button
          onClick={onOpenShop}
          className="flex-1 min-w-[125px] py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <ShoppingBag className="w-4 h-4 text-purple-400" />
          <span>Meme Locker</span>
        </button>

        <button
          onClick={onOpenQuests}
          className="flex-1 min-w-[130px] py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
        >
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Quests</span>
        </button>

        <button
          onClick={onOpenGithubDocs}
          className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md group"
        >
          <Github className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>GitHub Repo & Docs</span>
        </button>
      </div>
    </div>
  );
};
