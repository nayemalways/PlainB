# PlainB frontend migration notes

## What changed

- Bootstrap CSS, JavaScript, icon fonts, data attributes, and Bootstrap-specific components were removed.
- The client now uses Tailwind CSS 4, shadcn-style Radix primitives, Lucide icons, Motion, and Swiper.
- Routing uses nested lazy routes, error handling, legacy redirects, and protected customer routes.
- API traffic uses one credentialed Axios client with CSRF headers, one refresh queue, and one retry.
- Access and refresh tokens are HttpOnly cookies. Refresh sessions rotate and token reuse revokes the family.
- Zustand state is split by auth, products, cart, wishlist, reviews, orders, and profile.
- Product browsing supports optional pagination and sorting while retaining legacy responses.
- Light, dark, and system themes are supported without startup flashing.

## Generated assets

The built-in image-generation workflow produced three original, optimized WebP assets:

- `plainb-marketplace-hero.webp`
- `plainb-promo-banner.webp`
- `plainb-support-placeholder.webp`

The support portrait is explicitly a generic placeholder. The assets contain no embedded text, logos, payment claims, or real-person identity claims.

## Local setup

1. Copy `server/.env.example` to `server/.env` and configure its values.
2. Copy `client/.env.example` to `client/.env`.
3. Run `npm install` inside both `server` and `client`.
4. Run `npm run dev` in both directories.

## Verification

Client: `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

Server: `npm run typecheck`, `npm run lint`, and `npm run build`.

## Manual regression checklist

- OTP login, logout, restored sessions, expired-access refresh, failed refresh, and protected-route return.
- Product tabs, brand/category browsing, search, sorting, pagination, details, reviews, cart, and wishlist.
- Stripe checkout handoff, success/cancel callbacks, orders, order details, and invoice PDF.
- Profile and address updates.
- Direct refresh of canonical and legacy URLs on Vercel.
- Keyboard navigation, focus, mobile navigation, reduced motion, themes, and fixed-action overlap.
- Loading, empty, API error, unavailable-form, route-error, and 404 states.

## Remaining business dependencies

- Verified company address, email, telephone, social profiles, business hours, leadership, and support availability.
- Contact and complaint submission endpoints.
- Approved delivery estimates and complete refund/privacy content.
- Search suggestions and newsletters are intentionally not claimed or implemented.
