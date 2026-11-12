import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { SiteSettings } from '@/types';
import initialSettings from '@/data/settings.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

declare global {
  // eslint-disable-next-line no-var
  var __RTP_SETTINGS__: SiteSettings | undefined;
}

const defaultSettings: SiteSettings = {
  loginButton: {
    label: initialSettings?.loginButton?.label || 'Login',
    url: initialSettings?.loginButton?.url || 'https://tinyurl.com/ac1300-login',
    target: (initialSettings?.loginButton?.target as '_blank' | '_self') || '_blank',
    isActive: initialSettings?.loginButton?.isActive ?? true,
  },
  registerButton: {
    label: initialSettings?.registerButton?.label || 'Daftar',
    url: initialSettings?.registerButton?.url || 'https://tinyurl.com/ac1300-daftar',
    target: (initialSettings?.registerButton?.target as '_blank' | '_self') || '_blank',
    isActive: initialSettings?.registerButton?.isActive ?? true,
  },
};

const KV_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  'https://rested-gopher-198862.upstash.io';

const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  'gQAAAAAAAwjOAAIgcDJmZjcxNGIxY2QxODQ0NmE4YWU5MDFhYzkwYTlmYzk4NA';

async function getKvSettings(): Promise<SiteSettings | null> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || KV_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_READ_ONLY_TOKEN ||
    KV_TOKEN;

  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/site_settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Upstash GET returned HTTP ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (data?.result) {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      if (parsed && typeof parsed === 'object') {
        return {
          loginButton: {
            ...defaultSettings.loginButton,
            ...(parsed.loginButton || {}),
          },
          registerButton: {
            ...defaultSettings.registerButton,
            ...(parsed.registerButton || {}),
          },
        };
      }
    }
  } catch (err) {
    console.warn('Failed to read settings from Upstash KV:', err);
  }
  return null;
}

async function saveKvSettings(settings: SiteSettings): Promise<boolean> {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || KV_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || KV_TOKEN;

  if (!url || !token) return false;

  try {
    const dataToStore = JSON.stringify(settings);
    // Upstash Redis REST Command format: POST to base URL with body ["SET", key, value]
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'site_settings', dataToStore]),
    });

    if (!res.ok) {
      console.warn(`Upstash SET returned HTTP ${res.status}`);
      return false;
    }

    const data = await res.json();
    return data?.result === 'OK';
  } catch (err) {
    console.warn('Failed to save settings to Upstash KV:', err);
    return false;
  }
}

function getCandidatePaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'src', 'data', 'settings.json'),
    path.join(cwd, 'data', 'settings.json'),
    path.join(cwd, 'settings.json'),
    path.join(os.tmpdir(), 'rtp_site_settings.json'),
  ];
}

function getSettings(): SiteSettings {
  // 1. Check in-memory global cache first
  if (globalThis.__RTP_SETTINGS__) {
    return globalThis.__RTP_SETTINGS__;
  }

  // 2. Try candidate file paths on disk
  const candidatePaths = getCandidatePaths();
  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const merged: SiteSettings = {
            loginButton: {
              ...defaultSettings.loginButton,
              ...(parsed.loginButton || {}),
            },
            registerButton: {
              ...defaultSettings.registerButton,
              ...(parsed.registerButton || {}),
            },
          };
          globalThis.__RTP_SETTINGS__ = merged;
          return merged;
        }
      }
    } catch {
      // Continue to next path
    }
  }

  globalThis.__RTP_SETTINGS__ = defaultSettings;
  return defaultSettings;
}

function saveSettings(settings: SiteSettings): { success: boolean; savedPath?: string; error?: string } {
  // Always update global memory cache so server runtime stays immediately in sync
  globalThis.__RTP_SETTINGS__ = settings;

  const candidatePaths = getCandidatePaths();
  let lastError: any = null;
  let savedPath: string | undefined = undefined;

  for (const filePath of candidatePaths) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
      savedPath = filePath;
      break; // Successfully saved to primary or fallback file
    } catch (err: any) {
      lastError = err;
      console.warn(`Could not write settings to ${filePath}:`, err?.message || err);
      // Continue to next fallback path (e.g. os.tmpdir())
    }
  }

  return {
    success: true,
    savedPath,
    error: lastError ? String(lastError?.message || lastError) : undefined,
  };
}

// GET: Retrieve current site settings
export async function GET() {
  const kvSettings = await getKvSettings();
  if (kvSettings) {
    globalThis.__RTP_SETTINGS__ = kvSettings;
    return NextResponse.json(kvSettings);
  }
  const settings = getSettings();
  return NextResponse.json(settings);
}

// POST or PUT: Update site settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = (await getKvSettings()) || getSettings();

    const updated: SiteSettings = {
      loginButton: {
        label: body.loginButton?.label ?? current.loginButton.label,
        url: body.loginButton?.url ?? current.loginButton.url,
        target: body.loginButton?.target === '_self' ? '_self' : '_blank',
        isActive: body.loginButton?.isActive !== undefined ? Boolean(body.loginButton.isActive) : current.loginButton.isActive,
      },
      registerButton: {
        label: body.registerButton?.label ?? current.registerButton.label,
        url: body.registerButton?.url ?? current.registerButton.url,
        target: body.registerButton?.target === '_self' ? '_self' : '_blank',
        isActive: body.registerButton?.isActive !== undefined ? Boolean(body.registerButton.isActive) : current.registerButton.isActive,
      },
    };

    const saveResult = saveSettings(updated);
    const kvSaved = await saveKvSettings(updated);

    return NextResponse.json({
      success: true,
      settings: updated,
      savedPath: saveResult.savedPath,
      kvSaved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
