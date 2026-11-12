import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { SiteSettings } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var __RTP_SETTINGS__: SiteSettings | undefined;
}

const defaultSettings: SiteSettings = {
  loginButton: {
    label: 'Login',
    url: 'https://example.com/login',
    target: '_blank',
    isActive: true,
  },
  registerButton: {
    label: 'Daftar',
    url: 'https://example.com/register',
    target: '_blank',
    isActive: true,
  },
};

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
  const settings = getSettings();
  return NextResponse.json(settings);
}

// POST or PUT: Update site settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = getSettings();

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

    return NextResponse.json({
      success: true,
      settings: updated,
      savedPath: saveResult.savedPath,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
