'use client';

import React, { useState } from 'react';
import { soundFx } from '@/lib/audio';

interface DiceAnimationProps {
  dice: [number, number];
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const DICE_DOTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export const DiceAnimation: React.FC<DiceAnimationProps> = ({
  dice,
  isRolling,
  onRoll,
  disabled,
}) => {
  const handleClick = () => {
    if (!disabled && !isRolling) {
      soundFx.playDice();
      onRoll();
    }
  };

  const renderDice = (val: number) => {
    const dots = DICE_DOTS[val] || [];
    return (
      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl p-2 shadow-lg border-2 border-slate-200 grid grid-cols-3 grid-rows-3 items-center justify-items-center ${isRolling ? 'animate-spin' : ''}`}>
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${dots.includes(i) ? 'bg-slate-900 shadow-inner' : 'bg-transparent'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        {renderDice(dice[0])}
        {renderDice(dice[1])}
      </div>
      <button
        onClick={handleClick}
        disabled={disabled || isRolling}
        className={`px-6 py-3 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl transition-all ${
          disabled || isRolling
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-amber-500/20 hover:scale-105 active:scale-95 cursor-pointer'
        }`}
      >
        {isRolling ? 'Zar Dönüyor...' : 'Zarları At! 🎲'}
      </button>
    </div>
  );
};
