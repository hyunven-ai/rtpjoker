import React from 'react';
import { ALL_GAMES } from '@/data/games';
import { RtpDashboard } from '@/components/RtpDashboard';
import { Clock, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'RTP Terbaru Hari Ini — Update Jam & Winrate Terkini',
  description: 'Daftar game slot dengan update persentase RTP dan perubahan volatilitas terbaru hari ini dari seluruh provider.',
};

export default function RtpTerbaruPage() {
  // Sort by popular or recent
  const latestGames = [...ALL_GAMES].slice(0, 100);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Feed Pembaruan Real-Time</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Update <span className="text-cyan-400">RTP Slot Terbaru</span> & Terkini
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pantau pergerakan data RTP slot yang baru saja mengalami pergeseran rasio kemenangan dalam 15-30 menit terakhir. Data disinkronkan langsung dengan volume putaran aktif.
          </p>
        </div>
      </div>

      <RtpDashboard initialGames={latestGames} />
    </div>
  );
}
