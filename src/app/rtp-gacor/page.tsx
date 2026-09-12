import React from 'react';
import { ALL_GAMES } from '@/data/games';
import { RtpDashboard } from '@/components/RtpDashboard';
import { Sparkles, Flame } from 'lucide-react';

export const metadata = {
  title: 'Daftar Slot RTP Gacor Hari Ini (Winrate ≥ 97%) — RTP Gacor',
  description: 'Kumpulan game slot dengan persentase Return to Player (RTP) tertinggi di atas 97% hari ini. Cek pola spin petir dan rekomendasi jam gacor.',
};

export default function RtpGacorPage() {
  return (
    <div className="space-y-8">
      {/* Top Specialty Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-emerald-400" />
            <span>Koleksi Status Hijau Terverifikasi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Game Slot <span className="text-emerald-400">RTP Gacor</span> Tertinggi Hari Ini
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Menampilkan daftar game slot dari seluruh provider dengan persentase Return to Player minimal <strong>97.00% ke atas</strong>. Cocok bagi pemain yang memprioritaskan rasio pengembalian teoretis optimal.
          </p>
        </div>
      </div>

      {/* Games Dashboard Collection */}
      <section id="koleksi-gacor" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Koleksi Game RTP Gacor Hari Ini</h2>
          <p className="text-slate-400 text-sm">
            Daftar lengkap game dengan winrate tertinggi yang sudah difilter berdasarkan histori kemenangan pemain dalam 24 jam terakhir.
          </p>
        </div>
        
        <RtpDashboard initialGames={ALL_GAMES} initialStatus="tinggi" />
      </section>
    </div>
  );
}
