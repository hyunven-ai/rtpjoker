'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin');
      } else {
        setError('Username atau password tidak valid. Akses ditolak.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-[#060911] text-slate-200 items-center justify-center overflow-hidden font-sans relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-[#0b1222] border border-slate-800 rounded-3xl shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg mb-4">
            <div className="w-full h-full bg-[#090e1a] rounded-[14px] flex items-center justify-center">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">NEXUS <span className="text-purple-400">ENGINE</span></h1>
          <p className="text-xs text-slate-400 font-mono mt-1">SECURE ADMIN PORTAL v2.6</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs animate-in slide-in-from-top-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080c14] border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none text-white font-medium transition-all"
                placeholder="Masukkan username..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080c14] border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none text-white font-medium transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>OTORISASI AKSES</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-slate-500 font-mono">
          <p>IP Tercatat: 192.168.x.x • Otorisasi Wajib</p>
          <p className="mt-1">© 2026 Nexus RTP Engine. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
