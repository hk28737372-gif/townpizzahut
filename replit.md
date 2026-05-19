# Town Pizza-Hut (Family Restaurant)

A complete premium restaurant website for Town Pizza-Hut, Swat, Pakistan — featuring a multi-page menu system, cart, WhatsApp ordering, gallery, branches, and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/town-pizza-hut run dev` — run the website (port 25613)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React + Vite + wouter (routing)
- Tailwind CSS v4 + shadcn/ui components
- framer-motion (animations)
- react-icons (WhatsApp icons)
- No backend — all data hardcoded in `src/data/menuData.ts`

## Where things live

- `artifacts/town-pizza-hut/src/` — all source code
- `artifacts/town-pizza-hut/src/data/menuData.ts` — all menu items, deals, branches (source of truth)
- `artifacts/town-pizza-hut/src/context/CartContext.tsx` — cart state with localStorage persistence
- `artifacts/town-pizza-hut/src/pages/` — all pages
- `artifacts/town-pizza-hut/src/components/layout/` — Navbar (with cart drawer) and Footer
- `artifacts/town-pizza-hut/public/logo.png` — restaurant logo

## Architecture decisions

- No backend: all data is hardcoded in `menuData.ts` — images use Unsplash CDN URLs
- WhatsApp ordering: Checkout builds a formatted order message and opens WhatsApp with the branch-specific number
- Cart persists in `localStorage` across page reloads
- Admin panel is client-side only with hardcoded password "townpizza2024"
- Three branches each have separate WhatsApp numbers for order routing

## Product

- **Home**: Hero, features strip, category cards, featured deals, CTA banner
- **Menu**: 27 items across 4 categories (Burgers, Fried Chicken, Shawarma & Rolls, Pizza) with search + filter
- **Deals**: 9 combo deals with add-to-cart
- **Gallery**: 16 photo gallery with category filter
- **Branches**: 3 branch cards with Google Maps embed, call & WhatsApp buttons
- **About**: Restaurant story and values
- **Contact**: Contact form, supervisor numbers, branch quick-contact
- **Checkout**: Cart review, delivery form, WhatsApp order dispatch per branch
- **Admin**: Password-protected dashboard (password: townpizza2024) with products, deals, orders tabs

## User preferences

- Brand colors: Maroon #800020, Gold #D4AF37, Cream #FDFBF7
- Fonts: Playfair Display (headings) + Inter (body)
- WhatsApp numbers: Branch 1 → 03189659090, Branch 3 → 03199629090, Branch 5 → 03409659090

## Gotchas

- All images use Unsplash CDN URLs (no local image files needed)
- Admin panel has no real backend — it's a UI demo only
- The Gallery page has its own local `galleryCategories` array (different from menu categories)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
