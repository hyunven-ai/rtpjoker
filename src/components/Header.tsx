'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Trophy, 
  Gamepad2, 
  Building2, 
  BookOpen, 
  Search, 
  Menu, 
  X, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';
import { SiteSettings } from '@/types';
import initialSettings from '@/data/settings.json';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wibTime, setWibTime] = useState<string>('');
  const [settings, setSettings] = useState<SiteSettings>(initialSettings as SiteSettings);

  // Sync settings from server API & localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const cached = localStorage.getItem('admin_nav_settings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.loginButton && parsed.registerButton) {
            setSettings(parsed);
          }
        }
      } catch (err) {
        // ignore JSON parse error
      }

      fetch('/api/settings', { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error('Network response not ok');
          return res.json();
        })
        .then((data: SiteSettings) => {
          if (data && data.loginButton && data.registerButton) {
            setSettings(data);
            try {
              localStorage.setItem('admin_nav_settings', JSON.stringify(data));
            } catch (err) {}
          }
        })
        .catch(() => {
          // Fallback to initial
        });
    };

    loadSettings();

    const handleUpdate = () => loadSettings();
    window.addEventListener('nav-settings-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('nav-settings-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format to WIB (UTC+7)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setWibTime(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WIB');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Flame },
    { name: 'RTP Gacor', href: '/rtp-gacor', icon: Sparkles },
    { name: 'Top Ranking', href: '/rtp-tertinggi', icon: Trophy },
    { name: 'Provider', href: '/provider', icon: Building2 },
    { name: 'Artikel & Tips', href: '/artikel', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#080c14]/90 backdrop-blur-md">
      {/* Top Running Marquee Banner */}
      <div className="bg-gradient-to-r from-amber-600/20 via-emerald-600/20 to-cyan-600/20 border-b border-emerald-500/20 py-1.5 px-4 overflow-hidden">
        <div className="flex items-center text-xs text-slate-300 whitespace-nowrap">
          <div className="flex items-center gap-2 pr-6 mr-2 text-emerald-400 font-semibold uppercase tracking-wider shrink-0 border-r border-emerald-500/20 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            LIVE RTP UPDATE
          </div>
          <div className="flex-1 overflow-hidden relative w-full">
            <div className="inline-block animate-marquee whitespace-nowrap">
              <span className="mx-4 text-emerald-400">🔥 Gates of Olympus 1000: 98.92% (Tinggi)</span>
              <span className="mx-4 text-amber-400">⚡ Sweet Bonanza: 98.45% (Gacor)</span>
              <span className="mx-4 text-cyan-400">🐉 Mahjong Ways 2: 98.70% (Tinggi)</span>
              <span className="mx-4 text-rose-400">🌶️ Koi Gate: 97.90% (Stabil)</span>
              <span className="mx-4 text-purple-400">💀 Blood & Shadow: 97.65% (High Volatility)</span>
              <span className="mx-4 text-yellow-400">👑 Goyang Gaib Slot88: 98.20% (Trending)</span>
              <span className="mx-4 text-slate-400">ℹ️ Data diperbarui otomatis setiap 15 menit sesuai indikator hit-rate server.</span>
              
              <span className="mx-4 text-emerald-400">🔥 Gates of Olympus 1000: 98.92% (Tinggi)</span>
              <span className="mx-4 text-amber-400">⚡ Sweet Bonanza: 98.45% (Gacor)</span>
              <span className="mx-4 text-cyan-400">🐉 Mahjong Ways 2: 98.70% (Tinggi)</span>
              <span className="mx-4 text-rose-400">🌶️ Koi Gate: 97.90% (Stabil)</span>
              <span className="mx-4 text-purple-400">💀 Blood & Shadow: 97.65% (High Volatility)</span>
              <span className="mx-4 text-yellow-400">👑 Goyang Gaib Slot88: 98.20% (Trending)</span>
              <span className="mx-4 text-slate-400">ℹ️ Data diperbarui otomatis setiap 15 menit sesuai indikator hit-rate server.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-400 p-0.5 shadow-neonGlow group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-emerald-400 group-hover:text-amber-400 transition-colors animate-pulse-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                RTP GACOR
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-medium uppercase -mt-1">
                Live Winrate Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Clock & Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Realtime WIB Clock */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{wibTime || '00:00:00 WIB'}</span>
            </div>

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all text-xs lg:text-sm group"
              title="Cari Game (⌘K)"
            >
              <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">Cari Game...</span>
              <kbd className="hidden 2xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Tombol Login */}
            {settings?.loginButton?.isActive && (
              <a
                href={settings.loginButton.url || '#'}
                target={settings.loginButton.target || '_blank'}
                rel={settings.loginButton.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 text-xs lg:text-sm font-bold transition-all shadow-sm group"
              >
                <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{settings.loginButton.label}</span>
              </a>
            )}

            {/* Tombol Daftar */}
            {settings?.registerButton?.isActive && (
              <a
                href={settings.registerButton.url || '#'}
                target={settings.registerButton.target || '_blank'}
                rel={settings.registerButton.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1.5 px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 text-xs lg:text-sm font-black transition-all shadow-neonGlow hover:scale-105 active:scale-95 group"
              >
                <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-slate-950 group-hover:rotate-6 transition-transform" />
                <span>{settings.registerButton.label}</span>
              </a>
            )}
          </div>

          {/* Mobile Right Action Area */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Daftar button on mobile topbar */}
            {settings?.registerButton?.isActive && (
              <a
                href={settings.registerButton.url || '#'}
                target={settings.registerButton.target || '_blank'}
                rel={settings.registerButton.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-neonGlow"
              >
                <UserPlus className="w-3.5 h-3.5 fill-slate-950" />
                <span>{settings.registerButton.label}</span>
              </a>
            )}

            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Cari Game"
            >
              <Search className="w-5 h-5 text-emerald-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090e18] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-800 text-xs font-mono text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Waktu Server:
            </span>
            <span>{wibTime}</span>
          </div>

          {/* Tombol Login & Daftar Mobile Drawer */}
          {(settings?.loginButton?.isActive || settings?.registerButton?.isActive) && (
            <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
              {settings.loginButton.isActive && (
                <a
                  href={settings.loginButton.url || '#'}
                  target={settings.loginButton.target || '_blank'}
                  rel={settings.loginButton.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>{settings.loginButton.label}</span>
                </a>
              )}
              {settings.registerButton.isActive && (
                <a
                  href={settings.registerButton.url || '#'}
                  target={settings.registerButton.target || '_blank'}
                  rel={settings.registerButton.target === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs shadow-neonGlow ${
                    !settings.loginButton.isActive ? 'col-span-2' : ''
                  }`}
                >
                  <UserPlus className="w-4 h-4 fill-slate-950" />
                  <span>{settings.registerButton.label}</span>
                </a>
              )}
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
