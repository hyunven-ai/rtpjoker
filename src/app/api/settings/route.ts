import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SiteSettings } from '@/types';

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

const settingsFilePath = path.join(process.cwd(), 'src', 'data', 'settings.json');

function getSettings(): SiteSettings {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
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
  } catch (error) {
    console.error('Error reading settings.json:', error);
  }
  return defaultSettings;
}

function saveSettings(settings: SiteSettings): boolean {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing settings.json:', error);
    return false;
  }
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

    const saved = saveSettings(updated);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Gagal menyimpan pengaturan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

