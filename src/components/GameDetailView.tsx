'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import { RtpChart } from '@/components/RtpChart';
import { GameCard } from '@/components/GameCard';
import { 
  Flame, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Award,
  Calendar
} from 'lucide-react';

interface GameDetailViewProps {
  game: Game;
  relatedGames: Game[];
}

export function GameDetailView({ game, relatedGames }: GameDetailViewProps) {
  const [imgSrc, setImgSrc] = useState(game.image);

  const isHigh = game.status === 'tinggi';
  const isNormal = game.status === 'normal';

  return (
    <div className="space-y-10 py-4 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/provider/${game.providerSlug}`}
          className="hover:text-emerald-400 transition-colors"
        >
          {game.providerName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate">{game.name}</span>
      </nav>

      {/* Main Game Showcase Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0b1220] border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Game Image */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[280px] rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-neonGlow bg-slate-950">
              <img
                src={imgSrc}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={() => {
                  setImgSrc('/placeholder-game.svg');
                }}
              />
              {game.isTrending && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  <span>TRENDING</span>
                </div>
              )}
            </div>

            <span className="mt-3 text-xs text-slate-400">
              Update: <strong className="text-slate-200">{game.updatedAt}</strong>
            </span>
          </div>

          {/* Game Metadata & Live Meter */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/provider/${game.providerSlug}`}
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-800 text-emerald-400 border border-slate-700 hover:border-emerald-500/50 transition-colors"
                >
                  {game.providerName}
                </Link>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                  {game.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
                {game.name}
              </h1>
              <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                {game.description.split('.')[0]}.
              </p>
            </div>

            {/* Live RTP Meter Highlight */}
            <div className="bg-[#080d1a] border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-xs text-slate-400 uppercase font-semibold">
                    Live Return to Player
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 neon-text-green">
                    {game.rtp}%
                  </div>
                </div>

                <div className="h-10 w-px bg-slate-800 hidden sm:block" />

                <div>
                  <span className="text-xs text-slate-400 block font-semibold">
                    Status Server
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase mt-1 border ${
                      isHigh
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isNormal
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {game.status === 'tinggi' ? '🟢 TINGGI (GACOR)' : game.status === 'normal' ? '🟡 NORMAL' : '🔴 RENDAH'}
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Akurasi Hitrate</span>
                  <span className="text-emerald-400 font-bold">99.2%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, (game.rtp - 85) * (100 / 15)))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400">Volatilitas</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {game.volatility}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400">Max Win</span>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  {game.maxWin}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400">Jam Gacor</span>
                <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5 truncate">
                  {game.jamGacor.split(' ')[0]}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400">Double Chance</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {game.polaGacor.dc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pola Spin & Jam Gacor Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pola Spin */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-5 h-5 fill-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Bocoran Pola Spin {game.name}
            </h2>
          </div>

          <p className="text-xs text-slate-400">
            Kombinasi putaran yang direkomendasikan untuk menstimulasi simbol scatter dan tumble:
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[11px] text-slate-400">Manual Spin</span>
              <div className="text-xl font-black text-white font-mono mt-1">
                {game.polaGacor.manual}x
              </div>
              <span className="text-[10px] text-emerald-400">Pemanasan</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[11px] text-slate-400">Fast / Quick</span>
              <div className="text-xl font-black text-cyan-400 font-mono mt-1">
                {game.polaGacor.quick}x
              </div>
              <span className="text-[10px] text-slate-400">Sedang</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-[11px] text-slate-400">Turbo Spin</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-1">
                {game.polaGacor.turbo}x
              </div>
              <span className="text-[10px] text-amber-400">Akselerasi</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Status Double Chance (DC):</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              {game.polaGacor.dc}
            </span>
          </div>

          {game.polaGacor.note && (
            <div className="text-xs text-slate-300 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3">
              {game.polaGacor.note}
            </div>
          )}
        </div>

        {/* Jam Gacor Schedule */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">
                Jadwal Jam Gacor {game.name}
              </h2>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Interval waktu dengan aktivitas server tertinggi untuk memicu freespin:
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/30">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Jam Rekomendasi Utama:
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {game.jamGacor}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                *Tingkat kestabilan tumble multiplier terpantau sangat aktif pada rentang waktu ini.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Zona Waktu: <strong>WIB (UTC+7)</strong></span>
            <span className="text-emerald-400 font-medium">Status Server: Online 🟢</span>
          </div>
        </div>
      </div>

      {/* 7-Day RTP Chart */}
      <RtpChart
        data={game.rtpHistory}
        currentRtp={game.rtp}
        gameName={game.name}
      />

      {/* SEO Article Section (500-1000 kata) */}
      <article className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Ulasan Lengkap & Analisis Statistik
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Ulasan Lengkap {game.name} dari {game.providerName}
          </h2>
        </div>

        <div className="space-y-4">
          <p>
            Game <strong>{game.name}</strong> merupakan salah satu mahakarya dari provider terkemuka <strong>{game.providerName}</strong> yang dirancang dengan mekanisme permainan <em>{game.category}</em>. Dengan daya tarik visual yang spektakuler dan audio yang imersif, game ini berhasil menarik perhatian para pemain di berbagai negara, khususnya di Indonesia.
          </p>

          <h3 className="text-lg font-bold text-white mt-6">
            1. Rasio Return to Player (RTP) dan Volatilitas
          </h3>
          <p>
            Pada hari ini, <strong>{game.name}</strong> mencatatkan live RTP sebesar <strong>{game.rtp}%</strong>, menempatkannya pada status <strong className="text-emerald-400 uppercase">{game.status}</strong>. Nilai ini menunjukkan bahwa secara teoretis, mesin sedang berada dalam fase pengembalian statistik yang sangat menguntungkan pemain dibandingkan rata-rata industri yang umumnya berkisar antara 95% hingga 96%.
          </p>
          <p>
            Tingkat volatilitas game ini diklasifikasikan sebagai <strong>{game.volatility}</strong>. Bagi pemain yang memahami manajemen risiko, volatilitas ini berarti game mampu memberikan kejutan kemenangan luar biasa hingga batas maksimal <strong>{game.maxWin}</strong> dari nilai taruhan yang dipasang.
          </p>

          <h3 className="text-lg font-bold text-white mt-6">
            2. Fitur Unggulan dan Mekanisme Simbol
          </h3>
          <p>
            Salah satu daya tarik terbesar dari {game.name} adalah kehadiran simbol-simbol khusus seperti Scatter dan Multiplier. Saat minimal 4 simbol scatter mendarat di layar, mode putaran gratis (Free Spins) akan terpicu secara otomatis, membuka potensi pengali beruntun tanpa batas. Fitur <em>Double Chance (DC)</em> yang saat ini direkomendasikan berstatus <strong>{game.polaGacor.dc}</strong> juga memberikan probabilitas tambahan untuk memunculkan simbol scatter lebih sering.
          </p>

          <h3 className="text-lg font-bold text-white mt-6">
            3. Panduan Jam Gacor dan Manajemen Pola Spin
          </h3>
          <p>
            Berdasarkan riwayat putaran pemain, waktu terbaik untuk memainkan {game.name} adalah pada rentang <strong>{game.jamGacor}</strong>. Terapkan pola putaran secara disiplin: mulai dengan <strong>{game.polaGacor.manual}x Manual Spin</strong> untuk membaca respons mesin, lanjutkan dengan <strong>{game.polaGacor.quick}x Quick Spin</strong>, dan manfaatkan <strong>{game.polaGacor.turbo}x Turbo Spin</strong> untuk memaksimalkan frekuensi tumble saat tanda-tanda scatter mulai bermunculan.
          </p>

          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 my-6 text-xs sm:text-sm text-amber-200">
            <strong>Catatan Edukasi:</strong> Seluruh data RTP dan pola yang disajikan dalam ulasan ini dihitung berdasarkan analisis statistik putaran sebelumnya. Hasil putaran slot diatur oleh Random Number Generator (RNG) independen. Mainkan secara santai sebagai sarana hiburan dan selalu tentukan batas modal yang aman.
          </div>
        </div>
      </article>

      {/* Related Games from Same Provider */}
      {relatedGames.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Game Lainnya dari {game.providerName}
            </h2>
            <Link
              href={`/provider/${game.providerSlug}`}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {relatedGames.map((rel) => (
              <GameCard key={rel.id} game={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
