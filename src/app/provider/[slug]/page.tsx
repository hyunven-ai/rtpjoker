import React from 'react';
import { notFound } from 'next/navigation';
import { getProviderBySlug } from '@/data/providers';
import { getGamesByProvider } from '@/data/games';
import { ARTICLES } from '@/data/articles';
import { ProviderDetailView } from '@/components/ProviderDetailView';

interface ProviderPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);
  if (!provider) return { title: 'Provider Tidak Ditemukan' };

  return {
    title: `RTP Slot ${provider.name} Hari Ini Terupdate — Bocoran Jam & Pola Gacor`,
    description: `Daftar lengkap RTP slot ${provider.name} hari ini. Temukan game dengan winrate tertinggi, jam gacor, dan bocoran pola spin teruji.`,
  };
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const provider = getProviderBySlug(params.slug);
  if (!provider) {
    notFound();
  }

  const providerGames = getGamesByProvider(provider.id, 500);
  const topProviderGames = [...providerGames].sort((a, b) => b.rtp - a.rtp).slice(0, 4);

  return (
    <ProviderDetailView
      provider={provider}
      providerGames={providerGames}
      topProviderGames={topProviderGames}
      relatedArticles={ARTICLES.slice(0, 2)}
    />
  );
}
