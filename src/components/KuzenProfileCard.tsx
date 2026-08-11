'use client';

import React, { useState } from 'react';
import { KuzenProfile, UserRole } from '@/types';
import { processUploadedImage } from '@/lib/imageUtils';
import { Edit3, Sparkles, Heart, Gamepad2, Quote, Upload, Save, X, Trash2 } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface KuzenProfileCardProps {
  profile: KuzenProfile;
  userRole: UserRole;
  onUpdateProfile: (updated: KuzenProfile) => void;
}

export const KuzenProfileCard: React.FC<KuzenProfileCardProps> = ({
  profile,
  userRole,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<KuzenProfile>(profile);
  const [newHobby, setNewHobby] = useState('');
  const [newGame, setNewGame] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Authorization check: Global admin OR exact cousin matching this card!
  const canEdit = userRole === 'admin' || userRole === profile.id;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await processUploadedImage(file, 600);
        setEditForm((prev) => ({ ...prev, avatar: compressedBase64 }));
        soundFx.playBuyMoney();
      } catch (err) {
        alert('Görsel yüklenirken hata oluştu');
      } finally {
        setIsUploading(false);
      }
    }
  };

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
    setEditForm({ ...editForm, hobbies: editForm.hobbies.filter((_, i) => i !== index) });
  };

  const addGame = () => {
    if (newGame.trim()) {
      setEditForm({ ...editForm, favoriteGames: [...editForm.favoriteGames, newGame.trim()] });
      setNewGame('');
    }
  };

  const removeGame = (index: number) => {
    setEditForm({ ...editForm, favoriteGames: editForm.favoriteGames.filter((_, i) => i !== index) });
  };

  return (
    <div className={`relative flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-purple-950/40 overflow-hidden`}>
      
      {/* Top Background Glow */}
      <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br ${profile.themeColor} opacity-15 blur-2xl pointer-events-none`} />

      <div className="space-y-6 relative z-10">
        
        {/* Header & Avatar */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative group">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr ${profile.themeColor} shadow-xl`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[22px] bg-slate-950"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/90 border border-slate-700 text-[11px] font-bold text-slate-200 shadow-md">
              {profile.age} Yaşında
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{profile.name}</h2>
            <p className="text-xs font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent mt-0.5">
              {profile.title}
            </p>
          </div>
        </div>

        {/* Edit Button for Authorized Cousin/Admin */}
        {canEdit && (
          <button
            onClick={() => {
              setEditForm(profile);
              setIsEditing(true);
            }}
            className="w-full py-2.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-900/60 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit3 className="w-4 h-4 text-purple-400" />
            <span>Profili Düzenle & Fotoğraf Yükle</span>
          </button>
        )}

        {/* Bio */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          {profile.bio}
        </p>

        {/* Quote */}
        <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs italic text-purple-200">
          <Quote className="w-4 h-4 text-purple-400/50 mb-1 inline mr-1" />
          "{profile.quote}"
        </div>

        {/* Hobbies */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400">
            <Heart className="w-4 h-4" />
            <span>Hobiler</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.hobbies.map((h, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-medium">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Games */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Gamepad2 className="w-4 h-4" />
            <span>En Sevdiği Oyunlar</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.favoriteGames.map((g, i) => (
              <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-medium">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
          {profile.badges.map((b, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/90 text-[10px] font-bold text-slate-200">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Profili Düzenle ({profile.name})</h3>
              <button onClick={() => setIsEditing(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              
              {/* Direct Photo File Upload */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-purple-300 uppercase">
                  Doğrudan Profil Fotoğrafı Yükle (Cihazınızdan)
                </label>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editForm.avatar} alt="Preview" className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition shadow-md">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Yükleniyor...' : 'Fotoğraf Seç & Yükle'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Unvan</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Yaş</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hakkında (Bio)</label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Günlük Sözü</label>
                <input
                  type="text"
                  value={editForm.quote}
                  onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              {/* Hobiler */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hobiler</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newHobby}
                    onChange={(e) => setNewHobby(e.target.value)}
                    placeholder="Yeni hobi..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                  <button type="button" onClick={addHobby} className="px-3 py-2 bg-purple-600 text-white rounded-xl font-bold">
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editForm.hobbies.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-[11px] text-slate-200">
                      {h}
                      <Trash2 className="w-3 h-3 text-rose-400 cursor-pointer" onClick={() => removeHobby(i)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Favori Oyunlar */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Favori Oyunlar</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newGame}
                    onChange={(e) => setNewGame(e.target.value)}
                    placeholder="Yeni oyun..."
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                  <button type="button" onClick={addGame} className="px-3 py-2 bg-cyan-600 text-white rounded-xl font-bold">
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editForm.favoriteGames.map((g, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-[11px] text-slate-200">
                      {g}
                      <Trash2 className="w-3 h-3 text-rose-400 cursor-pointer" onClick={() => removeGame(i)} />
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                İptal
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg">
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
