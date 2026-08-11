'use client';

import React from 'react';
import { MonopolyProperty, Player } from '@/types';
import { Building, Home, Check, X, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface PropertyCardModalProps {
  property: MonopolyProperty | null;
  players: Player[];
  currentPlayer: Player | null;
  isLandedTile: boolean; // True ONLY if current player landed on this exact tile!
  onBuy: (property: MonopolyProperty) => void;
  onClose: () => void;
}

export const PropertyCardModal: React.FC<PropertyCardModalProps> = ({
  property,
  players,
  currentPlayer,
  isLandedTile,
  onBuy,
  onClose,
}) => {
  if (!property) return null;

  const owner = players.find((p) => p.id === property.ownerId);
  const isMine = currentPlayer && property.ownerId === currentPlayer.id;
  
  // Official Monopoly Rule: Player can ONLY buy if unowned, player has money, AND player actually landed on this tile!
  const canBuy = isLandedTile && !property.ownerId && currentPlayer && (currentPlayer.money || 0) >= property.price;

  const handleBuy = () => {
    soundFx.playBuyMoney();
    onBuy(property);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        {!isLandedTile && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
            <Info className="w-3.5 h-3.5" />
            <span>Mülk Bilgi Önizlemesi (İnceleme)</span>
          </div>
        )}

        {/* Color Group Header Card */}
        <div
          className="rounded-2xl p-4 text-center text-white font-extrabold shadow-md space-y-1"
          style={{ backgroundColor: property.colorGroup || '#3b82f6' }}
        >
          <div className="text-3xl">{property.flag || '🏰'}</div>
          <div className="text-xl tracking-tight">{property.name}</div>
          <div className="text-xs font-medium opacity-90">{property.subtitle}</div>
        </div>

        {/* Stats & Rent Details */}
        <div className="space-y-2 text-xs text-slate-300 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Satın Alma Fiyatı:</span>
            <span className="font-bold text-emerald-400">{property.price} ₺</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Temel Kira:</span>
            <span className="font-bold text-amber-400">{property.rent} ₺</span>
          </div>
          {property.houseRent && (
            <div className="space-y-1 pt-1">
              <div className="font-semibold text-slate-400">Ev Konaklama Kiraları:</div>
              {property.houseRent.slice(1).map((hRent, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-slate-400">
                  <span>{idx + 1} Ev / Otel:</span>
                  <span className="font-medium text-slate-200">{hRent} ₺</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Owner Status */}
        <div className="text-center text-xs">
          {owner ? (
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-slate-200">
              <span>Mülk Sahibi:</span>
              <span className="font-bold text-purple-400">{owner.name}</span>
              {isMine && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">(Senin Mülkün)</span>}
            </div>
          ) : (
            <div className="text-slate-400 italic">
              {isLandedTile ? 'Bu karesine geldin! Satın alabilirsin.' : 'Henüz satılmadı. (Satın almak için zarınızın buraya gelmesi gerekir)'}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {canBuy && (
            <button
              onClick={handleBuy}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              Satın Al ({property.price} ₺)
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
