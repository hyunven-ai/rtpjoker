const fs = require('fs');
const path = require('path');

const PROVIDERS_INFO = {
  pragmatic: {
    id: 'pragmatic',
    name: 'Pragmatic Play',
    slug: 'pragmatic-play',
    baseRtp: 97.5
  },
  pgsoft: {
    id: 'pgsoft',
    name: 'PG Soft',
    slug: 'pg-soft',
    baseRtp: 97.4
  },
  habanero: {
    id: 'habanero',
    name: 'Habanero',
    slug: 'habanero',
    baseRtp: 96.8
  },
  slot88: {
    id: 'slot88',
    name: 'Slot88',
    slug: 'slot88',
    baseRtp: 97.2
  },
  nolimitcity: {
    id: 'nolimitcity',
    name: 'NoLimit City',
    slug: 'nolimit-city',
    baseRtp: 96.9
  },
  joker: {
    id: 'joker',
    name: 'Joker Gaming',
    slug: 'joker-gaming',
    baseRtp: 96.7
  },
  microgaming: {
    id: 'microgaming',
    name: 'Microgaming',
    slug: 'microgaming',
    baseRtp: 96.4
  },
  playtech: {
    id: 'playtech',
    name: 'Playtech',
    slug: 'playtech',
    baseRtp: 96.2
  },
  cq9: {
    id: 'cq9',
    name: 'CQ9 Gaming',
    slug: 'cq9',
    baseRtp: 96.6
  },
  yggdrasil: {
    id: 'yggdrasil',
    name: 'Yggdrasil',
    slug: 'yggdrasil',
    baseRtp: 96.5
  }
};

const JAM_GACOR_LIST = [
  '00:30 - 02:45 WIB',
  '03:15 - 05:30 WIB',
  '08:45 - 11:15 WIB',
  '12:30 - 14:45 WIB',
  '15:20 - 17:40 WIB',
  '19:00 - 21:30 WIB',
  '22:15 - 00:30 WIB'
];

const POLA_PATTERNS = [
  { manual: 10, turbo: 30, quick: 20, dc: 'ON', note: '⚡ Pola Petir Gacor: Turbo Spin saat petir perkalian muncul' },
  { manual: 20, turbo: 50, quick: 30, dc: 'ON', note: '🔥 Pola Super Max: Naikkan taruhan bertahap tiap 20 spin' },
  { manual: 15, turbo: 20, quick: 10, dc: 'OFF', note: '🎯 Pola Stabil: Cocok untuk menguji putaran awal tanpa DC' },
  { manual: 25, turbo: 40, quick: 25, dc: 'ON', note: '👑 Pola Scatter Sensasional: Aktifkan Double Chance untuk freespins cepat' },
  { manual: 5, turbo: 70, quick: 30, dc: 'ON', note: '💥 Pola Hantam: Gunakan turbo spin berkecepatan tinggi di jam gacor' }
];

const VOLATILITIES = ['Medium', 'High', 'High', 'Extreme', 'Extreme'];
const MAX_WINS = ['x5,000', 'x10,000', 'x15,000', 'x21,100', 'x50,000', 'x100,000'];
const CATEGORIES = ['Megaways', 'Classic Video Slot', 'Cascading Reels', 'Cluster Pays', 'Jackpot Slot'];

function generateSlug(str) {
  return str
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/–|—/g, '-')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const gamesPath = path.join(__dirname, '..', 'public', 'games');
const allGames = [];
let globalIndex = 0;
const usedSlugs = new Set();

for (const [providerDir, pInfo] of Object.entries(PROVIDERS_INFO)) {
  const folder = path.join(gamesPath, providerDir);
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] || '999999');
      const numB = parseInt(b.match(/^(\d+)/)?.[1] || '999999');
      return numA - numB;
    });

  files.forEach((file) => {
    globalIndex++;
    const match = file.match(/^(\d+)\s+(.+?)\.(jpe?g|png|webp)$/i);
    let num = globalIndex;
    let name = file.replace(/\.[^.]+$/, '').trim();
    if (match) {
      num = parseInt(match[1]);
      name = match[2].trim();
    }

    let baseSlug = `${generateSlug(name)}-${pInfo.id}`;
    if (!baseSlug || baseSlug === `-${pInfo.id}`) {
      baseSlug = `game-${num}-${pInfo.id}`;
    }
    let slug = baseSlug;
    if (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${num}`;
    }
    usedSlugs.add(slug);

    const seed = globalIndex * 17 + num;
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);

    // Realistic RTP
    let rtp;
    if (num <= 10) {
      rtp = parseFloat((97.0 + r1 * 2.2).toFixed(2)); // 97.00 - 99.20% (Top games)
    } else if (r1 < 0.15) {
      rtp = parseFloat((96.5 + r2 * 2.5).toFixed(2)); // 96.50 - 99.00% (15% chance of being high)
    } else if (r1 < 0.40) {
      rtp = parseFloat((93.5 + r2 * 3.4).toFixed(2)); // 93.50 - 96.90% (25% chance of normal)
    } else if (r1 < 0.85) {
      rtp = parseFloat((75.0 + r2 * 19.9).toFixed(2)); // 75.00 - 94.90% (45% chance of low)
    } else {
      rtp = parseFloat((25.0 + r2 * 24.9).toFixed(2)); // 25.00 - 49.90% (15% chance of extremely low, < 50%)
    }
    if (rtp > 99.2) rtp = 99.18;

    const status = rtp >= 97.0 ? 'tinggi' : rtp >= 95.0 ? 'normal' : 'rendah';
    const pola = POLA_PATTERNS[Math.floor(r2 * POLA_PATTERNS.length)];
    const jam = JAM_GACOR_LIST[Math.floor(r3 * JAM_GACOR_LIST.length)];
    const vol = VOLATILITIES[Math.floor(r4 * VOLATILITIES.length)];
    const maxWin = MAX_WINS[Math.floor(pseudoRandom(seed + 4) * MAX_WINS.length)];
    const category = CATEGORIES[Math.floor(pseudoRandom(seed + 5) * CATEGORIES.length)];

    // Generate 7-day RTP history
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const rtpHistory = days.map((day, dIdx) => {
      const dayJitter = (pseudoRandom(seed + 10 + dIdx) - 0.5) * 2.6;
      const dRtp = Math.max(91.5, Math.min(99.4, parseFloat((rtp + dayJitter).toFixed(2))));
      return { day, rtp: dRtp };
    });

    const isTrending = num <= 8;
    const isPopular = num <= 20;

    const game = {
      id: `${pInfo.id}-${num}`,
      slug,
      num,
      name,
      providerId: pInfo.id,
      providerName: pInfo.name,
      providerSlug: pInfo.slug,
      image: `/games/${providerDir}/${file}`,
      rtp,
      status,
      volatility: vol,
      maxWin,
      jamGacor: jam,
      polaGacor: pola,
      rtpHistory,
      category,
      isTrending,
      isPopular,
      updatedAt: `${Math.floor(r1 * 45) + 5} menit yang lalu`,
      description: `${name} adalah salah satu judul slot unggulan dari ${pInfo.name}. Game ini menawarkan sensasi grafis memukau dengan volatilitas ${vol} dan potensi kemenangan maksimal mencapai ${maxWin} nilai taruhan. Dilengkapi fitur scatter dinamis, tumble/cascading multiplier, dan rasio live RTP sebesar ${rtp}%. Rekomendasi jam gacor adalah ${jam} dengan pola spin yang terbukti konsisten.`
    };

    allGames.push(game);
  });
}

console.log('Total indexed games:', allGames.length);

const outDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'gamesData.json'), JSON.stringify(allGames, null, 2), 'utf-8');
console.log('Saved gamesData.json successfully.');
