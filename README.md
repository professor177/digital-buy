# Digital Buy

Next.js 15 + Firebase (Auth + Firestore) on Vercel. The browser never reads Firestore. Every read and write goes through server code with the Admin SDK.

## Setup
1. Firebase console: enable Authentication > Email/Password. Add your production domain and your vercel.app domain under Authentication > Settings > Authorized domains.
2. Create a Firestore database. Paste `firestore.rules` into the Rules tab and publish (denies all client access).
3. Project settings > Service accounts > Generate new private key. Copy the values into the Vercel variables listed in `.env.example`.
4. Copy `.env.example` to `.env.local`, fill it in, and add the same variables in Vercel.
5. Customize the verification and reset email templates in Authentication > Templates. For a custom sender domain, configure it there.
6. Register your own account on the site and verify the email. Then run: `npm install` then `node --env-file=.env.local scripts/seed.mjs you@example.com`. That creates the starter categories, platforms and Ubisoft Full Library, and makes you the admin.
7. `npm run dev`, then push to GitHub and import into Vercel.

## Notes
- Ubisoft Full Library is seeded at 150 BDT for 30 days with stock 0. Set its stock in /admin.
- Set BKASH_NUMBER and NAGAD_NUMBER.
- Trailer URLs must be embed links (https://www.youtube.com/embed/ID).
- Session cookie is httpOnly. Accounts must have a verified email.
- Order limit: 5 per user per hour. A bKash/Nagad transaction ID can only be used once.
- Delivered passwords are AES-256-GCM encrypted and shown only to the buyer on completed orders.
- Review the Privacy Policy and Terms text with a lawyer. Connect your custom domain and set NEXT_PUBLIC_SITE_URL before launch.
