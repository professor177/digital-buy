# Digital Buy — where to plug things in

Everything below is already wired with a working placeholder/demo path, so the
site is fully clickable before you add real credentials.

| What | File | What to change |
| --- | --- | --- |
| **Google OAuth keys** | `.env` + `src/app/api/auth/google/route.ts` | Add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Redirect URI → `{origin}/api/auth/google/callback`. Without keys the route signs in a demo user. |
| **OTP / SMS API** | `src/app/api/auth/otp/send/route.ts` | Replace the commented Twilio Verify / SSL Wireless block and set `SMS_PROVIDER_TOKEN`. While unset, the 6-digit code is returned to the UI and auto-filled (dev mode). Numbers are validated as `+8801XXXXXXXXX` in `src/lib/phone.ts`. |
| **Payment verification** | `src/app/api/orders/route.ts` | Call the bKash Tokenized Checkout / Nagad Merchant API, then flip `status` from `pending` → `success` and attach credentials. |
| **Merchant numbers** | `src/lib/catalog.ts` → `MERCHANT` | Your real bKash / Nagad numbers shown on the checkout page. |
| **Messenger link** | `src/lib/catalog.ts` → `SUPPORT_MESSENGER_URL` | Replace `https://m.me/YOUR_PAGE` with your Facebook page inbox. |
| **Prices / validity** | `src/lib/catalog.ts` | Every price is `৳ TBD`. Games use `price` + `sharedValidity`; OTT plans use `price` + `validity`. |
| **Trailers** | `src/lib/catalog.ts` → `trailerId` | YouTube video ids used by the embedded player. |
| **Background videos** | `src/lib/catalog.ts` → `GAMING_BG_VIDEOS`, `OTT_BG_VIDEOS` | Swap with your own Forza / COD / GTA and Money Heist / Stranger Things montages (muted, looping MP4s). |
| **Cover art** | `src/components/game/CoverArt.tsx` | Procedural gradient capsules today — replace with `next/image` + real key art. |

## Data model (Drizzle, `src/db/schema.ts`)

- `users` — Google or phone-OTP accounts
- `sessions` — httpOnly cookie sessions (`db_session`)
- `otp_codes` — 5-minute single-use codes
- `orders` — manual bKash/Nagad orders, `pending | success | failed`, with the
  delivered `credential_email` / `credential_password` (only served through
  `/api/orders/[id]/credentials` for the owner of a delivered order)

Apply schema changes with `npx drizzle-kit push`.

## Marking an order as delivered (admin flow)

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
  then the “Welcome to Digital Buy” fade + slide-up. First visit of a session.
- `src/components/brand/eFootballLoader.tsx` — the **celebration-skip loader**.
  Phase 1 spins a metallic emblem (counter-rotating rings, breathing aura,
  3D `rotateY` on the “D”, progress arc) over animated speed-lines; phase 2
  fires on load-complete *or any tap/keypress*, zooming the emblem to
  `scale: 7` with a 20px camera blur, flare rings, a white flash and a
  split-panel wipe that reveals the page. Skip badge sits bottom-right.
- `src/components/brand/DMark.tsx` — the **D** logo, stroke-draw technique.
- `src/components/system/RouteLoader.tsx` — mounts the eFootball loader on
  every route change (state derived during render, so it shows on frame 1).
- `src/components/ui/CustomCursor.tsx` — neon dot + spring follower ring
  (`stiffness: 250`, `damping: 20`), magnetic lock-on to any
  `a / button / input / .magnetic-target`, cross-hair ticks on hover and a
  shockwave ripple on mousedown. Auto-disabled on `pointer: coarse`.
- `src/components/ui/RealisticButton.tsx` — metallic glass esports button.
- `src/components/ui/MagneticButton.tsx` — magnetic cursor + ripple (hero cards).
- `src/components/ui/Aurora.tsx` — animated aurora blobs, starfield, grid.

### `<RealisticButton />` usage

```tsx
<RealisticButton variant="cyber" size="lg" icon={Rocket} trailingIcon={ArrowRight} href="/gaming">
  Enter store
</RealisticButton>
```

Variants: `cyber · violet · ember · steel · lime` — sizes: `sm · md · lg`.
Props: `href` (renders a `Link`), `onClick`, `type`, `disabled`, `fullWidth`,
`tiltStrength` (default `10`).

> **Server Components:** React cannot serialise a component across the
> server/client boundary, so `icon={Rocket}` only works from a Client
> Component. From a Server Component pass a rendered node instead:
> `icon={<Rocket size={13} />}`. Both forms are supported.

### New CSS primitives (`globals.css`)

`.speed-lines`, `.noise`, `.animate-emblem-spin`, `.animate-emblem-spin-rev`,
`.animate-aura-breath`, `.animate-scan-sweep`, `.animate-skip-pulse`,
`.animate-gloss`, and `.cursor-none-root` (native-cursor suppression, kept
`text` over inputs). All animation work is done with GPU-friendly
`transform` / `opacity` / `filter` and `transform-gpu`.

## Admin panel (/admin)

A separate username+password admin dashboard lives at `/admin`, unrelated
to customer login. It manages orders (view, mark pending/success/failed,
attach delivered credentials).

Env vars (add in Vercel → Settings → Environment Variables):

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

The first successful login with these credentials creates the admin row
in the database (password stored hashed). After that, the env vars no
longer matter — the database row is what's checked. Visit `/admin/login`
to sign in.

## Game thumbnails

See `public/games/README.md` — drop images there and reference them from
`src/lib/catalog.ts` via each game's `image` field.
