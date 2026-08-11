'use client';

import React from 'react';
import { TabType, UserSession } from '@/types';
import { ShieldCheck, UserCheck, Sparkles, Gamepad2, Home as HomeIcon, LogOut } from 'lucide-react';
import { soundFx } from '@/lib/audio';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userSession: UserSession;
  onOpenAdminModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userSession,
  onOpenAdminModal,
  onLogout,
}) => {
  const tabs: Array<{ id: TabType; label: string; icon: string; isGame?: boolean }> = [
    { id: 'home', label: 'Ana Sayfa & Profiller', icon: '🏠' },
    { id: 'monopoly', label: 'Monopoly (8 Kişilik)', icon: '🎲', isGame: true },
    { id: 'uno', label: 'Bol Cezalı UNO', icon: '🃏', isGame: true },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundFx.playClick();
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('home')}
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
                Duru • Ömer • Çınar Portalı
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.isGame && (
                    <span className="sm:hidden text-[10px] px-1 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">
                      Oyun
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Session & Login Status */}
          <div className="flex items-center gap-2">
            {userSession.role !== 'guest' ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">{userSession.name} Girişi</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-purple-500/50 hover:bg-slate-800 text-xs font-semibold transition duration-200 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
