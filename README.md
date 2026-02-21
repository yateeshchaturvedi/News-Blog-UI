# News-Blog-UI

Frontend for DevOpsTic/NewsBlog, built with Next.js App Router.

## Tech Stack
- Next.js 16
- React 19
- Tailwind CSS
- Server Actions
- Vercel Blob (`@vercel/blob`) for media uploads

## Features
- Public pages:
  - Home
  - Lessons listing and detail
  - Blogs listing and detail
  - Contact
  - Search
- SEO:
  - Canonical metadata
  - OpenGraph/Twitter metadata
  - Dynamic sitemap and robots
- Admin/editor dashboard:
  - Lessons, blogs, categories, advertisements
  - Profile update (username, password reset, avatar)
- Push notification opt-in UI

## Environment Variables
Required:
- `NEXT_PUBLIC_API_BASE_URL` (backend API URL)

Recommended:
- `NEXT_PUBLIC_SITE_URL` (public site URL for canonical/sitemap)
- `API_BASE_URL` (optional server-side fallback API URL)

For Vercel Blob uploads:
- Configure Vercel Blob env vars/secrets in Vercel project settings (used by server actions with `@vercel/blob`).

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```
3. Start dev server:
```bash
npm run dev
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Routing Notes
- Lessons now use slug URLs:
  - `/lessons/<category>/<lesson-title>`
- Legacy lesson detail URLs under `/news/...` are redirected to `/lessons/...`.

## Auth and Session Behavior
- Login stores JWT in HTTP-only cookie (`token`) via Server Actions.
- Route guard in `src/middleware.ts` protects `/admin/*`.
- Expired token redirects to `/admin?session=expired`.

## Deployment (Vercel)
1. Deploy this folder as a Vercel project.
2. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL=https://<api-domain>`
   - `NEXT_PUBLIC_SITE_URL=https://<ui-domain>`
   - Vercel Blob variables required by `@vercel/blob`
3. Build command:
```bash
npm run build
```
4. Validate after deploy:
- Public pages load data from API
- Admin login and dashboard actions work
- Advertisement media renders
- Notification toggle can subscribe (requires API VAPID setup)

## Troubleshooting
- `fetch failed` / `ECONNREFUSED 127.0.0.1:3000`:
  - `NEXT_PUBLIC_API_BASE_URL` is missing or wrong for deployed environment.
- Notifications show `not configured`:
  - API missing `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`.
- Ad blocks show only text:
  - Ensure ad row contains valid media URL (`image_url` / `imageUrl`) and is active.

## Related Docs
- Root full documentation: `../APPLICATION_DOCUMENTATION.md`
