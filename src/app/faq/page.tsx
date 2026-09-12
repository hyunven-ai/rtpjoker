'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    q: 'Apa yang dimaksud dengan Return to Player (RTP) pada slot online?',
    a: 'RTP (Return to Player) adalah kalkulasi matematis teoretis yang mengukur persentase rata-rata dari total nilai taruhan yang dibayarkan kembali kepada para pemain dalam jangka panjang melalui jutaan simulasi putaran. Sebagai contoh, game dengan RTP 96.5% secara statistik mengembalikan Rp 96.500 dari setiap Rp 100.000 total akumulasi taruhan global.',
  },
  {
    q: 'Apakah persentase live RTP yang tinggi menjamin kemenangan?',
    a: 'Tidak. Perlu ditekankan bahwa RTP adalah indikator statistik probabilitas teoretis, bukan jaminan kepastian menang dalam sesi bermain singkat. Dalam jangka pendek, hasil putaran sangat dipengaruhi oleh tingkat volatilitas (variance) dan algoritma RNG independen.',
  },
  {
    q: 'Apa perbedaan antara status RTP Tinggi, Normal, dan Rendah?',
    a: '🟢 Tinggi (≥ 97%): Mengindikasikan bahwa server sedang dalam fase payout aktif dengan frekuensi kombinasi menang dan pengali tumble di atas rata-rata.\n🟡 Normal (95% - 96.9%): Berada pada kondisi standar pengembalian teoretis bawaan provider.\n🔴 Rendah (< 95%): Menandakan mesin sedang dalam fase jeda akumulasi atau volatilitas ketat.',
  },
  {
    q: 'Bagaimana cara membaca bocoran Jam Gacor?',
    a: 'Jam Gacor adalah interval waktu di mana traffic putaran di server regional mencapai volume tertinggi sehingga siklus distribusi jackpot dan fitur freespin berpotensi terpicu lebih sering. Jadwal jam gacor kami diperbarui secara dinamis dalam format WIB (Waktu Indonesia Barat).',
  },
  {
    q: 'Apakah website ini melayani transaksi taruhan atau deposit?',
    a: 'Sama sekali tidak. Website RTP Gacor adalah portal informasi, riset analitik, dan hiburan edukasi. Kami tidak menyediakan deposit, penarikan dana, maupun fasilitas perjudian berbayar dalam bentuk apa pun.',
  },
  {
    q: 'Mengapa pola spin seperti Manual, Quick, dan Turbo sering digunakan?',
    a: 'Pola spin digunakan oleh pemain berpengalaman untuk menguji respons gulungan dan mempercepat siklus putaran tanpa menghabiskan saldo terlalu cepat. Pola pemanasan manual membantu mendeteksi keberadaan scatter, sementara putaran cepat dan turbo membantu memicu tumble berkelanjutan.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Pertanyaan Umum Seputar RTP & Game
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Temukan jawaban atas berbagai pertanyaan seputar mekanisme statistik RTP, jam gacor, pola spin, dan disclaimer resmi kami.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_LIST.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#0b1222] border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-white hover:text-emerald-400 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 whitespace-pre-line">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Box Help */}
      <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-3">
        <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Punya Pertanyaan Lain?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Tim riset data kami selalu siap memberikan klarifikasi edukasi statistik seputar Return to Player.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
        >
          Hubungi Tim Kami
        </Link>
      </div>
    </div>
  );
}
