'use client';

import React, { useState } from 'react';
import { TabType } from '@/types';
import { Shield, ShieldCheck, Menu, X, Sparkles, Gamepad2, UserCircle2 } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: Array<{ id: TabType; label: string; icon: string; badge?: string; isGame?: boolean }> = [
    { id: 'duru', label: 'Duru', icon: '👧', badge: 'Özel Bölüm' },
    { id: 'omer', label: 'Ömer', icon: '👦', badge: 'Özel Bölüm' },
    { id: 'cinar', label: 'Çınar', icon: '👦', badge: 'Özel Bölüm' },
    { id: 'monopoly', label: 'Monopoly', icon: '🎲', isGame: true, badge: '8 Kişilik Canlı' },
    { id: 'uno', label: 'Bol Cezalı UNO', icon: '🃏', isGame: true, badge: 'Çılgın Mod' },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundFx.playClick();
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabClick('duru')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                KUZENLER
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide">
                Portal & Oyun Merkezi
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.isGame && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Oyun
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin & Mobile Menu Actions */}
          <div className="flex items-center gap-2.5">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Admin Aktif</span>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-slate-800 text-xs font-semibold transition duration-200 shadow-sm"
                title="Çocuk Bilgi Bölümleri Yönetim Paneli"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Admin Girişi</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
            Bölüm ve Oyun Seçimi
          </div>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-purple-300 border border-slate-700">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
