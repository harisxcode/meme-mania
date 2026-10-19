import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface MobileControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onLeft,
  onRight,
  onJump,
  onSlide,
}) => {
  return (
    <div className="absolute bottom-4 inset-x-4 pointer-events-none flex justify-between items-end select-none z-10">
      {/* Left / Right Steering Pad */}
      <div className="flex gap-2.5 pointer-events-auto">
        <button
          onClick={onLeft}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border-2 border-purple-500/50 text-white flex flex-col items-center justify-center active:scale-90 active:bg-purple-600 transition-all shadow-xl shadow-purple-950/40"
          title="Move Left (A / Left Arrow)"
        >
          <ArrowLeft className="w-7 h-7" />
          <span className="text-[9px] font-bold text-purple-300">LEFT [A]</span>
        </button>

        <button
          onClick={onRight}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border-2 border-purple-500/50 text-white flex flex-col items-center justify-center active:scale-90 active:bg-purple-600 transition-all shadow-xl shadow-purple-950/40"
          title="Move Right (D / Right Arrow)"
        >
          <ArrowRight className="w-7 h-7" />
          <span className="text-[9px] font-bold text-purple-300">RIGHT [D]</span>
        </button>
      </div>

      {/* Jump & Slide Action Pad */}
      <div className="flex gap-2.5 pointer-events-auto">
        <button
          onClick={onSlide}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border-2 border-pink-500/50 text-white flex flex-col items-center justify-center active:scale-90 active:bg-pink-600 transition-all shadow-xl shadow-pink-950/40"
          title="Slide Under Barriers (S / Down Arrow)"
        >
          <ArrowDown className="w-7 h-7 text-pink-400" />
          <span className="text-[9px] font-bold text-pink-300">SLIDE [S]</span>
        </button>

        <button
          onClick={onJump}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 border-2 border-cyan-400 text-white flex flex-col items-center justify-center active:scale-90 transition-all shadow-xl shadow-cyan-950/50"
          title="Jump Over Obstacles (W / Up Arrow / Space)"
        >
          <ArrowUp className="w-7 h-7" />
          <span className="text-[9px] font-black tracking-wide">JUMP [W]</span>
        </button>
      </div>
    </div>
  );
};
