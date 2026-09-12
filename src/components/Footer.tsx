import React from 'react';
import Link from 'next/link';
import { Flame, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { PROVIDERS } from '@/data/providers';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#05080f] text-slate-400">
      {/* Disclaimer Banner */}
      <div className="bg-amber-950/20 border-b border-amber-500/20 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 text-xs text-amber-300/90">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="leading-relaxed">
            <strong>DISCLAIMER PENTING:</strong> Website <strong>RTP Gacor</strong> adalah portal murni berbasis informasi, statistik analitik, dan hiburan edukatif. Kami <u>TIDAK</u> menyediakan fasilitas perjudian berbayar, taruhan uang asli, maupun transaksi finansial. Angka persentase Return to Player (RTP) adalah estimasi statistik teoretis dan <strong>tidak menjamin kemenangan mutlak</strong>. Harap selalu bermain secara bijak dan bertanggung jawab. (18+ Only).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-0.5 shadow-neonGlow">
                <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
                RTP GACOR
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform visualisasi data RTP slot online terpercaya dan terupdate hari ini di Indonesia. Menghadirkan bocoran pola spin gacor, grafik fluktuasi mingguan, dan katalog game provider terlengkap.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                18+
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
                BMM Testlabs Certified
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
                GLI Audited
              </span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link href="/rtp-gacor" className="hover:text-emerald-400 transition-colors">
                  Slot RTP Tinggi (Gacor)
                </Link>
              </li>
              <li>
                <Link href="/rtp-tertinggi" className="hover:text-emerald-400 transition-colors">
                  Top Ranking Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/rtp-terbaru" className="hover:text-emerald-400 transition-colors">
                  Update RTP Terbaru
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-emerald-400 transition-colors">
                  Artikel & Tips Slot
                </Link>
              </li>
            </ul>
          </div>

          {/* Providers Col */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Top Provider
            </h4>
            <ul className="space-y-2 text-sm">
              {PROVIDERS.slice(0, 6).map((provider) => (
                <li key={provider.id}>
                  <Link
                    href={`/provider/${provider.slug}`}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>{provider.logo}</span>
                    <span>{provider.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informational & Support */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Pusat Informasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="hover:text-emerald-400 transition-colors">
                  FAQ & Pertanyaan Umum
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                  Hubungi Kami & Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/artikel/apa-itu-rtp-slot-dan-cara-kerjanya" className="hover:text-emerald-400 transition-colors">
                  Cara Kerja RNG & RTP
                </Link>
              </li>
              <li>
                <Link href="/artikel/bocoran-jam-dan-pola-slot-gacor-hari-ini" className="hover:text-emerald-400 transition-colors">
                  Panduan Jam Gacor
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  ⚡ Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 RTP Gacor Portal. Semua Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Dibuat untuk analisis statistik slot dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & data real-time
          </p>
        </div>
      </div>
    </footer>
  );
}
