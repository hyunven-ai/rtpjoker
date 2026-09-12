import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const bannersFilePath = path.join(process.cwd(), 'src', 'data', 'banners.json');

function getBanners(): BannerItem[] {
  try {
    if (fs.existsSync(bannersFilePath)) {
      const data = fs.readFileSync(bannersFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading banners.json:', error);
  }
  return [];
}

function saveBanners(banners: BannerItem[]) {
  try {
    fs.writeFileSync(bannersFilePath, JSON.stringify(banners, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing banners.json:', error);
    return false;
  }
}

// GET: list all banners
export async function GET() {
  const banners = getBanners();
  return NextResponse.json(banners);
}

// POST: create new banner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const banners = getBanners();

    const newBanner: BannerItem = {
      id: body.id || `banner-${Date.now()}`,
      title: body.title || 'PROMO GACOR TERBARU',
      headline: body.headline || 'Game Pilihan Minggu Ini',
      subtitle: body.subtitle || 'Dapatkan persentase winrate tertinggi dan bocoran jam gacor teruji.',
      badge: body.badge || '🔥 REKOMENDASI',
      image: body.image || '/placeholder-game.svg',
      gameSlug: body.gameSlug || '',
      provider: body.provider || 'Pragmatic Play',
      rtp: typeof body.rtp === 'number' ? body.rtp : 98.5,
      accentColor: body.accentColor || 'from-emerald-500 via-teal-600 to-blue-700',
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order || banners.length + 1,
    };

    banners.push(newBanner);
    saveBanners(banners);

    return NextResponse.json({ success: true, banner: newBanner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: update banner
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required' }, { status: 400 });
    }

    const banners = getBanners();
    const index = banners.findIndex((b) => b.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }

    banners[index] = {
      ...banners[index],
      ...body,
    };

    saveBanners(banners);
    return NextResponse.json({ success: true, banner: banners[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: delete banner
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required' }, { status: 400 });
    }

    let banners = getBanners();
    const initialLength = banners.length;
    banners = banners.filter((b) => b.id !== id);

    if (banners.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }

    saveBanners(banners);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
