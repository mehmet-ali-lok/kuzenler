'use client';

import React from 'react';
import { UnoCard, UnoColor } from '@/types';

interface UnoCardViewProps {
  card: UnoCard;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const COLOR_MAP: Record<UnoColor, string> = {
  red: 'from-rose-500 to-red-600 border-rose-400 text-white',
  blue: 'from-blue-500 to-indigo-600 border-blue-400 text-white',
  green: 'from-emerald-500 to-teal-600 border-emerald-400 text-white',
  yellow: 'from-amber-400 to-yellow-500 border-amber-300 text-slate-950',
  wild: 'from-purple-600 via-pink-500 to-cyan-500 border-white text-white',
};

export const UnoCardView: React.FC<UnoCardViewProps> = ({
  card,
  onClick,
  disabled = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs border rounded-xl',
    md: 'w-20 h-28 sm:w-24 sm:h-36 text-base sm:text-lg border-2 rounded-2xl',
    lg: 'w-28 h-40 sm:w-32 sm:h-48 text-xl sm:text-2xl border-4 rounded-3xl',
  }[size];

  const getLabel = () => {
    switch (card.value) {
      case 'skip': return '🚫 Pas';
      case 'reverse': return '🔄 Yön';
      case 'draw2': return '+2';
      case 'wild': return '🎨 Renk';
      case 'wild_draw4': return '💥 +4';
      case 'silence': return '⚡ SESSİZ';
      case 'mega_draw_all': return '💣 HERKESE +2';
      case 'hand_swap': return '🌀 TAKAS';
      case 'kuzen_curse': return '🎭 CEZA +3';
      case 'lock_color': return '🛑 KİLİT';
      default: return card.value;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative select-none shadow-xl bg-gradient-to-tr ${COLOR_MAP[card.color]} flex flex-col items-center justify-between p-2 font-black transition-all duration-200 ${sizeClasses} ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer'
      }`}
    >
      <div className="self-start text-[10px] sm:text-xs opacity-90">{getLabel()}</div>
      
      <div className="w-full h-1/2 rounded-full bg-slate-950/20 flex items-center justify-center text-center p-1 font-black leading-tight drop-shadow-md">
        {getLabel()}
      </div>

      <div className="self-end text-[10px] sm:text-xs opacity-90">{getLabel()}</div>
    </button>
  );
};
