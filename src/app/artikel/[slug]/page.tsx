import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES, getArticleBySlug } from '@/data/articles';
import { ALL_GAMES } from '@/data/games';
import { GameCard } from '@/components/GameCard';
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  Tag, 
  Share2, 
  BookOpen,
  ShieldAlert,
  Gamepad2
} from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Artikel Tidak Ditemukan' };

  return {
    title: `${article.metaTitle} — RTP Gacor`,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  // Related games
  const relatedGames = ALL_GAMES.filter((g) =>
    article.relatedGameSlugs.includes(g.slug)
  ).slice(0, 4);

  return (
    <div className="space-y-10 py-4 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/artikel" className="hover:text-emerald-400 transition-colors">
          Artikel & Tips
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {article.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 pb-4 border-b border-slate-800">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <User className="w-3.5 h-3.5 text-emerald-400" /> {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Markdown/HTML Body */}
      <article className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-slate-300 leading-relaxed text-sm sm:text-base">
        <div className="whitespace-pre-line prose prose-invert max-w-none">
          {article.content}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <Tag className="w-4 h-4 text-emerald-400 mr-1" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related Games mentioned in article */}
      {relatedGames.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            Game Rekomendasi Terkait Artikel Ini
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
