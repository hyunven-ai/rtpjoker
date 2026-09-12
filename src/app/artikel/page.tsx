import React from 'react';
import Link from 'next/link';
import { ARTICLES } from '@/data/articles';
import { BookOpen, Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';

export const metadata = {
  title: 'Artikel, Tips & Panduan RTP Slot Online — RTP Gacor',
  description: 'Kumpulan artikel edukatif mengenai cara kerja Return to Player (RTP), algoritma RNG, strategi manajemen modal slot, dan review provider terlengkap.',
};

export default function ArtikelPage() {
  const featuredArticle = ARTICLES[0];
  const otherArticles = ARTICLES.slice(1);

  return (
    <div className="space-y-12 py-4 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Pusat Edukasi & Strategi Slot</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Artikel & Panduan <span className="text-purple-400">RTP Slot Gacor</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Dapatkan wawasan mendalam mengenai algoritma Return to Player, pemahaman volatilitas, tips anti-rungkat, dan review teknis performa provider slot terkini.
          </p>
        </div>
      </div>

      {/* Featured Big Article */}
      {featuredArticle && (
        <div className="bg-[#0b1222] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl group hover:border-purple-400/60 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative aspect-video md:aspect-auto md:h-full bg-slate-950 overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-purple-600 text-white text-[11px] font-bold uppercase tracking-wider">
                FEATURED
              </div>
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                  {featuredArticle.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {featuredArticle.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
                </span>
              </div>

              <Link href={`/artikel/${featuredArticle.slug}`}>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>
              </Link>

              <p className="text-sm text-slate-300 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={`/artikel/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Semua Artikel & Edukasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <div
              key={article.id}
              className="bg-[#0b1222] border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 text-emerald-400 text-[10px] font-bold uppercase border border-slate-700">
                    {article.category}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <Link href={`/artikel/${article.slug}`}>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/artikel/${article.slug}`}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
