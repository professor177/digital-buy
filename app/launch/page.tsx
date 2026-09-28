export const metadata = {
  robots: { index: false, follow: false },
};

export default function LaunchPage() {
  const missingBackend =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return (
    <div className="container py-28 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center border border-sky-500/50 bg-sky-500/10 font-black">
        DB
      </div>

      <h1 className="title-lg mt-6">
        {missingBackend
          ? "Digital Buy deployment is online."
          : "Digital Buy is being prepared for launch."}
      </h1>

      <p className="muted mx-auto mt-5 max-w-2xl leading-7">
        {missingBackend
          ? "The frontend is deployed successfully, but the production Supabase environment variables have not been configured yet. Authentication, catalog data and orders stay unavailable until the backend is connected."
          : "Production access stays closed until the custom domain, live environment variables, favicon, Privacy Policy and Terms & Conditions have been verified."}
      </p>

      {missingBackend && (
        <div className="surface mx-auto mt-8 max-w-2xl p-5 text-left">
          <p className="text-sm font-black">Required Vercel environment variables</p>
          <div className="muted mt-3 space-y-1 font-mono text-xs leading-6">
            <p>NEXT_PUBLIC_SUPABASE_URL</p>
            <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</p>
            <p>SUPABASE_SECRET_KEY</p>
            <p>CREDENTIAL_ENCRYPTION_KEY</p>
            <p>NEXT_PUBLIC_SITE_URL</p>
          </div>
        </div>
      )}
    </div>
  );
}
