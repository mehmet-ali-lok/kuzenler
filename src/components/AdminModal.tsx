'use client';

import React, { useState } from 'react';
import { UserRole, UserSession } from '@/types';
import { Lock, UserCheck, KeyRound, X, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('duru');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.toLowerCase().trim();
    const p = password.trim();

    let matchedRole: UserRole | null = null;
    let displayName = '';

    if (u === 'admin' && (p === 'kuzenler123' || p === 'admin' || p === '1234')) {
      matchedRole = 'admin';
      displayName = 'Global Admin';
    } else if (u === 'duru' && (p === 'duru123' || p === 'duru' || p === '1234')) {
      matchedRole = 'duru';
      displayName = 'Duru';
    } else if ((u === 'omer' || u === 'ömer') && (p === 'omer123' || p === 'omer' || p === '1234')) {
      matchedRole = 'omer';
      displayName = 'Ömer';
    } else if ((u === 'cinar' || u === 'çınar') && (p === 'cinar123' || p === 'cinar' || p === '1234')) {
      matchedRole = 'cinar';
      displayName = 'Çınar';
    }

    if (matchedRole) {
      soundFx.playWinFanfare();
      onLoginSuccess({ role: matchedRole, name: displayName });
      onClose();
      setPassword('');
      setError(false);
    } else {
      soundFx.playPenaltyBuzzer();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Kullanıcı & Admin Girişi</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Kendi profilinizi düzenlemek için kuzen hesabınızla veya tüm yetkiler için Global Admin ile giriş yapın.
          </p>
        </div>

        {/* Quick Role Selection Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'duru', label: '👧 Duru', hint: 'duru123' },
            { id: 'omer', label: '👦 Ömer', hint: 'omer123' },
            { id: 'cinar', label: '👦 Çınar', hint: 'cinar123' },
            { id: 'admin', label: '👑 Global Admin', hint: 'kuzenler123' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setUsername(item.id);
                setPassword(item.hint);
                setError(false);
              }}
              className={`p-2.5 rounded-2xl border text-left text-xs transition ${
                username === item.id
                  ? 'bg-purple-950/60 border-purple-500 text-white font-bold'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold">{item.label}</div>
              <div className="text-[10px] text-slate-500">Şifre: {item.hint}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="duru, omer, cinar veya admin"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Hatalı giriş bilgisi! Lütfen yukarıdaki butonlara tıklayarak hazır şifreleri deneyin.</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition active:scale-95"
            >
              Giriş Yap 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
