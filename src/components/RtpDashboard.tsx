'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Trophy, 
  Zap, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ChevronRight, 
  Clock, 
  Check, 
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Activity,
  Layers,
  Crown,
  Tag
} from 'lucide-react';
import { Game, Provider, RtpStatus } from '@/types';
import { PROVIDERS } from '@/data/providers';
import { GameCard } from './GameCard';
import { PolaGacorModal } from './PolaGacorModal';
import { HeroCarousel } from './HeroCarousel';
import { LiveWinTicker } from './LiveWinTicker';

interface RtpDashboardProps {
  initialGames: Game[];
  initialStatus?: RtpStatus | 'all';
}

type QuickCategory = 'all' | 'gacor' | 'petir' | 'scatter-hitam' | 'multiplier-1000' | 'admin-pick';

const TRENDING_TAGS = [
  'Mahjong Wins 3',
  'Gates of Olympus 1000',
  'Starlight Princess 1000',
  'Sweet Bonanza 2500',
  'Goyang Gaib',
  'Koi Gate Nexus',
  'Wild Bandito',
  'Lucky Neko'
];

export function RtpDashboard({ initialGames, initialStatus = 'all' }: RtpDashboardProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<RtpStatus | 'all'>(initialStatus);
  const [quickCategory, setQuickCategory] = useState<QuickCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rtp-desc' | 'rtp-asc' | 'name-asc' | 'popular'>('rtp-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Selected game for Pola Modal
  const [selectedPolaGame, setSelectedPolaGame] = useState<Game | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rtp_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (gameId: string) => {
    const updated = favorites.includes(gameId)
      ? favorites.filter((id) => id !== gameId)
      : [...favorites, gameId];
    setFavorites(updated);
    try {
      localStorage.setItem('rtp_favorites', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Top 5 spotlight games
  const topSpotlightGames = useMemo(() => {
    return [...games]
      .filter((g) => g.rtp >= 98.0)
      .sort((a, b) => b.rtp - a.rtp)
      .slice(0, 5);
  }, [games]);

  // Filtered & Sorted games
  const filteredGames = useMemo(() => {
    let list = games;

    // Filter by provider
    if (selectedProvider !== 'all') {
      list = list.filter((g) => g.providerId === selectedProvider);
    }

    // Filter by RTP status
    if (selectedStatus !== 'all') {
      list = list.filter((g) => g.status === selectedStatus);
    }

    // Filter by Quick Category
    if (quickCategory === 'gacor') {
      list = list.filter((g) => g.rtp >= 98.0);
    } else if (quickCategory === 'petir') {
      list = list.filter((g) => /olympus|zeus|starlight|petir|thor/i.test(g.name));
    } else if (quickCategory === 'scatter-hitam') {
      list = list.filter((g) => /scatter|mahjong|wukong/i.test(g.name));
    } else if (quickCategory === 'multiplier-1000') {
      list = list.filter((g) => /1000/i.test(g.name) || g.maxWin.includes('100,000'));
    } else if (quickCategory === 'admin-pick') {
      list = list.filter((g) => g.isTrending || (typeof g.num === 'number' && g.num <= 10));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || g.providerName.toLowerCase().includes(q)
      );
    }

    // Sort games
    return [...list].sort((a, b) => {
      if (sortBy === 'rtp-desc') return b.rtp - a.rtp;
      if (sortBy === 'rtp-asc') return a.rtp - b.rtp;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'popular') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      return b.rtp - a.rtp;
    });
  }, [games, selectedProvider, selectedStatus, quickCategory, searchQuery, sortBy]);

  // Paginated
  const paginatedGames = useMemo(() => {
    return filteredGames.slice(0, page * itemsPerPage);
  }, [filteredGames, page]);

  const hasMore = paginatedGames.length < filteredGames.length;

  const handleOpenPolaFromCarousel = (gameSlug: string) => {
    const target = games.find((g) => g.slug === gameSlug) || games.find((g) => g.slug.includes(gameSlug.split('-')[0]));
    if (target) {
      setSelectedPolaGame(target);
    } else if (games.length > 0) {
      setSelectedPolaGame(games[0]);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO CAROUSEL SECTION */}
      <section className="pt-2">
        <HeroCarousel onOpenPola={handleOpenPolaFromCarousel} allGames={games} />
      </section>

      {/* 2. COMMUNITY LIVE WIN TICKET */}
      <section>
        <LiveWinTicker />
      </section>

      {/* 3. PLATFORM TELEMETRY & TRUST STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-bold">10 Multi-Provider</div>
            <div className="text-base sm:text-lg font-black text-white">3.051 Game Resmi</div>
          </div>
        </div>

        <div className="bg-[#0b1222] border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Winrate Hit-Rate
            </div>
            <div className="text-base sm:text-lg font-black text-white">Update Tiap Menit</div>
          </div>
        </div>

        <div className="bg-[#0b1222] border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] text-amber-400 uppercase font-bold">MaxWin Multiplier</div>
            <div className="text-base sm:text-lg font-black text-white">Hingga x100.000</div>
          </div>
        </div>

        <div className="bg-[#0b1222] border border-cyan-500/30 rounded-2xl p-4 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-cyan-400 uppercase font-bold">Algoritma RNG Murni</div>
            <div className="text-base sm:text-lg font-black text-white">BMM / GLI Certified</div>
          </div>
        </div>
      </section>

      {/* 4. TOP 5 GACOR SPOTLIGHT */}
      <section className="bg-gradient-to-b from-[#0e1628] to-[#090f1d] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-goldGlow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Top 5 Game Tergacor Hari Ini
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  98%+ WINRATE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Peringkat persentase pengembalian tertinggi saat ini (Update WIB Realtime)
              </p>
            </div>
          </div>

          <Link
            href="/rtp-tertinggi"
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>Lihat Semua Ranking (#1 - #50)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {topSpotlightGames.map((game, rank) => (
            <div
              key={game.id}
              className="relative group bg-[#080d1a] border border-amber-500/30 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-400 transition-all hover:-translate-y-1.5 shadow-lg"
            >
              {/* Rank Medal */}
              <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                #{rank + 1}
              </div>

              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                  }}
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {game.providerName}
                </span>
                <Link href={`/game/${game.slug}`}>
                  <h4 className="font-bold text-xs sm:text-sm text-white hover:text-amber-400 transition-colors line-clamp-1">
                    {game.name}
                  </h4>
                </Link>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-amber-400 font-mono font-black text-sm">
                    {game.rtp}%
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    🟢 Gacor
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPolaGame(game)}
                className="mt-2.5 w-full py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Pola Jam</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MAIN FILTER & DASHBOARD SECTION */}
      <section className="space-y-6">
        {/* Filter Controls Card */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
          {/* Top Row: Search & View Toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari judul game (contoh: Mahjong Wins, Gates of Olympus, Koi Gate, Goyang Gaib)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Mode Bar */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="flex items-center gap-2 text-xs">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="rtp-desc">Urutan: RTP Tertinggi</option>
                  <option value="rtp-asc">Urutan: RTP Terendah</option>
                  <option value="popular">Urutan: Paling Populer</option>
                  <option value="name-asc">Urutan: Abjad (A - Z)</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Grid Kartu"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tampilan Tabel Data"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Populer:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  setPage(1);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-all font-medium ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-rose-400 hover:text-rose-300 underline font-semibold ml-2"
              >
                Reset Cari
              </button>
            )}
          </div>

          {/* Natural Gaming Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {[
              { id: 'all', label: 'Semua Koleksi', icon: '🎮' },
              { id: 'gacor', label: '🔥 Top Gacor (≥ 98%)', icon: '🔥' },
              { id: 'petir', label: '⚡ Pecah Petir Series', icon: '⚡' },
              { id: 'scatter-hitam', label: '🀄 Scatter Hitam Series', icon: '🀄' },
              { id: 'multiplier-1000', label: '💎 Multiplier x1000', icon: '💎' },
              { id: 'admin-pick', label: '👑 Pilihan Admin', icon: '👑' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setQuickCategory(cat.id as QuickCategory);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  quickCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border border-purple-500/50'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Provider Filter Bar */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pilih Provider Game
              </span>
              <span className="text-xs font-mono text-emerald-400">
                {filteredGames.length} Game Ditemukan
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider('all');
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  selectedProvider === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-neonGlow font-black'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>🔥 Semua Provider</span>
              </button>

              {PROVIDERS.map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => {
                    setSelectedProvider(prov.id);
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                    selectedProvider === prov.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-neonGlow font-black'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{prov.logo}</span>
                  <span>{prov.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter Badges */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Status RTP:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('all');
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua Status
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('tinggi');
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  selectedStatus === 'tinggi'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Tinggi (≥ 97%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('normal');
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  selectedStatus === 'normal'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Normal (95% - 96.9%)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('rendah');
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  selectedStatus === 'rendah'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Rendah (&lt; 95%)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. GAMES LISTING VIEW */}
        {filteredGames.length === 0 ? (
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Tidak ada game yang cocok</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Coba gunakan kata kunci pencarian lain atau reset filter provider & status.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedProvider('all');
                setSelectedStatus('all');
                setQuickCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {paginatedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onOpenPola={setSelectedPolaGame}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Live RTP</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Volatilitas</th>
                    <th className="py-3 px-4">Jam Gacor</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {paginatedGames.map((game) => (
                    <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                            }}
                          />
                          <div>
                            <Link
                              href={`/game/${game.slug}`}
                              className="font-bold text-white hover:text-emerald-400 transition-colors"
                            >
                              {game.name}
                            </Link>
                            <span className="text-[10px] text-slate-500 block font-mono">
                              MaxWin {game.maxWin}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{game.providerName}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          {game.rtp}%
                        </span>
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
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {game.jamGacor.split(' ')[0]}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPolaGame(game)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
                          >
                            Pola
                          </button>
                          <Link
                            href={`/game/${game.slug}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                          >
                            Detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-white font-bold text-xs sm:text-sm transition-all hover:shadow-neonGlow"
            >
              Muat Lebih Banyak Game ({paginatedGames.length} dari {filteredGames.length})
            </button>
          </div>
        )}
      </section>

      {/* Pola Gacor Modal Popup */}
      <PolaGacorModal
        game={selectedPolaGame}
        isOpen={Boolean(selectedPolaGame)}
        onClose={() => setSelectedPolaGame(null)}
      />
    </div>
  );
}
