'use client';

import React from 'react';
import Link from 'next/link';
import { Provider, Game, Article } from '@/types';
import { RtpDashboard } from '@/components/RtpDashboard';
import { Building2, Sparkles, BookOpen, Flame, Trophy } from 'lucide-react';
import { PROVIDERS } from '@/data/providers';

interface ProviderDetailViewProps {
  provider: Provider;
  providerGames: Game[];
  topProviderGames: Game[];
  relatedArticles: Article[];
}

export function ProviderDetailView({
  provider,
  providerGames,
  topProviderGames,
  relatedArticles,
}: ProviderDetailViewProps) {
  return (
    <div className="space-y-10 py-4">
      {/* Provider Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0e172a] to-slate-900 border border-slate-700/80 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0">
              {provider.logo}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
                Provider Terverifikasi
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                {provider.name}
              </h1>
              <p className="text-emerald-400 text-xs sm:text-sm font-semibold">
                {provider.tagline}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Total Game</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {provider.totalGames}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-bold">RTP Rata-rata</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {provider.avgRtp}%
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-bold">Game Gacor</div>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                {topProviderGames.length}+ Judul
              </div>
            </div>
          </div>
        </div>

        {/* Provider Description */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-sm text-slate-300 leading-relaxed max-w-4xl">
          {provider.description}
        </div>

        {/* Other Providers Quick Nav */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Provider Lain:</span>
          {PROVIDERS.filter((p) => p.id !== provider.id).map((p) => (
            <Link
              key={p.id}
              href={`/provider/${p.slug}`}
              className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-colors"
            >
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Top 4 Gacor Spotlight of this Provider */}
      {topProviderGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Game Tergacor dari {provider.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topProviderGames.map((game, idx) => (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                className="group bg-[#0b1222] border border-amber-500/30 hover:border-amber-400 rounded-2xl p-3 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2 bg-slate-950">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black">
                    #{idx + 1}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-400 line-clamp-1">
                    {game.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {game.rtp}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">
                      🟢 Gacor
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Provider Games Dashboard */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          Katalog Lengkap Slot {provider.name} ({providerGames.length} Game)
        </h2>
        <RtpDashboard initialGames={providerGames} />
      </div>

      {/* Related Articles for SEO */}
      {relatedArticles.length > 0 && (
        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Artikel Terkait Provider {provider.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-4 group"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-950"
                />
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">
                    {article.category}
                  </span>
                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 line-clamp-2 mt-0.5">
                    {article.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {article.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
