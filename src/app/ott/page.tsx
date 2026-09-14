import { Clapperboard, Users, UserRound } from "lucide-react";

import ModeChooser from "@/components/ui/ModeChooser";
import VideoBackdrop from "@/components/ui/VideoBackdrop";
import { OTT_BG_VIDEOS } from "@/lib/catalog";

export const metadata = { title: "OTT Subscriptions | Digital Buy" };

export default function OttPage() {
  return (
    <div className="relative">
      {/* Muted looping series montage (Money Heist / Stranger Things placeholders) */}
      <VideoBackdrop sources={OTT_BG_VIDEOS} tint="rgba(12,10,18,0.76)" />
      <ModeChooser
        title="OTT Subscriptions"
        titleIcon={Clapperboard}
        subtitle="Netflix, Prime Video, Spotify, HBO Max and more, as a shared profile or a fully private account."
        options={[
          {
            href: "/ott/shared",
            label: "SHARED",
            icon: Users,
            tagline: "Your own profile inside a premium plan",
            bullets: [
              "Duration based: 1 / 3 / 6 months",
              "4K UHD where supported",
              "Cheapest way to stream premium",
            ],
            from: "#f2b134",
            to: "#ec4899",
          },
          {
            href: "/ott/personal",
            label: "PERSONAL",
            icon: UserRound,
            tagline: "A private account nobody else touches",
            bullets: [
              "Permanent, no expiry",
              "Change the password freely",
              "All profiles are yours",
            ],
            from: "#fb923c",
            to: "#f43f5e",
          },
        ]}
      />
    </div>
  );
}
