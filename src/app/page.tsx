'use client';

import React, { useState, useEffect } from 'react';
import { TabType, KuzenProfile } from '@/types';
import { INITIAL_PROFILES } from '@/lib/initialData';
import { Header } from '@/components/Header';
import { AdminModal } from '@/components/AdminModal';
import { KuzenProfileSection } from '@/components/KuzenProfileSection';
import { MonopolyGame } from '@/components/monopoly/MonopolyGame';
import { UnoGame } from '@/components/uno/UnoGame';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('duru');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  const [profiles, setProfiles] = useState<Record<'duru' | 'omer' | 'cinar', KuzenProfile>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kuzenler_profiles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved profiles', e);
        }
      }
    }
    return INITIAL_PROFILES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kuzenler_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  const handleUpdateProfile = (updated: KuzenProfile) => {
    setProfiles((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={() => setIsAdmin(false)}
      />

      {/* Main Content Render */}
      <main className="w-full">
        {activeTab === 'duru' && (
          <KuzenProfileSection
            profile={profiles.duru}
            isAdmin={isAdmin}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'omer' && (
          <KuzenProfileSection
            profile={profiles.omer}
            isAdmin={isAdmin}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'cinar' && (
          <KuzenProfileSection
            profile={profiles.cinar}
            isAdmin={isAdmin}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'monopoly' && <MonopolyGame />}

        {activeTab === 'uno' && <UnoGame />}
      </main>

      {/* Admin Passcode Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />
    </div>
  );
}
