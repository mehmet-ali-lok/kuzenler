'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass is "kuzenler123" or "admin" or "1234" for ease of access
    if (password === 'kuzenler123' || password === 'admin' || password === '1234') {
      soundFx.playWinFanfare();
      onSuccess();
      onClose();
      setPassword('');
      setError(false);
    } else {
      soundFx.playPenaltyBuzzer();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Admin Yetki Girişi</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
            Duru, Ömer ve Çınar özel bölümlerini düzenlemek için admin şifrenizi girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Admin Şifresi
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Şifre (Varsayılan: kuzenler123)"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition"
                autoFocus
              />
              <KeyRound className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Hatalı admin şifresi! Tekrar deneyin. (İpucu: kuzenler123)</span>
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
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition active:scale-95"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
