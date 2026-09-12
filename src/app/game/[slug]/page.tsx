import React from 'react';
import { notFound } from 'next/navigation';
import { getGameBySlug, getRelatedGames } from '@/data/games';
import { GameDetailView } from '@/components/GameDetailView';

interface GamePageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug);
  if (!game) return { title: 'Game Tidak Ditemukan' };

  return {
    title: `Bocoran RTP ${game.name} Hari Ini (${game.rtp}%) — Jam & Pola Gacor ${game.providerName}`,
    description: `Cek live RTP ${game.name} dari ${game.providerName} sebesar ${game.rtp}%. Lengkap dengan bocoran jam gacor, grafik riwayat RTP 7 hari, pola spin turbo, dan ulasan strategi jackpot.`,
    openGraph: {
      title: `RTP Live ${game.name} — ${game.rtp}% Gacor`,
      description: `Bocoran jam gacor dan pola spin untuk game ${game.name} (${game.providerName}).`,
      images: [game.image],
    },
  };
}

export default function GameDetailPage({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug);
  if (!game) {
    notFound();
  }

  const relatedGames = getRelatedGames(game, 6);

  return <GameDetailView game={game} relatedGames={relatedGames} />;
}
