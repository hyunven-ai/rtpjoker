'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, Clock, Zap, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Game } from '@/types';

interface PolaGacorModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PolaGacorModal({ game, isOpen, onClose }: PolaGacorModalProps) {
  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0b1222] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-emerald-500/40 shrink-0 shadow-md">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback
                (e.target as HTMLImageElement).src = '/placeholder-game.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {game.providerName}
              </span>
              <span className="text-xs text-slate-400">Pola Rekomendasi</span>
            </div>
            <h3 className="text-xl font-black text-white leading-tight mt-1">
              {game.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Live RTP:</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                {game.rtp}%
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 font-bold uppercase rounded ${
                game.status === 'tinggi' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {game.status}
              </span>
            </div>
          </div>
        </div>

        {/* Jam Gacor Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Jam Gacor Teruji
              </div>
              <div className="text-base font-bold text-amber-300 font-mono">
                {game.jamGacor}
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-emerald-400" /> AKTIF SEKARANG
          </span>
        </div>

        {/* Pola Spin Grid */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Bocoran Pola Spin Putaran
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400">Manual Spin</div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {game.polaGacor.manual}x
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Putaran Awal</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400">Fast / Quick</div>
              <div className="text-lg font-black text-cyan-400 mt-0.5 font-mono">
                {game.polaGacor.quick}x
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Kecepatan Sedang</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400">Turbo Spin</div>
              <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">
                {game.polaGacor.turbo}x
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Akselerasi Tinggi</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[11px] text-slate-400">Double Chance</div>
              <div className={`text-lg font-black mt-0.5 font-mono ${
                game.polaGacor.dc === 'ON' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {game.polaGacor.dc}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Fitur DC</div>
            </div>
          </div>
        </div>

        {/* Pola Note */}
        {game.polaGacor.note && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 mb-6 text-xs text-emerald-300/90 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{game.polaGacor.note}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/game/${game.slug}`}
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm text-center flex items-center justify-center gap-2 shadow-neonGlow transition-all"
          >
            <span>Buka Detail & Grafik Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
