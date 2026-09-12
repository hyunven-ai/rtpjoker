'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Trophy, Sparkles, TrendingUp } from 'lucide-react';

interface WinItem {
  id: string;
  user: string;
  game: string;
  provider: string;
  multiplier: string;
  amount: string;
  time: string;
  gameSlug: string;
}

const INITIAL_WINS: WinItem[] = [
  { id: '1', user: 'ryan***88', game: 'Gates of Olympus 1000', provider: 'Pragmatic', multiplier: 'x1.250', amount: 'Rp 12.500.000', time: '1 mnt lalu', gameSlug: 'gates-of-olympus-1000-pragmatic' },
  { id: '2', user: 'dika***99', game: 'Mahjong Wins 3: Black Scatter', provider: 'Pragmatic', multiplier: 'x2.400', amount: 'Rp 24.000.000', time: '2 mnt lalu', gameSlug: 'mahjong-wins-3-black-scatter-pragmatic' },
  { id: '3', user: 'hendra***21', game: 'Sweet Bonanza 2500', provider: 'Pragmatic', multiplier: 'x5.000', amount: 'Rp 50.000.000', time: '3 mnt lalu', gameSlug: 'sweet-bonanza-2500-pragmatic' },
  { id: '4', user: 'agus***77', game: 'Mahjong Ways 2', provider: 'PG Soft', multiplier: 'x880', amount: 'Rp 8.800.000', time: '4 mnt lalu', gameSlug: 'mahjong-ways-2-pgsoft' },
  { id: '5', user: 'budi***12', game: 'Goyang Gaib', provider: 'Slot88', multiplier: 'x1.500', amount: 'Rp 15.000.000', time: '5 mnt lalu', gameSlug: 'goyang-gaib-slot88' },
  { id: '6', user: 'fajar***34', game: 'Nexus Koi Gate', provider: 'Habanero', multiplier: 'x950', amount: 'Rp 9.500.000', time: '6 mnt lalu', gameSlug: 'nexus-koi-gate-habanero' },
  { id: '7', user: 'rizky***05', game: 'Starlight Princess™ 1000', provider: 'Pragmatic', multiplier: 'x1.000', amount: 'Rp 10.000.000', time: '8 mnt lalu', gameSlug: 'starlight-princess-1000-pragmatic' },
];

export function LiveWinTicker() {
  const [wins, setWins] = useState<WinItem[]>(INITIAL_WINS);

  // Add random realistic win periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['kevin***17', 'andre***82', 'sari***90', 'gilang***66', 'dewi***43', 'eko***55'];
      const games = [
        { name: 'Gates of Olympus 1000', prov: 'Pragmatic', slug: 'gates-of-olympus-1000-pragmatic', mult: 'x1.800', amt: 'Rp 18.000.000' },
        { name: 'Mahjong Wins 3: Black Scatter', prov: 'Pragmatic', slug: 'mahjong-wins-3-black-scatter-pragmatic', mult: 'x3.200', amt: 'Rp 32.000.000' },
        { name: 'Wild Bandito', prov: 'PG Soft', slug: 'wild-bandito-pgsoft', mult: 'x650', amt: 'Rp 6.500.000' },
        { name: 'Lucky Neko', prov: 'PG Soft', slug: 'lucky-neko-pgsoft', mult: 'x920', amt: 'Rp 9.200.000' },
      ];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];

      const newWin: WinItem = {
        id: Date.now().toString(),
        user: randomUser,
        game: randomGame.name,
        provider: randomGame.prov,
        multiplier: randomGame.mult,
        amount: randomGame.amt,
        time: 'Baru saja',
        gameSlug: randomGame.slug,
      };

      setWins((prev) => [newWin, ...prev.slice(0, 9)]);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800/80 p-2.5 sm:p-3 flex items-center gap-3 overflow-hidden shadow-lg backdrop-blur-md">
      {/* Left Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black shrink-0 shadow-goldGlow select-none">
        <Trophy className="w-4 h-4 fill-slate-950" />
        <span className="hidden sm:inline">LIVE JACKPOT WINFEED</span>
        <span className="sm:hidden">WINFEED</span>
      </div>

      {/* Marquee Track */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex items-center gap-6 animate-[marquee_30s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
          {wins.concat(wins).map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/game/${item.gameSlug}`}
              className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-slate-400 font-semibold">{item.user}</span>
              <span>menang</span>
              <span className="font-black text-amber-400 group-hover:underline">
                {item.multiplier}
              </span>
              <span className="font-bold text-white">({item.amount})</span>
              <span className="text-slate-400">di</span>
              <span className="font-semibold text-emerald-300 group-hover:text-emerald-400 underline decoration-emerald-500/40">
                {item.game}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">[{item.time}]</span>
              <span className="text-slate-700 mx-2">•</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
