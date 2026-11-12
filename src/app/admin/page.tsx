'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Building2, 
  Zap, 
  BookOpen, 
  ShieldAlert, 
  Activity, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  SlidersHorizontal, 
  Download, 
  Bell, 
  LogOut, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  Flame, 
  Clock, 
  Cpu, 
  Wifi, 
  BarChart3, 
  Check, 
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Sliders,
  Link2,
  LogIn,
  UserPlus,
  Globe,
  Eye
} from 'lucide-react';
import { Game, Provider, RtpStatus, Volatility, Article, SiteSettings } from '@/types';
import { ALL_GAMES } from '@/data/games';
import { PROVIDERS } from '@/data/providers';
import { ARTICLES } from '@/data/articles';
import initialBanners from '@/data/banners.json';
import initialSettings from '@/data/settings.json';
import { BannerItem } from '@/components/HeroCarousel';

export default function AdminDedicatedPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<'overview' | 'games' | 'providers' | 'simulator' | 'banners' | 'articles' | 'buttons' | 'logs'>('overview');
  const [games, setGames] = useState<Game[]>([]);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [navSettings, setNavSettings] = useState<SiteSettings>(initialSettings as SiteSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [newBannerData, setNewBannerData] = useState<Partial<BannerItem>>({
    title: 'PROMO GACOR',
    headline: '',
    subtitle: '',
    badge: '🔥 REKOMENDASI GACOR',
    image: '/placeholder-game.svg',
    gameSlug: 'mahjong-wins-3-black-scatter-pragmatic',
    provider: 'Pragmatic Play',
    rtp: 98.8,
    accentColor: 'from-amber-500 via-rose-600 to-purple-700',
    isActive: true,
  });
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<RtpStatus | 'all'>('all');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSurging, setIsSurging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [newGameData, setNewGameData] = useState({
    name: '',
    providerId: 'pragmatic',
    rtp: 97.5,
    volatility: 'High' as Volatility,
    maxWin: 'x10,000',
    jamGacor: '13:00 - 15:30 WIB',
    category: 'Megaways',
    manual: 10,
    quick: 20,
    turbo: 30,
    dc: 'ON' as 'ON' | 'OFF',
    note: 'Pola petir gacor teruji',
  });

  // Bulk Selection
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  // Audit Logs
  const [changeLogs, setChangeLogs] = useState<
    { id: string; user: string; action: string; target: string; oldVal: string; newVal: string; time: string }[]
  >([]);

  // Telemetry Mock Stats
  const [telemetry, setTelemetry] = useState({
    latency: 14,
    cpuLoad: 18,
    activeUsers: 1420,
    memoryMb: 312,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    // Auth Check
    if (localStorage.getItem('admin_auth') !== 'true') {
      router.push('/admin/login');
      return;
    }

    try {
      const ADMIN_VERSION = 'v7_low_rtp';
      const storedVersion = localStorage.getItem('admin_version');
      if (storedVersion !== ADMIN_VERSION) {
        localStorage.removeItem('admin_games_custom');
        localStorage.setItem('admin_version', ADMIN_VERSION);
        setGames(ALL_GAMES);
      } else {
        const savedGames = localStorage.getItem('admin_games_custom');
        if (savedGames) {
          setGames(JSON.parse(savedGames));
        } else {
          setGames(ALL_GAMES);
        }
      }

      const savedLogs = localStorage.getItem('admin_rtp_audit_logs');
      if (savedLogs) {
        setChangeLogs(JSON.parse(savedLogs));
      } else {
        setChangeLogs([
          { id: '1', user: 'SuperAdmin', action: 'RTP Batch Sync', target: 'Pragmatic Play (702 games)', oldVal: '96.8%', newVal: '97.8%', time: '14:20 WIB' },
          { id: '2', user: 'SuperAdmin', action: 'Engine Calibration', target: 'PG Soft Mahjong Series', oldVal: '96.2%', newVal: '98.5%', time: '14:35 WIB' },
          { id: '3', user: 'SuperAdmin', action: 'Jam Gacor Refresh', target: 'Slot88 Olympus Series', oldVal: 'Inactive', newVal: 'Active WIB', time: '15:10 WIB' },
        ]);
      }

      // Load Navigation Button Settings
      const savedSettings = localStorage.getItem('admin_nav_settings');
      if (savedSettings) {
        try {
          setNavSettings(JSON.parse(savedSettings));
        } catch (e) {}
      }
      // Always sync latest settings from Upstash KV / Server
      fetch('/api/settings', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.loginButton && data?.registerButton) {
            setNavSettings(data);
            try {
              localStorage.setItem('admin_nav_settings', JSON.stringify(data));
            } catch (e) {}
          }
        })
        .catch(() => {});
    } catch {
      setGames(ALL_GAMES);
    }
  }, []);

  const handleSaveNavSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);

    // 1. Selalu simpan ke localStorage dan update navbar segera
    try {
      localStorage.setItem('admin_nav_settings', JSON.stringify(navSettings));
      window.dispatchEvent(new Event('nav-settings-updated'));
    } catch (err) {
      // ignore
    }

    // 2. Simpan ke server API (dengan fallback disk / tmp / memory)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navSettings),
      });
      const result = await res.json().catch(() => ({ success: true }));

      addAuditLog(
        'Update Link Tombol',
        'Navbar CTA (Login & Daftar)',
        'Tersimpan',
        `Login: ${navSettings.loginButton.label} | Daftar: ${navSettings.registerButton.label}`
      );

      if (result && result.success) {
        if (result.kvSaved) {
          showToast('✅ Pengaturan tombol tersimpan permanen di Database Cloud!');
        } else {
          showToast('✅ Pengaturan tombol Login & Daftar berhasil disimpan!');
        }
      } else {
        showToast('✅ Pengaturan tombol berhasil disimpan!');
      }
    } catch (err: any) {
      showToast('✅ Pengaturan disimpan secara lokal!');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleResetNavSettings = () => {
    if (confirm('Kembalikan pengaturan tombol Login & Daftar ke nilai awal?')) {
      const defaults: SiteSettings = {
        loginButton: {
          label: initialSettings?.loginButton?.label || 'Login',
          url: initialSettings?.loginButton?.url || 'https://tinyurl.com/ac1300-login',
          target: (initialSettings?.loginButton?.target as '_blank' | '_self') || '_blank',
          isActive: initialSettings?.loginButton?.isActive ?? true,
        },
        registerButton: {
          label: initialSettings?.registerButton?.label || 'Daftar',
          url: initialSettings?.registerButton?.url || 'https://tinyurl.com/ac1300-daftar',
          target: (initialSettings?.registerButton?.target as '_blank' | '_self') || '_blank',
          isActive: initialSettings?.registerButton?.isActive ?? true,
        },
      };
      setNavSettings(defaults);
      showToast('🔄 Pengaturan dikembalikan ke draft awal.');
    }
  };

  // Telemetry live heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry({
        latency: Math.floor(12 + Math.random() * 6),
        cpuLoad: Math.floor(15 + Math.random() * 10),
        activeUsers: Math.floor(1400 + (Math.random() - 0.5) * 80),
        memoryMb: Math.floor(310 + Math.random() * 8),
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addAuditLog = (action: string, target: string, oldVal: string, newVal: string) => {
    const newLog = {
      id: Date.now().toString(),
      user: 'SuperAdmin',
      action,
      target,
      oldVal,
      newVal,
      time: new Date().toLocaleTimeString('id-ID') + ' WIB',
    };
    const updated = [newLog, ...changeLogs].slice(0, 100);
    setChangeLogs(updated);
    try {
      localStorage.setItem('admin_rtp_audit_logs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const persistGames = (updated: Game[]) => {
    setGames(updated);
    try {
      localStorage.setItem('admin_games_custom', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    let list = games;
    if (selectedProvider !== 'all') {
      list = list.filter((g) => g.providerId === selectedProvider);
    }
    if (selectedStatus !== 'all') {
      list = list.filter((g) => g.status === selectedStatus);
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || g.providerName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [games, selectedProvider, selectedStatus, search]);

  // Quick inline RTP change (+/- 0.1%)
  const handleQuickRtpAdjust = (game: Game, delta: number) => {
    const newRtp = parseFloat(Math.max(85, Math.min(99.8, game.rtp + delta)).toFixed(2));
    const newStatus: RtpStatus = newRtp >= 97.0 ? 'tinggi' : newRtp >= 95.0 ? 'normal' : 'rendah';
    const updated = games.map((g) =>
      g.id === game.id ? { ...g, rtp: newRtp, status: newStatus, updatedAt: '1 mnt lalu (Quick Adjust)' } : g
    );
    persistGames(updated);
    addAuditLog('Inline RTP Adjust', game.name, `${game.rtp}%`, `${newRtp}%`);
    showToast(`RTP ${game.name} disesuaikan ke ${newRtp}%`);
  };

  // Save full edited game
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    const rtpNum = Number(editingGame.rtp);
    const newStatus: RtpStatus = rtpNum >= 97.0 ? 'tinggi' : rtpNum >= 95.0 ? 'normal' : 'rendah';

    const originalGame = games.find((g) => g.id === editingGame.id);
    const oldRtp = originalGame ? `${originalGame.rtp}%` : 'N/A';

    const updatedGame: Game = {
      ...editingGame,
      rtp: rtpNum,
      status: newStatus,
      updatedAt: 'Baru saja diubah (Admin CMS)',
    };

    const updatedList = games.map((g) => (g.id === updatedGame.id ? updatedGame : g));
    persistGames(updatedList);
    addAuditLog('Edit Game Data', updatedGame.name, oldRtp, `${rtpNum}%`);
    
    // Server persistence
    fetch('/api/games', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGame),
    }).catch(console.error);

    setEditingGame(null);
    showToast(`✅ Game ${updatedGame.name} berhasil diperbarui!`);
  };

  // Add new game
  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    const providerObj = PROVIDERS.find((p) => p.id === newGameData.providerId) || PROVIDERS[0];
    const newId = `${newGameData.providerId}-${Date.now()}`;
    const slug = newGameData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${providerObj.id}`;
    const rtpNum = Number(newGameData.rtp);
    const status: RtpStatus = rtpNum >= 97.0 ? 'tinggi' : rtpNum >= 95.0 ? 'normal' : 'rendah';

    const newGame: Game = {
      id: newId,
      slug,
      name: newGameData.name,
      providerId: providerObj.id,
      providerName: providerObj.name,
      providerSlug: providerObj.slug,
      image: '/placeholder-game.svg',
      rtp: rtpNum,
      status,
      volatility: newGameData.volatility,
      maxWin: newGameData.maxWin,
      jamGacor: newGameData.jamGacor,
      polaGacor: {
        manual: newGameData.manual,
        quick: newGameData.quick,
        turbo: newGameData.turbo,
        dc: newGameData.dc,
        note: newGameData.note,
      },
      rtpHistory: [
        { day: 'Sen', rtp: rtpNum - 0.5 },
        { day: 'Sel', rtp: rtpNum + 0.2 },
        { day: 'Rab', rtp: rtpNum - 0.3 },
        { day: 'Kam', rtp: rtpNum + 0.6 },
        { day: 'Jum', rtp: rtpNum - 0.1 },
        { day: 'Sab', rtp: rtpNum + 0.8 },
        { day: 'Min', rtp: rtpNum },
      ],
      description: `${newGameData.name} adalah game slot baru yang ditambahkan oleh Administrator ke dalam katalog ${providerObj.name}.`,
      category: newGameData.category,
      isTrending: true,
      updatedAt: 'Baru saja ditambahkan',
    };

    const updated = [newGame, ...games];
    persistGames(updated);
    addAuditLog('Tambah Game Baru', newGame.name, 'None', `${newGame.rtp}%`);
    
    // Server persistence
    fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame),
    }).catch(console.error);

    setIsAddGameOpen(false);
    showToast(`🎉 Game baru "${newGame.name}" berhasil ditambahkan!`);
  };

  // Delete game
  const handleDeleteGame = (game: Game) => {
    if (confirm(`Yakin ingin menghapus game "${game.name}"?`)) {
      const updated = games.filter((g) => g.id !== game.id);
      persistGames(updated);
      addAuditLog('Hapus Game', game.name, `${game.rtp}%`, 'Deleted');
      
      // Server persistence
      fetch(`/api/games?id=${encodeURIComponent(game.id)}`, {
        method: 'DELETE',
      }).catch(console.error);

      showToast(`Game ${game.name} telah dihapus.`);
    }
  };

  // ==========================
  // BANNER CAROUSEL CRUD HANDLERS
  // ==========================
  const handleToggleBannerActive = (banner: BannerItem) => {
    const nextActive = !banner.isActive;
    const updated = banners.map((b) => (b.id === banner.id ? { ...b, isActive: nextActive } : b));
    setBanners(updated);
    addAuditLog('Toggle Status Banner', banner.headline, banner.isActive ? 'Aktif' : 'Nonaktif', nextActive ? 'Aktif' : 'Nonaktif');
    showToast(`Status banner "${banner.headline}" diperbarui`);
    fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: banner.id, isActive: nextActive }),
    }).catch(console.error);
  };

  const handleDeleteBanner = (banner: BannerItem) => {
    if (!confirm(`Hapus banner "${banner.headline}"?`)) return;
    const updated = banners.filter((b) => b.id !== banner.id);
    setBanners(updated);
    addAuditLog('Hapus Banner Slider', banner.headline, 'Aktif', 'Dihapus');
    showToast(`Banner "${banner.headline}" telah dihapus.`);
    fetch(`/api/banners?id=${encodeURIComponent(banner.id)}`, {
      method: 'DELETE',
    }).catch(console.error);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    const updated = banners.map((b) => (b.id === editingBanner.id ? editingBanner : b));
    setBanners(updated);
    addAuditLog('Edit Banner Slider', editingBanner.headline, 'Existing', 'Diperbarui');
    showToast(`✅ Banner "${editingBanner.headline}" berhasil diperbarui!`);
    fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBanner),
    }).catch(console.error);
    setEditingBanner(null);
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerData.headline) {
      showToast('Judul utama banner wajib diisi');
      return;
    }
    const created: BannerItem = {
      id: `banner-${Date.now()}`,
      title: newBannerData.title || 'PROMO GACOR',
      headline: newBannerData.headline,
      subtitle: newBannerData.subtitle || 'Dapatkan persentase winrate tertinggi hari ini.',
      badge: newBannerData.badge || '🔥 REKOMENDASI GACOR',
      image: newBannerData.image || '/placeholder-game.svg',
      gameSlug: newBannerData.gameSlug || (games[0]?.slug || 'mahjong-wins-3-black-scatter-pragmatic'),
      provider: newBannerData.provider || 'Pragmatic Play',
      rtp: Number(newBannerData.rtp) || 98.8,
      accentColor: newBannerData.accentColor || 'from-emerald-500 via-teal-600 to-blue-700',
      isActive: true,
      order: banners.length + 1,
    };
    const updated = [created, ...banners];
    setBanners(updated);
    addAuditLog('Tambah Banner Baru', created.headline, 'None', 'Dibuat');
    showToast(`🎉 Banner baru "${created.headline}" berhasil dibuat!`);
    fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(console.error);
    setIsAddBannerOpen(false);
  };

  // Bulk RTP shift for selected games
  const handleBulkRtpShift = (delta: number) => {
    if (selectedGameIds.length === 0) {
      showToast('Pilih setidaknya satu game untuk aksi massal.');
      return;
    }
    const updated = games.map((g) => {
      if (!selectedGameIds.includes(g.id)) return g;
      const newRtp = parseFloat(Math.max(85, Math.min(99.8, g.rtp + delta)).toFixed(2));
      const newStatus: RtpStatus = newRtp >= 97.0 ? 'tinggi' : newRtp >= 95.0 ? 'normal' : 'rendah';
      return { ...g, rtp: newRtp, status: newStatus, updatedAt: 'Batch Update Admin' };
    });
    persistGames(updated);
    addAuditLog('Batch RTP Shift', `${selectedGameIds.length} Games`, 'Various', `${delta > 0 ? '+' : ''}${delta}%`);
    showToast(`⚡ ${selectedGameIds.length} game berhasil diubah nilainya (${delta > 0 ? '+' : ''}${delta}%)!`);
  };

  // Live RTP Simulator
  const handleSimulateRtp = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = games.map((g) => {
        const jitter = (Math.random() - 0.48) * 0.65;
        let newRtp = parseFloat((g.rtp + jitter).toFixed(2));
        if (newRtp > 99.2) newRtp = 99.12;
        if (newRtp < 91.5) newRtp = 91.5;
        const newStatus: RtpStatus = newRtp >= 97.0 ? 'tinggi' : newRtp >= 95.0 ? 'normal' : 'rendah';
        return {
          ...g,
          rtp: newRtp,
          status: newStatus,
          updatedAt: '1 menit lalu (Simulasi Server)',
        };
      });
      persistGames(updated);
      addAuditLog('Live Fluctuation Run', 'All Catalog (3,053 Games)', 'Dynamic', 'Synchronized');
      setIsSimulating(false);
      showToast('⚡ Simulasi fluktuasi live RTP berhasil diperbarui di seluruh katalog!');
    }, 700);
  };

  // SURGE JACKPOT: Ultimate Gacor Mode with Confetti!
  const handleJackpotSurge = () => {
    setIsSurging(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'],
    });

    const updated = games.map((g, idx) => {
      if (idx < 50 || g.isTrending) {
        // Boost top games to 98.8 - 99.4%
        const surgeRtp = parseFloat((98.6 + Math.random() * 0.8).toFixed(2));
        return { ...g, rtp: surgeRtp, status: 'tinggi' as RtpStatus, updatedAt: '🔥 JACKPOT SURGE AKTIF' };
      }
      return g;
    });

    persistGames(updated);
    addAuditLog('JACKPOT SURGE TRIGGERED', 'Top 50 Popular Games', 'Normal', '99%+ Boost');
    setIsSurging(false);
    showToast('🚀 MODE SURGE JACKPOT DIAKTIFKAN! Top 50 Game kini berstatus 99%+ Winrate!');
  };

  // Export data as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rtp_gacor_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Data katalog game berhasil diexport ke file JSON!');
  };

  // Reset to original factory defaults
  const handleResetDefaults = () => {
    if (confirm('PERINGATAN: Seluruh penyesuaian custom akan direset kembali ke data awal. Lanjutkan?')) {
      persistGames(ALL_GAMES);
      localStorage.removeItem('admin_games_custom');
      showToast('🔄 Seluruh data berhasil dikembalikan ke standar awal.');
    }
  };

  // Stats
  const totalGames = games.length;
  const highGames = games.filter((g) => g.status === 'tinggi').length;
  const normalGames = games.filter((g) => g.status === 'normal').length;
  const lowGames = games.filter((g) => g.status === 'rendah').length;
  const avgRtp = (games.reduce((acc, g) => acc + g.rtp, 0) / (totalGames || 1)).toFixed(2);

  return (
    <div className="flex h-screen w-full bg-[#060911] text-slate-200 overflow-hidden font-sans">
      {/* Toast Pop-up */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-2xl shadow-emerald-500/30 flex items-center gap-2.5 animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 fill-slate-950 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. DEDICATED ADMIN SIDEBAR */}
      <aside className="w-72 bg-[#090e1a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Backoffice Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-[#090e1a] rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="font-black text-sm text-white tracking-wider flex items-center gap-1.5">
                  NEXUS RTP ENGINE
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px] font-mono">v2.6</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Engine Online (WIB)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Control Panel
            </div>

            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'overview'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Overview</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveNav('games')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'games'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-4 h-4" />
                <span>Manajemen Game</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                {totalGames}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('providers')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'providers'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4" />
                <span>Kontrol Provider</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                10
              </span>
            </button>

            <button
              onClick={() => setActiveNav('simulator')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'simulator'
                  ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Live Simulator & Surge</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            </button>

            <div className="px-3 pt-4 pb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Content & Security
            </div>

            <button
              onClick={() => setActiveNav('banners')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'banners'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Banner Hero Slider</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-400">
                {banners.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('articles')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'articles'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Artikel & SEO CMS</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('buttons')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'buttons'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <span>Tombol Login & Daftar</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Navbar CTA
              </span>
            </button>

            <button
              onClick={() => setActiveNav('logs')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                activeNav === 'logs'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4" />
                <span>Audit & Security Logs</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300">
                {changeLogs.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">Administrator</div>
              <div className="text-[10px] text-purple-400 font-mono">Super Admin • Root</div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_auth');
                router.push('/admin/login');
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Keluar dari Portal Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR HEADER */}
        <header className="h-16 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          {/* Left Breadcrumbs & Telemetry */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Backoffice</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-bold capitalize">
                {activeNav === 'overview' ? 'Executive Overview' : activeNav === 'buttons' ? 'Pengaturan Tombol Login & Daftar' : activeNav}
              </span>
            </div>

            {/* Realtime Telemetry Badges */}
            <div className="hidden xl:flex items-center gap-4 text-[11px] font-mono border-l border-slate-800 pl-6 text-slate-400">
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>WS: <strong className="text-emerald-400">{telemetry.latency}ms</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Load: <strong className="text-cyan-300">{telemetry.cpuLoad}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Users: <strong className="text-amber-300">{telemetry.activeUsers}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleJackpotSurge}
              disabled={isSurging}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-goldGlow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Surge Jackpot 99%</span>
            </button>

            <button
              onClick={handleSimulateRtp}
              disabled={isSimulating}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Memproses...' : 'Simulasi RTP'}</span>
            </button>

            <button
              onClick={() => setIsAddGameOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-neonGlow transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Game</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors"
              title="Export Katalog JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* SCROLLABLE MAIN TAB CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeNav === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 4 Main Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Games Terindeks</div>
                  <div className="text-3xl font-black text-white font-mono mt-2">{totalGames}</div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>10 Provider Resmi Terhubung</span>
                  </div>
                </div>

                <div className="bg-[#0b1222] border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Winrate Gacor (≥ 97%)</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono mt-2">{highGames}</div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Proporsi: <strong>{((highGames / (totalGames || 1)) * 100).toFixed(1)}%</strong> dari total katalog
                  </div>
                </div>

                <div className="bg-[#0b1222] border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rata-rata RTP Industri</div>
                  <div className="text-3xl font-black text-amber-400 font-mono mt-2">{avgRtp}%</div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Kondisi: <strong className="text-emerald-400">Sangat Sehat & Stabil</strong>
                  </div>
                </div>

                <div className="bg-[#0b1222] border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Aktivitas Audit Logs</div>
                  <div className="text-3xl font-black text-cyan-400 font-mono mt-2">{changeLogs.length}</div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Perubahan Tercatat Secara Lengkap
                  </div>
                </div>
              </div>

              {/* Quick Status Banner: Tombol CTA Navbar */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Status Tombol Navbar (Login & Daftar)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                        Aktif di Navbar
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Login: <span className="text-cyan-300 font-mono font-bold">{navSettings.loginButton.isActive ? navSettings.loginButton.label : 'Nonaktif'}</span>{' '}
                      <span className="text-slate-500 font-mono text-[11px]">({navSettings.loginButton.url})</span> • 
                      Daftar: <span className="text-amber-300 font-mono font-bold">{navSettings.registerButton.isActive ? navSettings.registerButton.label : 'Nonaktif'}</span>{' '}
                      <span className="text-slate-500 font-mono text-[11px]">({navSettings.registerButton.url})</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveNav('buttons')}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Kelola Link Tombol</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Row: Provider Breakdown & Realtime Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Provider Distribution Card */}
                <div className="lg:col-span-7 bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-400" />
                      Distribusi Katalog Provider Game
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">10 Multi-Provider</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {PROVIDERS.slice(0, 6).map((provider) => {
                      const count = games.filter((g) => g.providerId === provider.id).length;
                      const percentage = ((count / (totalGames || 1)) * 100).toFixed(1);
                      return (
                        <div key={provider.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-300 flex items-center gap-1.5">
                              <span>{provider.logo}</span>
                              <span>{provider.name}</span>
                            </span>
                            <span className="font-mono text-slate-400">
                              {count} games ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Realtime RTP Feed */}
                <div className="lg:col-span-5 bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Live Feed Fluktuasi Terkini
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>

                  <div className="space-y-2.5 divide-y divide-slate-800/60 text-xs">
                    {games.slice(0, 5).map((game) => (
                      <div key={game.id} className="pt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-8 h-8 rounded-lg object-cover bg-slate-950 border border-slate-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                            }}
                          />
                          <div>
                            <div className="font-bold text-white line-clamp-1">{game.name}</div>
                            <div className="text-[10px] text-slate-500">{game.providerName}</div>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="font-black text-emerald-400">{game.rtp}%</div>
                          <div className="text-[10px] text-slate-500">{game.jamGacor.split(' ')[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveNav('games')}
                    className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold text-center transition-colors"
                  >
                    Buka Semua Game Di Katalog ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GAMES MANAGEMENT (CMS) */}
          {activeNav === 'games' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Filter & Batch Actions Bar */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari game berdasarkan judul atau provider..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Provider & Status Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="all">Semua Provider (10)</option>
                      {PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="all">Semua Status</option>
                      <option value="tinggi">🟢 Tinggi (≥ 97%)</option>
                      <option value="normal">🟡 Normal (95-96.9%)</option>
                      <option value="rendah">🔴 Rendah (&lt; 95%)</option>
                    </select>

                    <button
                      onClick={() => setIsAddGameOpen(true)}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Game</span>
                    </button>
                  </div>
                </div>

                {/* Batch Action Toolbar */}
                {selectedGameIds.length > 0 && (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between bg-purple-950/20 px-4 py-2 rounded-xl border border-purple-500/30">
                    <span className="text-xs text-purple-300 font-semibold">
                      {selectedGameIds.length} game terpilih untuk aksi massal:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkRtpShift(0.5)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold"
                      >
                        +0.5% RTP
                      </button>
                      <button
                        onClick={() => handleBulkRtpShift(-0.5)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold"
                      >
                        -0.5% RTP
                      </button>
                      <button
                        onClick={() => setSelectedGameIds([])}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="sticky top-0 z-10 bg-slate-900 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedGameIds.length === filteredGames.length && filteredGames.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedGameIds(filteredGames.map((g) => g.id));
                              else setSelectedGameIds([]);
                            }}
                            className="rounded bg-slate-800 border-slate-700"
                          />
                        </th>
                        <th className="py-3 px-4">Game & Thumbnail</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Live RTP</th>
                        <th className="py-3 px-4">Quick Adjust</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Volatilitas</th>
                        <th className="py-3 px-4">Jam Gacor</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredGames.slice(0, 100).map((game) => {
                        const isSelected = selectedGameIds.includes(game.id);
                        return (
                          <tr key={game.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedGameIds([...selectedGameIds, game.id]);
                                  else setSelectedGameIds(selectedGameIds.filter((id) => id !== game.id));
                                }}
                                className="rounded bg-slate-800 border-slate-700"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={game.image}
                                  alt={game.name}
                                  className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                                  }}
                                />
                                <div>
                                  <span className="font-bold text-white block">{game.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{game.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-400">{game.providerName}</td>
                            <td className="py-3 px-4">
                              <span className="font-mono font-black text-emerald-400 text-sm">{game.rtp}%</span>
                            </td>
                            {/* Inline Adjust (+ / -) */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleQuickRtpAdjust(game, -0.1)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 font-mono text-xs flex items-center justify-center font-bold"
                                  title="Kurang 0.1%"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => handleQuickRtpAdjust(game, +0.1)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 font-mono text-xs flex items-center justify-center font-bold"
                                  title="Tambah 0.1%"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                  game.status === 'tinggi'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                    : game.status === 'normal'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                }`}
                              >
                                {game.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono">{game.volatility}</td>
                            <td className="py-3 px-4 font-mono text-amber-300">{game.jamGacor.split(' ')[0]}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingGame({ ...game })}
                                  className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40"
                                  title="Edit Rinci"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGame(game)}
                                  className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/40"
                                  title="Hapus Game"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 bg-slate-950 text-slate-500 text-[11px] text-center border-t border-slate-800">
                  Menampilkan {Math.min(100, filteredGames.length)} dari {filteredGames.length} game.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROVIDER CONTROLS */}
          {activeNav === 'providers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5">
                <h3 className="text-base font-bold text-white mb-1">
                  Kontrol & Manajemen 10 Provider Slot
                </h3>
                <p className="text-xs text-slate-400">
                  Kelola status operasional dan atur kalibrasi winrate massal per provider.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {PROVIDERS.map((provider) => {
                  const pGames = games.filter((g) => g.providerId === provider.id);
                  const pAvg = (pGames.reduce((a, b) => a + b.rtp, 0) / (pGames.length || 1)).toFixed(2);

                  return (
                    <div
                      key={provider.id}
                      className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
                            {provider.logo}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">{provider.name}</h4>
                            <span className="text-[11px] text-slate-400 font-mono">{provider.totalGames} Games Aktif</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Operasional 🟢
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{provider.description}</p>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Rata-rata RTP Terkini:</span>
                        <span className="font-black text-emerald-400 text-sm">{pAvg}%</span>
                      </div>

                      {/* Quick Shift Provider */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = games.map((g) =>
                              g.providerId === provider.id
                                ? { ...g, rtp: parseFloat((g.rtp + 0.3).toFixed(2)) }
                                : g
                            );
                            persistGames(updated);
                            addAuditLog('Provider Boost', provider.name, `${pAvg}%`, '+0.3% Offset');
                            showToast(`Seluruh game ${provider.name} dinaikkan +0.3%`);
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
                        >
                          +0.3% Boost Provider
                        </button>
                        <button
                          onClick={() => {
                            const updated = games.map((g) =>
                              g.providerId === provider.id
                                ? { ...g, rtp: parseFloat((g.rtp - 0.3).toFixed(2)) }
                                : g
                            );
                            persistGames(updated);
                            addAuditLog('Provider Decrease', provider.name, `${pAvg}%`, '-0.3% Offset');
                            showToast(`Seluruh game ${provider.name} diturunkan -0.3%`);
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold"
                        >
                          -0.3% Cool Down
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATOR & SURGE */}
          {activeNav === 'simulator' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>Realtime Fluctuation Simulator Engine</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Mesin Simulasi & Otomasi RTP Real-Time
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Fitur ini memungkinkan administrator untuk memicu fluktuasi persentase Return to Player secara dinamis tanpa perlu mengubah ribuan game secara manual satu per satu. Algoritma akan menambahkan varians probabilistik yang realistis.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleSimulateRtp}
                    disabled={isSimulating}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>Jalankan Fluktuasi Standar (+/- 0.6%)</span>
                  </button>

                  <button
                    onClick={handleJackpotSurge}
                    disabled={isSurging}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-goldGlow flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>🔥 Aktifkan SURGE JACKPOT (99%+)</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Reset ke Pengaturan Awal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BANNER HERO SLIDER CMS */}
          {activeNav === 'banners' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1222] p-5 rounded-2xl border border-slate-800 shadow-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                      Interactive Carousel CMS
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 text-xs font-mono">{banners.filter(b => b.isActive).length} aktif / {banners.length} total</span>
                  </div>
                  <h3 className="font-black text-white text-lg mt-1">Manajemen Banner Hero Slider</h3>
                  <p className="text-xs text-slate-400">
                    Kelola sliding banner utama di frontend portal. Lengkap dengan kontrol real-time hit-rate, game target, dan aksi hapus/edit.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddBannerOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Slide Baru</span>
                </button>
              </div>

              {/* Banner Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((b, idx) => (
                  <div
                    key={b.id}
                    className={`relative bg-[#0b1222] border rounded-2xl p-4 transition-all flex flex-col justify-between overflow-hidden shadow-xl ${
                      b.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-red-900/30 opacity-60'
                    }`}
                  >
                    {/* Top slide badge & status switch */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] font-bold text-purple-300 truncate max-w-[140px]">
                          {b.badge}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleBannerActive(b)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                          b.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                        title="Klik untuk toggle status aktif/nonaktif"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${b.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        <span>{b.isActive ? 'AKTIF' : 'NONAKTIF'}</span>
                      </button>
                    </div>

                    {/* Banner Image Preview */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 group">
                      <img
                        src={b.image}
                        alt={b.headline}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                            {b.provider}
                          </span>
                          <span className="text-xs font-mono font-black text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
                            {b.rtp}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Headline & Subtitle */}
                    <div className="space-y-1 mb-4 flex-1">
                      <h4 className="font-black text-white text-sm line-clamp-1">{b.headline}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{b.subtitle}</p>
                      <div className="text-[10px] font-mono text-slate-500 truncate pt-1">
                        Target slug: <span className="text-slate-300">{b.gameSlug}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setEditingBanner(b)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Edit Slide</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b)}
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-xs transition-colors"
                        title="Hapus slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ARTICLES CMS */}
          {activeNav === 'articles' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between bg-[#0b1222] p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">Manajemen Artikel & Edukasi SEO</h3>
                  <p className="text-xs text-slate-400">Total {articles.length} artikel terbit.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((art) => (
                  <div key={art.id} className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-4">
                      <img src={art.image} alt={art.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 text-[10px] font-bold uppercase">
                          {art.category}
                        </span>
                        <h4 className="font-bold text-white text-sm line-clamp-2">{art.title}</h4>
                        <div className="text-[11px] text-slate-400">{art.publishedAt} • {art.readTime}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: NAVBAR BUTTONS & LINKS SETTINGS (LOGIN & DAFTAR) */}
          {activeNav === 'buttons' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1222] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                      Navbar & Header CTA Settings
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-slate-400 text-xs font-mono">Real-time Synchronization</span>
                  </div>
                  <h3 className="font-black text-white text-xl mt-1.5 flex items-center gap-2.5">
                    <Link2 className="w-5 h-5 text-emerald-400" />
                    <span>Pengaturan Tombol Login & Daftar</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Atur tautan link URL tujuan, teks label tombol, target tab jendela browser (tab baru atau tab yang sama), serta visibilitas tombol Login dan Daftar di navbar desktop maupun menu mobile.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleResetNavSettings}
                    type="button"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-700"
                  >
                    Reset Default
                  </button>
                  <button
                    onClick={handleSaveNavSettings}
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-neonGlow flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                  </button>
                </div>
              </div>

              {/* Main Grid: Form Inputs (Left) and Live Previews (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Columns: Form Configurations */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Card 1: Tombol Login */}
                  <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                    {/* Header with Switch */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <LogIn className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-base flex items-center gap-2">
                            <span>Tombol Login (Masuk)</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                              Secondary CTA
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">Tombol akses masuk bagi anggota atau pemain terdaftar</p>
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">
                          {navSettings.loginButton.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setNavSettings({
                              ...navSettings,
                              loginButton: {
                                ...navSettings.loginButton,
                                isActive: !navSettings.loginButton.isActive,
                              },
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center cursor-pointer ${
                            navSettings.loginButton.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              navSettings.loginButton.isActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          Teks Label Tombol
                        </label>
                        <input
                          type="text"
                          value={navSettings.loginButton.label}
                          onChange={(e) =>
                            setNavSettings({
                              ...navSettings,
                              loginButton: { ...navSettings.loginButton, label: e.target.value },
                            })
                          }
                          placeholder="e.g. Login atau Masuk Akun"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Teks yang terpampang pada tombol di navbar (disarankan singkat).
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-slate-300 font-bold">
                            Link URL Tujuan (Destination Link)
                          </label>
                          {navSettings.loginButton.url && (
                            <a
                              href={navSettings.loginButton.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline font-semibold"
                            >
                              <span>Uji Tautan</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={navSettings.loginButton.url}
                            onChange={(e) =>
                              setNavSettings({
                                ...navSettings,
                                loginButton: { ...navSettings.loginButton, url: e.target.value },
                              })
                            }
                            placeholder="https://situs-utama.com/login"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Masukkan tautan lengkap URL tujuan (misal: <code className="text-slate-400 font-mono">https://domain.com/login</code> atau link afiliasi Anda).
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          Target Jendela Browser (Target Tab)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setNavSettings({
                                ...navSettings,
                                loginButton: { ...navSettings.loginButton, target: '_blank' },
                              })
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              navSettings.loginButton.target === '_blank'
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-semibold'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>Tab Baru (_blank)</span>
                              {navSettings.loginButton.target === '_blank' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Membuka tautan login di tab browser baru
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setNavSettings({
                                ...navSettings,
                                loginButton: { ...navSettings.loginButton, target: '_self' },
                              })
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              navSettings.loginButton.target === '_self'
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-semibold'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>Tab Saat Ini (_self)</span>
                              {navSettings.loginButton.target === '_self' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Mengarahkan halaman portal saat ini langsung ke URL login
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Tombol Daftar */}
                  <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                    {/* Header with Switch */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <UserPlus className="w-5 h-5 fill-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-base flex items-center gap-2">
                            <span>Tombol Daftar (Registrasi)</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                              Primary Conversion CTA
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400">Tombol pendaftaran anggota baru beraksen gradasi emas-hijau memikat</p>
                        </div>
                      </div>

                      {/* Active Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">
                          {navSettings.registerButton.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setNavSettings({
                              ...navSettings,
                              registerButton: {
                                ...navSettings.registerButton,
                                isActive: !navSettings.registerButton.isActive,
                              },
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center cursor-pointer ${
                            navSettings.registerButton.isActive ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              navSettings.registerButton.isActive ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          Teks Label Tombol
                        </label>
                        <input
                          type="text"
                          value={navSettings.registerButton.label}
                          onChange={(e) =>
                            setNavSettings({
                              ...navSettings,
                              registerButton: { ...navSettings.registerButton, label: e.target.value },
                            })
                          }
                          placeholder="e.g. Daftar atau Daftar Sekarang"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-500 transition-colors"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Teks yang terpampang pada tombol daftar di navbar utama dan mobile.
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-slate-300 font-bold">
                            Link URL Tujuan (Destination Link)
                          </label>
                          {navSettings.registerButton.url && (
                            <a
                              href={navSettings.registerButton.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline font-semibold"
                            >
                              <span>Uji Tautan</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={navSettings.registerButton.url}
                            onChange={(e) =>
                              setNavSettings({
                                ...navSettings,
                                registerButton: { ...navSettings.registerButton, url: e.target.value },
                              })
                            }
                            placeholder="https://situs-utama.com/register"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Tautan link formulir registrasi / affiliate link pendaftaran.
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          Target Jendela Browser (Target Tab)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setNavSettings({
                                ...navSettings,
                                registerButton: { ...navSettings.registerButton, target: '_blank' },
                              })
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              navSettings.registerButton.target === '_blank'
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>Tab Baru (_blank)</span>
                              {navSettings.registerButton.target === '_blank' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Direkomendasikan agar pemain tetap membuka tab bocoran RTP
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setNavSettings({
                                ...navSettings,
                                registerButton: { ...navSettings.registerButton, target: '_self' },
                              })
                            }
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              navSettings.registerButton.target === '_self'
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>Tab Saat Ini (_self)</span>
                              {navSettings.registerButton.target === '_self' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Mengarahkan halaman saat ini langsung ke halaman pendaftaran
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Footer Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0b1222] border border-slate-800 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 text-center sm:text-left">
                      Perubahan yang Anda simpan akan langsung disinkronkan ke seluruh antarmuka situs.
                    </div>
                    <button
                      onClick={handleSaveNavSettings}
                      disabled={isSavingSettings}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-neonGlow flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Semua Perubahan'}</span>
                    </button>
                  </div>
                </div>

                {/* Right 5 Columns: Realtime Live Visual Preview */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Visual Preview Card: Desktop Navbar */}
                  <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <h4 className="font-bold text-white text-sm">Pratinjau Langsung (Desktop)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Live Preview
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Simulasi tampilan tombol di navbar desktop secara realtime:
                    </p>

                    {/* Desktop Mockup Frame */}
                    <div className="bg-[#080c14] border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        {/* Mini Logo */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500 p-0.5">
                            <div className="w-full h-full bg-[#0b1120] rounded-md flex items-center justify-center">
                              <Flame className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                          </div>
                          <span className="text-xs font-black text-white">RTP GACOR</span>
                        </div>

                        {/* Mini Nav Links */}
                        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">Home</span>
                          <span className="px-1.5 py-1">RTP Gacor</span>
                        </div>

                        {/* Preview Buttons */}
                        <div className="flex items-center gap-1.5">
                          {navSettings.loginButton.isActive ? (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[10px] font-bold border border-slate-700 shadow-sm">
                              <LogIn className="w-3 h-3 text-cyan-400" />
                              <span>{navSettings.loginButton.label || 'Login'}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-600 line-through">Login Tersembunyi</span>
                          )}

                          {navSettings.registerButton.isActive ? (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 text-[10px] font-black shadow-neonGlow">
                              <UserPlus className="w-3 h-3 fill-slate-950" />
                              <span>{navSettings.registerButton.label || 'Daftar'}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-600 line-through">Daftar Tersembunyi</span>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 text-center py-1 font-mono">
                        Header Sticky • Target: {navSettings.loginButton.target} (Login), {navSettings.registerButton.target} (Daftar)
                      </div>
                    </div>
                  </div>

                  {/* Mobile Preview Card */}
                  <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-white text-sm">Pratinjau Menu Mobile (Drawer)</h4>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        Mobile Responsive
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      Tampilan tombol CTA di drawer menu navigasi saat dibuka melalui perangkat HP/mobile:
                    </p>

                    {/* Mobile Frame Simulation */}
                    <div className="max-w-[280px] mx-auto bg-[#090e18] border border-slate-800 rounded-2xl p-3 space-y-2.5 shadow-2xl">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 pb-1.5 border-b border-slate-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Waktu Server:
                        </span>
                        <span>19:30:00 WIB</span>
                      </div>

                      {/* 2-Button Grid Mobile */}
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        {navSettings.loginButton.isActive ? (
                          <div className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 text-white text-[11px] font-bold border border-slate-700">
                            <LogIn className="w-3 h-3 text-cyan-400" />
                            <span className="truncate">{navSettings.loginButton.label || 'Login'}</span>
                          </div>
                        ) : (
                          <div className="py-2 px-1 text-center text-[9px] text-slate-600 border border-dashed border-slate-800 rounded-xl">
                            Login Nonaktif
                          </div>
                        )}

                        {navSettings.registerButton.isActive ? (
                          <div className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 text-[11px] font-black shadow-neonGlow">
                            <UserPlus className="w-3 h-3 fill-slate-950" />
                            <span className="truncate">{navSettings.registerButton.label || 'Daftar'}</span>
                          </div>
                        ) : (
                          <div className="py-2 px-1 text-center text-[9px] text-slate-600 border border-dashed border-slate-800 rounded-xl">
                            Daftar Nonaktif
                          </div>
                        )}
                      </div>

                      {/* Mock Links */}
                      <div className="space-y-1 pt-1 opacity-70">
                        <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-[10px] text-emerald-400 font-semibold border border-emerald-500/30">
                          Home
                        </div>
                        <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-[10px] text-slate-300">
                          RTP Gacor
                        </div>
                        <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-[10px] text-slate-300">
                          Top Ranking
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information & Security Card */}
                  <div className="bg-gradient-to-br from-purple-950/20 to-slate-900 border border-purple-500/20 rounded-2xl p-5 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Rekomendasi & Keamanan Link CTA</span>
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                      <li>
                        Target <strong className="text-slate-300">Tab Baru (_blank)</strong> sangat direkomendasikan agar pemain tetap membuka portal live RTP dan pola spin sambil bermain di tab lain.
                      </li>
                      <li>
                        Tautan eksternal otomatis diproteksi dengan atribut keamanan <code className="text-purple-300 font-mono">rel=&quot;noopener noreferrer&quot;</code> untuk melindungi situs dari eksploitasi tabnabbing.
                      </li>
                      <li>
                        Penyimpanan data tersimpan ganda secara persisten di file server <code className="text-emerald-300 font-mono">settings.json</code> dan <code className="text-emerald-300 font-mono">localStorage</code>.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeNav === 'logs' && (
            <div className="bg-[#0b1222] border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Log Audit & Perubahan Sistem</h3>
                  <p className="text-xs text-slate-400">Seluruh riwayat aksi administrator dicatat dengan aman.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                  {changeLogs.length} Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Waktu (WIB)</th>
                      <th className="py-3 px-4">Admin User</th>
                      <th className="py-3 px-4">Aksi</th>
                      <th className="py-3 px-4">Target Game / Provider</th>
                      <th className="py-3 px-4">Nilai Awal</th>
                      <th className="py-3 px-4">Nilai Baru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {changeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 text-slate-400">{log.time}</td>
                        <td className="py-3 px-4 text-purple-400 font-bold">{log.user}</td>
                        <td className="py-3 px-4 text-white font-sans">{log.action}</td>
                        <td className="py-3 px-4 text-slate-200 font-sans">{log.target}</td>
                        <td className="py-3 px-4 text-slate-400">{log.oldVal}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">➔ {log.newVal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT GAME MODAL */}
      {editingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0b1222] border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setEditingGame(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={editingGame.image}
                alt={editingGame.name}
                className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800"
              />
              <div>
                <span className="text-[11px] text-purple-400 font-bold uppercase">Backoffice Game Editor</span>
                <h3 className="text-lg font-black text-white">{editingGame.name}</h3>
                <span className="text-xs text-slate-400">{editingGame.providerName}</span>
              </div>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Game</label>
                <input
                  type="text"
                  value={editingGame.name}
                  onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Persentase RTP (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="80"
                    max="99.99"
                    value={editingGame.rtp}
                    onChange={(e) => setEditingGame({ ...editingGame, rtp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Volatilitas</label>
                  <select
                    value={editingGame.volatility}
                    onChange={(e) => setEditingGame({ ...editingGame, volatility: e.target.value as Volatility })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Max Win</label>
                  <input
                    type="text"
                    value={editingGame.maxWin}
                    onChange={(e) => setEditingGame({ ...editingGame, maxWin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Jam Gacor (WIB)</label>
                  <input
                    type="text"
                    value={editingGame.jamGacor}
                    onChange={(e) => setEditingGame({ ...editingGame, jamGacor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GAME MODAL */}
      {isAddGameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0b1222] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddGameOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-400 font-bold uppercase">Backoffice Creation</span>
                <h3 className="text-lg font-black text-white">Tambah Game Baru ke Katalog</h3>
              </div>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Game</label>
                  <input
                    type="text"
                    required
                    value={newGameData.name}
                    onChange={(e) => setNewGameData({ ...newGameData, name: e.target.value })}
                    placeholder="Contoh: Gates of Olympus 2000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Provider</label>
                  <select
                    value={newGameData.providerId}
                    onChange={(e) => setNewGameData({ ...newGameData, providerId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">RTP (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newGameData.rtp}
                    onChange={(e) => setNewGameData({ ...newGameData, rtp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Volatilitas</label>
                  <select
                    value={newGameData.volatility}
                    onChange={(e) => setNewGameData({ ...newGameData, volatility: e.target.value as Volatility })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Max Win</label>
                  <input
                    type="text"
                    value={newGameData.maxWin}
                    onChange={(e) => setNewGameData({ ...newGameData, maxWin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jam Gacor (WIB)</label>
                <input
                  type="text"
                  value={newGameData.jamGacor}
                  onChange={(e) => setNewGameData({ ...newGameData, jamGacor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-neonGlow flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Game ke Server</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddGameOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BANNER MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0b1222] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setEditingBanner(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={editingBanner.image}
                alt={editingBanner.headline}
                className="w-16 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
              />
              <div>
                <span className="text-[11px] text-cyan-400 font-bold uppercase">Hero Slider Editor</span>
                <h3 className="text-lg font-black text-white">{editingBanner.headline}</h3>
                <span className="text-xs text-slate-400">{editingBanner.provider}</span>
              </div>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Badge Label</label>
                <input
                  type="text"
                  value={editingBanner.badge}
                  onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Headline Utama</label>
                <input
                  type="text"
                  required
                  value={editingBanner.headline}
                  onChange={(e) => setEditingBanner({ ...editingBanner, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Subtitle</label>
                <textarea
                  rows={2}
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Game Slug</label>
                  <input
                    type="text"
                    value={editingBanner.gameSlug}
                    onChange={(e) => setEditingBanner({ ...editingBanner, gameSlug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Live RTP (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingBanner.rtp}
                    onChange={(e) => setEditingBanner({ ...editingBanner, rtp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Provider Name</label>
                  <input
                    type="text"
                    value={editingBanner.provider}
                    onChange={(e) => setEditingBanner({ ...editingBanner, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Image Path</label>
                  <input
                    type="text"
                    value={editingBanner.image}
                    onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW BANNER MODAL */}
      {isAddBannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#0b1222] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddBannerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-cyan-400 font-bold uppercase">Tambah Slide Baru</span>
                <h3 className="text-lg font-black text-white">Hero Slider Banner</h3>
                <span className="text-xs text-slate-400">Tampilkan game unggulan atau promo khusus di homepage</span>
              </div>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Badge Label</label>
                <input
                  type="text"
                  placeholder="e.g. 🔥 HOT TRENDING atau 💎 MAXWIN x100.000"
                  value={newBannerData.badge}
                  onChange={(e) => setNewBannerData({ ...newBannerData, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Headline Utama</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahjong Wins 3 Black Scatter Pecah x2.400"
                  value={newBannerData.headline}
                  onChange={(e) => setNewBannerData({ ...newBannerData, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Subtitle</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat menarik untuk memancing pemain mengklik pola atau game"
                  value={newBannerData.subtitle}
                  onChange={(e) => setNewBannerData({ ...newBannerData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pilih Game Target</label>
                  <select
                    value={newBannerData.gameSlug}
                    onChange={(e) => {
                      const selectedG = games.find((g) => g.slug === e.target.value);
                      if (selectedG) {
                        setNewBannerData({
                          ...newBannerData,
                          gameSlug: selectedG.slug,
                          provider: selectedG.providerName,
                          rtp: selectedG.rtp,
                          image: selectedG.image,
                        });
                      } else {
                        setNewBannerData({ ...newBannerData, gameSlug: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    {games.slice(0, 50).map((g) => (
                      <option key={g.id} value={g.slug}>
                        {g.name} ({g.providerName}) - {g.rtp}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Live RTP (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBannerData.rtp}
                    onChange={(e) => setNewBannerData({ ...newBannerData, rtp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Provider Name</label>
                  <input
                    type="text"
                    value={newBannerData.provider}
                    onChange={(e) => setNewBannerData({ ...newBannerData, provider: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Image Path</label>
                  <input
                    type="text"
                    value={newBannerData.image}
                    onChange={(e) => setNewBannerData({ ...newBannerData, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Slide Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBannerOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
