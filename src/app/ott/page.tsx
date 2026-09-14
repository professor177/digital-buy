import ModeChooser from "@/components/ui/ModeChooser";

export const metadata = { title: "OTT Subscriptions — Digital Buy" };

export default function OttPage() {
  return (
    <div className="relative bg-bg min-h-screen">
      <ModeChooser
        title="OTT Subscriptions"
        subtitle="Netflix, Prime Video, Spotify and more — as a shared profile or a fully private account."
        options={[
          {
            href: "/ott/shared",
            label: "SHARED",
            tagline: "Your own profile inside a premium plan.",
            bullets: [
              "Duration based: 1 / 3 / 6 months",
              "4K UHD where supported",
              "Cheapest way to stream premium",
            ],
          },
          {
            href: "/ott/personal",
            label: "PERSONAL",
            tagline: "A private account nobody else touches.",
            bullets: [
              "Permanent — no expiry",
              "Change the password freely",
              "All profiles are yours",
            ],
          },
        ]}
      />
    </div>
  );
}
