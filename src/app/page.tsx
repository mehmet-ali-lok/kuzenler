'use client';

import React, { useState, useEffect } from 'react';
import { TabType, KuzenProfile, SharedPhoto, UserSession } from '@/types';
import { INITIAL_PROFILES, INITIAL_SHARED_PHOTOS } from '@/lib/initialData';
import { fetchCloudSyncData, pushCloudSyncData } from '@/lib/cloudSync';
import { Header } from '@/components/Header';
import { AdminModal } from '@/components/AdminModal';
import { KuzenProfileCard } from '@/components/KuzenProfileCard';
import { SharedGallerySection } from '@/components/SharedGallerySection';
import { MonopolyGame } from '@/components/monopoly/MonopolyGame';
import { UnoGame } from '@/components/uno/UnoGame';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userSession, setUserSession] = useState<UserSession>({ role: 'guest', name: 'Ziyaretçi' });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Profiles State
  const [profiles, setProfiles] = useState<Record<'duru' | 'omer' | 'cinar', KuzenProfile>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kuzenler_profiles_v3');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse profiles', e);
        }
      }
    }
    return INITIAL_PROFILES;
  });

  // Shared Photos State
  const [sharedPhotos, setSharedPhotos] = useState<SharedPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kuzenler_shared_photos_v3');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse shared photos', e);
        }
      }
    }
    return INITIAL_SHARED_PHOTOS;
  });

  // Global Cloud Synchronization (Fetches from /api/sync on mount & periodically)
  useEffect(() => {
    const syncWithCloud = async () => {
      const cloudData = await fetchCloudSyncData();
      if (cloudData) {
        if (cloudData.profiles) {
          setProfiles(cloudData.profiles);
          localStorage.setItem('kuzenler_profiles_v3', JSON.stringify(cloudData.profiles));
        }
        if (cloudData.photos) {
          setSharedPhotos(cloudData.photos);
          localStorage.setItem('kuzenler_shared_photos_v3', JSON.stringify(cloudData.photos));
        }
      }
    };

    syncWithCloud();
    const interval = setInterval(syncWithCloud, 8000); // 8-second live sync polling across all devices
    return () => clearInterval(interval);
  }, []);

  const handleUpdateProfile = (updated: KuzenProfile) => {
    const newProfiles = {
      ...profiles,
      [updated.id]: updated,
    };
    setProfiles(newProfiles);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kuzenler_profiles_v3', JSON.stringify(newProfiles));
    }
    // Push globally to all devices
    pushCloudSyncData({ profiles: newProfiles });
  };

  const handleAddPhoto = (newPhoto: SharedPhoto) => {
    const newPhotos = [newPhoto, ...sharedPhotos];
    setSharedPhotos(newPhotos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kuzenler_shared_photos_v3', JSON.stringify(newPhotos));
    }
    // Push globally to all devices
    pushCloudSyncData({ photos: newPhotos });
  };

  const handleDeletePhoto = (id: string) => {
    const newPhotos = sharedPhotos.filter((p) => p.id !== id);
    setSharedPhotos(newPhotos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kuzenler_shared_photos_v3', JSON.stringify(newPhotos));
    }
    // Push globally to all devices
    pushCloudSyncData({ photos: newPhotos });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userSession={userSession}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogout={() => setUserSession({ role: 'guest', name: 'Ziyaretçi' })}
      />

      {/* Main Content Area */}
      <main className="w-full">
        {activeTab === 'home' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            
            {/* Top Banner */}
            <div className="text-center space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Duru • Ömer • Çınar Canlı Senkronize Portalı
              </div>
              <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white">
                Kuzenler Dünyasına Hoş Geldiniz! ✨
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                3 süper kuzenin özel bilgileri, ortak canlı fotoğraf galerisi ve 8 kişilik çok oyunculu oyun merkezi!
              </p>
            </div>

            {/* 3 Column Side-by-Side Profiles Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>👧👦👦 Kuzen Profilleri</span>
                </h2>
                <span className="text-xs text-slate-400">
                  {userSession.role !== 'guest' ? `${userSession.name} olarak düzenleyebilirsiniz` : 'Giriş yaparak bilgilerinizi güncelleyebilirsiniz'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KuzenProfileCard
                  profile={profiles.duru}
                  userRole={userSession.role}
                  onUpdateProfile={handleUpdateProfile}
                />
                <KuzenProfileCard
                  profile={profiles.omer}
                  userRole={userSession.role}
                  onUpdateProfile={handleUpdateProfile}
                />
                <KuzenProfileCard
                  profile={profiles.cinar}
                  userRole={userSession.role}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>
            </div>

            {/* Ortak Kuzenler Fotoğraf Galerisi */}
            <SharedGallerySection
              photos={sharedPhotos}
              userSession={userSession}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
            />

          </div>
        )}

        {/* Monopoly Game View */}
        {activeTab === 'monopoly' && <MonopolyGame />}

        {/* UNO Game View */}
        {activeTab === 'uno' && <UnoGame />}
      </main>

      {/* Login Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={(session) => setUserSession(session)}
      />
    </div>
  );
}
