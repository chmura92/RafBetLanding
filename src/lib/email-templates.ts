export interface Lead {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  ip?: string;
  userAgent?: string;
  submittedAt: Date;
  siteUrl: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const BG_BASE = '#1e1e20';
const BG_DEEP = '#131316';
const BG_CARD = '#26262a';
const TEXT = '#f2f2f2';
const TEXT_2 = 'rgba(242,242,242,0.68)';
const TEXT_3 = 'rgba(242,242,242,0.42)';
const ORANGE = '#f97316';
const LINE = 'rgba(255,255,255,0.10)';
const LINE_STRONG = 'rgba(255,255,255,0.20)';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatDate = (d: Date): string =>
  new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Warsaw',
  }).format(d);

const sanitizePhoneForTel = (phone: string): string => phone.replace(/[^\d+]/g, '');

const emailShell = (innerHtml: string, preheader: string): string => `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>rafbet.pl</title>
</head>
<body style="margin:0;padding:0;background:${BG_DEEP};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${TEXT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG_DEEP};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:${BG_BASE};border:1px solid ${LINE};">
      <tr><td style="padding:28px 32px 0 32px;">
        <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${ORANGE};">
          <span style="display:inline-block;width:24px;height:1px;background:${ORANGE};vertical-align:middle;margin-right:10px;"></span>rafbet.pl
        </div>
      </td></tr>
      ${innerHtml}
      <tr><td style="padding:24px 32px 28px 32px;border-top:1px solid ${LINE};">
        <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:10px;letter-spacing:1px;color:${TEXT_3};line-height:1.6;">
          Rafbet · posadzki i wylewki · Opole<br>
          <a href="https://posadzki-wylewki.opole.pl" style="color:${TEXT_3};text-decoration:none;">posadzki-wylewki.opole.pl</a>
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

const fieldRow = (label: string, valueHtml: string): string => `
  <tr><td style="padding:14px 32px 0 32px;">
    <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${TEXT_3};margin-bottom:6px;">${escapeHtml(label)}</div>
    <div style="font-size:16px;font-weight:500;color:${TEXT};line-height:1.45;">${valueHtml}</div>
  </td></tr>`;

export function renderLeadNotification(lead: Lead): RenderedEmail {
  const subject = `Nowy lead z rafbet.pl: ${lead.name}`;
  const phoneHref = sanitizePhoneForTel(lead.phone);
  const emailHtml = lead.email
    ? `<a href="mailto:${escapeHtml(lead.email)}" style="color:${ORANGE};text-decoration:none;">${escapeHtml(lead.email)}</a>`
    : `<span style="color:${TEXT_3};font-style:italic;">nie podano</span>`;
  const messageHtml = lead.message
    ? `<div style="white-space:pre-wrap;">${escapeHtml(lead.message)}</div>`
    : `<span style="color:${TEXT_3};font-style:italic;">brak wiadomości</span>`;

  const inner = `
    <tr><td style="padding:16px 32px 8px 32px;">
      <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-1px;line-height:1.15;color:${TEXT};">
        Nowy lead.<br><span style="color:${ORANGE};">${escapeHtml(lead.name)}</span> czeka na telefon.
      </h1>
    </td></tr>
    ${fieldRow('Imię', escapeHtml(lead.name))}
    ${fieldRow('Telefon', `<a href="tel:${escapeHtml(phoneHref)}" style="color:${ORANGE};text-decoration:none;font-weight:700;font-size:20px;letter-spacing:-0.5px;">${escapeHtml(lead.phone)}</a>`)}
    ${fieldRow('Email', emailHtml)}
    ${fieldRow('Metraż i lokalizacja', messageHtml)}
    <tr><td style="padding:24px 32px 0 32px;">
      <a href="tel:${escapeHtml(phoneHref)}" style="display:inline-block;padding:14px 22px;background:${ORANGE};color:#0a0a0a;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:-0.2px;">Oddzwoń teraz →</a>
    </td></tr>
    <tr><td style="padding:20px 32px 0 32px;">
      <div style="background:${BG_CARD};border:1px solid ${LINE};padding:14px 16px;">
        <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${TEXT_3};margin-bottom:8px;">Metadane</div>
        <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:11px;color:${TEXT_2};line-height:1.7;">
          Zgłoszono: ${escapeHtml(formatDate(lead.submittedAt))}<br>
          IP: ${escapeHtml(lead.ip ?? '-')}<br>
          UA: ${escapeHtml(lead.userAgent ?? '-')}
        </div>
      </div>
    </td></tr>`;

  const text = [
    `Nowy lead z rafbet.pl`,
    `========================`,
    ``,
    `Imię: ${lead.name}`,
    `Telefon: ${lead.phone}`,
    `Email: ${lead.email ?? 'nie podano'}`,
    `Metraż i lokalizacja: ${lead.message ?? 'brak'}`,
    ``,
    `Zgłoszono: ${formatDate(lead.submittedAt)}`,
    `IP: ${lead.ip ?? '-'}`,
    `UA: ${lead.userAgent ?? '-'}`,
    ``,
    `--`,
    `Rafbet · posadzki i wylewki Opole`,
    `https://posadzki-wylewki.opole.pl`,
  ].join('\n');

  return {
    subject,
    html: emailShell(inner, `Lead: ${lead.name}, tel. ${lead.phone}`),
    text,
  };
}

export function renderClientConfirmation(lead: Lead): RenderedEmail {
  const subject = 'Dziękujemy za kontakt z rafbet.pl';

  const inner = `
    <tr><td style="padding:16px 32px 8px 32px;">
      <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-1px;line-height:1.15;color:${TEXT};">
        Dzięki, <span style="color:${ORANGE};">${escapeHtml(lead.name)}</span>.<br>Oddzwonimy do 24h.
      </h1>
    </td></tr>
    <tr><td style="padding:18px 32px 0 32px;">
      <p style="margin:0;font-size:16px;line-height:1.6;color:${TEXT_2};">
        Otrzymaliśmy Twoje zgłoszenie. Skontaktujemy się na podany numer
        <strong style="color:${TEXT};">${escapeHtml(lead.phone)}</strong>
        w ciągu maksymalnie 24 godzin roboczych (zwykle dużo szybciej).
      </p>
    </td></tr>
    <tr><td style="padding:24px 32px 0 32px;">
      <div style="background:${BG_CARD};border:1px solid ${LINE_STRONG};padding:18px 20px;">
        <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${ORANGE};margin-bottom:10px;">Potrzebujesz szybciej?</div>
        <div style="font-size:14px;color:${TEXT_2};line-height:1.55;margin-bottom:12px;">Zadzwoń bezpośrednio:</div>
        <a href="tel:505895888" style="font-size:24px;font-weight:700;color:${TEXT};text-decoration:none;letter-spacing:-0.5px;">505 895 888</a>
      </div>
    </td></tr>
    <tr><td style="padding:24px 32px 0 32px;">
      <div style="font-family:ui-monospace,SFMono-Regular,'SF Mono',Consolas,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:${TEXT_3};margin-bottom:10px;">Twoje zgłoszenie</div>
      <div style="font-size:13px;color:${TEXT_2};line-height:1.7;">
        ${lead.message ? `<em style="color:${TEXT};font-style:normal;">"${escapeHtml(lead.message)}"</em><br>` : ''}
        Zgłoszono: ${escapeHtml(formatDate(lead.submittedAt))}
      </div>
    </td></tr>`;

  const text = [
    `Dzięki, ${lead.name}. Oddzwonimy do 24h.`,
    ``,
    `Otrzymaliśmy Twoje zgłoszenie. Skontaktujemy się na numer ${lead.phone}`,
    `w ciągu maksymalnie 24 godzin roboczych (zwykle dużo szybciej).`,
    ``,
    `Potrzebujesz szybciej? Zadzwoń bezpośrednio: 505 895 888`,
    ``,
    lead.message ? `Twoja wiadomość: "${lead.message}"` : ``,
    `Zgłoszono: ${formatDate(lead.submittedAt)}`,
    ``,
    `--`,
    `Rafbet · posadzki i wylewki Opole`,
    `https://posadzki-wylewki.opole.pl`,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    subject,
    html: emailShell(inner, `Oddzwonimy do 24h pod numer ${lead.phone}`),
    text,
  };
}
