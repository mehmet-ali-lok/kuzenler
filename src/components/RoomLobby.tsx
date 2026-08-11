'use client';

import React, { useState } from 'react';
import { Player, KuzenProfile } from '@/types';
import { Users, Bot, Play, Sparkles, Copy, Check, LogOut, CheckCircle2, Circle } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface RoomLobbyProps {
  gameTitle: string;
  gameIcon: string;
  gameDescription: string;
  players: Player[];
  myPlayerId: string;
  roomId: string;
  profiles?: Record<'duru' | 'omer' | 'cinar', KuzenProfile>;
  onJoinRoom: (name: string, avatar: string, customRoomId?: string) => void;
  onToggleReady: () => void;
  onAddBot: () => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  isHost: boolean;
  maxPlayers?: number;
}

const DEFAULT_AVATARS = [
  '👧 Duru Avatar', '👦 Ömer Avatar', '👦 Çınar Avatar',
  '🦁 Aslan Kaptan', '🦅 Kartal Göz', '🐬 Yunus Oyuncu',
  '🤖 Robot Oyuncu', '👑 Kral Kardeş', '🚀 Uzay Pilotu'
];

const COLORS = [
  '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#ef4444', '#06b6d4', '#d946ef'
];

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  gameTitle,
  gameIcon,
  gameDescription,
  players,
  myPlayerId,
  roomId,
  profiles,
  onJoinRoom,
  onToggleReady,
  onAddBot,
  onRemovePlayer,
  onStartGame,
  onLeaveRoom,
  isHost,
  maxPlayers = 8,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [inputRoomId, setInputRoomId] = useState('');
  const [copied, setCopied] = useState(false);

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const isInRoom = !!myPlayer;

  const avatarOptions = profiles
    ? [
        `👧 ${profiles.duru.name}`,
        `👦 ${profiles.omer.name}`,
        `👦 ${profiles.cinar.name}`,
        ...DEFAULT_AVATARS.slice(3)
      ]
    : DEFAULT_AVATARS;

  // Ready count check
  const realPlayers = players.filter((p) => !p.isBot);
  const readyCount = realPlayers.filter((p) => p.ready).length;
  const isEveryoneReady = realPlayers.length >= 1 && realPlayers.every((p) => p.ready);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      soundFx.playClick();
      // Format to 4-digit code e.g. "1234"
      const formattedCode = inputRoomId.replace(/\D/g, '').slice(0, 4) || '1234';
      onJoinRoom(playerName.trim(), selectedAvatar, formattedCode);
    }
  };

  const copyRoomId = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <span>{gameIcon}</span>
            <span>{gameTitle} - Çok Oyunculu Oda</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {gameTitle} Lobisi
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            {gameDescription} (Maksimum {maxPlayers} Oyuncu - Telefon, Tablet ve PC Uyumlu)
          </p>
        </div>

        {!isInRoom ? (
          /* Join / Create Form */
          <form onSubmit={handleJoin} className="max-w-md mx-auto space-y-6 bg-slate-950/70 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Oyuncu Adınız</label>
                <input
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Örn: Duru, Ömer, Çınar..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Avatar Seçimi</label>
                <select
                  value={selectedAvatar}
                  onChange={(e) => setSelectedAvatar(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  {avatarOptions.map((av) => (
                    <option key={av} value={av}>{av}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  4 Haneli Oda Kodu (Örn: 1234)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Varsayılan: 1234"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-base focus:outline-none focus:border-purple-500 tracking-widest font-mono text-center font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-extrabold text-base shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition"
            >
              {inputRoomId.trim() ? `${inputRoomId} Odasına Katıl 🚀` : '1234 Odasını Kur/Katıl 🎲'}
            </button>
          </form>
        ) : (
          /* Active Room Player List & Ready Controls */
          <div className="space-y-6">
            
            {/* Room Code Share Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 font-mono font-black text-xl tracking-widest">
                  #{roomId}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">4 Haneli Oda Kodu</h4>
                  <p className="text-xs text-slate-400">Arkadaşlarınızın bu 4 haneli koda katılması için paylaşın!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyRoomId}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
                </button>
                <button
                  onClick={onLeaveRoom}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                  title="Odadan Çık"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Joined Players Grid with Live Ready Indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Katılan Oyuncular ({players.length} / {maxPlayers})</span>
                  <span className="text-xs text-emerald-400 font-semibold">({readyCount}/{realPlayers.length} Hazır)</span>
                </div>
                {players.length < maxPlayers && (
                  <button
                    onClick={onAddBot}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition border border-cyan-500/30"
                  >
                    <Bot className="w-4 h-4" />
                    + Bot Ekle
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {players.map((p, idx) => {
                  const isMe = p.id === myPlayerId;
                  const isReady = p.ready || p.isBot;

                  return (
                    <div
                      key={p.id}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isMe
                          ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-950/50'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0"
                          style={{ backgroundColor: p.color || COLORS[idx % COLORS.length] }}
                        >
                          {p.avatar ? p.avatar.slice(0, 2) : p.name.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                            {isMe && <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300">Sen</span>}
                            {p.isBot && <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300">BOT</span>}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{p.avatar}</p>
                        </div>
                      </div>

                      {/* Ready Badge */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isReady ? (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hazır</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-xl border border-amber-500/30">
                            <Circle className="w-3.5 h-3.5 animate-pulse" />
                            <span>Bekliyor</span>
                          </div>
                        )}
                        {isHost && !isMe && (
                          <button
                            onClick={() => onRemovePlayer(p.id)}
                            className="text-slate-500 hover:text-rose-400 text-xs ml-1"
                            title="Oyuncuyu Çıkar"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar with Ready & Start Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              
              {/* Ready Toggle for Joined Player */}
              <button
                onClick={onToggleReady}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                  myPlayer?.ready
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{myPlayer?.ready ? '✓ Hazırım! (Tıkla ve Bekle)' : '👉 Hazırım Butonuna Bas!'}</span>
              </button>

              {/* Start Game Button */}
              <button
                onClick={onStartGame}
                disabled={players.length < 2 || !isEveryoneReady}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition shadow-xl ${
                  players.length >= 2 && isEveryoneReady
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white shadow-purple-500/25 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                Oyunu Başlat ({readyCount}/{realPlayers.length} Oyuncu Hazır) 🎲
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
