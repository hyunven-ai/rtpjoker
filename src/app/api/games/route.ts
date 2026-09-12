import { NextResponse } from 'next/server';
import { filterGames, FilterParams } from '@/data/games';
import { Game } from '@/types';
import fs from 'fs';
import path from 'path';

const gamesFilePath = path.join(process.cwd(), 'src', 'data', 'gamesData.json');

function readGamesData(): Game[] {
  try {
    if (fs.existsSync(gamesFilePath)) {
      const data = fs.readFileSync(gamesFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading gamesData.json:', err);
  }
  return [];
}

function writeGamesData(games: Game[]): boolean {
  try {
    fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing gamesData.json:', err);
    return false;
  }
}

// GET: Filter & list games
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const provider = searchParams.get('provider') || 'all';
  const status = (searchParams.get('status') as any) || 'all';
  const search = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sortBy') as any) || 'rtp-desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '24', 10);

  const result = filterGames({
    provider,
    status,
    search,
    sortBy,
    page,
    limit,
  });

  return NextResponse.json(result);
}

// POST: Create a new game in catalog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.providerId) {
      return NextResponse.json(
        { success: false, error: 'Nama game dan providerId wajib diisi' },
        { status: 400 }
      );
    }

    const allGames = readGamesData();
    const cleanSlug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + body.providerId;
    const cleanId = body.id || `${body.providerId}-${Date.now()}`;

    const newGame: Game = {
      id: cleanId,
      slug: cleanSlug,
      num: typeof body.num === 'number' ? body.num : allGames.length + 1,
      name: body.name,
      providerId: body.providerId,
      providerName: body.providerName || body.providerId,
      providerSlug: body.providerSlug || body.providerId,
      image: body.image || '/placeholder-game.svg',
      rtp: typeof body.rtp === 'number' ? body.rtp : 97.5,
      status: body.rtp >= 97 ? 'tinggi' : body.rtp >= 95 ? 'normal' : 'rendah',
      volatility: body.volatility || 'High',
      maxWin: body.maxWin || 'x10,000',
      jamGacor: body.jamGacor || '19:00 - 21:30 WIB',
      polaGacor: body.polaGacor || {
        manual: 10,
        turbo: 30,
        quick: 20,
        dc: 'ON',
        note: 'Pola petir gacor teruji'
      },
      rtpHistory: body.rtpHistory || [
        { day: 'Sen', rtp: body.rtp || 97.5 },
        { day: 'Sel', rtp: body.rtp || 97.5 },
        { day: 'Rab', rtp: body.rtp || 97.5 },
        { day: 'Kam', rtp: body.rtp || 97.5 },
        { day: 'Jum', rtp: body.rtp || 97.5 },
        { day: 'Sab', rtp: body.rtp || 97.5 },
        { day: 'Min', rtp: body.rtp || 97.5 },
      ],
      category: body.category || 'Video Slot',
      isTrending: body.isTrending || false,
      isPopular: body.isPopular || false,
      updatedAt: 'Baru saja ditambahkan',
      description: body.description || `${body.name} adalah game slot resmi dari ${body.providerName || body.providerId}. Menawarkan live RTP ${body.rtp || 97.5}% dan potensi maxwin ${body.maxWin || 'x10,000'}.`
    };

    allGames.unshift(newGame);
    writeGamesData(allGames);

    return NextResponse.json({ success: true, game: newGame }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing game
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Game ID wajib disertakan' },
        { status: 400 }
      );
    }

    const allGames = readGamesData();
    const index = allGames.findIndex((g) => g.id === body.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Game tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedRtp = typeof body.rtp === 'number' ? body.rtp : allGames[index].rtp;
    const updatedStatus = updatedRtp >= 97 ? 'tinggi' : updatedRtp >= 95 ? 'normal' : 'rendah';

    allGames[index] = {
      ...allGames[index],
      ...body,
      rtp: updatedRtp,
      status: updatedStatus,
      updatedAt: '1 mnt lalu (Diupdate Admin)'
    };

    writeGamesData(allGames);

    return NextResponse.json({ success: true, game: allGames[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a game from catalog
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Game ID wajib disertakan' },
        { status: 400 }
      );
    }

    let allGames = readGamesData();
    const initialCount = allGames.length;
    allGames = allGames.filter((g) => g.id !== id);

    if (allGames.length === initialCount) {
      return NextResponse.json(
        { success: false, error: 'Game tidak ditemukan' },
        { status: 404 }
      );
    }

    writeGamesData(allGames);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
