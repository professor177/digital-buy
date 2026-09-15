"use client";

import { Gamepad2, Users, UserRound } from "lucide-react";

import ModeChooser from "@/components/ui/ModeChooser";
import VideoBackdrop from "@/components/ui/VideoBackdrop";

import { GAMING_BG_VIDEOS } from "@/lib/catalog";

export default function GamingPage() {
  return (
    <div className="relative">
      <VideoBackdrop
        sources={GAMING_BG_VIDEOS}
        tint="rgba(12,10,18,0.74)"
      />

      <ModeChooser
        title="Gaming Accounts"
        titleIcon={Gamepad2}
        subtitle="Pick how you want to play. Shared accounts are budget friendly with a fixed validity; personal accounts are permanently yours."
        options={[
          {
            href: "/gaming/shared",
            label: "SHARED",
            icon: Users,
            tagline: "Offline / family-library access at a lower price",
            bullets: [
              "Choose Steam, Xbox or Ubisoft store",
              "Limited validity (e.g. 1 month)",
              "Best value for single-player titles",
            ],
            from: "#2dd4d4",
            to: "#6366f1",
          },
          {
            href: "/gaming/personal",
            label: "PERSONAL",
            icon: UserRound,
            tagline: "A permanent account that belongs only to you",
            bullets: [
              "All titles in one unified library",
              "Pick your preferred platform at checkout",
              "No expiry, lifetime ownership",
            ],
            from: "#f2b134",
            to: "#ec4899",
          },
        ]}
      />
    </div>
  );
}