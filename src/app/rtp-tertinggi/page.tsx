'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Trophy, Medal, Crown, ArrowRight, Zap, Filter, Flame, Clock } from 'lucide-react';
import { ALL_GAMES } from '@/data/games';
import { PROVIDERS } from '@/data/providers';
import { Game } from '@/types';
import { PolaGacorModal } from '@/components/PolaGacorModal';

export default function RtpTertinggiPage() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [selectedPolaGame, setSelectedPolaGame] = useState<Game | null>(null);

  // Ranked Games
  const rankedGames = useMemo(() => {
    let list = ALL_GAMES;
    if (selectedProvider !== 'all') {
      list = list.filter((g) => g.providerId === selectedProvider);
    }
    return [...list].sort((a, b) => b.rtp - a.rtp).slice(0, 50);
  }, [selectedProvider]);

  const top1 = rankedGames[0];
  const top2 = rankedGames[1];
  const top3 = rankedGames[2];
  const restOfGames = rankedGames.slice(3);

  return (
    <div className="space-y-12 py-4">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-yellow-950/70 border border-amber-500/40 p-6 sm:p-10 overflow-hidden shadow-2xl text-center max-w-4xl mx-auto">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-3">
          <Trophy className="w-4 h-4 fill-amber-400" />
          <span>Official Hall of Fame Leaderboard</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Peringkat <span className="text-amber-400">RTP Tertinggi</span> Slot Online
        </h1>

        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Klasemen resmi game slot dengan persentase Return to Player tertinggi terverifikasi. Diperbarui secara otomatis berdasarkan akumulasi hit rate putaran hari ini.
        </p>

        {/* Time Tabs & Provider Filter */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-1 flex items-center text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === 'today' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === 'week' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                timeRange === 'month' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Semua Provider</option>
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top1 && top2 && top3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto pt-6">
          {/* #2 Silver (Left) */}
          <div className="order-2 md:order-1 bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-600/60 rounded-3xl p-5 shadow-xl relative text-center flex flex-col items-center">
            <div className="absolute -top-5 w-10 h-10 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-900 font-black text-sm flex items-center justify-center shadow-lg border-2 border-slate-400">
              #2
            </div>
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-400 mt-3 shadow-md">
              <img src={top2.image} alt={top2.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-3">
              {top2.providerName}
            </span>
            <Link href={`/game/${top2.slug}`}>
              <h3 className="font-bold text-base text-white hover:text-slate-200 mt-1 line-clamp-1">
                {top2.name}
              </h3>
            </Link>
            <div className="mt-2 text-2xl font-black font-mono text-slate-200">
              {top2.rtp}%
            </div>
            <button
              onClick={() => setSelectedPolaGame(top2)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Bocoran Pola</span>
            </button>
          </div>

          {/* #1 Gold Champion (Center - Higher Elevation) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-900/60 via-[#121c33] to-[#0d1527] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl shadow-amber-500/20 relative text-center flex flex-col items-center -translate-y-2 md:-translate-y-4">
            <div className="absolute -top-7 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-goldGlow border-2 border-yellow-200">
              <Crown className="w-7 h-7 fill-slate-950" />
            </div>
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-400 mt-5 shadow-xl">
              <img src={top1.image} alt={top1.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
              👑 JUARA 1 WINRATE
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase mt-1">
              {top1.providerName}
            </span>
            <Link href={`/game/${top1.slug}`}>
              <h3 className="font-extrabold text-lg text-white hover:text-amber-300 mt-1 line-clamp-1">
                {top1.name}
              </h3>
            </Link>
            <div className="mt-2 text-3xl font-black font-mono text-amber-300 neon-text-gold">
              {top1.rtp}%
            </div>
            <div className="mt-1 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Jam Gacor: {top1.jamGacor.split(' ')[0]}
            </div>
            <button
              onClick={() => setSelectedPolaGame(top1)}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-goldGlow"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Bocoran Pola Sensasional</span>
            </button>
          </div>

          {/* #3 Bronze (Right) */}
          <div className="order-3 bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-800/60 rounded-3xl p-5 shadow-xl relative text-center flex flex-col items-center">
            <div className="absolute -top-5 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 font-black text-sm flex items-center justify-center shadow-lg border-2 border-amber-600">
              #3
            </div>
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-700 mt-3 shadow-md">
              <img src={top3.image} alt={top3.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase mt-3">
              {top3.providerName}
            </span>
            <Link href={`/game/${top3.slug}`}>
              <h3 className="font-bold text-base text-white hover:text-amber-400 mt-1 line-clamp-1">
                {top3.name}
              </h3>
            </Link>
            <div className="mt-2 text-2xl font-black font-mono text-amber-500">
              {top3.rtp}%
            </div>
            <button
              onClick={() => setSelectedPolaGame(top3)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Bocoran Pola</span>
            </button>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table #4 to #50 */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden shadow-xl max-w-5xl mx-auto">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Peringkat #4 Hingga #50
            </h2>
            <p className="text-xs text-slate-400">
              Daftar lanjutan game dengan persentase RTP tertinggi
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            50 Game Terbaik
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-center w-16">Rank</th>
                <th className="py-3 px-4">Game & Provider</th>
                <th className="py-3 px-4">Live RTP</th>
                <th className="py-3 px-4">Volatilitas</th>
                <th className="py-3 px-4">Max Win</th>
                <th className="py-3 px-4">Jam Gacor</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {restOfGames.map((game, idx) => {
                const rankNumber = idx + 4;
                return (
                  <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-center font-black font-mono text-slate-400">
                      #{rankNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
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
                          <div className="text-[11px] text-slate-500">
                            {game.providerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-mono font-black text-emerald-400 text-sm">
                        <span>{game.rtp}%</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">{game.volatility}</td>
                    <td className="py-3 px-4 text-xs font-mono text-amber-300">{game.maxWin}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-300">{game.jamGacor.split(' ')[0]}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPolaGame(game)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-xs"
                          title="Pola Spin"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <Link
                          href={`/game/${game.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold transition-all"
                        >
                          Detail
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PolaGacorModal
        game={selectedPolaGame}
        isOpen={!!selectedPolaGame}
        onClose={() => setSelectedPolaGame(null)}
      />
    </div>
  );
}
