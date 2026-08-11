'use client';

import React, { useState } from 'react';
import { SharedPhoto, UserSession } from '@/types';
import { processUploadedImage } from '@/lib/imageUtils';
import { Image as ImageIcon, Upload, Trash2, Plus, Sparkles, X, Calendar, User } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface SharedGallerySectionProps {
  photos: SharedPhoto[];
  userSession: UserSession;
  onAddPhoto: (newPhoto: SharedPhoto) => void;
  onDeletePhoto: (id: string) => void;
}

export const SharedGallerySection: React.FC<SharedGallerySectionProps> = ({
  photos,
  userSession,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<SharedPhoto | null>(null);

  const canUpload = userSession.role !== 'guest';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !photoTitle.trim()) return;

    try {
      setIsUploading(true);
      const base64 = await processUploadedImage(photoFile, 1200);
      const newPhoto: SharedPhoto = {
        id: `photo_${Date.now()}`,
        url: base64,
        title: photoTitle.trim(),
        uploadedBy: userSession.name,
        date: new Date().toISOString().split('T')[0],
      };

      soundFx.playWinFanfare();
      onAddPhoto(newPhoto);
      setIsModalOpen(false);
      setPhotoTitle('');
      setPhotoFile(null);
      setPreviewUrl(null);
    } catch (err) {
      alert('Fotoğraf yükleme hatası!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Ortak Anı Galerisi
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Kuzenler Birlikte Anı Galerisi 📸
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Duru, Ömer ve Çınar'ın birlikte çekildikleri unutulmaz fotoğrafların toplandığı özel alan!
          </p>
        </div>

        {canUpload ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:scale-105 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Yeni Birlikte Fotoğraf Yükle</span>
          </button>
        ) : (
          <div className="text-xs text-slate-500 italic bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            Fotoğraf yüklemek için kuzen veya admin girişi yapın.
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-lg hover:border-purple-500/50 transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div
              onClick={() => setSelectedLightboxPhoto(photo)}
              className="relative aspect-video overflow-hidden cursor-pointer bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Photo Metadata Footer */}
            <div className="p-4 flex items-center justify-between gap-2 border-t border-slate-800/60 bg-slate-900/60">
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{photo.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-purple-400" />
                    {photo.uploadedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {photo.date}
                  </span>
                </div>
              </div>

              {canUpload && (
                <button
                  onClick={() => {
                    if (confirm('Bu fotoğrafı galeriden silmek istediğinize emin misiniz?')) {
                      onDeletePhoto(photo.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Fotoğrafı Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Ortak Galeriyeye Fotoğraf Yükle</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fotoğraf Başlığı / Anı Notu</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="Örn: Kapadokya Tatil Anımız 🌄"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fotoğraf Seçin (Cihazınızdan)</label>
                <label className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl bg-slate-950 cursor-pointer transition text-center space-y-2">
                  <Upload className="w-8 h-8 text-purple-400" />
                  <span className="text-slate-300 font-medium">Görsel Dosyası Seç (JPEG, PNG)</span>
                  <input type="file" accept="image/*" required onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {previewUrl && (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !photoFile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold shadow-lg disabled:opacity-50"
                >
                  {isUploading ? 'Yükleniyor...' : 'Galeride Paylaş 🚀'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedLightboxPhoto && (
        <div
          onClick={() => setSelectedLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 p-4 space-y-3">
            <button
              onClick={() => setSelectedLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedLightboxPhoto.url} alt={selectedLightboxPhoto.title} className="w-full max-h-[75vh] object-contain rounded-2xl bg-black" />
            <div className="flex justify-between items-center px-2 text-slate-300 text-sm">
              <span className="font-bold text-white">{selectedLightboxPhoto.title}</span>
              <span className="text-xs text-purple-300">Yükleyen: {selectedLightboxPhoto.uploadedBy} ({selectedLightboxPhoto.date})</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
