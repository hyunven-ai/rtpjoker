'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Heart, Flame, Clock, ArrowUpRight } from 'lucide-react';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
  onOpenPola?: (game: Game) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (gameId: string) => void;
}

export function GameCard({
  game,
  onOpenPola,
  isFavorite = false,
  onToggleFavorite,
}: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(game.image);

  // Status color styles
  const isHigh = game.status === 'tinggi';
  const isNormal = game.status === 'normal';

  const statusBadge = isHigh
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
    : isNormal
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
    : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

  const rtpBarColor = isHigh
    ? 'from-emerald-500 via-teal-400 to-cyan-400'
    : isNormal
    ? 'from-amber-500 to-yellow-400'
    : 'from-rose-600 to-pink-500';

  return (
    <div className="group relative bg-[#0b1220] border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardHover flex flex-col">
      {/* Top badges & Favorite button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-sm pointer-events-auto">
          {game.providerName}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(game.id);
          }}
          className={`p-1.5 rounded-full backdrop-blur-md transition-all pointer-events-auto ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
          aria-label="Simpan Favorit"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link href={`/game/${game.slug}`} className="relative aspect-square w-full overflow-hidden bg-slate-950 block">
        <img
          src={imgSrc}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => {
            setImgSrc('/placeholder-game.svg');
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent opacity-80" />

        {/* Trending / Popular Pill */}
        {game.isTrending && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
            <Flame className="w-3 h-3 fill-slate-950" />
            <span>TRENDING</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Game Title */}
          <Link href={`/game/${game.slug}`}>
            <h3 className="font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
              {game.name}
            </h3>
          </Link>

          {/* RTP Rate & Status Bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Live RTP</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-mono font-black text-sm ${
                  isHigh ? 'text-emerald-400 neon-text-green' : isNormal ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {game.rtp}%
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${statusBadge}`}>
                  {game.status}
                </span>
              </div>
            </div>

            {/* Progress meter bar */}
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${rtpBarColor} transition-all duration-700`}
                style={{ width: `${Math.min(100, Math.max(0, (game.rtp - 85) * (100 / 15)))}%` }}
              />
            </div>
          </div>

          {/* Quick Info (Jam & Volatility) */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1 truncate">
              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">{game.jamGacor.split(' ')[0]}</span>
            </div>
            <div className="text-right text-slate-300 font-mono">
              Vol: <span className="font-semibold text-white">{game.volatility}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenPola?.(game)}
            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800/90 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Pola Spin</span>
          </button>

          <Link
            href={`/game/${game.slug}`}
            className="py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
            title="Lihat Detail Game"
          >
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
