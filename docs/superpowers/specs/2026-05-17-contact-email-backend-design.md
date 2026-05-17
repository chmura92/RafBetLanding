# Spec: backend wysyłki maili z formularza kontaktowego

**Data:** 2026-05-17
**Autor:** Roman Dużynski + Claude
**Status:** Approved (verbal)

## Cel

Zastąpić Web3Forms własnym backendem wysyłki maili z formularza w `ContactForm.astro`.
Lokalnie maile mają wpadać do Mailpita; na Railway (prod) do SendGrid SMTP relay.
Recipient i dane SMTP konfigurowane przez zmienne env.

## Architektura

Astro przełączamy z czystego `output: 'static'` na *hybrid*:
- landing dalej leci 100% statycznie (prerender domyślnie włączony per route),
- jedyna route opt-in do SSR to `src/pages/api/contact.ts` z `export const prerender = false`,
- adapter: `@astrojs/node` w trybie `standalone` (Railway uruchamia `node ./dist/server/entry.mjs`).

Mailer: `nodemailer` z transportem SMTP. Jedna ścieżka kodu dla Mailpit i SendGrid, różnią się tylko zmienne env.

## Komponenty

### `src/lib/mailer.ts`
Cienki wrapper na nodemailer:
- `createMailer()` czyta env i zwraca skonfigurowany transport (cache na module-level),
- `sendContactMail(lead)` wysyła 2 maile (notyfikacja do `MAIL_TO` + opcjonalne potwierdzenie do klienta jeśli podał email).

### `src/lib/email-templates.ts`
Dwie funkcje renderujące:
- `renderLeadNotification(lead) -> { subject, html, text }` — mail do Romana z danymi leada,
- `renderClientConfirmation(lead) -> { subject, html, text }` — potwierdzenie "dziękujemy, oddzwonimy" do klienta.

Style inline (maile nie wczytują CSS z linków). Dark theme z pomarańczowym akcentem zgodny z brandem.

### `src/pages/api/contact.ts`
POST handler:
1. Honeypot check (`botcheck` field) → silent 200 jeśli wypełnione.
2. Rate-limit in-memory: 5 prób/godzinę per IP.
3. Walidacja: `name` required (1-100 chars), `phone` required (5-20 chars), `email` opcjonalnie ale jeśli podany to musi być validny, `message` opcjonalnie (max 2000 chars).
4. Wywołanie `sendContactMail()`.
5. Response JSON: `{ok: true}` lub `{ok: false, error: string}`.

### `ContactForm.astro` (zmiany)
- Usunięcie pól ukrytych Web3Forms (`access_key`, `from_name`, `subject`, `redirect`).
- Usunięcie `action` i `method` (lub override przez JS).
- Dodanie inline JS: intercept submit, `fetch('/api/contact', POST)`, render statusu (success/error) bez przeładowania strony.

### `compose.yml`
Plik docker-compose w roocie z usługą `mailpit`:
- porty `1025` (SMTP) i `8025` (web UI),
- `docker compose up -d` startuje, `http://localhost:8025` pokazuje wpadające maile.

## Zmienne środowiskowe

```
# SMTP
SMTP_HOST=smtp.sendgrid.net      # lokalnie: localhost
SMTP_PORT=587                    # lokalnie: 1025
SMTP_USER=apikey                 # lokalnie: pusty
SMTP_PASS=SG.xxx                 # lokalnie: pusty
SMTP_SECURE=false                # true tylko dla portu 465

# Adresy
MAIL_TO=biuro@rafbet.pl          # recipient leadów
MAIL_FROM=noreply@rafbet.pl      # verified sender w SendGrid
MAIL_FROM_NAME=rafbet.pl
MAIL_REPLY_TO=                   # opcjonalnie

# Site
PUBLIC_SITE_URL=https://posadzki-wylewki.opole.pl
```

Dokumentacja w `.env.example` + krótka sekcja w `CLAUDE.md`.

## Build / deploy

- `package.json` start zmienia się z `serve dist -l ...` na `node ./dist/server/entry.mjs` (port czyta z `process.env.PORT`).
- `nixpacks.toml` bez zmian (start command i tak idzie z `npm start`).
- Usunięcie `serve` z dependencies (już niepotrzebny).

## Bezpieczeństwo

- Honeypot field zostaje (był już w formie).
- Rate limit in-memory (5/h per IP) chroni przed spamem podstawowym; pełny rate limit wymaga Redisa, out of scope.
- IP/UA loggowane w treści maila notyfikacyjnego (dla manualnego flagowania).
- Brak persystencji leadów w bazie (out of scope).

## Co NIE wchodzi do scope

- DKIM/SPF setup (robi się w panelu SendGrid + DNS, instrukcja w komentarzu CLAUDE.md).
- Strona `/dziekujemy` (inline status w formie wystarczy).
- Admin/lista leadów.
- Wielokrotny retry przy failu SendGrida (single attempt; user widzi error message i może spróbować ponownie).
