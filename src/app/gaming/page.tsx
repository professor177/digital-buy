import ModeChooser from "@/components/ui/ModeChooser";

export const metadata = { title: "Gaming Accounts — Digital Buy" };

export default function GamingPage() {
  return (
    <div className="relative bg-bg min-h-screen">
      <ModeChooser
        title="Gaming Accounts"
        subtitle="Pick how you want to play. Shared accounts are budget friendly with a fixed validity; personal accounts are permanently yours."
        options={[
          {
            href: "/gaming/shared",
            label: "SHARED",
            tagline: "Offline or family-library access at a lower price.",
            bullets: [
              "Choose Steam, Xbox or Ubisoft store",
              "Limited validity (1-3 months)",
              "Best value for single-player titles",
            ],
          },
          {
            href: "/gaming/personal",
            label: "PERSONAL",
            tagline: "A permanent account that belongs only to you.",
            bullets: [
              "All titles in one unified library",
              "Pick your preferred platform at checkout",
              "No expiry — lifetime ownership",
            ],
          },
        ]}
      />
    </div>
  );
}
