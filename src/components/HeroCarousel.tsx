'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Zap, Sparkles, Flame, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import initialBanners from '@/data/banners.json';
import { Game } from '@/types';

export interface BannerItem {
  id: string;
  title: string;
  headline: string;
  subtitle: string;
  badge: string;
  image: string;
  gameSlug: string;
  provider: string;
  rtp: number;
  accentColor?: string;
  isActive: boolean;
  order: number;
}

interface HeroCarouselProps {
  onOpenPola?: (gameSlug: string) => void;
  allGames?: Game[];
}

export function HeroCarousel({ onOpenPola, allGames = [] }: HeroCarouselProps) {
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners.filter(b => b.isActive));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-play interval: 5.5 seconds
  const slideDuration = 5500;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (banners.length || 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % (banners.length || 1));
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    timerRef.current = setTimeout(() => {
      nextSlide();
    }, slideDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, banners.length, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const currentBanner = banners[currentIndex] || initialBanners[0];

  const handlePolaClick = (e: React.MouseEvent, gameSlug: string) => {
    e.preventDefault();
    if (onOpenPola) {
      onOpenPola(gameSlug);
    }
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-slate-800/90 shadow-2xl bg-[#080d1a]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-[#0a1020] to-slate-950 opacity-90" />
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${
          currentBanner.accentColor || 'from-emerald-500 to-cyan-500'
        } transition-all duration-1000`}
      />
      <div
        className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25 bg-gradient-to-tr ${
          currentBanner.accentColor || 'from-purple-600 to-indigo-600'
        } transition-all duration-1000`}
      />

      {/* Slide Container */}
      <div className="relative min-h-[380px] sm:min-h-[420px] md:min-h-[440px] flex items-center p-6 sm:p-10 md:p-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left animate-in fade-in slide-in-from-left-4 duration-500 key={currentIndex}">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-slate-900/90 border border-slate-700 text-emerald-400 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                {currentBanner.badge}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/15 border border-purple-500/30 text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentBanner.provider}
              </span>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>RTP {currentBanner.rtp}%</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                {currentBanner.title}
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {currentBanner.headline}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {currentBanner.subtitle}
            </p>

            {/* Live Meter Bar */}
            <div className="pt-1 max-w-md">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Hit-Rate Win Server:
                </span>
                <span className="font-bold text-emerald-400">{currentBanner.rtp}% GACOR</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-900/90 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                  style={{ width: `${Math.min(100, Math.max(0, (currentBanner.rtp - 80) * 5))}%` }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={(e) => handlePolaClick(e, currentBanner.gameSlug)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-neonGlow transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Bocoran Pola Gacor</span>
              </button>

              <Link
                href={`/game/${currentBanner.gameSlug}`}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2"
              >
                <span>Detail & Grafik</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual 3D Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-4 duration-500 key={`img-${currentIndex}`}">
            <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
              {/* Backlight Aura */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-tr ${
                  currentBanner.accentColor || 'from-emerald-500 to-purple-600'
                } blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 scale-95`}
              />

              {/* Showcase Card Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 group-hover:border-emerald-500/60 shadow-2xl bg-slate-950 transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                <div className="relative aspect-square w-full">
                  <img
                    src={currentBanner.image}
                    alt={currentBanner.headline}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-game.svg';
                    }}
                  />
                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-black shadow-lg backdrop-blur-md">
                    #{currentIndex + 1} TOP TRENDING
                  </div>

                  {/* Bottom Info on Image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-left">
                    <div className="text-[11px] text-slate-400 uppercase font-bold">{currentBanner.provider}</div>
                    <div className="text-sm font-black text-white truncate">{currentBanner.headline}</div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-mono font-black">RTP: {currentBanner.rtp}%</span>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">STATUS TINGGI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-emerald-500 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95"
        aria-label="Slide Sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-slate-900/80 hover:bg-emerald-500 border border-slate-700 hover:border-emerald-400 text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all duration-300 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95"
        aria-label="Slide Berikutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Pagination Dots & Auto-play Timer Bar */}
      <div className="absolute bottom-3.5 left-0 right-0 z-20 flex flex-col items-center gap-2">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {banners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Smooth auto-progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden">
        <div
          key={`progress-${currentIndex}-${isPaused}`}
          className={`h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 ${
            isPaused ? 'w-0' : 'animate-[carouselProgress_5.5s_linear_infinite]'
          }`}
          style={{ animationDuration: `${slideDuration}ms` }}
        />
      </div>
    </div>
  );
}
