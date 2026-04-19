# LiNC Connect

Intern communityplatform voor LiNC medewerkers. Combineert onboarding
(Mijn Pad), kennisbank, praktische informatie en een team-overzicht
in één Next.js app, met Google SSO via Supabase.

## Tech stack

- **Next.js 15** (App Router, Turbopack, Server Components)
- **TypeScript**
- **Tailwind CSS v4** (theme tokens + `@layer components`)
- **Supabase** — Auth (Google SSO, `@linc.nl` domain gate) + users store
- **Google APIs** — Calendar freeBusy + events (schedule modal op team cards)
- **Hosting**: Vercel

### Fonts

- **Roboto** via `next/font/google` (body)
- **Safiro** — self-hosted `.woff2` in `public/fonts/safiro/` (display)
- **Material Symbols Rounded** — self-hosted in `public/fonts/material-symbols/`

## Setup

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
# …fill in the values (see "Environment variables" below)

# 3. Dev
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Environment variables

Zie [`.env.example`](./.env.example) voor de volledige lijst. Samengevat:

| Variable                        | Server/Client | Bron                               |
| ------------------------------- | ------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | both          | Supabase → Project Settings → API  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | both          | idem                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | server only   | idem, "service_role" key           |
| `GOOGLE_CLIENT_ID`              | reference     | Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET`          | reference     | idem                               |

> `SUPABASE_SERVICE_ROLE_KEY` mag **nooit** de `NEXT_PUBLIC_` prefix krijgen — hij bypassed Row-Level Security. De team-pagina gebruikt 'm server-side om via `auth.admin.listUsers()` alle ingelogde users + Google photos op te halen.

## Auth + Google integraties

### Supabase Auth

1. Enable **Google provider** in Supabase → Authentication → Providers. Plak de Google client id + secret.
2. Zet **Site URL** op je productie-URL.
3. Voeg localhost toe aan **Redirect URLs** voor dev:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```
4. De app filtert op `@linc.nl` domein in [`app/auth/callback/route.ts`](./app/auth/callback/route.ts) — andere accounts worden direct uitgelogd.

### Google Cloud Console

Enable deze APIs in je Google Cloud project:

- **Google Calendar API** — nodig voor de "Plan afspraak met collega" modal op team cards. Vereist `calendar.freebusy` (vrije tijden opzoeken) en `calendar.events` (uitnodiging aanmaken).

Scopes worden opgevraagd in [`app/(auth)/login/page.tsx`](<./app/(auth)/login/page.tsx>); bij het toevoegen van nieuwe scopes moeten gebruikers opnieuw inloggen om een refreshed provider token te krijgen.

> Google Chat scopes hebben we **niet** meer nodig — de chat-knoppen linken rechtstreeks naar `https://mail.google.com/chat/` zodat de user zelf kan zoeken. De API-variant vereist een geregistreerde Chat app in Cloud Console en die setup valt buiten de scope van dit project.

## Projectstructuur

```
app/
  (auth)/
    login/                  # Google SSO login page
  (app)/                    # Authed shell (sidebar + topbar)
    home/                   # Dashboard — nieuw / ervaren / begeleider
    kennisbank/             # Artikelen overzicht + detail + create
    mijn-pad/               # Onboardingpad — fase → module → taken
    praktische-info/        # Categorie lijst → detail → artikel
    team/                   # Team lijst + lid detailpagina
  api/
    calendar/               # freeBusy + event invite endpoints
  auth/
    callback/               # OAuth callback handler
  not-found.tsx             # 404 page
  layout.tsx                # Root layout (lang="nl", fonts)

components/
  layout/                   # App shell, sidebar, top-bar, mobile menu
  home/                     # Dashboard-specifieke rijen / cards
  knowledge/                # Kennisbank cards, filters
  my-path/                  # Onboarding cards, modals, confetti
  practical/                # Category rows, BHV cards, document rows
  team/                     # Team card, schedule modal, XP tier card
  ui/                       # Animated arrow, arrow link, etc.

lib/
  mock-data/                # Mock data tot DB-tables live zijn
  supabase/
    client.ts               # Browser client
    server.ts               # Server Component client
    admin.ts                # Service-role client (server only)
  team/
    server.ts               # Supabase Auth → TeamMember merge helpers
  types/                    # TypeScript types per domein
```

## Belangrijke patronen

### App shell + scroll

- `components/layout/app-shell.tsx` zet een fixed height `flex` container.
- Rechter inhoud scrollt; sidebar + top-bar blijven gefixeerd.
- Sommige detailpagina's (team, schedule modal) hebben hun eigen twee-pane scroll.

### Mijn Pad state

- Fase + module + taak data staat in `lib/mock-data/my-path.ts`.
- De checklist (`ModuleTaskChecklist`) is client-side React state — bij reload reset de demo naar 2-van-5 voltooid.
- De "fase voltooid" celebration modal gebruikt CSS-keyframes + een eager-loaded confetti image in `public/images/confetti.webp`.
- De "Claim je XP" mini-explosie in de module-pagina gebruikt de Web Animations API per particle.

### Team + agenda

- Team lijst wordt gehydreerd uit Supabase Auth (`lib/team/server.ts`). Mock metadata (jobTitle, discipline, expertises) wordt per email gematched.
- Schedule modal: 14 dagen freeBusy → cal.com-achtige date picker + time grid → titel+beschrijving → `POST /api/calendar/invite` stuurt de uitnodiging via Google Calendar.
- Beide deelnemers worden attendee (organiser staat op `responseStatus: "accepted"`).

## Deploy

1. Push naar je remote.
2. Importeer in Vercel, vul alle env vars in (incl. `SUPABASE_SERVICE_ROLE_KEY`).
3. Voeg je Vercel URL toe aan Supabase → Redirect URLs.
4. Update Google Cloud Console OAuth redirect URI (`https://<jouw-domein>.vercel.app/auth/callback`) als je ook direct-to-Google OAuth gebruikt. Voor de Supabase flow is dat niet nodig — Google callt altijd Supabase.

## Scripts

| Command         | Effect                           |
| --------------- | -------------------------------- |
| `npm run dev`   | Next.js dev server met Turbopack |
| `npm run build` | Production build                 |
| `npm run start` | Production server (na build)     |
| `npm run lint`  | ESLint                           |
