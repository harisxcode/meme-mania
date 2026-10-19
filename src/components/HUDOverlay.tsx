import React from 'react';
import { ActivePowerUp, FloatingText } from '../types/game';
import { INITIAL_POWERUPS } from '../data/characters';
import { Pause, Volume2, VolumeX, Shield, Flame } from 'lucide-react';

interface HUDOverlayProps {
  score: number;
  distance: number;
  coins: number;
  activePowerUps: ActivePowerUp[];
  chaserThreat: number; // 0 to 1
  floatingTexts: FloatingText[];
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  score,
  distance,
  coins,
  activePowerUps,
  chaserThreat,
  floatingTexts,
  isMuted,
  onToggleMute,
  onPause,
}) => {
  const isStonksActive = activePowerUps.some((p) => p.type === 'stonks');

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar Stats */}
      <div className="flex items-start justify-between w-full">
        {/* Left Stats: Score & Distance */}
        <div className="flex flex-col gap-1.5">
          <div className="bg-slate-900/85 border border-purple-500/40 rounded-xl px-4 py-2 backdrop-blur-md shadow-lg shadow-purple-950/40">
            <span className="text-xs uppercase tracking-wider text-purple-300 font-bold block">
              Meme Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {score.toLocaleString()}
              </span>
              {isStonksActive && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold border border-emerald-400/30 animate-pulse">
                  3X STONKS 📈
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-1 backdrop-blur-md flex items-center gap-2 w-fit">
            <span className="text-xs text-slate-400 font-bold">DISTANCE</span>
            <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">
              {distance}m
            </span>
          </div>
        </div>

        {/* Center: Chaser Threat Alert when close */}
        {chaserThreat > 0.35 && (
          <div className="flex flex-col items-center animate-bounce">
            <div className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg backdrop-blur-md ${
              chaserThreat > 0.7 
                ? 'bg-red-600/90 border-red-400 text-white shadow-red-900/60 animate-pulse' 
                : 'bg-amber-600/90 border-amber-300 text-amber-100 shadow-amber-900/60'
            }`}>
              <Flame className="w-4 h-4 fill-current" />
              <span>{chaserThreat > 0.7 ? 'CRITICAL! BEAST IS ON YOUR TAIL!' : 'CHASER GAINING ON YOU!'}</span>
            </div>
            {/* Threat meter bar */}
            <div className="w-40 sm:w-52 h-2 bg-slate-900/80 border border-slate-700 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-150 ${
                  chaserThreat > 0.7 ? 'bg-red-500' : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(chaserThreat * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Right Stats: Dogecoins & Actions */}
        <div className="flex items-start gap-3">
          {/* Dogecoin Counter */}
          <div className="bg-amber-950/80 border border-amber-500/50 rounded-xl px-3.5 py-2 backdrop-blur-md flex items-center gap-2 shadow-lg shadow-amber-950/40">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-sm shadow-inner">
              Ð
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-bold block leading-none">
                Dogecoins
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono leading-tight">
                {coins}
              </span>
            </div>
          </div>

          {/* Pause & Audio Buttons */}
          <div className="flex gap-1.5 pointer-events-auto">
            <button
              onClick={onToggleMute}
              className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 flex items-center justify-center transition-colors active:scale-95"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>
            <button
              onClick={onPause}
              className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 flex items-center justify-center transition-colors active:scale-95"
              title="Pause Game"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Power-Ups Stack (Left Side) */}
      <div className="flex flex-col gap-2 max-w-xs mb-16 sm:mb-20">
        {activePowerUps.map((pu) => {
          const cfg = INITIAL_POWERUPS[pu.type];
          if (!cfg) return null;
          const pct = Math.max(0, Math.min(100, (pu.timeRemaining / pu.duration) * 100));

          return (
            <div
              key={pu.type}
              className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-lg flex items-center gap-3 animate-slide-in"
              style={{ borderColor: `${cfg.color}66` }}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shadow-inner font-bold"
                style={{ backgroundColor: `${cfg.color}33`, color: cfg.color }}
              >
                {cfg.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center text-xs font-bold text-white mb-1">
                  <span>{cfg.name}</span>
                  <span className="font-mono text-[11px]" style={{ color: cfg.color }}>
                    {pu.type === 'rickroll' ? 'ACTIVE' : `${pu.timeRemaining.toFixed(1)}s`}
                  </span>
                </div>
                {pu.type !== 'rickroll' && (
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cfg.color,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Meme Popups */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="text-lg sm:text-2xl font-black drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-mono animate-float-fade"
            style={{
              color: ft.color,
              transform: `translate(${ft.x}px, ${ft.y}px)`,
            }}
          >
            {ft.text}
          </div>
        ))}
      </div>
    </div>
  );
};
