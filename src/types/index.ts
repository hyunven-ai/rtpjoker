export type RtpStatus = 'tinggi' | 'normal' | 'rendah';

export type Volatility = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface PolaGacor {
  manual: number;
  turbo: number;
  quick: number;
  dc: 'ON' | 'OFF';
  note?: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  providerId: string;
  providerName: string;
  providerSlug: string;
  image: string;
  rtp: number;
  status: RtpStatus;
  volatility: Volatility;
  maxWin: string;
  jamGacor: string;
  polaGacor: PolaGacor;
  rtpHistory: { day: string; rtp: number }[];
  description: string;
  category: string;
  isTrending?: boolean;
  isPopular?: boolean;
  updatedAt: string;
  num?: number;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  folder: string;
  tagline: string;
  badgeColor: string;
  logo: string;
  description: string;
  totalGames: number;
  avgRtp: number;
  topGamesCount: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  relatedGameSlugs: string[];
}

export interface NavButtonConfig {
  label: string;
  url: string;
  target: '_blank' | '_self';
  isActive: boolean;
}

export interface SiteSettings {
  loginButton: NavButtonConfig;
  registerButton: NavButtonConfig;
}
