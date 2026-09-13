# Digital Buy — where to plug things in

Everything below is already wired with a working placeholder/demo path, so the
site is fully clickable before you add real credentials.

| What | File | What to change |
| --- | --- | --- |
| **Firebase (client)** | `.env` + `src/lib/firebase-client.ts` | Add `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` from Firebase console → Project settings. Enable **Google** and **Phone** under Authentication → Sign-in method. Once `NEXT_PUBLIC_FIREBASE_API_KEY` is set, the login modal automatically switches to Firebase for both Google (popup) and phone OTP (invisible reCAPTCHA — Google auto-clears it for almost every real visitor, closest web equivalent to Android's silent SMS verification). Without it, the old demo Google OAuth / dev-mode OTP flow below still runs. |
| **Firebase (server/admin SDK)** | `.env` + `src/lib/firebase-admin.ts` | Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` from a service-account key (Project settings → Service accounts → Generate new private key). Required so `/api/auth/firebase/session` can verify ID tokens server-side before creating the session cookie. |
| **Google OAuth keys (legacy fallback)** | `.env` + `src/app/api/auth/google/route.ts` | Add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Redirect URI → `{origin}/api/auth/google/callback`. Only used while Firebase isn't configured. |
| **OTP / SMS API (legacy fallback)** | `src/app/api/auth/otp/send/route.ts` | Replace the commented Twilio Verify / SSL Wireless block and set `SMS_PROVIDER_TOKEN`. Only used while Firebase isn't configured; while unset, the 6-digit code is returned to the UI and auto-filled (dev mode). Numbers are validated as `+8801XXXXXXXXX` in `src/lib/phone.ts`. |
| **Admin panel login** | `.env` + `src/lib/admin-auth.ts` | Add `ADMIN_USERNAME` / `ADMIN_PASSWORD`. The very first successful login at `/admin/login` creates the first row in the `admins` table (bcrypt-hashed) and those two env vars stop mattering — add more admins or rotate the password directly in that table afterwards. This is a separate cookie/session from buyer accounts; no Google or phone sign-in is offered there. |
| **Payment verification** | `src/app/api/orders/route.ts` | Call the bKash Tokenized Checkout / Nagad Merchant API, then flip `status` from `pending` → `success` and attach credentials. |
| **Merchant numbers** | `src/lib/catalog.ts` → `MERCHANT` | Your real bKash / Nagad numbers shown on the checkout page. |
| **Messenger link** | `src/lib/catalog.ts` → `SUPPORT_MESSENGER_URL` | Replace `https://m.me/YOUR_PAGE` with your Facebook page inbox. |
| **Prices / validity** | `src/lib/catalog.ts` | Every price is `৳ TBD`. Games use `price` + `sharedValidity`; OTT plans use `price` + `validity`. |
| **Trailers** | `src/lib/catalog.ts` → `trailerId` | YouTube video ids used by the embedded player. |
| **Background videos** | `src/lib/catalog.ts` → `GAMING_BG_VIDEOS`, `OTT_BG_VIDEOS` | Swap with your own Forza / COD / GTA and Money Heist / Stranger Things montages (muted, looping MP4s). |
| **Cover art** | `src/components/game/CoverArt.tsx` | Procedural gradient capsules today — replace with `next/image` + real key art. |

## Data model (Drizzle, `src/db/schema.ts`)

- `users` — Google, phone-OTP, or Firebase (Google/phone) accounts;
  `firebase_uid` links a row to its Firebase identity once one exists
- `sessions` — httpOnly cookie sessions for buyers (`db_session`)
- `otp_codes` — 5-minute single-use codes (legacy fallback path only)
- `orders` — manual bKash/Nagad orders, `pending | success | failed`, with the
  delivered `credential_email` / `credential_password` (only served through
  `/api/orders/[id]/credentials` for the owner of a delivered order)
- `admins` — admin panel accounts (bcrypt-hashed password), separate from `users`
- `admin_sessions` — httpOnly cookie sessions for admins (`db_admin_session`)

Apply schema changes with `npx drizzle-kit push`.

## Marking an order as delivered (admin flow)

Go to **`/admin/login`**, sign in with the admin username/password, then open
the order under the *Pending* tab and fill in status, note, and the
credential email/password — no SQL needed. (The raw SQL below still works if
you ever want to do it by hand.)

```sql
UPDATE orders
SET status = 'success',
    note = 'Delivered. Do not change the password.',
    credential_email = 'account@mail.com',
    credential_password = 'SuperSecret123'
WHERE reference = 'DB-ABC123';
```

The buyer then sees the credentials under **My Orders → Successful → Click to reveal**.

## Animation map

- `src/components/brand/HelloIntro.tsx` — Apple-style cursive **hello** draw
  (real lettering path, 2.5s `pathLength` animation, rainbow gradient stroke),
  then the “Welcome to Digital Buy” fade + slide-up. Runs once per session.
- `src/components/brand/DMark.tsx` — the **D** logo, same stroke-draw technique.
- `src/components/system/RouteLoader.tsx` — the D redraws on every route change
  (eFootball-style, tap anywhere to skip).
- `src/components/ui/MagneticButton.tsx` — magnetic cursor + ripple.
- `src/components/ui/Aurora.tsx` — animated aurora blobs, starfield, grid.
