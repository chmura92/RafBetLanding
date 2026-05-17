import type { APIRoute } from 'astro';
import { sendContactMail } from '../../lib/mailer.ts';
import type { Lead } from '../../lib/email-templates.ts';

export const prerender = false;

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

function getClientIp(request: Request, clientAddress: string | undefined): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return clientAddress ?? 'unknown';
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseAndValidate(form: FormData): { ok: true; lead: Omit<Lead, 'ip' | 'userAgent' | 'submittedAt' | 'siteUrl'> } | { ok: false; error: string } {
  const name = String(form.get('name') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();

  if (name.length < 1 || name.length > 100) return { ok: false, error: 'Podaj imię (1-100 znaków).' };
  if (phone.length < 5 || phone.length > 20) return { ok: false, error: 'Podaj poprawny numer telefonu.' };
  if (email && !EMAIL_RE.test(email)) return { ok: false, error: 'Email ma niepoprawny format.' };
  if (email.length > 200) return { ok: false, error: 'Email zbyt długi.' };
  if (message.length > 2000) return { ok: false, error: 'Wiadomość zbyt długa (max 2000 znaków).' };

  return {
    ok: true,
    lead: {
      name,
      phone,
      email: email || undefined,
      message: message || undefined,
    },
  };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse(400, { ok: false, error: 'Nieprawidłowe dane formularza.' });
  }

  if (String(form.get('botcheck') ?? '').length > 0) {
    return jsonResponse(200, { ok: true });
  }

  const ip = getClientIp(request, clientAddress);
  if (!checkRateLimit(ip)) {
    return jsonResponse(429, {
      ok: false,
      error: 'Za dużo zgłoszeń z tego adresu. Spróbuj ponownie za godzinę lub zadzwoń bezpośrednio.',
    });
  }

  const parsed = parseAndValidate(form);
  if (!parsed.ok) return jsonResponse(400, parsed);

  try {
    await sendContactMail({
      ...parsed.lead,
      ip,
      userAgent: request.headers.get('user-agent') ?? undefined,
      submittedAt: new Date(),
      siteUrl: import.meta.env.PUBLIC_SITE_URL ?? 'https://posadzki-wylewki.opole.pl',
    });
  } catch (err) {
    console.error('[api/contact] sendContactMail failed:', err);
    return jsonResponse(500, {
      ok: false,
      error: 'Nie udało się wysłać wiadomości. Zadzwoń bezpośrednio: 505 895 888.',
    });
  }

  return jsonResponse(200, { ok: true });
};
