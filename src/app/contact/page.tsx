'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldAlert, CheckCircle2, Send, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase">
          <Mail className="w-4 h-4" />
          <span>Hubungi Tim Analisis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Kontak & Informasi Portal
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Kirimkan saran, laporan pembaruan metadata provider, atau pertanyaan seputar data statistik RTP kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Information & Disclaimer */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Saluran Informasi</h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Email Redaksi</div>
                  <div className="font-semibold text-white">redaksi@rtpgacor.info</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Jam Operasional Analisis</div>
                  <div className="font-semibold text-white">24 Jam (Sistem Algoritma Otomatis)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400">Zona Server</div>
                  <div className="font-semibold text-white">Asia / Jakarta (WIB)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-6 text-xs text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
              <ShieldAlert className="w-4 h-4" /> Kebijakan Konten
            </div>
            <p className="leading-relaxed">
              Kami tidak menerima promosi situs yang tidak terdaftar resmi atau memfasilitasi penipuan. RTP Gacor berdedikasi menjaga integritas data statistik yang transparan dan independen.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Pesan Berhasil Terkirim!</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Terima kasih atas pesan Anda. Tim analis statistik kami akan meninjau dan merespons dalam waktu 1x24 jam.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">
                Kirimkan Pesan atau Masukan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Subjek
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: Koreksi Nama Game / Saran Fitur"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Pesan Anda
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pesan lengkap atau pertanyaan Anda di sini..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-neonGlow transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
