import { NextResponse } from 'next/server';
import { PROVIDERS } from '@/data/providers';

export async function GET() {
  return NextResponse.json({
    providers: PROVIDERS,
    total: PROVIDERS.length,
  });
}
