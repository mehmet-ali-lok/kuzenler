'use client';

import React from 'react';
import { MonopolyProperty, Player } from '@/types';
import { Building, ShieldAlert, Sparkles, Home, User } from 'lucide-react';

interface MonopolyBoardViewProps {
  properties: MonopolyProperty[];
  players: Player[];
  onTileClick: (prop: MonopolyProperty) => void;
}

export const MonopolyBoardView: React.FC<MonopolyBoardViewProps> = ({
  properties,
  players,
  onTileClick,
}) => {
  // Tile positioning logic for 32 tiles (8x8 loop around corners)
  // Corners: 0 (Start Bottom Right), 10 (Jail Bottom Left), 20 (Free Parking Top Left), 30 (Go To Jail Top Right)
  const getTilePosition = (index: number) => {
    if (index >= 0 && index <= 9) {
      // Bottom row (right to left)
      return { gridRow: 9, gridColumn: 10 - index };
    } else if (index >= 10 && index <= 19) {
      // Left col (bottom to top)
      return { gridRow: 10 - (index - 10), gridColumn: 1 };
    } else if (index >= 20 && index <= 29) {
      // Top row (left to right)
      return { gridRow: 1, gridColumn: index - 19 };
    } else {
      // Right col (top to bottom)
      return { gridRow: index - 28, gridColumn: 10 };
    }
  };

  return (
    <div className="relative w-full max-w-4xl aspect-square mx-auto bg-slate-950/90 border-2 border-slate-800 rounded-3xl p-2 sm:p-4 shadow-2xl overflow-hidden grid grid-cols-10 grid-rows-10 gap-1">
      
      {/* Center Center Area - Monopoly Hub */}
      <div className="col-start-2 col-end-10 row-start-2 row-end-10 bg-slate-900/80 rounded-2xl border border-slate-800/80 p-4 sm:p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <div className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
            MONOPOLY
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase">
            Türkiye & Dünya Metropolleri Edisyonu
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[10px] sm:text-xs font-semibold">
            🇹🇷 Türkiye Yerleri
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] sm:text-xs font-semibold">
            🌐 Dünya Şehirleri
          </span>
        </div>
      </div>

      {/* Render 32 Board Tiles */}
      {properties.map((prop) => {
        const gridPos = getTilePosition(prop.id);
        const tilePlayers = players.filter((p) => (p.position || 0) === prop.id && !p.isBankrupt);
        const owner = players.find((p) => p.id === prop.ownerId);

        return (
          <div
            key={prop.id}
            onClick={() => onTileClick(prop)}
            style={gridPos}
            className={`relative flex flex-col justify-between p-1 rounded-xl border text-[9px] sm:text-xs font-bold cursor-pointer transition-all duration-200 select-none overflow-hidden ${
              prop.type === 'special'
                ? 'bg-slate-900 border-slate-700 hover:border-amber-400'
                : 'bg-slate-900/90 border-slate-800 hover:border-purple-400'
            }`}
          >
            {/* Property Color Bar */}
            {prop.colorGroup && (
              <div
                className="w-full h-2 rounded-t-lg mb-0.5"
                style={{ backgroundColor: prop.colorGroup }}
              />
            )}

            {/* Tile Header & Flag */}
            <div className="flex items-center justify-between gap-0.5 text-[10px] leading-none">
              <span className="truncate text-slate-200">{prop.name}</span>
              {prop.flag && <span className="shrink-0">{prop.flag}</span>}
            </div>

            {/* Subtitle / Price */}
            <div className="text-[8px] sm:text-[10px] text-slate-400 font-medium truncate">
              {prop.price > 0 ? `${prop.price}₺` : prop.subtitle}
            </div>

            {/* Owner Dot Indicator */}
            {owner && (
              <div
                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: owner.color }}
                title={`Sahibi: ${owner.name}`}
              />
            )}

            {/* Player Pawns / Tokens on this Tile */}
            {tilePlayers.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-0.5 mt-1 pt-0.5 border-t border-slate-800">
                {tilePlayers.map((p) => (
                  <div
                    key={p.id}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white shadow-md border border-white animate-bounce"
                    style={{ backgroundColor: p.color }}
                    title={p.name}
                  >
                    {p.name.slice(0, 1)}
                  </div>
                ))}
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
};
