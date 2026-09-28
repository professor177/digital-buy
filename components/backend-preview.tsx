import Link from "next/link";

export function BackendPreview({
  title,
  platforms,
}: {
  title: string;
  platforms: string[];
}) {
  return (
    <div className="catalog-preview">
      <div className="catalog-preview-head">
        <div>
          <p className="eyebrow">Catalog preview</p>
          <h2>{title}</h2>
        </div>
        <span>DATABASE NOT CONNECTED</span>
      </div>

      <div className="preview-platform-grid">
        {platforms.map((platform, index) => (
          <div className="preview-platform-card" key={platform}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{platform}</strong>
            <p>Products, price, duration and stock will load from Supabase.</p>
          </div>
        ))}
      </div>

      <div className="preview-notice">
        This preview intentionally shows no invented products or prices. Connect
        Supabase to activate the real catalog, authentication and checkout.
        <Link href="/">Back to store</Link>
      </div>
    </div>
  );
}
