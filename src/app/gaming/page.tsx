import ModeChooser from "@/components/ui/ModeChooser";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { GAMING_BG_VIDEOS } from "@/lib/catalog";

export const metadata = { title: "Gaming Accounts — Digital Buy" };

export default function GamingPage() {
  return (
    <div className="relative">
      {/* Muted looping gameplay montage (Forza / COD / GTA placeholders) */}
      <VideoBackdrop sources={GAMING_BG_VIDEOS} tint="rgba(5,4,12,0.74)" />
      <ModeChooser
        title="🎮 Gaming Accounts"
        subtitle="Pick how you want to play. Shared accounts are budget friendly with a fixed validity; personal accounts are permanently yours."
        options={[
          {
            href: "/gaming/shared",
            label: "SHARED",
            emoji: "🤝",
            tagline: "Offline / family-library access at a lower price",
            bullets: [
              "Choose Steam, Xbox or Ubisoft store",
              "Limited validity (e.g. 1 month)",
              "Best value for single-player titles",
            ],
            from: "#22d3ee",
            to: "#a855f7",
          },
          {
            href: "/gaming/personal",
            label: "PERSONAL",
            emoji: "👤",
            tagline: "A permanent account that belongs only to you",
            bullets: [
              "All titles in one unified library",
              "Pick your preferred platform at checkout",
              "No expiry — lifetime ownership",
            ],
            from: "#fb923c",
            to: "#ec4899",
          },
        ]}
      />
    </div>
  );
}
