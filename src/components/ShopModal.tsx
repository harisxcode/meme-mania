import React, { useState } from 'react';
import { CharacterConfig, PowerUpConfig } from '../types/game';
import { X, Lock, Check, Zap, ArrowUpCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface ShopModalProps {
  characters: CharacterConfig[];
  selectedCharacterId: string;
  onSelectCharacter: (charId: string) => void;
  onUnlockCharacter: (charId: string, cost: number) => void;
  powerUps: Record<string, PowerUpConfig>;
  onUpgradePowerUp: (powerUpId: string, cost: number) => void;
  totalCoins: number;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  onUnlockCharacter,
  powerUps,
  onUpgradePowerUp,
  totalCoins,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'powerups'>('characters');

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md select-none pointer-events-auto">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-purple-950/80 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🛍️ Meme Locker & Upgrades</span>
            </h2>
            <p className="text-xs text-purple-300">
              Spend Dogecoins to recruit memers & buff your power-ups!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl px-3 py-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center">
                Ð
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {totalCoins.toLocaleString()}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'characters'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Memers Roster ({characters.length})
          </button>
          <button
            onClick={() => setActiveTab('powerups')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'powerups'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Power-Up Upgrades
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'characters' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {characters.map((char) => {
                const isSelected = char.id === selectedCharacterId;
                const canAfford = totalCoins >= char.cost;

                return (
                  <div
                    key={char.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'bg-purple-950/40 border-pink-500 ring-2 ring-pink-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{char.avatarEmoji}</span>
                        <div>
                          <h4 className="font-black text-white text-base">
                            {char.name}
                          </h4>
                          <span className="text-[11px] text-pink-300 font-medium block">
                            {char.tagline}
                          </span>
                        </div>
                      </div>

                      {char.unlocked ? (
                        isSelected ? (
                          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectCharacter(char.id);
                              soundManager.playWow();
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1 rounded-xl font-bold transition-colors"
                          >
                            SELECT
                          </button>
                        )
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            onUnlockCharacter(char.id, char.cost);
                            soundManager.playPowerUp('stonks');
                          }}
                          className={`text-xs px-3 py-1 rounded-xl font-black flex items-center gap-1 transition-all ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          <span>{char.cost} Ð</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mb-2">
                      {char.description}
                    </p>

                    <div className="bg-slate-900/90 rounded-xl p-2 text-[11px] text-yellow-300/90 flex items-center gap-1.5 font-medium border border-yellow-500/20">
                      <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
                      <span>{char.perks.specialDescription}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(powerUps).map((pu) => {
                const canAfford = totalCoins >= pu.costToUpgrade;

                return (
                  <div
                    key={pu.id}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{pu.icon}</span>
                          <div>
                            <h4 className="font-black text-white text-sm">
                              {pu.name}
                            </h4>
                            <span className="text-[10px] text-purple-300 font-mono">
                              LVL {pu.level} • {pu.duration}s DURATION
                            </span>
                          </div>
                        </div>

                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pu.color }}
                        />
                      </div>

                      <p className="text-xs text-slate-300 mb-3">
                        {pu.description}
                      </p>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        onUpgradePowerUp(pu.id, pu.costToUpgrade);
                        soundManager.playPowerUp('stonks');
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>UPGRADE TO LVL {pu.level + 1} ({pu.costToUpgrade} Ð)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
