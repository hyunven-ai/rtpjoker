import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

export const metadata: Metadata = {
  title: 'RTP Gacor Hari Ini — Bocoran Live RTP Slot & Pola Spin Terupdate',
  description: 'Portal live update RTP slot online tertinggi dan terakurat hari ini di Indonesia. Cek bocoran jam gacor, pola spin turbo, dan persentase winrate Pragmatic Play, PG Soft, Slot88, Habanero, dan NoLimit City.',
  keywords: [
    'RTP Gacor',
    'RTP Slot Hari Ini',
    'Bocoran Slot Gacor',
    'Pola Slot Pragmatic',
    'Jam Gacor PG Soft',
    'Live RTP Slot88',
    'Return to Player',
    'RTP Tertinggi'
  ],
  authors: [{ name: 'RTP Gacor Analytics' }],
  openGraph: {
    title: 'RTP Gacor Hari Ini — Bocoran Live RTP Slot & Pola Spin Terupdate',
    description: 'Bocoran persentase live RTP slot online tertinggi, jam gacor hari ini, dan pola spin dari 10 provider game terpercaya.',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080c14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
