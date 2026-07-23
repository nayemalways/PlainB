# Stripe Payment API Guide

PlainB uses Stripe-hosted Checkout. Prices are always calculated by the backend from the
authenticated user's cart; the frontend never sends an amount.

## Configuration

Add these values to `server/.env`:

```env
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=bdt
```

Use Stripe test keys locally and live keys only in production. Never expose the secret key or
webhook secret in the Vite frontend.

## Authentication

Checkout creation and status requests require the existing access token:

```http
Authorization: Bearer <access-token>
```

## Create a Checkout session

```http
POST /api/v2/payment/checkout
Authorization: Bearer <access-token>
Content-Type: application/json
```

No request body is required. A successful response is:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Stripe Checkout session created.",
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/...",
    "sessionId": "cs_test_...",
    "invoiceId": "..."
  }
}
```

Redirect the browser to `data.checkoutUrl`. Stripe returns the customer to:

- Success: `/payment/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel: `/payment/cancel?invoice_id=<invoice-id>`

The success redirect does not mark an invoice paid. Only a verified Stripe webhook does that.

## Read payment status

```http
GET /api/v2/payment/status/cs_test_...
Authorization: Bearer <access-token>
```

The session must belong to the authenticated user.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment status retrieved.",
  "data": {
    "invoiceId": "...",
    "transactionId": "...",
    "status": "paid",
    "amount": 1050,
    "currency": "BDT"
  }
}
```

Possible statuses are `pending`, `paid`, `failed`, and `cancelled`.

## Cancel a pending Checkout

The frontend calls this after Stripe returns through the cancel URL:

```http
PATCH /api/v2/payment/cancel/<invoice-id>
Authorization: Bearer <access-token>
```

Only a pending invoice owned by the authenticated user can be cancelled.

## Invoice APIs

Both invoice endpoints require the access-token authorization header.

```http
GET /api/v2/invoice
GET /api/v2/invoice/<invoice-id>
Authorization: Bearer <access-token>
```

The list endpoint returns the authenticated user's newest invoices first. The details endpoint
returns the invoice together with its purchased products and the prices captured at checkout.

## Stripe webhook

Configure this endpoint in Stripe Workbench:

```http
POST https://your-api-domain.com/api/v2/payment/webhook
```

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`

For local development:

```bash
stripe listen --forward-to localhost:5001/api/v2/payment/webhook
```

Copy the `whsec_...` value printed by the Stripe CLI into `STRIPE_WEBHOOK_SECRET`, then restart
the server. A standard test card is `4242 4242 4242 4242`, with any future expiry date and any
three-digit CVC.

## Production checklist

1. Replace test keys with live Stripe keys.
2. Register the production HTTPS webhook URL.
3. Store secrets in the hosting provider's environment settings.
4. Confirm `FRONTEND_URL` matches the production client URL.
5. Complete a real low-value payment and verify that the invoice becomes `paid`.
