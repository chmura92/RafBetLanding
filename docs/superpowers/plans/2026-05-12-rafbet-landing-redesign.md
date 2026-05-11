# Rafbet Landing Redesign — Plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować nowoczesny, mobile-first landing dla firmy Rafbet (posadzki maszynowe Opole) jako statyczną aplikację Astro, zastępujący ciężki landing z 2016. Wszystkie elementy wizualne potwierdzone w brainstorming Visual Companion.

**Architecture:** Astro static site, zero-JS domyślnie, lazy-loading bibliotek (Leaflet) przez Intersection Observer, Web3Forms jako backend formularza. Obrazy zoptymalizowane przez wbudowany komponent `<Image>` (AVIF/WebP, responsive srcset). CSS variables jako design tokens.

**Tech Stack:** Astro 5+, Inter Variable (Google Fonts), JetBrains Mono, Leaflet 1.9.4 + CartoDB Dark tiles, Web3Forms API, deploy: Railway (Nixpacks + `serve dist` na `$PORT`).

**Spec:** `docs/superpowers/specs/2026-05-12-rafbet-landing-redesign-design.md`

**Mockupy referencyjne:** Visual Companion w `.superpowers/brainstorm/2011-1778497720/content/` (zatwierdzone: `hero-v10.html`, `section-services-v2.html`, `section-process-v1.html`, `section-gallery-v3.html`, `section-reviews-v2.html`, `section-faq-v1.html`, `section-cta-contact-v1.html`, `section-map-footer-v1.html`).

---

## File Structure

```
.
├── astro.config.mjs                                 (Task 1)
├── package.json                                     (Task 1)
├── tsconfig.json                                    (Task 1)
├── .env.example                                     (Task 22)
├── public/
│   ├── favicon.svg                                  (Task 21)
│   ├── og-image.jpg                                 (Task 21)
│   └── robots.txt                                   (Task 19)
├── src/
│   ├── pages/
│   │   ├── index.astro                              (Task 18)
│   │   └── privacy.astro                            (Task 20)
│   ├── layouts/
│   │   └── BaseLayout.astro                         (Task 4)
│   ├── components/
│   │   ├── ConcreteTexture.astro                    (Task 5)
│   │   ├── SectionHeader.astro                      (Task 6)
│   │   ├── Nav.astro                                (Task 7)
│   │   ├── MetaBar.astro                            (Task 7)
│   │   ├── Hero.astro                               (Task 8)
│   │   ├── Services.astro                           (Task 9)
│   │   ├── Process.astro                            (Task 10)
│   │   ├── Gallery.astro                            (Task 11)
│   │   ├── Lightbox.astro                           (Task 11)
│   │   ├── Reviews.astro                            (Task 12)
│   │   ├── FAQ.astro                                (Task 13)
│   │   ├── ContactForm.astro                        (Task 14)
│   │   ├── MapSection.astro                         (Task 15)
│   │   └── Footer.astro                             (Task 16)
│   ├── styles/
│   │   ├── tokens.css                               (Task 3)
│   │   ├── base.css                                 (Task 3)
│   │   └── animations.css                           (Task 3)
│   └── data/
│       ├── services.ts                              (Task 9)
│       ├── process.ts                               (Task 10)
│       ├── gallery.ts                               (Task 11)
│       ├── reviews.ts                               (Task 12)
│       └── faq.ts                                   (Task 13)
└── src/assets/
    └── images/
        ├── gallery-01.jpg ... gallery-14.jpg         (Task 2)
        ├── bg-services.jpg                          (Task 2)
        └── bg-process.jpg                           (Task 2)
```

---

## Faza 1: Setup

### Task 1: Inicjalizacja projektu Astro

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore` (uzupełnić istniejący)

- [ ] **Step 1: Inicjalizacja Astro w pustym katalogu**

```bash
cd C:/Code/Repositories/RafBetLanding
npm create astro@latest -- --template minimal --typescript strict --no-install --skip-houston --yes .
```

Expected: Astro tworzy `src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Instalacja zależności**

```bash
npm install
npm install -D sharp
npm install leaflet serve
npm install -D @types/leaflet
```

Expected: `node_modules/` utworzone, `package-lock.json` zapisany. `serve` jako runtime dependency dla Railway (Nixpacks build).

- [ ] **Step 3: Konfiguracja astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://posadzki-wylewki.opole.pl',
  output: 'static',
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
```

- [ ] **Step 4: Uzupełnić .gitignore o pliki Astro i dodać Railway config**

Dodać do istniejącego `.gitignore`:
```
.astro/
```

Dodać `package.json` script dla Railway (do uruchomienia po build):

Edit `package.json`, w `"scripts"` dodać:
```json
"start": "serve dist -l ${PORT:-4321} --no-clipboard --single"
```

Stworzyć `nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

- [ ] **Step 5: Verify dev server**

Run: `npm run dev`
Expected: Server listens on `http://localhost:4321/`, brak błędów.

Zatrzymać dev server (Ctrl+C).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ public/ .gitignore
git commit -m "feat: inicjalizacja projektu Astro 5 z TypeScript"
```

---

### Task 2: Optymalizacja i przeniesienie zdjęć z OldApp

**Files:**
- Create: `src/assets/images/gallery-01.jpg` ... `gallery-14.jpg`
- Create: `src/assets/images/bg-services.jpg`
- Create: `src/assets/images/bg-process.jpg`

- [ ] **Step 1: Stworzyć katalog assets i skrypt kopiujący**

```bash
mkdir -p src/assets/images
```

- [ ] **Step 2: Skopiować 14 zdjęć galerii (mapping zgodny ze specem)**

```bash
cp OldApp/assets/images/c918ca06533c2c42deba575fabe24e4f-1228x816-64.jpg src/assets/images/gallery-01.jpg
cp OldApp/assets/images/38157bbeac6bb9946cfdd9524ba272a4-1074x693-59.jpg src/assets/images/gallery-02.jpg
cp OldApp/assets/images/c9f527fdcfee50c82aba9c44a3d82a60-1228x816-68.jpg src/assets/images/gallery-03.jpg
cp OldApp/assets/images/ef3c8a7d229720db6b69e32a728f3d80-1210x654-71.jpg src/assets/images/gallery-04.jpg
cp OldApp/assets/images/e0e12a64816a7a4aa5217021522ed091-1621x1078-26.jpg src/assets/images/gallery-05.jpg
cp OldApp/assets/images/p6210020-4608x3456-2-2000x1500-55.jpg src/assets/images/gallery-06.jpg
cp OldApp/assets/images/dcf312a6ee32b4417e3351ad68b1aaab-1280x850-32.jpg src/assets/images/gallery-07.jpg
cp OldApp/assets/images/p6230047-4608x3456-92-2000x1500-20.jpg src/assets/images/gallery-08.jpg
cp OldApp/assets/images/7ec518bac6d91bc37c87825509d1949d-1228x816-20.jpg src/assets/images/gallery-09.jpg
cp OldApp/assets/images/61fd8fbc7ecff8d27e4d28ee8e5ba2fd-1228x816-92.jpg src/assets/images/gallery-10.jpg
cp OldApp/assets/images/3aebef85e9fc45b8c894e0bd7b8fbd65-1280x850-21.jpg src/assets/images/gallery-11.jpg
cp OldApp/assets/images/231b2d1b50c60a97a7afe4c8d4a71e5d-1280x850-5.jpg src/assets/images/gallery-12.jpg
cp OldApp/assets/images/p2090014-4608x3456-6-2000x1500-95.jpg src/assets/images/gallery-13.jpg
cp OldApp/assets/images/glowna1-1187x816-29.jpg src/assets/images/gallery-14.jpg
```

- [ ] **Step 3: Skopiować tła sekcji**

```bash
cp OldApp/assets/images/29186a0c75e55e92fda7af18d13a43e4-1228x775-92.jpg src/assets/images/bg-services.jpg
cp OldApp/assets/images/p6220033-4608x3456-27.jpg src/assets/images/bg-process.jpg
```

- [ ] **Step 4: Verify wszystkie 16 plików istnieją i mają sensowny rozmiar**

Run: `ls -la src/assets/images/ | tail -20`
Expected: 16 plików jpg, każdy >50KB, max ~5MB (jeszcze oryginalne, Astro zoptymalizuje przy build).

- [ ] **Step 5: Commit**

```bash
git add src/assets/images/
git commit -m "feat: dodać 14 zdjęć galerii i 2 tła sekcji z OldApp"
```

---

### Task 3: Design tokens i base styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/animations.css`

- [ ] **Step 1: Stworzyć src/styles/tokens.css**

```css
:root {
  /* Concrete palette */
  --bg-base: #1e1e20;
  --bg-deep: #131316;

  --line: rgba(255,255,255,0.10);
  --line-strong: rgba(255,255,255,0.20);

  --text: #f2f2f2;
  --text-2: rgba(242,242,242,0.68);
  --text-3: rgba(242,242,242,0.42);

  --cream: #e8e2d3;
  --orange: #f97316;
  --orange-light: #fb923c;
  --orange-dark: #ea580c;
  --amber: #fbbf24;
  --green: #22c55e;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;

  /* Sizing */
  --max-width: 1280px;
  --section-padding-y: 64px;
  --section-padding-x: 22px;
}
```

- [ ] **Step 2: Stworzyć src/styles/base.css**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg-base);
  color: var(--text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  line-height: 1.5;
}

a { color: inherit; text-decoration: none; }
button { background: none; border: none; color: inherit; cursor: pointer; font-family: inherit; }
img { max-width: 100%; height: auto; display: block; }

:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Stworzyć src/styles/animations.css**

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-ring {
  0% { transform: scale(0.7); opacity: 0.5; }
  100% { transform: scale(2.4); opacity: 0; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50%      { transform: translateY(3px); opacity: 1; }
}

@keyframes pin-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(249,115,22,0.30), 0 0 0 10px rgba(249,115,22,0.12); }
  50%      { box-shadow: 0 0 0 6px rgba(249,115,22,0.40), 0 0 0 16px rgba(249,115,22,0.10); }
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: design tokens, base styles i wspólne animacje"
```

---

## Faza 2: Layout i komponenty bazowe

### Task 4: BaseLayout.astro

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Stworzyć src/layouts/BaseLayout.astro**

```astro
---
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/animations.css';

export interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'Posadzki maszynowe Opole · Rafbet · Wylewki cementowe od 2013',
  description = 'Wylewki maszynowe mixokretem dla domów i hal na Opolszczyźnie. 22 lata doświadczenia Rafała, 5.0/5 na Oferteo. Bezpłatna wycena w 24h.',
  ogImage = '/og-image.jpg',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site).toString();
---

<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="generator" content={Astro.generator} />

  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site).toString()} />
  <meta property="og:locale" content="pl_PL" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 2: Dodać alias `@` w tsconfig.json**

Edit `tsconfig.json` - dodać do `compilerOptions`:
```json
{
  "compilerOptions": {
    "extends": "astro/tsconfigs/strict",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ tsconfig.json
git commit -m "feat: BaseLayout z preconnect do Google Fonts i meta tagami"
```

---

### Task 5: ConcreteTexture.astro

**Files:**
- Create: `src/components/ConcreteTexture.astro`

- [ ] **Step 1: Stworzyć src/components/ConcreteTexture.astro**

```astro
---
export interface Props {
  withCracks?: boolean;
}
const { withCracks = false } = Astro.props;
---

<div class="tex-grain"></div>
<div class="tex-aggregate"></div>
<div class="tex-trowel"></div>
{withCracks && <div class="tex-cracks"></div>}
<div class="tex-highlight"></div>
<div class="tex-vignette"></div>

<style>
  div { position: absolute; inset: 0; pointer-events: none; }

  .tex-grain {
    z-index: 1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.6;
    mix-blend-mode: overlay;
  }

  .tex-aggregate {
    z-index: 2;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
    opacity: 0.4;
    mix-blend-mode: soft-light;
  }

  .tex-trowel {
    z-index: 3;
    background:
      repeating-linear-gradient(118deg, transparent 0, transparent 90px, rgba(255,255,255,0.025) 90px, rgba(255,255,255,0.025) 92px, transparent 92px, transparent 220px),
      repeating-linear-gradient(62deg, transparent 0, transparent 130px, rgba(0,0,0,0.07) 130px, rgba(0,0,0,0.07) 132px, transparent 132px, transparent 310px);
    opacity: 0.7;
  }

  .tex-highlight {
    z-index: 4;
    background:
      radial-gradient(ellipse 380px 500px at 55% 45%, rgba(255,235,200,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 700px 300px at 70% -5%, rgba(255,255,255,0.04) 0%, transparent 55%);
  }

  .tex-vignette {
    z-index: 5;
    background:
      radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%),
      linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.3) 100%);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConcreteTexture.astro
git commit -m "feat: ConcreteTexture - 5-warstwowy efekt tła betonu"
```

---

### Task 6: SectionHeader.astro

**Files:**
- Create: `src/components/SectionHeader.astro`

- [ ] **Step 1: Stworzyć src/components/SectionHeader.astro**

```astro
---
export interface Props {
  num: string;     // "02"
  meta: string;    // "Co robimy"
  title: string;   // "Dwie skale."
  titleAccent: string;  // "Jedna robota."
  subtitle?: string;
}
const { num, meta, title, titleAccent, subtitle } = Astro.props;
---

<div class="header">
  <div class="num">
    <span class="num-pill">{num}</span>
    <span class="num-line"></span>
    <span class="num-meta">{meta}</span>
  </div>
  <h2 class="title">
    {title}<br />
    <span class="accent">{titleAccent}</span>
  </h2>
  {subtitle && <p class="subtitle">{subtitle}</p>}
</div>

<style>
  .header { padding: 0 var(--section-padding-x); margin-bottom: 36px; }

  .num {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 22px;
    opacity: 0;
    animation: fade-up 0.6s ease-out 0.1s forwards;
  }
  .num-pill {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--orange);
    letter-spacing: 1px;
  }
  .num-line { flex: 1; height: 1px; background: var(--line); }
  .num-meta {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .title {
    font-family: var(--font-sans);
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -2.2px;
    line-height: 0.95;
    color: var(--text);
    margin-bottom: 14px;
    opacity: 0;
    animation: fade-up 0.6s ease-out 0.2s forwards;
  }
  .accent { color: var(--orange); }

  .subtitle {
    font-size: 15px;
    line-height: 1.55;
    color: var(--text-2);
    max-width: 330px;
    opacity: 0;
    animation: fade-up 0.6s ease-out 0.3s forwards;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SectionHeader.astro
git commit -m "feat: SectionHeader z numeracją, tytułem i accent"
```

---

## Faza 3: Sekcje (nav, hero)

### Task 7: Nav.astro + MetaBar.astro

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/MetaBar.astro`

- [ ] **Step 1: Stworzyć src/components/Nav.astro**

Zawartość patrz mockup `hero-v10.html` linie z `.nav` (skopiować markup `<nav>` i style). Kluczowe elementy:
- Wordmark `<span class="raf">RAF</span><span class="bet">BET</span><span class="dot">.</span>`
- Live badge z pulse-ring (zielona kropka)
- Position sticky top:0, backdrop-blur, hairline border-bottom

```astro
---
---
<nav class="nav">
  <a class="brand" href="/">
    <span class="wordmark">
      <span class="raf">RAF</span><span class="bet">BET</span><span class="dot">.</span>
    </span>
  </a>
  <div class="live-badge" aria-label="Dostępni dziś">
    <span class="live-dot"></span>
    <span>DOSTĘPNI DZIŚ</span>
  </div>
</nav>

<style>
  .nav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px;
    background: rgba(20,20,22,0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
  }
  .brand { display: flex; align-items: center; }
  .wordmark {
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -1.5px;
    line-height: 1;
  }
  .raf { color: var(--cream); }
  .bet { color: var(--orange); }
  .dot { color: var(--orange); font-size: 22px; margin-left: 1px; }

  .live-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 10px;
    border: 1px solid var(--line-strong);
    background: rgba(0,0,0,0.3);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.5px;
    color: var(--text-2);
  }
  .live-dot {
    position: relative;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
  }
  .live-dot::after {
    content: ''; position: absolute; inset: -3px; border-radius: 50%;
    background: var(--green); opacity: 0.35;
    animation: pulse-ring 1.8s ease-out infinite;
  }
</style>
```

- [ ] **Step 2: Stworzyć src/components/MetaBar.astro**

```astro
---
const items = [
  { label: 'Lokalizacja', val: 'Opole, PL' },
  { label: 'Działamy od', val: '2013' },
  { label: 'Mixokret', val: 'Brinkmann' },
];
---
<div class="meta-bar">
  {items.map(({ label, val }) => (
    <div>
      <span class="label">{label}</span>
      <span class="val">{val}</span>
    </div>
  ))}
</div>

<style>
  .meta-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 1px solid var(--line);
    background: rgba(0,0,0,0.22);
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .meta-bar > div {
    padding: 10px 14px;
    border-right: 1px solid var(--line);
  }
  .meta-bar > div:last-child { border-right: none; }
  .label { color: var(--text-3); display: block; margin-bottom: 2px; }
  .val { color: var(--text); font-weight: 500; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro src/components/MetaBar.astro
git commit -m "feat: Nav z dual-color wordmark i live badge + MetaBar"
```

---

### Task 8: Hero.astro

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Stworzyć src/components/Hero.astro**

Skopiować strukturę z mockupu `hero-v10.html` (sekcja `.hero` po MetaBar) ze stylami. Kluczowe elementy:
- Eyebrow "Posadzki maszynowe" (mono 10px, letter-spacing 2px)
- H1 trzy linie z `<span class="line">` (animacja fade-up sekwencyjna delay 0.2/0.36/0.52)
- Accent na ostatniej linii (kolor orange)
- Lead text "Robimy jedną rzecz..."
- Primary CTA `<button>` "Bezpłatna wycena →" z anchor `#kontakt`
- Phone link `<a href="tel:505895888">` "Wolisz zadzwonić? 505 895 888"
- Stats grid 3 kolumny z border-top/bottom

```astro
---
const stats = [
  { label: 'Doświadczenie', value: '22', unit: 'lata' },
  { label: 'Realizacje', value: '500', unit: '+' },
  { label: 'Dziennie', value: '300', unit: 'm²', prefix: 'do' },
];
---
<section class="hero" id="hero">
  <div class="eyebrow">Posadzki maszynowe</div>

  <h1 class="headline">
    <span class="line">Idealnie</span>
    <span class="line">gładka</span>
    <span class="line"><span class="accent">posadzka.</span></span>
  </h1>

  <p class="lead">
    Robimy jedną rzecz i robimy ją dobrze. <strong>Mixokret, jeden dzień, do 300&nbsp;m²</strong> gładko jak tafla. Gotowe pod parkiet, panele i płytki.
  </p>

  <a class="btn-primary" href="#kontakt">
    <span>Bezpłatna wycena</span>
    <span class="arrow">→</span>
  </a>

  <a class="phone-link" href="tel:505895888">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    <span class="hint">Wolisz zadzwonić?</span>
    <span class="num">505 895 888</span>
  </a>
</section>

<div class="stats">
  {stats.map(s => (
    <div class="stat">
      <div class="stat-label">{s.label}</div>
      <div class="stat-value">
        {s.prefix && <span class="prefix">{s.prefix}</span>}{s.value}<span class="unit">{s.unit}</span>
      </div>
    </div>
  ))}
</div>

<style>
  .hero { padding: 56px 22px 32px; }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 28px;
    opacity: 0;
    animation: fade-up 0.6s ease-out 0.1s forwards;
  }
  .headline {
    font-family: var(--font-sans);
    font-size: 68px;
    font-weight: 800;
    letter-spacing: -3.5px;
    line-height: 0.9;
    color: var(--text);
    margin-bottom: 26px;
  }
  .line { display: block; opacity: 0; transform: translateY(20px); animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
  .line:nth-child(1) { animation-delay: 0.2s; }
  .line:nth-child(2) { animation-delay: 0.32s; }
  .line:nth-child(3) { animation-delay: 0.44s; }
  .accent { color: var(--orange); }
  .lead {
    font-size: 16px; line-height: 1.55; color: var(--text-2);
    max-width: 330px; margin-bottom: 36px; font-weight: 400;
    opacity: 0; animation: fade-up 0.7s ease-out 0.6s forwards;
  }
  .lead strong { color: var(--text); font-weight: 600; }

  .btn-primary {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; padding: 17px 22px;
    background: var(--orange);
    color: #0a0a0a;
    border: 1px solid var(--orange);
    font-size: 15px; font-weight: 700; letter-spacing: -0.2px;
    text-decoration: none;
    transition: background 0.18s, transform 0.18s;
    margin-bottom: 22px;
    opacity: 0; animation: fade-up 0.7s ease-out 0.8s forwards;
  }
  .btn-primary:hover { background: var(--orange-light); transform: translateY(-1px); }
  .btn-primary .arrow { font-family: var(--font-mono); font-size: 17px; transition: transform 0.18s; }
  .btn-primary:hover .arrow { transform: translateX(3px); }

  .phone-link {
    display: flex; align-items: center; justify-content: center;
    gap: 12px;
    margin-bottom: 44px;
    color: var(--text);
    opacity: 0; animation: fade-up 0.7s ease-out 1.0s forwards;
  }
  .phone-link svg { color: var(--orange); flex-shrink: 0; }
  .phone-link .hint { font-size: 14px; color: var(--text-3); font-weight: 400; }
  .phone-link .num {
    font-family: var(--font-sans);
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
    border-bottom: 1px solid var(--orange);
    padding-bottom: 1px;
  }

  .stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: rgba(0,0,0,0.22);
    opacity: 0; animation: fade-up 0.7s ease-out 1.1s forwards;
  }
  .stat { padding: 20px 14px; border-right: 1px solid var(--line); }
  .stat:last-child { border-right: none; }
  .stat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 1.5px; color: var(--text-3); text-transform: uppercase; margin-bottom: 8px; }
  .stat-value { font-size: 28px; font-weight: 700; letter-spacing: -1.5px; color: var(--text); line-height: 1; }
  .stat-value .prefix { font-size: 14px; color: var(--text-3); margin-right: 4px; font-weight: 400; }
  .stat-value .unit { font-size: 12px; color: var(--text-3); margin-left: 3px; font-weight: 400; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: Hero z animacją text reveal, primary CTA i stats grid"
```

---

## Faza 4: Sekcje treściowe

### Task 9: Services.astro + data/services.ts

**Files:**
- Create: `src/data/services.ts`
- Create: `src/components/Services.astro`

- [ ] **Step 1: Stworzyć src/data/services.ts**

```ts
export interface Service {
  num: string;
  title: string;
  metric: string;
  desc: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const services: Service[] = [
  {
    num: '01',
    title: 'Posadzki w domu<br>jednorodzinnym',
    metric: 'do 200 m²\n1 dzień pracy',
    desc: 'Wylewamy całość parteru lub piętra w jeden dzień. Mixokret zostaje na ulicy, w środku tylko czysty wąż. Po 2 tygodniach możesz układać parkiet.',
    tags: ['Hydroizolacja', 'Termoizolacja (styropian)', 'Ogrzewanie podłogowe', 'Dylatacje', 'Wylewka półsucha', 'Zatarcie mechaniczne'],
    ctaLabel: 'Zobacz realizacje domów',
    ctaHref: '#realizacje',
  },
  {
    num: '02',
    title: 'Hale przemysłowe<br>i magazyny',
    metric: '500+ m²\netapowo',
    desc: 'Duże powierzchnie wymagają większego zespołu i kilku mixokretów na zmianę. Robimy hale przemysłowe i magazyny na Opolszczyźnie i dalej.',
    tags: ['Zbrojenie siatką', 'Włókna polipropylenowe', 'Plastyfikatory', 'Poziomy laserowe', 'Dylatacje technologiczne', 'Zatarcie maszynowe'],
    ctaLabel: 'Zapytaj o wycenę hali',
    ctaHref: '#kontakt',
  },
];
```

- [ ] **Step 2: Stworzyć src/components/Services.astro**

Skopiować markup i style z mockupu `section-services-v2.html` używając danych z `services.ts`. Iteracja przez `services.map`. Każdy service renderowany jako `<article class="service">`.

```astro
---
import SectionHeader from './SectionHeader.astro';
import { services } from '@/data/services';
---

<section class="section" id="oferta">
  <SectionHeader
    num="02"
    meta="Co robimy"
    title="Dwie skale."
    titleAccent="Jedna robota."
    subtitle="Wylewki maszynowe dla domów jednorodzinnych i dla hal. To wszystko, czym się zajmujemy. Bez kompromisów."
  />
  <div class="services-list">
    {services.map((s, idx) => (
      <article class="service" style={`animation-delay: ${0.4 + idx * 0.1}s`}>
        <header class="service-header">
          <span class="service-num">{s.num}</span>
          <h3 class="service-title" set:html={s.title}></h3>
          <span class="service-meta">{s.metric}</span>
        </header>
        <p class="service-desc">{s.desc}</p>
        <div class="service-includes">
          <div class="service-includes-label">W zakresie:</div>
          <div class="service-tags">
            {s.tags.map(t => <span class="service-tag">{t}</span>)}
          </div>
        </div>
        <a class="service-cta" href={s.ctaHref}>
          <span>{s.ctaLabel}</span>
          <span class="arrow">→</span>
        </a>
      </article>
    ))}
  </div>
</section>

<style>
  /* Skopiowane z section-services-v2.html, dostosowane do CSS variables */
  .section { padding: 64px 0 48px; position: relative; }
  .services-list {
    display: flex; flex-direction: column;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .service {
    padding: 28px 22px;
    border-bottom: 1px solid var(--line);
    background: rgba(0,0,0,0.18);
    opacity: 0; transform: translateY(20px);
    animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
    transition: background 0.2s;
  }
  .service:last-child { border-bottom: none; }
  .service:hover { background: rgba(0,0,0,0.32); }
  .service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; gap: 16px; }
  .service-num { font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--orange); letter-spacing: 1px; padding-top: 6px; min-width: 28px; }
  .service-title { font-size: 22px; font-weight: 700; letter-spacing: -0.8px; color: var(--text); line-height: 1.1; flex: 1; }
  .service-meta { font-family: var(--font-mono); font-size: 9.5px; color: var(--text-3); letter-spacing: 1.2px; text-transform: uppercase; padding-top: 8px; text-align: right; white-space: pre-line; }
  .service-desc { font-size: 14px; line-height: 1.55; color: var(--text-2); margin-bottom: 18px; padding-left: 44px; }
  .service-includes { padding-left: 44px; margin-bottom: 18px; }
  .service-includes-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 1.5px; color: var(--text-3); text-transform: uppercase; margin-bottom: 10px; }
  .service-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .service-tag { font-family: var(--font-sans); font-size: 12px; color: var(--text-2); background: rgba(255,255,255,0.04); padding: 5px 10px; border: 1px solid var(--line); line-height: 1.2; }
  .service-cta {
    padding-left: 44px;
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-sans);
    font-size: 12px; font-weight: 600;
    color: var(--orange);
    letter-spacing: 1px; text-transform: uppercase;
    transition: gap 0.18s;
  }
  .service-cta:hover { gap: 14px; }
  .service-cta .arrow { font-family: var(--font-mono); font-size: 14px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/data/services.ts src/components/Services.astro
git commit -m "feat: sekcja Co robimy (2 karty Dom + Hala) z danymi w services.ts"
```

---

### Task 10: Process.astro + data/process.ts

**Files:**
- Create: `src/data/process.ts`
- Create: `src/components/Process.astro`

- [ ] **Step 1: Stworzyć src/data/process.ts**

```ts
export interface ProcessStep {
  num: string;
  meta: string;
  duration: string;
  title: string;
  desc: string;
  details: { label: string; value: string }[];
  active?: boolean;
}

export const processSteps: ProcessStep[] = [
  {
    num: '01',
    meta: 'Krok pierwszy',
    duration: '5 minut',
    title: 'Zadzwoń lub napisz',
    desc: 'Zostaw numer w formularzu albo zadzwoń bezpośrednio. Mówisz co budujesz, gdzie, ile metrów. My słuchamy i zadajemy konkretne pytania.',
    details: [
      { label: 'Koszt', value: '0 zł' },
      { label: 'Czas', value: '5 minut' },
    ],
  },
  {
    num: '02',
    meta: 'Krok drugi',
    duration: 'w 24h',
    title: 'Otrzymujesz wycenę',
    desc: 'W ciągu doby dostajesz wycenę z rozpisaną ceną za m² i terminem. Bez zobowiązań. Decydujesz w swoim tempie, porównujesz, pytasz dalej.',
    details: [
      { label: 'Koszt', value: '0 zł' },
      { label: 'Czas', value: 'do 24h' },
      { label: 'Zobowiązanie', value: 'brak' },
    ],
  },
  {
    num: '03',
    meta: 'Krok trzeci',
    duration: '1 dzień (dom)',
    title: 'Wylewamy posadzkę',
    desc: 'Mixokret zostaje na ulicy, w środku tylko czysty wąż i 4-osobowa ekipa. Najpierw hydroizolacja, termoizolacja, dylatacje. Potem wylewka półsucha i od razu zatarcie maszynowe.',
    details: [
      { label: 'Sprzęt', value: 'Mixokret Brinkmann' },
      { label: 'Ekipa', value: '4-6 osób' },
      { label: 'Czas', value: '1 dzień / dom' },
    ],
  },
  {
    num: '04',
    meta: 'Krok czwarty',
    duration: 'po 2 tygodniach',
    title: 'Gotowe pod podłogę',
    desc: 'Po 2 tygodniach schnięcia posadzka jest gotowa pod parkiet, panele lub płytki. Zostawiamy plac czysty, ty układasz wykończenie albo zlecasz dalej.',
    details: [
      { label: 'Suszenie', value: '~2 tygodnie' },
      { label: 'Gotowe pod', value: 'Parkiet, panele, płytki' },
    ],
    active: true,
  },
];
```

- [ ] **Step 2: Stworzyć src/components/Process.astro**

Skopiować markup i CSS z mockupu `section-process-v1.html`. Iterować przez `processSteps`. Zmienić ścieżki tła na `bg-process.jpg` ze specyfikacji.

```astro
---
import SectionHeader from './SectionHeader.astro';
import { processSteps } from '@/data/process';
---

<section class="section" id="proces">
  <SectionHeader
    num="03"
    meta="Jak pracujemy"
    title="Cztery kroki"
    titleAccent="do gotowej posadzki."
    subtitle="Bez ukrytych kosztów, bez ciśnienia. Od pierwszego telefonu do gotowej tafli wiesz dokładnie co się dzieje."
  />
  <div class="process">
    {processSteps.map((s, idx) => (
      <div class="step" style={`animation-delay: ${0.4 + idx * 0.1}s`}>
        <div class={`step-num ${s.active ? 'active' : ''}`}>{s.num}</div>
        <div class="step-meta">
          <span>{s.meta}</span>
          <span class="meta-dot">·</span>
          <span>{s.duration}</span>
        </div>
        <h3 class="step-title">{s.title}</h3>
        <p class="step-desc">{s.desc}</p>
        <div class="step-detail">
          {s.details.map(d => (
            <div class="step-detail-item">
              <span class="step-detail-label">{d.label}</span>
              <span class="step-detail-value">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
  <div class="process-cta">
    <div class="process-cta-text">
      Wszystko zaczyna się <strong>od telefonu</strong>.<br>
      Reszta jest na nas.
    </div>
    <a class="process-cta-btn" href="#kontakt">
      <span>Krok 01</span>
      <span class="arrow">→</span>
    </a>
  </div>
</section>

<style>
  /* Skopiowane z section-process-v1.html, używając CSS vars */
  .section { padding: 64px 0 56px; position: relative; }
  .process { padding: 0 22px; position: relative; }
  .step {
    position: relative;
    padding: 0 0 32px 56px;
    opacity: 0; transform: translateY(20px);
    animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .step:last-child { padding-bottom: 0; }
  .step::before {
    content: ''; position: absolute;
    left: 17px; top: 38px; bottom: -8px;
    width: 1px;
    background: linear-gradient(180deg, var(--line-strong) 0%, var(--line) 80%, transparent 100%);
  }
  .step:last-child::before { display: none; }
  .step-num {
    position: absolute; left: 0; top: 4px;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg-base);
    border: 1px solid var(--line-strong);
    font-family: var(--font-mono);
    font-size: 12px; font-weight: 600;
    color: var(--orange);
    z-index: 2;
  }
  .step-num.active { background: var(--orange); color: #0a0a0a; border-color: var(--orange); }
  .step-meta { display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 1.2px; color: var(--text-3); text-transform: uppercase; margin-bottom: 8px; }
  .step-meta .meta-dot { color: var(--orange); }
  .step-title { font-family: var(--font-sans); font-size: 24px; font-weight: 700; letter-spacing: -1px; color: var(--text); line-height: 1.05; margin-bottom: 10px; }
  .step-desc { font-size: 14px; line-height: 1.55; color: var(--text-2); margin-bottom: 14px; }
  .step-desc strong { color: var(--text); font-weight: 600; }
  .step-detail {
    display: flex; flex-wrap: wrap; gap: 16px;
    padding: 12px 14px;
    background: rgba(0,0,0,0.25);
    border: 1px solid var(--line);
    border-left: 2px solid var(--orange);
  }
  .step-detail-item { display: flex; flex-direction: column; gap: 2px; }
  .step-detail-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 1.2px; color: var(--text-3); text-transform: uppercase; }
  .step-detail-value { font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--text); }

  .process-cta {
    margin: 12px 22px 0;
    padding: 24px 22px;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: rgba(0,0,0,0.25);
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
  }
  .process-cta-text { font-size: 14px; color: var(--text-2); line-height: 1.4; }
  .process-cta-text strong { color: var(--text); font-weight: 600; }
  .process-cta-btn {
    flex-shrink: 0;
    padding: 12px 18px;
    background: var(--orange);
    color: #0a0a0a;
    border: 1px solid var(--orange);
    font-family: var(--font-sans);
    font-size: 13px; font-weight: 700; letter-spacing: -0.1px;
    display: flex; align-items: center; gap: 8px;
    transition: background 0.18s, transform 0.18s;
  }
  .process-cta-btn:hover { background: var(--orange-light); transform: translateY(-1px); }
  .process-cta-btn .arrow { font-family: var(--font-mono); font-size: 14px; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/data/process.ts src/components/Process.astro
git commit -m "feat: sekcja Jak pracujemy (4 kroki z details box)"
```

---

### Task 11: Gallery.astro + Lightbox.astro + data/gallery.ts

**Files:**
- Create: `src/data/gallery.ts`
- Create: `src/components/Gallery.astro`
- Create: `src/components/Lightbox.astro`

- [ ] **Step 1: Stworzyć src/data/gallery.ts**

```ts
import gallery01 from '@/assets/images/gallery-01.jpg';
import gallery02 from '@/assets/images/gallery-02.jpg';
import gallery03 from '@/assets/images/gallery-03.jpg';
import gallery04 from '@/assets/images/gallery-04.jpg';
import gallery05 from '@/assets/images/gallery-05.jpg';
import gallery06 from '@/assets/images/gallery-06.jpg';
import gallery07 from '@/assets/images/gallery-07.jpg';
import gallery08 from '@/assets/images/gallery-08.jpg';
import gallery09 from '@/assets/images/gallery-09.jpg';
import gallery10 from '@/assets/images/gallery-10.jpg';
import gallery11 from '@/assets/images/gallery-11.jpg';
import gallery12 from '@/assets/images/gallery-12.jpg';
import gallery13 from '@/assets/images/gallery-13.jpg';
import gallery14 from '@/assets/images/gallery-14.jpg';

export interface GalleryItem {
  src: ImageMetadata;
  caption: string;
  category: string;
  visible: boolean;
}

export const galleryItems: GalleryItem[] = [
  { src: gallery01, caption: 'Zatarta tafla, refleks słońca', category: 'Dom', visible: true },
  { src: gallery02, caption: 'Zatarcie helikopterem', category: 'Proces', visible: true },
  { src: gallery03, caption: 'Mixokret Brinkmann w akcji', category: 'Sprzęt', visible: true },
  { src: gallery04, caption: 'Poziomica na świeżej wylewce', category: 'Detal', visible: true },
  { src: gallery05, caption: 'Gotowa pod parkiet', category: 'Dom', visible: true },
  { src: gallery06, caption: 'Poziomy laserowe', category: 'Proces', visible: true },
  { src: gallery07, caption: 'Posadzka cementowa', category: 'Dom', visible: false },
  { src: gallery08, caption: 'Wylewka na ogrzewaniu podłogowym', category: 'Proces', visible: false },
  { src: gallery09, caption: 'Dom drewniany, świeża wylewka', category: 'Dom', visible: false },
  { src: gallery10, caption: 'Zatarcie maszynowe', category: 'Proces', visible: false },
  { src: gallery11, caption: 'Hala przed wylewką', category: 'Hala', visible: false },
  { src: gallery12, caption: 'Hydroizolacja folią', category: 'Proces', visible: false },
  { src: gallery13, caption: 'Wyrównanie terenu pod podbudowę', category: 'Przygotowanie', visible: false },
  { src: gallery14, caption: 'Dom drewniany, Opolszczyzna', category: 'Dom', visible: false },
];
```

- [ ] **Step 2: Stworzyć src/components/Gallery.astro**

```astro
---
import { Image } from 'astro:assets';
import SectionHeader from './SectionHeader.astro';
import { galleryItems } from '@/data/gallery';
---

<section class="section" id="realizacje">
  <SectionHeader
    num="04"
    meta="Realizacje"
    title="Twoja podłoga"
    titleAccent="zaczyna się tutaj."
    subtitle="Domy, hale i kawałek rzemiosła w tle. Wszystko prawdziwe, wszystko nasze."
  />

  <div class="gallery" id="gallery">
    {galleryItems.map((item, i) => (
      <button
        class={`photo ${!item.visible ? 'hidden' : ''}`}
        data-i={i}
        type="button"
        aria-label={`Powiększ: ${item.caption}`}
      >
        <Image
          src={item.src}
          alt={item.caption}
          widths={[300, 600]}
          sizes="(max-width: 390px) 50vw, 300px"
          loading={i < 6 ? 'eager' : 'lazy'}
        />
        <div class="photo-overlay">
          <span class="photo-num">{String(i + 1).padStart(2, '0')} / 14</span>
          <div class="photo-info">
            <div class="photo-caption">{item.caption}</div>
            <div class="photo-meta">{item.category}</div>
          </div>
        </div>
      </button>
    ))}
  </div>

  <div class="show-more-wrap">
    <button class="show-more" id="showMore" type="button">
      <span>Pokaż więcej realizacji</span>
      <span class="show-more-right">
        <span class="count">+8 zdjęć</span>
        <span class="arrow">↓</span>
      </span>
    </button>
  </div>
</section>

<style>
  /* Style z section-gallery-v3.html zastosowane do CSS vars */
  .section { padding: 64px 0 56px; position: relative; }
  .gallery {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--line);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .photo {
    position: relative; background: #0a0a0a; overflow: hidden;
    cursor: zoom-in; aspect-ratio: 1 / 1;
    padding: 0; border: none;
    opacity: 0; animation: fade-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  .photo:nth-child(3), .photo:nth-child(4),
  .photo:nth-child(7), .photo:nth-child(8),
  .photo:nth-child(11), .photo:nth-child(12) { aspect-ratio: 1 / 1.25; }
  .photo.hidden { display: none; }
  .photo.revealed { display: block; animation: reveal 0.5s ease-out forwards; }
  .photo :global(img) {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.4s ease, filter 0.3s ease;
    filter: saturate(0.85) brightness(0.92);
  }
  .photo:hover :global(img) { transform: scale(1.04); filter: saturate(1) brightness(1); }
  .photo-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.82) 100%);
    padding: 10px 12px 12px;
    display: flex; flex-direction: column; justify-content: space-between;
    pointer-events: none;
    text-align: left;
  }
  .photo-num { font-family: var(--font-mono); font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.9); letter-spacing: 1px; }
  .photo-info { display: flex; flex-direction: column; gap: 3px; }
  .photo-caption { font-family: var(--font-sans); font-size: 12px; font-weight: 600; color: #fff; letter-spacing: -0.2px; line-height: 1.2; }
  .photo-meta { font-family: var(--font-mono); font-size: 9.5px; color: var(--orange); letter-spacing: 1px; text-transform: uppercase; }

  .show-more-wrap { padding: 20px 22px 0; }
  .show-more {
    width: 100%;
    padding: 16px 22px;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--line-strong);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 14px; font-weight: 600;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.18s, border-color 0.18s;
  }
  .show-more:hover { background: rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.32); }
  .show-more-right { display: flex; align-items: center; gap: 10px; }
  .show-more .count { font-family: var(--font-mono); font-size: 11px; color: var(--orange); letter-spacing: 1px; }
  .show-more .arrow { font-family: var(--font-mono); font-size: 16px; color: var(--orange); transition: transform 0.3s; }
  .show-more.expanded .arrow { transform: rotate(180deg); }
</style>

<script>
  const btn = document.getElementById('showMore');
  btn?.addEventListener('click', () => {
    const hidden = document.querySelectorAll<HTMLElement>('.photo.hidden');
    hidden.forEach((el, i) => {
      el.classList.remove('hidden');
      el.classList.add('revealed');
      el.style.animationDelay = `${i * 0.05}s`;
    });
    btn.querySelector<HTMLSpanElement>('span:first-child')!.textContent = 'Pokazano wszystkie';
    btn.querySelector<HTMLElement>('.count')!.textContent = '14 / 14';
    btn.classList.add('expanded');
    (btn as HTMLButtonElement).disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'default';
  });

  // Open lightbox on photo click — handled in Lightbox.astro via custom event
  document.querySelectorAll<HTMLElement>('.photo').forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.i!);
      document.dispatchEvent(new CustomEvent('open-lightbox', { detail: { index: i } }));
    });
  });
</script>
```

- [ ] **Step 3: Stworzyć src/components/Lightbox.astro**

```astro
---
import { galleryItems } from '@/data/gallery';
---

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="lightbox-counter" id="lightboxCounter">01 / 14</div>
  <button class="lightbox-close" id="lightboxClose" aria-label="Zamknij">×</button>
  <img class="lightbox-img" id="lightboxImg" src="" alt="" />
  <div class="lightbox-info">
    <div class="lightbox-caption" id="lightboxCaption"></div>
    <div class="lightbox-meta" id="lightboxMeta"></div>
  </div>
  <div class="lightbox-nav">
    <button class="lightbox-btn" id="lightboxPrev" aria-label="Poprzednie">←</button>
    <button class="lightbox-btn" id="lightboxNext" aria-label="Następne">→</button>
  </div>
</div>

<script>
  import { galleryItems } from '@/data/gallery';

  // We need URLs to images — Astro generates them at build time.
  // The simplest: re-import here and get .src property.
  const photos = galleryItems.map(item => ({
    src: item.src.src,
    caption: item.caption,
    meta: item.category,
  }));
  const TOTAL = photos.length;
  let currentIndex = 0;

  const lightbox = document.getElementById('lightbox')!;
  const img = document.getElementById('lightboxImg') as HTMLImageElement;
  const caption = document.getElementById('lightboxCaption')!;
  const meta = document.getElementById('lightboxMeta')!;
  const counter = document.getElementById('lightboxCounter')!;

  function update() {
    const p = photos[currentIndex];
    img.src = p.src;
    img.alt = p.caption;
    caption.textContent = p.caption;
    meta.textContent = p.meta;
    counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;
  }
  function open(i: number) {
    currentIndex = i;
    update();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  const next = () => { currentIndex = (currentIndex + 1) % TOTAL; update(); };
  const prev = () => { currentIndex = (currentIndex - 1 + TOTAL) % TOTAL; update(); };

  document.addEventListener('open-lightbox', (e: any) => open(e.detail.index));
  document.getElementById('lightboxClose')!.addEventListener('click', close);
  document.getElementById('lightboxNext')!.addEventListener('click', next);
  document.getElementById('lightboxPrev')!.addEventListener('click', prev);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
</script>

<style>
  .lightbox {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.96);
    z-index: 100;
    display: none;
    align-items: center; justify-content: center;
    padding: 60px 16px;
    flex-direction: column;
    gap: 20px;
  }
  .lightbox.active { display: flex; animation: fade-up 0.3s ease-out; }
  .lightbox-img { max-width: 100%; max-height: calc(100vh - 200px); object-fit: contain; border: 1px solid rgba(255,255,255,0.1); }
  .lightbox-info { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
  .lightbox-caption { font-size: 16px; font-weight: 600; color: #fff; letter-spacing: -0.3px; }
  .lightbox-meta { font-family: var(--font-mono); font-size: 11px; color: var(--orange); letter-spacing: 1.5px; text-transform: uppercase; }
  .lightbox-counter { position: fixed; top: 20px; left: 20px; font-family: var(--font-mono); font-size: 12px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
  .lightbox-close {
    position: fixed; top: 16px; right: 16px;
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; font-family: var(--font-mono); font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s;
  }
  .lightbox-close:hover { background: rgba(255,255,255,0.15); }
  .lightbox-nav {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 10px;
  }
  .lightbox-btn {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; font-family: var(--font-mono); font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s;
  }
  .lightbox-btn:hover { background: rgba(255,255,255,0.15); }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/data/gallery.ts src/components/Gallery.astro src/components/Lightbox.astro
git commit -m "feat: galeria 14 zdjęć z show more + lightbox z klawiaturą"
```

---

### Task 12: Reviews.astro + data/reviews.ts

**Files:**
- Create: `src/data/reviews.ts`
- Create: `src/components/Reviews.astro`

- [ ] **Step 1: Stworzyć src/data/reviews.ts**

```ts
export const reviewsAggregate = {
  google: { rating: 4.4, count: 14, url: 'https://www.google.com/maps/place/RafBet/@50.721085,17.7721754,12z/data=!3m1!4b1!4m6!3m5!1s0x47104c99d1d2af27:0xa4551354b1a8b37a!8m2!3d50.721085!4d17.7721754!16s%2Fg%2F1ptyg4956' },
  oferteo: { rating: 5.0, count: 2, url: 'https://www.oferteo.pl/rafbet/firma/5854574' },
};

export interface Review {
  source: 'GOOGLE' | 'OFERTEO';
  stars: 5;
  date: string;
  quote: string;
  authorName: string;
  authorMeta: string;
  initials: string;
}

export const reviews: Review[] = [
  {
    source: 'OFERTEO',
    stars: 5,
    date: '06.2023',
    quote: 'Jestem pełen uznania za wykonanie wylewki w moim domu. Organizacja pracy jak i fachowość wykonania na najwyższym poziomie. Gorąco polecam firmę i usługi Pana Rafała. Firma rzetelna, solidna i dokładna.',
    authorName: 'Bartłomiej S.',
    authorMeta: 'Klient indywidualny',
    initials: 'BS',
  },
  {
    source: 'GOOGLE',
    stars: 5,
    date: '2024',
    quote: 'Bardzo zadowolony z pracy Pana Rafała. Spełniła moje oczekiwania, bardzo czysta robota, szybko i równo. Wylewka w garażu zrobiona perfekcyjnie, dobry kontakt z klientem, praca zgodna z umową, na czas. Cena uczciwa, polecam firmę RafBet.',
    authorName: 'Tomasz Czerwiński',
    authorMeta: 'Wylewka w garażu',
    initials: 'TC',
  },
  {
    source: 'GOOGLE',
    stars: 5,
    date: '2022',
    quote: 'Mile zaskoczony wykonaniem tej trudnej roboty, bo łatwa nie była. Praca spełniła moje oczekiwania. Polecam RAFBET każdemu zainteresowanemu. Profesjonalni, dokładni, szybcy i niezawodni.',
    authorName: 'Dariusz Różycki',
    authorMeta: 'Trudna realizacja',
    initials: 'DR',
  },
];
```

- [ ] **Step 2: Stworzyć src/components/Reviews.astro**

Skopiować markup z mockupu `section-reviews-v2.html`, iterować przez `reviews`. Użyć `reviewsAggregate` dla pasków oceny. Wszystkie linki w CTA z `target="_blank" rel="noopener"`.

```astro
---
import SectionHeader from './SectionHeader.astro';
import { reviews, reviewsAggregate } from '@/data/reviews';

const totalCount = reviewsAggregate.google.count + reviewsAggregate.oferteo.count;
const avgRating = ((reviewsAggregate.google.rating * reviewsAggregate.google.count +
  reviewsAggregate.oferteo.rating * reviewsAggregate.oferteo.count) / totalCount).toFixed(1);
---

<section class="section" id="opinie">
  <SectionHeader
    num="05"
    meta="Opinie"
    title="Tak nas widzą"
    titleAccent="klienci."
    subtitle={`${totalCount} opinii w sieci, średnia ${avgRating} z 5. Każdą można sprawdzić u źródła.`}
  />

  <div class="rating-sources">
    <div class="rating-source">
      <div class="rating-source-top">
        <span class="rating-source-name">Google Maps</span>
        <span class="rating-stars">★★★★½</span>
      </div>
      <div class="rating-num-line">
        <span class="rating-num">{reviewsAggregate.google.rating}</span>
        <span class="rating-num-max">/ 5</span>
      </div>
      <span class="rating-count">{reviewsAggregate.google.count} opinii</span>
    </div>
    <div class="rating-source">
      <div class="rating-source-top">
        <span class="rating-source-name">Oferteo</span>
        <span class="rating-stars">★★★★★</span>
      </div>
      <div class="rating-num-line">
        <span class="rating-num">{reviewsAggregate.oferteo.rating.toFixed(1)}</span>
        <span class="rating-num-max">/ 5</span>
      </div>
      <span class="rating-count">{reviewsAggregate.oferteo.count} opinie + Sprawdzona Firma</span>
    </div>
  </div>

  <div class="reviews-list">
    {reviews.map((r, i) => (
      <article class="review" style={`animation-delay: ${0.55 + i * 0.1}s`}>
        <header class="review-header">
          <div class="review-stars-row">
            <span class="review-stars">{'★'.repeat(r.stars)}</span>
            <span class="review-source-tag">{r.source}</span>
          </div>
          <span class="review-date">{r.date}</span>
        </header>
        <p class="review-quote">{r.quote}</p>
        <div class="review-author">
          <div class="review-avatar">{r.initials}</div>
          <div>
            <div class="review-author-name">{r.authorName}</div>
            <div class="review-author-meta">{r.authorMeta}</div>
          </div>
        </div>
      </article>
    ))}
  </div>

  <div class="reviews-cta-wrap">
    <a class="reviews-cta-btn" href={reviewsAggregate.google.url} target="_blank" rel="noopener">
      <span class="reviews-cta-left">
        <span class="reviews-cta-source">Google</span>
        <span class="reviews-cta-text">Zobacz pozostałe {reviewsAggregate.google.count - 3} opinii</span>
      </span>
      <span class="arrow">↗</span>
    </a>
    <a class="reviews-cta-btn" href={reviewsAggregate.oferteo.url} target="_blank" rel="noopener">
      <span class="reviews-cta-left">
        <span class="reviews-cta-source">Oferteo</span>
        <span class="reviews-cta-text">Profil sprawdzonej firmy</span>
      </span>
      <span class="arrow">↗</span>
    </a>
  </div>
</section>

<style>
  /* Style skopiowane z section-reviews-v2.html używając CSS vars */
  /* Pełna treść w mockupie - tu skrót dla planu */
  .section { padding: 64px 0 56px; position: relative; }
  .rating-sources { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: rgba(0,0,0,0.25); }
  /* ... reszta zgodnie z mockupem ... */
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/data/reviews.ts src/components/Reviews.astro
git commit -m "feat: sekcja Opinie z dual-source rating (Google + Oferteo)"
```

---

### Task 13: FAQ.astro + data/faq.ts

**Files:**
- Create: `src/data/faq.ts`
- Create: `src/components/FAQ.astro`

- [ ] **Step 1: Stworzyć src/data/faq.ts**

```ts
export interface FaqItem {
  num: string;
  question: string;
  answer: string; // HTML allowed
}

export const faqItems: FaqItem[] = [
  {
    num: '01',
    question: 'Ile kosztuje wylewka za m²?',
    answer: 'Cena zależy od metrażu, technologii i lokalizacji. Najczęściej domowe wylewki kosztują <strong>60–110 zł / m²</strong> z materiałem. Bezpłatna wycena po pomiarze, bez zobowiązań.',
  },
  {
    num: '02',
    question: 'Kiedy mogę chodzić po wylewce i kłaść podłogę?',
    answer: 'Po <strong>24-48 godzinach</strong> spokojnie chodzisz. Po <strong>2 tygodniach</strong> jest gotowa pod parkiet, panele lub płytki. Pełne wysuszenie zajmuje miesiąc.',
  },
  {
    num: '03',
    question: 'Materiał kupujecie wy czy ja?',
    answer: 'Najczęściej kupujemy my (cement, plastyfikatory, dylatacje, siatki). Możesz też dostarczyć własny, wtedy rabat ujmiemy w wycenie.',
  },
  {
    num: '04',
    question: 'Robicie wylewki na ogrzewaniu podłogowym?',
    answer: 'Tak. Wylewka na ogrzewaniu podłogowym to nasza specjalność. <strong>Półsucha metoda mixokretem</strong> to idealna podstawa pod rury PE-X.',
  },
  {
    num: '05',
    question: 'Dajecie gwarancję?',
    answer: 'Tak, <strong>5 lat gwarancji</strong> na wylewkę. Jeśli pęknięcia lub odspojenia są z naszej winy, naprawiamy bezpłatnie.',
  },
  {
    num: '06',
    question: 'W jakim obszarze działacie?',
    answer: '<strong>Województwo opolskie i dolnośląskie</strong> standardowo. Do 80 km od Dąbrowy bez dopłat, dalej do uzgodnienia. Hale 500+ m² robimy w całej Polsce.',
  },
];
```

- [ ] **Step 2: Stworzyć src/components/FAQ.astro**

Skopiować markup `<details><summary>` z mockupu `section-faq-v1.html`. Iterować przez `faqItems`. Wszystkie style z mockupu (kolumna pomarańczowy "+", inversion na `[open]`).

```astro
---
import SectionHeader from './SectionHeader.astro';
import { faqItems } from '@/data/faq';
---

<section class="section" id="faq">
  <SectionHeader
    num="06"
    meta="Pytania"
    title="Pytasz,"
    titleAccent="odpowiadamy."
    subtitle="Najczęstsze pytania od klientów. Krótko i bez owijania w bawełnę."
  />

  <div class="faq-list">
    {faqItems.map((f, i) => (
      <details class="faq" style={`animation-delay: ${0.4 + i * 0.08}s`}>
        <summary>
          <span class="faq-q-num">{f.num}</span>
          <span class="faq-question">{f.question}</span>
          <span class="faq-icon"></span>
        </summary>
        <div class="faq-answer" set:html={f.answer}></div>
      </details>
    ))}
  </div>

  <div class="faq-cta">
    <div class="faq-cta-inner">
      <div class="faq-cta-text">
        <strong>Masz inne pytanie?</strong><br>
        Zadzwoń bezpośrednio, odpowiemy.
      </div>
      <a class="faq-cta-btn" href="tel:505895888">
        <span>Zadzwoń</span>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</section>

<style>
  /* Pełen CSS z section-faq-v1.html — patrz mockup */
  .section { padding: 64px 0 56px; }
  /* ... */
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/data/faq.ts src/components/FAQ.astro
git commit -m "feat: sekcja FAQ z 6 pytaniami i akordeonem details/summary"
```

---

### Task 14: ContactForm.astro (Web3Forms)

**Files:**
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: Stworzyć src/components/ContactForm.astro**

Form POST do `https://api.web3forms.com/submit` z hidden `access_key` z `import.meta.env.PUBLIC_WEB3FORMS_KEY`. Honeypot field. Subject prefix "Wycena z rafbet.pl —".

```astro
---
const WEB3_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? 'PLACEHOLDER_KEY_REPLACE_BEFORE_DEPLOY';
---

<section class="final-cta" id="kontakt">
  <div class="cta-eyebrow"><span>Krok pierwszy</span></div>
  <h2 class="cta-title">
    Czas na Twoją<br>
    <span class="accent">podłogę.</span>
  </h2>
  <p class="cta-text">
    Zostaw kontakt, oddzwonimy w ciągu 24 godzin z wyceną. <strong>Bez zobowiązań, bez ciśnienia.</strong>
  </p>

  <form
    class="form"
    action="https://api.web3forms.com/submit"
    method="POST"
  >
    <input type="hidden" name="access_key" value={WEB3_KEY} />
    <input type="hidden" name="from_name" value="Strona Rafbet" />
    <input type="hidden" name="subject" value="Wycena z rafbet.pl" />
    <input type="hidden" name="redirect" value="https://posadzki-wylewki.opole.pl/dziekujemy" />
    <input type="text" name="botcheck" style="display:none" tabindex="-1" autocomplete="off" />

    <div class="form-row">
      <div class="field-group">
        <label class="field-label" for="name">Imię<span class="req">*</span></label>
        <input id="name" class="field" type="text" name="name" placeholder="Jan" required />
      </div>
      <div class="field-group">
        <label class="field-label" for="phone">Telefon<span class="req">*</span></label>
        <input id="phone" class="field" type="tel" name="phone" placeholder="500 000 000" required />
      </div>
    </div>

    <div class="field-group">
      <label class="field-label" for="email">Email (opcjonalnie)</label>
      <input id="email" class="field" type="email" name="email" placeholder="jan@example.pl" />
    </div>

    <div class="field-group">
      <label class="field-label" for="message">Metraż i lokalizacja</label>
      <textarea id="message" class="field" name="message" placeholder="np. 150 m² dom w Opolu, ogrzewanie podłogowe"></textarea>
    </div>

    <button class="form-submit" type="submit">
      <span>Wyślij i oddzwonimy</span>
      <span class="arrow">→</span>
    </button>

    <p class="form-note">
      Wysyłając akceptujesz <a href="/privacy">politykę prywatności</a>. Numeru używamy tylko do oddzwonienia.
    </p>
  </form>

  <div class="or-divider"><span class="line"></span><span class="text">albo</span><span class="line"></span></div>

  <a class="phone-block" href="tel:505895888">
    <div class="phone-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </div>
    <div class="phone-info">
      <span class="phone-label">Zadzwoń bezpośrednio</span>
      <span class="phone-num">505 895 888</span>
    </div>
    <div class="phone-hours">
      <span class="phone-hours-label">Dziś</span>
      <span class="phone-hours-val">● Dostępni</span>
    </div>
  </a>
</section>

<style>
  /* Pełen CSS z section-cta-contact-v1.html używając CSS vars */
  .final-cta { padding: 56px 22px 48px; position: relative; background: radial-gradient(ellipse 600px 400px at 50% 100%, rgba(249,115,22,0.18) 0%, transparent 60%), rgba(0,0,0,0.35); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  /* ... */
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: ContactForm z Web3Forms (honeypot + RODO note)"
```

---

### Task 15: MapSection.astro (Leaflet lazy)

**Files:**
- Create: `src/components/MapSection.astro`

- [ ] **Step 1: Stworzyć src/components/MapSection.astro**

```astro
---
const address = {
  street: 'ul. Ks. prof. J. Sztonyka 78',
  city: '49-120 Dąbrowa',
  phone: '505 895 888',
  email: 'posadzkiopole@gmail.com',
  areas: ['Opolskie', 'Dolnośląskie'],
  gmapsUrl: 'https://www.google.com/maps/place/RafBet/@50.721085,17.7721754,12z/data=!3m1!4b1!4m6!3m5!1s0x47104c99d1d2af27:0xa4551354b1a8b37a!8m2!3d50.721085!4d17.7721754!16s%2Fg%2F1ptyg4956',
  lat: 50.7239,
  lon: 17.7340,
};
---

<section class="map-section" id="mapa">
  <div class="map-header">
    <div class="map-num">
      <span class="map-num-pill">08</span>
      <span class="map-num-line"></span>
      <span class="map-num-meta">Gdzie nas znajdziesz</span>
    </div>
    <h2 class="map-title">
      Baza w <span class="accent">Dąbrowie.</span><br>
      Pracujemy w terenie.
    </h2>
  </div>

  <div class="map-wrap">
    <div id="leafletMap" data-lat={address.lat} data-lon={address.lon}></div>
    <a class="map-overlay-btn" href={address.gmapsUrl} target="_blank" rel="noopener">
      <span class="ico">↗</span>
      <span>Otwórz w Google Maps</span>
    </a>
  </div>

  <div class="address-block">
    <div class="addr-item">
      <span class="addr-label">Adres</span>
      <span class="addr-val">{address.street}<br />{address.city}</span>
    </div>
    <div class="addr-item">
      <span class="addr-label">Telefon</span>
      <span class="addr-val"><a href={`tel:${address.phone.replace(/\s/g, '')}`}>{address.phone}</a></span>
    </div>
    <div class="addr-item">
      <span class="addr-label">Email</span>
      <span class="addr-val"><a href={`mailto:${address.email}`}>{address.email}</a></span>
    </div>
    <div class="addr-item">
      <span class="addr-label">Obszar pracy</span>
      <span class="addr-val">{address.areas.join('\n')}</span>
    </div>
  </div>
</section>

<script>
  let mapInitialized = false;

  async function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    const el = document.getElementById('leafletMap');
    if (!el) return;
    const lat = parseFloat(el.dataset.lat!);
    const lon = parseFloat(el.dataset.lon!);

    // Inject Leaflet CSS at lazy-time
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const L = (await import('leaflet')).default;
    const map = L.map(el, {
      center: [lat, lon],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd', maxZoom: 19, pane: 'shadowPane',
    }).addTo(map);
    const pin = L.divIcon({ className: 'rafbet-pin', iconSize: [14, 14], iconAnchor: [7, 7] });
    L.marker([lat, lon], { icon: pin }).addTo(map);
  }

  // Lazy: initialize when section enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        initMap();
        observer.disconnect();
      }
    },
    { rootMargin: '200px' }
  );
  observer.observe(document.querySelector('.map-section')!);
</script>

<style>
  /* Style z section-map-footer-v1.html + Leaflet dark theme overrides */
  .map-section { background: rgba(0,0,0,0.25); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
  .map-header { padding: 36px 22px 24px; border-bottom: 1px solid var(--line); }
  /* ... rest from mockup ... */

  :global(.leaflet-container) { background: #14141a !important; font-family: var(--font-sans) !important; }
  :global(.leaflet-control-attribution) { background: rgba(10,10,12,0.7) !important; color: rgba(255,255,255,0.4) !important; font-size: 9px !important; font-family: var(--font-mono) !important; }
  :global(.leaflet-control-attribution a) { color: rgba(249,115,22,0.7) !important; }
  :global(.leaflet-control-zoom a) { background: rgba(20,20,24,0.85) !important; color: var(--text) !important; border: 1px solid var(--line-strong) !important; border-radius: 0 !important; }
  :global(.leaflet-control-zoom a:hover) { background: rgba(30,30,36,0.95) !important; color: var(--orange) !important; }

  :global(.rafbet-pin) {
    width: 14px; height: 14px;
    background: var(--orange);
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(249,115,22,0.30), 0 0 0 10px rgba(249,115,22,0.12);
    animation: pin-pulse 2s ease-in-out infinite;
    position: relative;
  }
  :global(.rafbet-pin::after) {
    content: 'RAFBET';
    position: absolute; top: -28px; left: 50%;
    transform: translateX(-50%);
    background: var(--orange); color: #0a0a0c;
    font-family: var(--font-mono); font-size: 9px; font-weight: 700; letter-spacing: 1px;
    padding: 3px 7px; white-space: nowrap;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MapSection.astro
git commit -m "feat: MapSection z Leaflet lazy-loaded (Intersection Observer)"
```

---

### Task 16: Footer.astro

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Stworzyć src/components/Footer.astro**

```astro
---
const navLinks = [
  { label: 'Co robimy', href: '#oferta' },
  { label: 'Jak pracujemy', href: '#proces' },
  { label: 'Realizacje', href: '#realizacje' },
  { label: 'Opinie', href: '#opinie' },
  { label: 'FAQ', href: '#faq' },
];
const contactLinks = [
  { label: '505 895 888', href: 'tel:505895888' },
  { label: 'posadzkiopole@gmail.com', href: 'mailto:posadzkiopole@gmail.com' },
  { label: 'Formularz wyceny', href: '#kontakt' },
  { label: 'Google Maps ↗', href: 'https://www.google.com/maps/place/RafBet/@50.721085,17.7721754,12z/data=!3m1!4b1!4m6!3m5!1s0x47104c99d1d2af27:0xa4551354b1a8b37a!8m2!3d50.721085!4d17.7721754!16s%2Fg%2F1ptyg4956', external: true },
];
const currentYear = new Date().getFullYear();
---

<footer class="footer">
  <div class="footer-top">
    <div>
      <div class="footer-brand">
        <span class="footer-wordmark"><span class="raf">RAF</span><span class="bet">BET</span><span class="dot">.</span></span>
        <span class="footer-brand-meta">Od 2013</span>
      </div>
      <p class="footer-slogan">
        Rafał Fabiańczyk z ekipą. Wylewki maszynowe od 2013 roku. Opolskie, dolnośląskie.
      </p>
    </div>
  </div>

  <div class="footer-grid">
    <div>
      <div class="footer-col-title">Strona</div>
      {navLinks.map(l => <a class="footer-link" href={l.href}>{l.label}</a>)}
    </div>
    <div>
      <div class="footer-col-title">Kontakt</div>
      {contactLinks.map(l => (
        <a class="footer-link" href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>{l.label}</a>
      ))}
    </div>
  </div>

  <div class="footer-legal">
    <div class="footer-legal-line">
      <div class="footer-legal-text">
        <strong>"RAFBET" Rafał Fabiańczyk</strong><br>
        NIP 9910327582 · REGON 161512382<br>
        Sprawdzona Firma · Oferteo.pl
      </div>
      <a class="footer-policy" href="/privacy">Polityka prywatności</a>
    </div>
  </div>

  <div class="footer-built">
    © {currentYear} RAFBET · Wszystkie prawa zastrzeżone
  </div>
</footer>

<style>
  /* CSS z section-map-footer-v1.html sekcja footer */
  .footer { background: var(--bg-deep); padding: 32px 22px 20px; position: relative; }
  /* ... pełna treść z mockupu ... */
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: Footer z brand, nav linkami, kontaktem i danymi prawnymi"
```

---

## Faza 5: Strona główna i SEO

### Task 17: pages/index.astro - kompozycja całości

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Stworzyć src/pages/index.astro**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import MetaBar from '@/components/MetaBar.astro';
import Hero from '@/components/Hero.astro';
import Services from '@/components/Services.astro';
import Process from '@/components/Process.astro';
import Gallery from '@/components/Gallery.astro';
import Lightbox from '@/components/Lightbox.astro';
import Reviews from '@/components/Reviews.astro';
import FAQ from '@/components/FAQ.astro';
import ContactForm from '@/components/ContactForm.astro';
import MapSection from '@/components/MapSection.astro';
import Footer from '@/components/Footer.astro';
import { reviewsAggregate } from '@/data/reviews';
import { faqItems } from '@/data/faq';

const totalReviews = reviewsAggregate.google.count + reviewsAggregate.oferteo.count;
const avgRating = ((reviewsAggregate.google.rating * reviewsAggregate.google.count +
  reviewsAggregate.oferteo.rating * reviewsAggregate.oferteo.count) / totalReviews).toFixed(1);

const jsonLdBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://posadzki-wylewki.opole.pl/#org',
  name: '"RAFBET" Rafał Fabiańczyk',
  image: 'https://posadzki-wylewki.opole.pl/og-image.jpg',
  url: 'https://posadzki-wylewki.opole.pl/',
  telephone: '+48505895888',
  email: 'posadzkiopole@gmail.com',
  priceRange: '60-110 PLN/m²',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ul. Ks. prof. J. Sztonyka 78',
    postalCode: '49-120',
    addressLocality: 'Dąbrowa',
    addressRegion: 'Opolskie',
    addressCountry: 'PL',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 50.7239, longitude: 17.7340 },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Opolskie' },
    { '@type': 'AdministrativeArea', name: 'Dolnośląskie' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: avgRating,
    reviewCount: totalReviews,
    bestRating: '5',
    worstRating: '1',
  },
};
const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer.replace(/<[^>]+>/g, '') },
  })),
};
---

<BaseLayout>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLdBusiness)} slot="head" />
  <script type="application/ld+json" set:html={JSON.stringify(jsonLdFaq)} slot="head" />

  <Nav />
  <MetaBar />
  <Hero />
  <Services />
  <Process />
  <Gallery />
  <Reviews />
  <FAQ />
  <ContactForm />
  <MapSection />
  <Footer />
  <Lightbox />
</BaseLayout>
```

- [ ] **Step 2: Dodać slot "head" w BaseLayout.astro**

Edit `src/layouts/BaseLayout.astro` - dodać `<slot name="head" />` przed `</head>`.

- [ ] **Step 3: Verify dev server pokazuje całość**

Run: `npm run dev`
Expected: `http://localhost:4321/` pokazuje pełen landing — wszystkie sekcje, animacje działają, lightbox otwiera się po kliknięciu zdjęcia, FAQ akordeon działa, mapa się ładuje przy scrollu.

Manualnie sprawdzić:
- Sticky nav działa
- Wszystkie linki anchor (#oferta, #kontakt itd.) skaczą do sekcji
- Formularz wymaga "imię" i "telefon"
- Klawiatura w lightbox: ESC, ←, →
- Show more w galerii rozsuwa pozostałe 8 zdjęć

Zatrzymać dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/layouts/BaseLayout.astro
git commit -m "feat: pages/index.astro z kompozycją wszystkich sekcji + JSON-LD"
```

---

### Task 18: pages/privacy.astro

**Files:**
- Create: `src/pages/privacy.astro`

- [ ] **Step 1: Stworzyć src/pages/privacy.astro**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Nav from '@/components/Nav.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout
  title="Polityka prywatności · Rafbet"
  description="Polityka prywatności i informacja o przetwarzaniu danych osobowych przez RAFBET Rafał Fabiańczyk."
>
  <Nav />
  <main class="privacy">
    <h1>Polityka prywatności</h1>
    <p>
      Administratorem danych osobowych podanych w formularzu kontaktowym jest
      <strong>"RAFBET" Rafał Fabiańczyk</strong>, ul. Ks. prof. J. Sztonyka 78, 49-120 Dąbrowa, NIP 9910327582.
    </p>
    <h2>Cel przetwarzania</h2>
    <p>
      Dane (imię, telefon, opcjonalnie email i wiadomość) są zbierane wyłącznie w celu kontaktu zwrotnego
      i przygotowania wyceny usługi. Nie są przekazywane stronom trzecim.
    </p>
    <h2>Przechowywanie</h2>
    <p>
      Wiadomości z formularza trafiają na adres <a href="mailto:posadzkiopole@gmail.com">posadzkiopole@gmail.com</a>
      przez usługę Web3Forms. Dane są przechowywane do czasu zakończenia kontaktu i obsługi zapytania
      (najczęściej do 12 miesięcy), po czym są usuwane.
    </p>
    <h2>Twoje prawa</h2>
    <p>
      Masz prawo do wglądu, sprostowania, usunięcia lub przeniesienia swoich danych. Aby skorzystać,
      napisz na <a href="mailto:posadzkiopole@gmail.com">posadzkiopole@gmail.com</a>.
    </p>
    <h2>Cookies i analityka</h2>
    <p>
      Strona nie używa cookies śledzących. Mapa Google (Leaflet z CartoDB) jest ładowana z zewnętrznych
      tile serwerów po wejściu w sekcję kontaktu.
    </p>
    <p style="margin-top: 32px"><a href="/" style="border-bottom: 1px solid var(--orange)">← Powrót do strony głównej</a></p>
  </main>
  <Footer />
</BaseLayout>

<style>
  .privacy {
    max-width: 720px;
    margin: 0 auto;
    padding: 64px 22px;
    color: var(--text-2);
    line-height: 1.7;
  }
  .privacy h1 { font-size: 32px; font-weight: 800; color: var(--text); margin-bottom: 24px; letter-spacing: -1.5px; }
  .privacy h2 { font-size: 18px; font-weight: 700; color: var(--text); margin-top: 28px; margin-bottom: 10px; }
  .privacy p { font-size: 15px; margin-bottom: 14px; }
  .privacy a { color: var(--text); border-bottom: 1px solid var(--line-strong); }
  .privacy a:hover { border-bottom-color: var(--orange); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/privacy.astro
git commit -m "feat: strona polityki prywatności z informacją RODO"
```

---

### Task 19: Sitemap i robots.txt

**Files:**
- Create: `public/robots.txt`
- Modify: `astro.config.mjs` (dodać @astrojs/sitemap)

- [ ] **Step 1: Zainstalować @astrojs/sitemap**

```bash
npm install @astrojs/sitemap
```

- [ ] **Step 2: Dodać sitemap do astro.config.mjs**

Edit `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://posadzki-wylewki.opole.pl',
  integrations: [sitemap()],
  output: 'static',
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: { build: { cssMinify: 'lightningcss' } },
});
```

- [ ] **Step 3: Stworzyć public/robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://posadzki-wylewki.opole.pl/sitemap-index.xml
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs public/robots.txt
git commit -m "feat: sitemap przez @astrojs/sitemap + robots.txt"
```

---

### Task 20: OG image i favicon

**Files:**
- Create: `public/favicon.svg`
- Create: `public/og-image.jpg`

- [ ] **Step 1: Stworzyć public/favicon.svg (dual-color "RB.")**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="#1e1e20"/>
  <text x="6" y="44" font-family="Inter, sans-serif" font-weight="800" font-size="28" letter-spacing="-2" fill="#e8e2d3">R</text>
  <text x="26" y="44" font-family="Inter, sans-serif" font-weight="800" font-size="28" letter-spacing="-2" fill="#f97316">B</text>
  <text x="46" y="44" font-family="Inter, sans-serif" font-weight="800" font-size="28" fill="#f97316">.</text>
</svg>
```

- [ ] **Step 2: Wygenerować og-image.jpg (1200×630)**

Skopiować z `gallery-01.jpg` (zatarta tafla z refleksem) i przyciąć/dopasować do 1200×630. Można użyć Pythona z PIL:

```python
from PIL import Image, ImageDraw, ImageFont
img = Image.open('src/assets/images/gallery-01.jpg')
img = img.resize((1200, int(1200 * img.height / img.width)))
img = img.crop((0, (img.height - 630) // 2, 1200, (img.height - 630) // 2 + 630))
# darken
overlay = Image.new('RGBA', (1200, 630), (10, 10, 12, 100))
img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
img.save('public/og-image.jpg', quality=85, optimize=True)
```

Run skrypt jako bash heredoc lub jednorazowy plik `tools/build-og.py`.

- [ ] **Step 3: Verify oba pliki istnieją**

Run: `ls -la public/favicon.svg public/og-image.jpg`
Expected: oba istnieją, og-image.jpg < 200KB.

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg public/og-image.jpg
git commit -m "feat: favicon SVG dual-color + og-image z zdjęciem realizacji"
```

---

## Faza 6: Deploy

### Task 21: .env.example i Web3Forms setup

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Stworzyć .env.example**

```bash
# Web3Forms access key — wygeneruj na https://web3forms.com
# Recipient ustawiony przez Web3Forms dashboard: romduz@gmail.com (tymczasowo,
# zmienić na posadzkiopole@gmail.com po przekazaniu Rafałowi).
PUBLIC_WEB3FORMS_KEY=replace-with-real-key-before-deploy
```

- [ ] **Step 2: Verify .env w .gitignore (z Task 1 step 4)**

Run: `grep -E '^\.env' .gitignore`
Expected: `.env` i `.env.local` są wyłączone.

- [ ] **Step 3: Stworzyć .env lokalny (NIE commitować)**

Roman rejestruje się na https://web3forms.com z `romduz@gmail.com`, ustawia ten sam adres jako recipient (na czas testów — Roman forwarduje Rafałowi gdy potrzeba). Kopiuje access key, wkleja do `.env`:

```
PUBLIC_WEB3FORMS_KEY=<real-uuid-from-web3forms>
```

Po przekazaniu projektu Rafałowi: zmienić recipient na `posadzkiopole@gmail.com` w Web3Forms dashboard (kod nie wymaga zmian).

- [ ] **Step 4: Commit (tylko .env.example)**

```bash
git add .env.example
git commit -m "chore: .env.example z instrukcją Web3Forms"
```

---

### Task 22: Build i Lighthouse audit

**Files:** none

- [ ] **Step 1: Build produkcyjny**

```bash
npm run build
```

Expected: folder `dist/` utworzony, brak błędów. Wyświetla rozmiary plików (HTML, CSS, JS).

- [ ] **Step 2: Preview build**

```bash
npm run preview
```

Expected: serwer na `http://localhost:4321/`. Otworzyć w przeglądarce.

- [ ] **Step 3: Lighthouse audit (mobile)**

W Chrome DevTools (F12) → Lighthouse tab → Mobile + Performance/Accessibility/Best Practices/SEO → Analyze.

Expected:
- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Zanotować wyniki. Jeśli Performance < 95, zidentyfikować problemy (largest contentful paint, layout shift) i poprawić.

- [ ] **Step 4: Test ręczny na realnym telefonie**

Odpalić preview na `npm run preview -- --host 0.0.0.0`. W telefonie wejść na `http://<IP-komputera>:4321/`. Sprawdzić:
- LCP < 2s
- Galeria scrolluje płynnie
- Lightbox otwiera się
- Mapa się ładuje przy scrollu
- Formularz wypełnialny

- [ ] **Step 5: Commit (jeśli były poprawki performance)**

```bash
git add .
git commit -m "perf: optymalizacje po Lighthouse audit"
```

---

### Task 23: Deploy na Railway

**Files:**
- `nixpacks.toml` (już z Task 1)
- `package.json` script `start` (już z Task 1)

- [ ] **Step 1: Push repo na GitHub**

Stworzyć puste repo na github.com/<user>/rafbet-landing (private albo public).

```bash
cd C:/Code/Repositories/RafBetLanding
git remote add origin git@github.com:<user>/rafbet-landing.git
git push -u origin main
```

- [ ] **Step 2: Stworzyć projekt w Railway**

1. Otworzyć https://railway.app, zalogować się przez GitHub
2. New Project → Deploy from GitHub repo → wybrać `rafbet-landing`
3. Railway wykryje `nixpacks.toml` i uruchomi build automatycznie

- [ ] **Step 3: Ustawić env var w Railway dashboard**

Project → Variables → Add:
- `PUBLIC_WEB3FORMS_KEY` = `<UUID z Web3Forms>`

Po dodaniu Railway zrobi rebuild automatycznie.

- [ ] **Step 4: Wygenerować domenę Railway**

Project → Settings → Networking → Generate Domain.

Railway wygeneruje URL typu `rafbet-landing-production-xxxx.up.railway.app`.

- [ ] **Step 5: Test produkcji**

Otworzyć Railway URL na telefonie. Sprawdzić:
- Wszystkie sekcje renderują się
- Animacje działają (text reveal, pulse-ring, mesh tła)
- Galeria + lightbox (klawiatura + dotyk)
- Mapa Leaflet ładuje się przy scrollu
- Formularz: wypełnić testowo, wysłać, zweryfikować że trafił na `romduz@gmail.com` (recipient ustawiony w Web3Forms dashboard)

- [ ] **Step 6: Custom domena (opcjonalnie, po zatwierdzeniu z Rafałem)**

Project → Settings → Networking → Custom Domain → wpisać docelową domenę (`rafbet.pl` albo `posadzki-wylewki.opole.pl`).

Railway pokaże wymagane rekordy DNS (CNAME). Wpisać u rejestratora domeny.

Po propagacji DNS (zwykle minuty, max 24h) — domena działa z certyfikatem SSL od Railway.

- [ ] **Step 7: Commit (jeśli były poprawki po deploy)**

```bash
git add .
git commit -m "chore: poprawki po deploy testowym na Railway"
git push origin main
```

Railway auto-deployuje po pushu do main.

---

## Otwarte punkty do potwierdzenia z Rafałem przed publikacją

Te są w spec, powtarzam dla świadomości engineera:

1. Liczby trust bar: 500+ realizacji, 300 m²/dzień
2. Cena za m²: 60-110 zł
3. Gwarancja: 5 lat
4. Obszar pracy bez dopłat: 80 km
5. Captiony galerii z metrażami (placeholder)
6. Czy mikrocementowe/żywiczne/anhydrytowe rzeczywiście w ofercie
7. Polskie wersje opinii Google (mamy tłumaczenia EN→PL)
8. Logo SVG/PNG do innych zastosowań
9. Web3Forms API key
10. Domena docelowa: posadzki-wylewki.opole.pl lub nowa rafbet.pl
11. Hosting: Vercel / Netlify
