# tamir39-portfolio

Personal portfolio for Phi Vuong Tuong Tam (`tamir39`). Sci-fi HUD operator-console aesthetic built around a cybercat avatar.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Framer Motion 11

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Structure

- `app/` — routes (`/`, `/profile`, `/missions`, `/missions/[slug]`, `/transmission`)
- `components/` — UI primitives, layout chrome, page-specific sections
- `lib/` — data, motion variants, hooks
- `public/` — avatar, video, resume PDF
