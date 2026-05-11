# Rafbet — redesign landingu

**Data:** 2026-05-12
**Klient:** "RAFBET" Rafał Fabiańczyk (NIP 9910327582, REGON 161512382)
**Stara strona:** https://posadzki-wylewki.opole.pl/ (`OldApp/` w repo)
**Sesja brainstormingu:** Visual Companion (mockupy: `.superpowers/brainstorm/`)

## Cel projektu

Zastąpienie ciężkiego landingu z 2016 (Mobirise + jQuery + Bootstrap 3, niezoptymalizowane obrazy 4608×3456px) nowoczesną stroną mobile-first dla klienta indywidualnego (B2C, prywatny inwestor budujący dom). Strona ma:

- przekonać że firma robi dobrze, szybko i jest długo na rynku
- działać szybko na 4G (LCP < 1.5s)
- eksponować realne dowody zaufania (opinie z Google + Oferteo, 22 lata doświadczenia Rafała, 5.0/5 na Oferteo)
- prowadzić do konwersji: formularz wyceny lub telefon

## Stack technologiczny

- **Framework:** Astro (static site generator, zero JS domyślnie, build → folder `dist/`)
- **CSS:** vanilla CSS z CSS variables (tokens w `src/styles/tokens.css`)
- **Typografia:** Inter Variable (weights 200–800) + JetBrains Mono (300–600) z Google Fonts (preconnect + display=swap)
- **Obrazy:** komponent `<Image>` Astro → auto-konwersja do AVIF/WebP, responsive `srcset`, lazy loading domyślnie
- **Mapa:** Leaflet 1.9.4 + CartoDB Dark tiles (lazy-loaded przez Intersection Observer)
- **Formularz:** Web3Forms (free 250 wiadomości/miesiąc, API key w `.env`, recipient `romduz@gmail.com` tymczasowo dla okresu testów — Roman forwarduje Rafałowi; docelowo zmienić na `posadzkiopole@gmail.com` po uzyskaniu dostępu od Rafała)
- **Hosting:** Railway (Nixpacks build + `serve dist` przez `$PORT` env var, GitHub auto-deploy)
- **Język:** PL only (na razie, struktura przewiduje przyszłą `i18n` w Astro)

**Decyzja hosting:** Railway (zatwierdzone). Build przez Nixpacks, serwowanie statyki przez `serve dist -l $PORT`. Auto-deploy z GitHub po pushu.

## Identyfikacja i targetowanie

**Target:** B2C dominujący — prywatny inwestor budujący dom jednorodzinny na Opolszczyźnie (rozszerzone do Dolnośląskiego).
**Tone:** rzeczowy, bezpośredni, bez korpo-języka, bez em-dashów (zakaz Romana — sygnatura AI). Krótkie zdania, konkretne liczby.
**Vibe:** industrial dark mode z betonowym charakterem (NIE czerń pełna, NIE glassmorphism z lat 2018–2021).

## Paleta kolorów (concrete dark)

```
--bg-base:      #1e1e20    /* główne tło (concrete) */
--bg-deep:      #131316    /* footer / głębsze sekcje */
--line:         rgba(255,255,255,0.10)
--line-strong:  rgba(255,255,255,0.20)

--text:         #f2f2f2
--text-2:       rgba(242,242,242,0.68)  /* secondary */
--text-3:       rgba(242,242,242,0.42)  /* tertiary / metadata */

--cream:        #e8e2d3    /* warm off-white (logo RAF, avatars) */

--orange:       #f97316    /* primary accent — CTA, headlines accent */
--orange-light: #fb923c    /* hover */
--orange-dark:  #ea580c    /* gradients */
--amber:        #fbbf24    /* stars / decorative */

--green:        #22c55e    /* live status, success */
```

**Zasada:** szarości jako baza, amber/pomarańcz **wyłącznie jako akcent** na: logo, primary CTA, jeden wyraz w nagłówkach, linki, indykatory live. Nigdy jako wypełnienie dużych obszarów.

## Typografia

- **Inter Variable** (Google Fonts) — headings 60–68px weight 800 letter-spacing −2.5px do −3.5px, body 14–16px weight 400, lead 16px weight 400
- **JetBrains Mono** — wszystkie labelki techniczne, numery sekcji, dane (NIP/REGON), metryki, daty, ceny, eyebrow texty

## Tekstura "concrete" w tle

6-warstwowy efekt w `<body>` lub na sekcjach (CSS, bez obrazów):

1. **Fine grain** — SVG noise (turbulence baseFrequency 0.7), blend `overlay`, opacity 0.5
2. **Aggregate / kamyki** — SVG noise (baseFrequency 0.012), blend `soft-light`, opacity 0.3
3. **Ślady pacy** — krzyżujące się `repeating-linear-gradient` 118° + 62°, opacity 0.6
4. **Central highlight** — `radial-gradient` ellipse 55%/45%, ciepły cream (rgba(255,235,200,0.07))
5. **Polish reflex** — opcjonalny blurred radial w centrum
6. **Vignette** — radial + linear gradient od dołu

W Astro: jeden `<ConcreteTexture>` component reużywalny.

## Logo

**Dual-color wordmark:**
- `RAF` w cream `#e8e2d3`
- `BET` w pomarańczowym `#f97316`
- `.` (kropka) w pomarańczowym (subtelny brand mark)

Font: Inter, weight 800, letter-spacing −1.5px.
Brak osobnego logo-mark (icon). W footerze ta sama wordmark + "Od 2013".

**Otwarty punkt:** czy potrzebujemy wektorowego SVG/PNG do social media, faktur, samochodów ekipy. Trzeba dostarczyć Rafałowi.

## Struktura strony (9 sekcji)

### 00. Sticky nav
- Lewa: wordmark RAFBET. + sub-label "POSADZKI · OPOLE"
- Prawa: live-badge "● DOSTĘPNI DZIŚ" (pulsująca zielona kropka, animacja `pulse-ring`)
- Backdrop blur, hairline bottom border
- Sticky na scroll

### 01. Hero (zatwierdzony jako v10)
- **Meta bar** (3 kolumny mono): `Lokalizacja: Opole, PL` | `Działamy od: 2013` | `Mixokret: Brinkmann`
- **Eyebrow:** "Posadzki maszynowe" (mono 10px)
- **H1:** "Idealnie / gładka / **posadzka**." (60–68px, 3 linie z fade-up reveal sekwencyjnym)
- **Lead:** "Robimy jedną rzecz i robimy ją dobrze. **Mixokret, jeden dzień, do 300 m²** gładko jak tafla. Gotowe pod parkiet, panele i płytki."
- **CTAs:** primary "Bezpłatna wycena →" (pomarańczowy solid) + phone-link "Wolisz zadzwonić? · 505 895 888" (numer z pomarańczowym podkreśleniem)
- **Stats bar** (3 kolumny, hairline separators): `22 lata` (doświadczenie Rafała) | `500+ realizacji` | `do 300 m² dziennie`

**Otwarty punkt:** liczby `500+ realizacji` i `300 m² dziennie` do potwierdzenia z Rafałem. `22 lata` = osobiste doświadczenie Rafała w branży od 2003 (firma jako JDG od 2013, zgodnie z CEIDG i Oferteo).

### 02. Co robimy
- Header: `02 ──── Co robimy`, tytuł "Dwie skale. Jedna **robota**.", podtytuł "Wylewki maszynowe dla domów jednorodzinnych i dla hal. To wszystko, czym się zajmujemy. Bez kompromisów."
- **2 karty** w pionie z hairline borders (NIE 3, bez tynków — `userconfirmed`):
  - **01 Posadzki w domu jednorodzinnym** (do 200 m² / 1 dzień pracy) + tagi: Hydroizolacja, Termoizolacja (styropian), Ogrzewanie podłogowe, Dylatacje, Wylewka półsucha, Zatarcie mechaniczne
  - **02 Hale przemysłowe i magazyny** (500+ m² / etapowo) + tagi: Zbrojenie siatką, Włókna polipropylenowe, Plastyfikatory, Poziomy laserowe, Dylatacje technologiczne, Zatarcie maszynowe
- CTA per karta: "Zobacz realizacje domów →" / "Zapytaj o wycenę hali →"

**Otwarty punkt:** Oferteo lista wskazuje też mikrocementowe / żywiczne / anhydrytowe / remonty — czy Rafał faktycznie wszystko robi, czy zostać przy klasycznych cementowych?

### 03. Jak pracujemy (proces)
- Header: `03 ──── Jak pracujemy`, tytuł "Cztery kroki do gotowej **posadzki**.", podtytuł "Bez ukrytych kosztów, bez ciśnienia. Od pierwszego telefonu do gotowej tafli wiesz dokładnie co się dzieje."
- **4 kroki** z pionową linią łączącą + numer w pudełku 36×36 + tytuł + opis humanizowany + box detali (czas / koszt / sprzęt):
  1. **Zadzwoń lub napisz** (5 min, 0 zł)
  2. **Otrzymujesz wycenę** (24h, bez zobowiązań)
  3. **Wylewamy posadzkę** (1 dzień, Mixokret Brinkmann, ekipa 4–6 osób)
  4. **Gotowe pod podłogę** (po 2 tyg, parkiet/panele/płytki) — wypełniony pomarańczowy numer (active state)
- Pod listą **box CTA** "Wszystko zaczyna się od telefonu. Reszta jest na nas." + button "Krok 01 →"
- Tło sekcji: zdjęcie `p6220033` (poddasze z łatą poziomującą) jako subtle backdrop

### 04. Galeria realizacji
- Header: `04 ──── Realizacje`, tytuł "Twoja podłoga zaczyna się **tutaj**.", podtytuł "Domy, hale i kawałek rzemiosła w tle. Wszystko prawdziwe, wszystko nasze."
- **Grid 2 kolumny** mixed aspect-ratio (1:1 + 1:1.25 dla masonry feel), hairline 2px gap
- **6 zdjęć widocznych** od razu (najmocniejsze):
  1. Zatarta tafla, refleks słońca (Dom) — `c918ca06`
  2. Zatarcie helikopterem (Proces) — `38157bbe`
  3. Mixokret Brinkmann w akcji (Sprzęt) — `c9f527fd`
  4. Poziomica na świeżej wylewce (Detal) — `ef3c8a7d`
  5. Gotowa pod parkiet (Dom) — `e0e12a64`
  6. Poziomy laserowe (Proces) — `p6210020`
- **Przycisk "Pokaż więcej realizacji [+8 zdjęć]"** rozsuwa pozostałe 8:
  7. Posadzka cementowa (Dom) — `dcf312a6`
  8. Wylewka na ogrzewaniu podłogowym (Proces) — `p6230047`
  9. Dom drewniany, świeża wylewka (Dom) — `7ec518ba`
  10. Zatarcie maszynowe (Proces) — `61fd8fbc`
  11. Hala przed wylewką (Hala) — `3aebef85`
  12. Hydroizolacja folią (Proces) — `231b2d1b`
  13. Wyrównanie terenu pod podbudowę (Przygotowanie) — `p2090014`
  14. Dom drewniany, Opolszczyzna (Dom) — `glowna1`
- **Lightbox po kliknięciu** (overlay fullscreen, klawiatura ESC/←/→, swipe na touch)
- Każde zdjęcie ma overlay: numer `XX/14` (lewy górny) + caption + kategoria pomarańczowa (dolny)
- Hover: scale 1.04 + saturate up

**Wyłączone:** zdjęcie `11b6022c` (mokra wylewka z węża, blur, słaba jakość).

**Tło sekcji "Co robimy" (02):** zdjęcie `29186a0c` (zatarcie ręczne pacą + helikopter) jako subtle backdrop.

**Otwarty punkt:** metraże w captionach (180 m², 120 m², 650 m² itd.) to placeholdery — Rafał potwierdza lub poprawia. Niektóre realizacje może opowiedzieć: lokalizacja, klient, problem rozwiązany.

### 05. Opinie
- Header: `05 ──── Opinie`, tytuł "Tak nas widzą **klienci**.", podtytuł "16 opinii w sieci, średnia 4.6 z 5. Każdą można sprawdzić u źródła."
- **Dual-source rating bar** (2 kolumny):
  - **Google Maps** ★★★★½ · **4.4 / 5** · 14 opinii
  - **Oferteo** ★★★★★ · **5.0 / 5** · 2 opinie + "Sprawdzona Firma"
- **3 prawdziwe opinie** z tagami źródła:
  1. **Bartłomiej S.** (Oferteo, 06.2023, ★★★★★) — pełna treść w mockup
  2. **Tomasz Czerwiński** (Google, 2024, ★★★★★) — wylewka w garażu
  3. **Dariusz Różycki** (Google, 2022, ★★★★★) — trudna realizacja
- **2 CTAs** z prawdziwymi linkami:
  - Google → `https://www.google.com/maps/place/RafBet/@50.721085,17.7721754,12z/...`
  - Oferteo → `https://www.oferteo.pl/rafbet/firma/5854574`

**Otwarty punkt:** opinie Google to tłumaczenia z polskiego oryginału (przez Google translate w Maps EN). Przed deployem warto pobrać dokładne polskie wersje z Google Maps (zalogowanym w PL).

### 06. FAQ
- Header: `06 ──── Pytania`, tytuł "Pytasz, **odpowiadamy**.", podtytuł "Najczęstsze pytania od klientów. Krótko i bez owijania w bawełnę."
- **6 pytań w `<details>` akordeonie** (natywny HTML, działa bez JS):
  1. Ile kosztuje wylewka za m²? — 60–110 zł / m² z materiałem
  2. Kiedy mogę chodzić po wylewce i kłaść podłogę? — 24-48h chodzić, 2 tygodnie pod podłogę
  3. Materiał kupujecie wy czy ja? — najczęściej my, alternatywnie ty (z rabatem)
  4. Robicie wylewki na ogrzewaniu podłogowym? — tak, specjalność
  5. Dajecie gwarancję? — tak, 5 lat
  6. W jakim obszarze działacie? — Opolskie + Dolnośląskie, do 80 km bez dopłat
- Pomarańczowy `+` → `−` (inversion kolorów) po rozwinięciu
- Pod sekcją box CTA "Masz inne pytanie? Zadzwoń bezpośrednio, odpowiemy." + button

**Otwarty punkt:** cena 60–110 zł/m², gwarancja 5 lat, obszar 80 km — wszystkie do potwierdzenia z Rafałem przed publikacją.

### 07. Final CTA + Formularz
- **Eyebrow:** "Krok pierwszy"
- **Tytuł:** "Czas na Twoją **podłogę**."
- **Lead:** "Zostaw kontakt, oddzwonimy w ciągu 24 godzin z wyceną. **Bez zobowiązań, bez ciśnienia.**"
- **Formularz** (Web3Forms POST do API):
  - Imię\* + Telefon\* (2 kolumny obok siebie)
  - Email (opcjonalny, 1 kolumna)
  - Metraż i lokalizacja (textarea, placeholder "np. 150 m² dom w Opolu, ogrzewanie podłogowe")
  - Submit "Wyślij i oddzwonimy →"
  - RODO note: "Wysyłając akceptujesz politykę prywatności. Numeru używamy tylko do oddzwonienia."
- Label floats nad polem (mono, drobny), pomarańczowy focus border, ciemne tło pola
- **Divider:** `─── albo ───`
- **Phone block** klikalny (`tel:505895888`): ikona + "Zadzwoń bezpośrednio" + numer 20px bold + status "Dziś · ● Dostępni"
- Subtelne pomarańczowe linie w narożnikach prawym górnym i lewym dolnym (industrial framing)

**Web3Forms config:**
- API key generowany przez Romana przed deployem (przechowywany w `.env` jako `PUBLIC_WEB3FORMS_KEY`, dostępny w build-time przez `import.meta.env`)
- Recipient ustawiony przez Web3Forms dashboard: `romduz@gmail.com` (tymczasowo, Roman forwarduje Rafałowi)
- Subject: "Wycena z rafbet.pl"
- Honeypot anti-spam field
- Po przekazaniu projektu Rafałowi: zmienić recipient na `posadzkiopole@gmail.com` w Web3Forms dashboard (bez zmian w kodzie)

### 08. Mapa + adres
- Header: `08 ──── Gdzie nas znajdziesz`, tytuł "Baza w **Dąbrowie**. Pracujemy w terenie."
- **Mapa Leaflet** z CartoDB Dark `dark_nolabels` + `dark_only_labels` overlay (czytelne labelki na ciemnym tle)
  - Centrum: 50.7239 N, 17.7340 E, zoom 15
  - Custom DivIcon: pomarańczowy pulsujący circle 14×14 + label "RAFBET" nad
  - Zoom controls w industrial stylu (ciemne, pomarańczowy hover)
  - Scroll-wheel zoom wyłączony, drag/buttons OK
- **Lazy-load** przez Intersection Observer (Leaflet CSS/JS ładowane dopiero gdy sekcja widoczna)
- **Przycisk "↗ Otwórz w Google Maps"** w prawym dolnym rogu mapy
- **Address grid** (2 kolumny mobile):
  - Adres: ul. Ks. prof. J. Sztonyka 78, 49-120 Dąbrowa
  - Telefon: 505 895 888 (`tel:`)
  - Email: posadzkiopole@gmail.com (`mailto:`)
  - Obszar pracy: Opolskie / Dolnośląskie

### 09. Footer
- **Brand row:** wordmark RAFBET. + "Od 2013" + slogan "Rafał Fabiańczyk z ekipą. Wylewki maszynowe od 2013 roku. Opolskie, dolnośląskie."
- **2 kolumny linków:**
  - **Strona:** Co robimy / Jak pracujemy / Realizacje / Opinie / FAQ
  - **Kontakt:** 505 895 888 / posadzkiopole@gmail.com / Formularz wyceny / Google Maps ↗
- **Legal line** (mono): "RAFBET" Rafał Fabiańczyk · NIP 9910327582 · REGON 161512382 · Sprawdzona Firma · Oferteo.pl
- **Polityka prywatności** link (do strony `/privacy`)
- **Build credit:** © 2026 RAFBET · Wszystkie prawa zastrzeżone

## Animacje

Wszystkie CSS, brak bibliotek JS dla animacji. Lista:

- **Hero text reveal:** każda linia H1 fade-up sekwencyjny (delay 0.2s / 0.36s / 0.52s, cubic-bezier(0.16,1,0.3,1))
- **Lead/CTAs/stats:** fade-up z delay 0.7s / 0.9s / 1.1s
- **Live badge dot:** `pulse-ring` 1.8s ease-out infinite (rosnąca zielona aureola)
- **Logo mark hover:** brak — flat
- **Section reveal:** każda sekcja fade-up gdy wchodzi do viewport (Intersection Observer + `animation-play-state`)
- **CTA hover:** translateY -1px + strzałka translateX 3px
- **Service / Stat cards:** stagger fade-up
- **Gallery photo hover:** scale 1.04 + saturate 1 + brightness 1
- **FAQ akordeon:** native `<details>` + max-height transition (lub CSS-only)
- **Map pin:** `pin-pulse` 2s ease-in-out infinite (rosnące pomarańczowe shadow rings)
- **Scroll hint arrow:** `bounce` 1.6s

**Zakaz:** glassmorphism (`backdrop-filter` only na nav, nie wszędzie), multi-layer shadows na cards, em-dashes (`—`) w copy, emoji ikon, rounded corners > 8px, pełne czerń tła.

## Performance targets

- **LCP** < 1.5s na 4G (mobile)
- **CLS** < 0.05
- **JS bundle** < 60KB (Leaflet lazy, brak innych libs)
- **Obrazy:** AVIF/WebP, responsive `srcset` (640 / 1280 / 1920), `loading="lazy"` poza hero
- **Fonts:** preconnect + display=swap, Inter Variable Subset PL+EN
- **Lighthouse Performance:** ≥ 95 na mobile

## SEO

- **`<title>`:** "Posadzki maszynowe Opole · Rafbet · Wylewki cementowe od 2013"
- **Meta description:** "Wylewki maszynowe mixokretem dla domów i hal na Opolszczyźnie. 22 lata doświadczenia Rafała, 5.0/5 na Oferteo. Bezpłatna wycena w 24h."
- **Open Graph:** title, description, og:image (`/og-image.jpg` 1200×630 — zdjęcie zatartej tafli z brandingiem)
- **JSON-LD `LocalBusiness`:**
  - `name`, `address`, `geo`, `telephone`, `priceRange`, `aggregateRating` (4.6/5 z 16 reviews)
  - `openingHoursSpecification`
  - `areaServed`: Opolskie, Dolnośląskie
- **Sitemap.xml** generowany przez Astro
- **Robots.txt** — index, follow
- **FAQ section** z mikrodanymi `FAQPage` (Google rich snippets)
- **Hreflang:** tylko `pl-PL`

## Dostępność

- Kontrast tekstu wzgl. tła ≥ 4.5:1 (sprawdzić: cream `#e8e2d3` na bg-base `#1e1e20` — OK, ~12:1)
- Focus visible: pomarańczowy 2px outline na wszystkich interaktywnych
- Klawiatura: tab order zachowany, lightbox/akordeon zamykany ESC
- `aria-label` na ikonach SVG bez tekstu
- `<button>` vs `<a>` zgodnie z semantyką
- `lang="pl"` na `<html>`
- Skip-link na początek main content
- Animacje wyłączane przez `@media (prefers-reduced-motion: reduce)`

## Struktura katalogu Astro

```
src/
  pages/
    index.astro                    # cała strona
    privacy.astro                  # polityka prywatności
  components/
    Nav.astro
    Hero.astro
    MetaBar.astro
    Services.astro
    Process.astro
    Gallery.astro                  # + lightbox client:visible
    Reviews.astro
    FAQ.astro
    ContactForm.astro              # Web3Forms POST
    MapSection.astro               # Leaflet client:idle, lazy
    Footer.astro
    ConcreteTexture.astro          # reużywalne tło tekstury
    SectionHeader.astro            # 02/03/04/... numeracja + tytuł
  styles/
    tokens.css                     # CSS variables (paleta, fonts)
    base.css                       # reset, body, typography
    animations.css
  assets/
    images/                        # zdjęcia gallery-1.jpg ... gallery-14.jpg + bg-process.jpg + bg-services.jpg
public/
  og-image.jpg
  favicon.svg                      # dual-color wordmark "RB."
  robots.txt
astro.config.mjs                   # output: 'static', image service: 'sharp'
```

## Dane firmy (canonical)

| Pole | Wartość |
|---|---|
| Nazwa pełna | "RAFBET" Rafał Fabiańczyk |
| NIP | 9910327582 |
| REGON | 161512382 |
| Forma prawna | JDG |
| Data startu firmy | 27.02.2013 (CEIDG) |
| Doświadczenie Rafała | od 2003 (osobiste) |
| Adres | ul. Ks. prof. J. Sztonyka 78, 49-120 Dąbrowa |
| Telefon | 505 895 888 |
| Email | posadzkiopole@gmail.com |
| PKD główne | 43.33.Z (Posadzkarstwo) |
| PKD dodatkowe | 43.31.Z (Tynkowanie) — NIE realizujemy, nie pokazujemy |
| Obszar pracy | Opolskie + Dolnośląskie |
| Google Maps | 4.4 / 5 · 14 opinii |
| Oferteo | 5.0 / 5 · 2 opinie · "Sprawdzona Firma" |

## Otwarte punkty (do potwierdzenia z Rafałem przed publikacją)

1. **Liczby na trust bar:** `500+ realizacji` (placeholder), `300 m² dziennie` (placeholder)
2. **Cena za m²:** 60–110 zł — czy realna stawka rynkowa
3. **Gwarancja:** 5 lat — czy faktycznie tyle deklaruje
4. **Obszar pracy bez dopłat:** 80 km od Dąbrowy — czy ten promień
5. **Captiony galerii:** metraże poszczególnych realizacji (180 m², 120 m², 650 m²...) — placeholdery
6. **Zakres usług:** czy tylko klasyczne cementowe, czy też mikrocementowe / żywiczne / anhydrytowe (Oferteo listuje, stara strona nie wspomina)
7. **Polskie wersje opinii Google:** pobrać dokładne polskie cytaty (mamy translate EN→PL)
8. **Logo do wykorzystania poza stroną:** SVG + PNG transparent (faktury, samochody, FB profile)
9. **Web3Forms API key:** wygenerować i wkleić w `.env`
10. **Domena docelowa:** zachować `posadzki-wylewki.opole.pl` czy przejść na `rafbet.pl` / `rafbet.opole.pl` (DNS wskazujący na Railway custom domain)
11. **Email recipient:** docelowy `posadzkiopole@gmail.com` (Rafał) — na czas testów `romduz@gmail.com` (Roman)

## Następne kroki

1. **Plan implementacji** (writing-plans skill) — krok po kroku jak budujemy Astro app
2. **Implementacja** — strona by sekcja, weryfikacja w przeglądarce
3. **Optymalizacja zdjęć** — kompresja + responsive variants
4. **Testy** — Lighthouse mobile, manualne na realnym telefonie
5. **Web3Forms setup + .env**
6. **Deploy** na wybrany hosting
7. **Weryfikacja z Rafałem** — otwarte punkty + finalna kontrola treści
