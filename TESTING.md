# Digital Buy testing record

The repository includes the implementation and acceptance procedure. A complete end-to-end production acceptance run requires the owner's Supabase project, SMTP provider, payment receiving numbers, admin identity and custom domain.

Local/static validation performed during generation:

- Required route/file inventory checked
- No real secrets stored in repository
- `.env.example` contains names only
- Manual payment flow does not auto-verify
- Admin authorization is checked server-side and again in database RPCs for payment/status transitions
- Delivered credential table has no customer/anonymous grants
- RLS enabled on all exposed application tables
- Production launch guard defaults closed

Run `npm install && npm run typecheck && npm run build` in an internet-enabled environment before deployment, then complete the README acceptance checklist with real services.
