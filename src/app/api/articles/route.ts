import { NextResponse } from 'next/server';
import { ARTICLES } from '@/data/articles';

export async function GET() {
  return NextResponse.json({
    articles: ARTICLES,
    total: ARTICLES.length,
  });
}
