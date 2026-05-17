# CLAUDE.md - kontekst projektu rafbet landing

Astro 6 (hybrid SSR) - landing dla firmy posadzkarskiej w Opolu.
Deploy: Railway (nixpacks, node 22+).

## Architektura

- **Tryb**: `output: 'static'` + `@astrojs/node` (standalone). Cala strona prerenderuje sie do statyki.
- **Jedyny endpoint SSR**: `src/pages/api/contact.ts` (`export const prerender = false`).
- **Mailer**: `nodemailer` przez SMTP. Jedna sciezka kodu dla Mailpita (lokalnie) i SendGrida (prod).

Pliki ktore warto znac:
- `src/components/ContactForm.astro` - formularz, fetch do `/api/contact`, inline status (success/error).
- `src/pages/api/contact.ts` - walidacja, honeypot, rate-limit (in-memory, 5/h per IP), wywolanie mailera.
- `src/lib/mailer.ts` - cienki wrapper na nodemailer, czyta env, cache transportu na module-level.
- `src/lib/email-templates.ts` - render HTML+text dla dwoch maili: notyfikacja do Romana + potwierdzenie do klienta.
- `compose.yml` - Mailpit lokalny (SMTP 1025, web UI 8025).
- `astro.config.mjs` - adapter node standalone + sitemap.
- `nixpacks.toml` - build na Railway.
- `package.json` - `npm start` = `node ./dist/server/entry.mjs`.

## Lokalne uruchomienie

```bash
# 1. Mailpit (Docker)
docker compose up -d
# UI: http://localhost:8025

# 2. Skopiuj env
cp .env.example .env
# (domyslnie celuje w Mailpita na localhost:1025)

# 3. Dev server
npm run dev
# http://localhost:4321
```

Po wyslaniu formularza maile wpadaja do Mailpita - sprawdzic w `http://localhost:8025`.

## Zmienne srodowiskowe

Wszystkie kluczowe vars w `.env.example` z komentarzami:

| Zmienna           | Lokalnie (Mailpit) | Prod (SendGrid)               |
|-------------------|--------------------|-------------------------------|
| `SMTP_HOST`       | `localhost`        | `smtp.sendgrid.net`           |
| `SMTP_PORT`       | `1025`             | `587`                         |
| `SMTP_USER`       | pusty              | `apikey`                      |
| `SMTP_PASS`       | pusty              | `SG.xxxxx...` (SendGrid key)  |
| `SMTP_SECURE`     | `false`            | `false` (port 587)            |
| `MAIL_TO`         | `dev@rafbet.local` | skrzynka Rafala/Romana        |
| `MAIL_FROM`       | `noreply@rafbet.local` | verified sender w SendGrid|
| `MAIL_FROM_NAME`  | `rafbet.pl`        | `rafbet.pl`                   |
| `MAIL_REPLY_TO`   | pusty              | opcjonalnie                   |
| `PUBLIC_SITE_URL` | `http://localhost:4321` | `https://posadzki-wylewki.opole.pl` |

Na Railway: te same klucze w **Variables** w panelu projektu.

## SendGrid - setup ktorego nie ma w kodzie

1. Konto na sendgrid.com (free tier daje 100 mails/day, wystarczy do startu).
2. **Verified Sender** dla `MAIL_FROM`:
   - Settings > Sender Authentication > **Single Sender Verification** (szybciej, klikalne)
   - albo **Domain Authentication** przez DNS (lepsze deliverability, wymaga CNAME-ow).
3. **API Key**: Settings > API Keys > Create > **Restricted Access** > Mail Send tylko. Skopiowac `SG.xxx` do `SMTP_PASS`.
4. (Opcjonalnie) DKIM + SPF jesli domain auth - SendGrid wystawia CNAME, dodac do DNS.

## Convention

- Brak em-dashow (`—`) w copy. Sygnatura AI generation - Roman nie chce.
- Polski jezyk w copy; angielski w nazwach plikow/komponentow/kodzie.
- Brand: dark theme + pomarancz (`#f97316`). Tokeny w `src/styles/tokens.css`.

## Useful commands

```bash
npm run dev         # dev server (z mailerem dziala tylko jak Mailpit chodzi)
npm run build       # buduje statyke + server adapter do dist/
npm start           # uruchamia zbudowany server (Railway tak startuje)
docker compose up -d   # Mailpit
docker compose down    # stop Mailpit
```
