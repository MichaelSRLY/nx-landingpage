'use server';

import { Pool } from 'pg';
import { headers } from 'next/headers';

declare global {
  // eslint-disable-next-line no-var
  var _nexoraAdsPool: Pool | undefined;
}

const pool =
  globalThis._nexoraAdsPool ??
  new Pool({ connectionString: process.env.NEXORA_ADS_DATABASE_URL });

if (process.env.NODE_ENV !== 'production') globalThis._nexoraAdsPool = pool;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupState = { ok?: true; error?: string };

export async function signup(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL_RX.test(email)) {
    return { error: 'Bitte gültige E-Mail-Adresse eingeben.' };
  }

  const h = await headers();
  const ua = h.get('user-agent') ?? null;
  const ref = h.get('referer') ?? null;

  try {
    await pool.query(
      `INSERT INTO email_signups (email, source, user_agent, referrer)
       VALUES ($1, 'foerderrechner-anticipation', $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [email, ua, ref],
    );
  } catch {
    return { error: 'Speichern fehlgeschlagen — bitte später erneut versuchen.' };
  }

  return { ok: true };
}
