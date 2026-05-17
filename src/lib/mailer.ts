import nodemailer, { type Transporter } from 'nodemailer';
import {
  renderClientConfirmation,
  renderLeadNotification,
  type Lead,
  type RenderedEmail,
} from './email-templates.ts';

interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  from: string;
  fromName: string;
  replyTo?: string;
  to: string;
}

let cachedTransporter: Transporter | null = null;
let cachedConfig: MailConfig | null = null;

function readEnv(key: string): string | undefined {
  // import.meta.env is populated by Vite in dev + at build time;
  // process.env is populated by Railway (and any `node --env-file` invocation).
  const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
  if (fromVite !== undefined && fromVite !== '') return fromVite;
  const fromNode = process.env[key];
  if (fromNode !== undefined && fromNode !== '') return fromNode;
  return undefined;
}

function readConfig(): MailConfig {
  const host = readEnv('SMTP_HOST');
  const portStr = readEnv('SMTP_PORT');
  const from = readEnv('MAIL_FROM');
  const to = readEnv('MAIL_TO');

  if (!host) throw new Error('SMTP_HOST is not set');
  if (!portStr) throw new Error('SMTP_PORT is not set');
  if (!from) throw new Error('MAIL_FROM is not set');
  if (!to) throw new Error('MAIL_TO is not set');

  const port = Number.parseInt(portStr, 10);
  if (Number.isNaN(port)) throw new Error(`SMTP_PORT is not a number: ${portStr}`);

  const user = readEnv('SMTP_USER') ?? '';
  const pass = readEnv('SMTP_PASS') ?? '';

  return {
    host,
    port,
    secure: readEnv('SMTP_SECURE') === 'true',
    auth: user && pass ? { user, pass } : undefined,
    from,
    fromName: readEnv('MAIL_FROM_NAME') ?? 'rafbet.pl',
    replyTo: readEnv('MAIL_REPLY_TO'),
    to,
  };
}

function getTransporter(): { transporter: Transporter; config: MailConfig } {
  if (cachedTransporter && cachedConfig) {
    return { transporter: cachedTransporter, config: cachedConfig };
  }
  const config = readConfig();
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
  cachedConfig = config;
  return { transporter: cachedTransporter, config };
}

const formatFrom = (config: MailConfig): string => `"${config.fromName}" <${config.from}>`;

async function sendOne(email: RenderedEmail, to: string, replyTo?: string): Promise<void> {
  const { transporter, config } = getTransporter();
  await transporter.sendMail({
    from: formatFrom(config),
    to,
    replyTo: replyTo ?? config.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}

export async function sendContactMail(lead: Lead): Promise<void> {
  const { config } = getTransporter();
  const notification = renderLeadNotification(lead);
  await sendOne(notification, config.to, lead.email);

  if (lead.email) {
    const confirmation = renderClientConfirmation(lead);
    await sendOne(confirmation, lead.email);
  }
}
