'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Flame, Zap, ArrowRight } from 'lucide-react';
import { Game } from '@/types';
import { ALL_GAMES } from '@/data/games';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Default top suggestions
      setResults(ALL_GAMES.filter((g) => g.isTrending || g.rtp > 98).slice(0, 8));
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(ALL_GAMES.filter((g) => g.isTrending).slice(0, 8));
      return;
    }
    const q = text.toLowerCase().trim();
    const found = ALL_GAMES.filter(
      (g) => g.name.toLowerCase().includes(q) || g.providerName.toLowerCase().includes(q)
    ).slice(0, 10);
    setResults(found);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#090f1d] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-800 px-4 py-3.5 bg-slate-900/50">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Ketik nama game (contoh: Olympus, Bonanza, Mahjong, Koi Gate)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-800/60">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{query ? `Hasil Pencarian (${results.length})` : 'Rekomendasi Populer'}</span>
            <span className="text-[11px] text-emerald-400 font-mono">Live RTP</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Tidak ditemukan game dengan kata kunci &quot;<span className="text-white font-medium">{query}</span>&quot;.
            </div>
          ) : (
            results.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {game.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{game.providerName}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">Vol: {game.volatility}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-emerald-400">
                      {game.rtp}%
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {game.status}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 px-4 py-2.5 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Tekan <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> untuk menutup</span>
          <span className="text-emerald-400 font-medium">3,053+ Game Terkatalog</span>
        </div>
      </div>
    </div>
  );
}
