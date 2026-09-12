'use client';

import React from 'react';
import { ALL_GAMES } from '@/data/games';
import { RtpDashboard } from '@/components/RtpDashboard';

export default function HomePage() {
  return <RtpDashboard initialGames={ALL_GAMES} />;
}
