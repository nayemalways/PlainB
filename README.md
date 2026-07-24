# PlainB

PlainB is a full-stack TypeScript ecommerce application with a React/Vite storefront, Tailwind design system, Zustand feature stores, Express/MongoDB backend, and Stripe Checkout.

## Run locally

```text
cd server
npm install
copy .env.example .env
npm run dev
```

In another terminal:

```text
cd client
npm install
copy .env.example .env
npm run dev
```

The examples expect the API at `http://localhost:5001/api/v2` and the client at `http://localhost:5173`.

## Quality checks

Both projects provide `typecheck`, `lint`, and `build` scripts. The client also provides Vitest through `npm test`.

See [MIGRATION.md](MIGRATION.md) for architecture changes, generated assets, verification steps, regression coverage, and remaining business dependencies.
