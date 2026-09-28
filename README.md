# Digital Buy

Production-ready ecommerce application for gaming account access and OTT subscriptions, built for GitHub + Vercel.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL and Storage
- Vercel deployment
- Server-side authorization and Row Level Security
- AES-256-GCM encrypted delivered credentials
- Manual bKash and Nagad payment verification

## Implemented features

- Database-driven Gaming and OTT storefront
- Shared and Personal account types
- Steam, Xbox, Ubisoft and configurable OTT platforms
- Configurable products, price, duration, stock, availability, artwork and trailers
- Real Supabase email/password authentication
- Email verification and password recovery
- Protected My Orders
- Manual bKash/Nagad checkout and payment references
- Transactional order creation and stock decrement
- Secure admin dashboard and server-side authorization
- Payment approval/rejection and order status workflow
- Encrypted credential delivery
- Product/category/platform/customer administration
- Supabase Storage product image uploads
- Rate limiting on sensitive actions
- Privacy Policy, Terms, favicon, metadata, sitemap, robots, 404, loading/error/empty states and notifications
- Production launch lock

The required initial **Ubisoft Full Library** shared rental is seeded at **150 BDT/month**, but it remains fully editable from the admin dashboard.

## Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
CREDENTIAL_ENCRYPTION_KEY=
NEXT_PUBLIC_BKASH_MERCHANT_NUMBER=
NEXT_PUBLIC_NAGAD_MERCHANT_NUMBER=
LAUNCH_READY=false
```

Generate the credential encryption key:

```bash
openssl rand -base64 32
```

Never expose `SUPABASE_SECRET_KEY` or `CREDENTIAL_ENCRYPTION_KEY` in client-side code.

## Supabase setup

Apply these migrations in order:

1. `supabase/migrations/001_initial.sql`
2. `supabase/migrations/002_admin_workflows.sql`

The schema creates users/profiles, products, categories, platforms, orders, order items, payments, delivered credentials, admin users, indexes, RLS policies, rate limiting, transactional checkout, Storage configuration and seed catalog data.

### Create the first admin

1. Create the admin as a normal Supabase Auth email/password user.
2. Verify the email.
3. Copy the user's UUID from Supabase Auth.
4. Replace the placeholder UUID in `supabase/seed-admin.sql`.
5. Run that SQL once.

Do not store an administrator password in source code or environment variables.

## Real authentication email

For production, configure a real SMTP provider in Supabase Auth and keep email confirmation enabled.

Recommended confirmation template target:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/
```

Recommended recovery target:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/update-password
```

Set the Supabase Site URL to the final HTTPS custom domain and include valid development/preview redirect URLs while testing.

## Payments

The initial release intentionally uses manual payment verification.

1. Customer selects bKash or Nagad.
2. Customer pays the configured receiving number.
3. Customer submits payer number and transaction/reference ID.
4. Order enters `payment_submitted`.
5. Admin reviews the payment.
6. Approval changes payment to `verified` and order to `confirmed`.
7. Rejection changes the order to `failed` and restores tracked stock.

The application does not claim automatic bKash/Nagad verification.

## Local development

```bash
npm install
npm run dev
```

Before deployment:

```bash
npm run typecheck
npm run smoke
npm run build
```

## Vercel deployment

1. Import this GitHub repository into Vercel.
2. Configure all variables from `.env.example`.
3. Keep `LAUNCH_READY=false` while Supabase, SMTP, payment numbers and the custom domain are being configured.
4. Connect and validate the final custom domain.
5. Set `NEXT_PUBLIC_SITE_URL` to that exact HTTPS domain.
6. Update Supabase Auth Site URL and redirect URLs.
7. Verify favicon, Privacy Policy and Terms.
8. Complete production acceptance testing.
9. Set `LAUNCH_READY=true` only when the site is actually ready to launch.

The production launch guard also checks that the request hostname matches `NEXT_PUBLIC_SITE_URL`, so the raw Vercel hostname can remain closed.

## Acceptance checklist

Verify with real configured services:

- Registration and actual verification email
- Login/logout
- Password reset
- Protected customer routes
- Normal users blocked from admin routes
- Product search/filter/detail
- Checkout validation
- Order creation
- Duplicate payment reference protection
- Admin payment approval/rejection
- Order status workflow
- Encrypted credential delivery
- My Orders ownership protection
- Stock decrement/restoration
- Product/category/platform CRUD
- Mobile layouts
- Invalid forms and failed requests
- Empty/loading/error states
- 404
- Privacy and Terms pages

Do not enable launch until those checks pass with your production configuration.

## Security notes

- Passwords are handled by Supabase Auth, never stored as plaintext by this app.
- Sensitive database/admin secrets are server-only.
- Public catalog access is separated from protected customer/order data through RLS and grants.
- Delivered credentials are encrypted before storage and decrypted only server-side after ownership/admin checks.
- No live credentials belong in GitHub.
