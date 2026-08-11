'use client';

import React, { useState } from 'react';
import { KuzenProfile } from '@/types';
import { Edit3, Sparkles, Trophy, Heart, Gamepad2, Quote, Image as ImageIcon, Save, X, Plus, Trash2 } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface KuzenProfileSectionProps {
  profile: KuzenProfile;
  isAdmin: boolean;
  onUpdateProfile: (updated: KuzenProfile) => void;
}

export const KuzenProfileSection: React.FC<KuzenProfileSectionProps> = ({
  profile,
  isAdmin,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<KuzenProfile>(profile);
  const [newHobby, setNewHobby] = useState('');
  const [newGame, setNewGame] = useState('');

  const handleSave = () => {
    soundFx.playBuyMoney();
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setEditForm({ ...editForm, hobbies: [...editForm.hobbies, newHobby.trim()] });
      setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    const updated = editForm.hobbies.filter((_, i) => i !== index);
    setEditForm({ ...editForm, hobbies: updated });
  };

  const addGame = () => {
    if (newGame.trim()) {
      setEditForm({ ...editForm, favoriteGames: [...editForm.favoriteGames, newGame.trim()] });
      setNewGame('');
    }
  };

  const removeGame = (index: number) => {
    const updated = editForm.favoriteGames.filter((_, i) => i !== index);
    setEditForm({ ...editForm, favoriteGames: updated });
  };

  return (
    <div className={`relative min-h-[calc(100vh-5rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b ${profile.bgGradient}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Admin Edit Controls Header Banner */}
        {isAdmin && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                <Edit3 className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Admin Düzenleme Modu</h4>
                <p className="text-xs text-purple-200">Bu profil bilgilerini sadece yetkili admin değiştirebilir.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-md hover:scale-105 transition"
            >
              <Edit3 className="w-4 h-4" />
              Profili Düzenle
            </button>
          </div>
        )}

        {/* Hero Card Showcase */}
        <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Subtle Glow */}
          <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${profile.themeColor} opacity-20 blur-3xl`} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar Image with Status Badge */}
            <div className="relative group shrink-0">
              <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr ${profile.themeColor} shadow-xl shadow-purple-500/20`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[22px] bg-slate-950"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-slate-950/90 border border-slate-700 text-xs font-bold text-slate-200 shadow-md whitespace-nowrap">
                {profile.age} Yaşında
              </div>
            </div>

            {/* Profile Info & Bio */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-purple-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Kuzen Özel Bölümü
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-base sm:text-xl font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent mt-1">
                  {profile.title}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                {profile.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200 shadow-sm"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Card */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-md">
          <Quote className="w-8 h-8 text-purple-400/40 mb-2" />
          <p className="text-lg sm:text-xl font-medium text-purple-200 italic">
            {profile.quote}
          </p>
        </div>

        {/* Two Column Grid: Hobbies & Favorite Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hobbies Card */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 text-pink-400">
              <Heart className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Hobiler & İlgi Alanları</h3>
            </div>
            <div className="space-y-2.5">
              {profile.hobbies.map((hobby, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm font-medium text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>{hobby}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Games Card */}
          <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <Gamepad2 className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">En Sevdiği Oyunlar</h3>
            </div>
            <div className="space-y-2.5">
              {profile.favoriteGames.map((game, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm font-medium text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{game}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <ImageIcon className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Fotoğraf & Anı Galerisi</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Gallery"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Edit3 className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Profili Düzenle ({profile.name})</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Unvan</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Yaş</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Avatar Görsel URL</label>
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hakkında (Bio)</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Günlük Sözü / Mesajı</label>
                <input
                  type="text"
                  value={editForm.quote}
                  onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                />
              </div>

              {/* Hobiler Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hobiler</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Yeni hobi ekle..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={addHobby}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.hobbies.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-200">
                      {h}
                      <Trash2 className="w-3 h-3 text-rose-400 cursor-pointer hover:text-rose-300" onClick={() => removeHobby(i)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Favori Oyunlar Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Favori Oyunlar</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newGame}
                    onChange={(e) => setNewGame(e.target.value)}
                    placeholder="Yeni oyun ekle..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={addGame}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editForm.favoriteGames.map((g, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-200">
                      {g}
                      <Trash2 className="w-3 h-3 text-rose-400 cursor-pointer hover:text-rose-300" onClick={() => removeGame(i)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg"
              >
                <Save className="w-4 h-4" />
                Kaydet & Yayınla
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
