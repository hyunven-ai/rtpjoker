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
  Settings
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wibTime, setWibTime] = useState<string>('');

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

          {/* Right Action & Clock */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Realtime WIB Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-emerald-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{wibTime || '00:00:00 WIB'}</span>
            </div>

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-all text-sm group"
            >
              <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Cari Game...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
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
        <div className="md:hidden border-t border-slate-800 bg-[#090e18] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Waktu Server:
            </span>
            <span>{wibTime}</span>
          </div>

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
      )}
    </header>
  );
}
