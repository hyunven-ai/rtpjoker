'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuickSearchModal } from './QuickSearchModal';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in /admin, provide dedicated full-screen layout without public header, marquee, or footer
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-purple-500 selection:text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
      <Header onOpenSearch={() => setSearchOpen(true)} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <Footer />

      {/* Global Quick Search Modal */}
      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
