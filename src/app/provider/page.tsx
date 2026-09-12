import React from 'react';
import Link from 'next/link';
import { PROVIDERS } from '@/data/providers';
import { Building2, ArrowRight, Sparkles, Trophy } from 'lucide-react';

export const metadata = {
  title: 'Daftar Provider Game Slot Online Terpopuler — RTP Gacor',
  description: 'Daftar 10 provider slot online resmi terlengkap: Pragmatic Play, PG Soft, Slot88, Habanero, NoLimit City, Microgaming, Joker Gaming, CQ9, Playtech, dan Yggdrasil.',
};

export default function ProviderIndexPage() {
  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e172a] to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>10 Provider Resmi Terverifikasi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Daftar Provider <span className="text-emerald-400">Slot Terpercaya</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pilih provider slot favorit Anda untuk melihat daftar bocoran RTP live, jam gacor spesifik, dan pola spin sensasional dari ribuan judul game.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="group bg-[#0b1222] border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardHover flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">
                  {provider.logo}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {provider.totalGames} Games
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {provider.name}
                </h2>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  {provider.tagline}
                </p>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {provider.description}
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Rata-rata RTP:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {provider.avgRtp}%
                </span>
              </div>
            </div>

            <div className="pt-5">
              <Link
                href={`/provider/${provider.slug}`}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-400 transition-all shadow-md"
              >
                <span>Lihat Katalog Game</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
