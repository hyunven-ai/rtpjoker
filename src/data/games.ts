import { Game, RtpStatus } from '@/types';
import rawGames from './gamesData.json';

export const ALL_GAMES: Game[] = rawGames as unknown as Game[];

export function getFeaturedGames(limit = 12): Game[] {
  return ALL_GAMES.filter((g) => g.isTrending || g.rtp >= 98.0).slice(0, limit);
}

export function getTopRtpGames(limit = 50): Game[] {
  return [...ALL_GAMES].sort((a, b) => b.rtp - a.rtp).slice(0, limit);
}

export function getLatestUpdatedGames(limit = 24): Game[] {
  return [...ALL_GAMES].filter(g => g.isPopular).slice(0, limit);
}

export function getGamesByProvider(providerId: string, limit = 100): Game[] {
  return ALL_GAMES.filter((g) => g.providerId === providerId).slice(0, limit);
}

export function getGameBySlug(slug: string): Game | undefined {
  return ALL_GAMES.find((g) => g.slug === slug || g.id === slug);
}

export function getRelatedGames(currentGame: Game, limit = 6): Game[] {
  return ALL_GAMES.filter(
    (g) => g.providerId === currentGame.providerId && g.id !== currentGame.id
  ).slice(0, limit);
}

export interface FilterParams {
  provider?: string;
  status?: RtpStatus | 'all';
  search?: string;
  sortBy?: 'rtp-desc' | 'rtp-asc' | 'name-asc' | 'popular';
  page?: number;
  limit?: number;
}

export function filterGames(params: FilterParams) {
  const {
    provider = 'all',
    status = 'all',
    search = '',
    sortBy = 'rtp-desc',
    page = 1,
    limit = 24,
  } = params;

  let filtered = ALL_GAMES;

  if (provider && provider !== 'all') {
    filtered = filtered.filter(
      (g) => g.providerId === provider || g.providerName.toLowerCase() === provider.toLowerCase()
    );
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((g) => g.status === status);
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (g) => g.name.toLowerCase().includes(q) || g.providerName.toLowerCase().includes(q)
    );
  }

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'rtp-desc') return b.rtp - a.rtp;
    if (sortBy === 'rtp-asc') return a.rtp - b.rtp;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'popular') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    return b.rtp - a.rtp;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    games: paginated,
    total,
    page,
    totalPages,
    limit,
  };
}
