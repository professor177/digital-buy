"use client";

/**
 * Lightweight, original SVG marks inspired by each platform's official logo.
 * Swap these for the real brand assets if you have licensing to use them.
 */
export function PlatformLogo({
  slug,
  size = 40,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    className,
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "steam":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#1b2838" stroke="#66c0f4" strokeWidth="2" />
          <circle cx="41" cy="24" r="9" stroke="#c7d5e0" strokeWidth="3.2" fill="none" />
          <circle cx="41" cy="24" r="3.6" fill="#66c0f4" />
          <circle cx="23" cy="42" r="7.5" fill="#c7d5e0" />
          <circle cx="23" cy="42" r="3" fill="#1b2838" />
          <path d="M15 36 L33 27" stroke="#c7d5e0" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "xbox":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#107c10" />
          <path
            d="M19 47c-3-4 6-17 13-24 7 7 16 20 13 24-3.5 4-9.5 6-13 6s-9.5-2-13-6Z"
            fill="#fff"
            opacity="0.15"
          />
          <path d="M18 48C22 36 27 27 32 21c5 6 10 15 14 27" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M20 17c5 2 9 6 12 10-5 8-10 14-14 22" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M44 17c-5 2-9 6-12 10 5 8 10 14 14 22" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      );
    case "ubisoft":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#0b1b2b" stroke="#0082e6" strokeWidth="2" />
          <path
            d="M32 9c12.7 0 23 10.3 23 23S44.7 55 32 55 9 44.7 9 32c0-7 3-13.3 7.8-17.6"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M32 18c7.7 0 14 6.3 14 14s-6.3 14-14 14-14-6.3-14-14c0-4 1.7-7.7 4.4-10.3"
            stroke="#0082e6"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="4.5" fill="#fff" />
        </svg>
      );
    case "netflix":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#0b0b0b" />
          <path d="M22 12h8l12 40h-8L22 12Z" fill="#e50914" />
          <path d="M22 12h7v40h-7V12Z" fill="#b20710" />
          <path d="M35 12h7v40h-7V12Z" fill="#e50914" />
        </svg>
      );
    case "prime-video":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#0f171e" />
          <text
            x="32"
            y="30"
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fill="#fff"
            fontFamily="system-ui"
          >
            prime
          </text>
          <path d="M14 40c11 7 25 7 36 0" stroke="#00a8e1" strokeWidth="4" strokeLinecap="round" />
          <path d="M46 36c3 1 4 4 3 8" stroke="#00a8e1" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "hbo-max":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#0b0018" />
          <text
            x="32"
            y="30"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="#fff"
            fontFamily="system-ui"
          >
            HBO
          </text>
          <text
            x="32"
            y="46"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="#7b2bf9"
            fontFamily="system-ui"
          >
            max
          </text>
        </svg>
      );
    case "disney-plus-hotstar":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#040814" />
          <text
            x="30"
            y="30"
            textAnchor="middle"
            fontSize="14"
            fontStyle="italic"
            fontWeight="700"
            fill="#fff"
            fontFamily="Georgia, serif"
          >
            Disney
          </text>
          <path d="M46 20v10M41 25h10" stroke="#0f4ff5" strokeWidth="3" strokeLinecap="round" />
          <text
            x="32"
            y="47"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#8ab4ff"
            fontFamily="system-ui"
          >
            hotstar
          </text>
        </svg>
      );
    case "spotify":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#1db954" />
          <path d="M18 24c10-3 21-2 29 3" stroke="#000" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M20 33c8-2.5 17-1.6 24 2.6" stroke="#000" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 41.5c6.5-2 13.5-1.3 19 2" stroke="#000" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      );
    case "youtube-premium":
      return (
        <svg {...common} fill="none">
          <rect x="2" y="12" width="60" height="40" rx="11" fill="#ff0033" />
          <path d="M27 23l16 9-16 9V23Z" fill="#fff" />
        </svg>
      );
    case "apple-tv-plus":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#111" />
          <text
            x="30"
            y="40"
            textAnchor="middle"
            fontSize="20"
            fontWeight="600"
            fill="#fff"
            fontFamily="system-ui"
          >
            tv
          </text>
          <path d="M46 26v12M40 32h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "crunchyroll":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#f47521" />
          <path
            d="M44 42c-6 6-17 5-23-1s-6-16 0-22c-2 9 2 17 9 20 5 2 10 2 14 3Z"
            fill="#fff"
          />
          <circle cx="24" cy="26" r="3.6" fill="#f47521" />
        </svg>
      );
    case "zee5":
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#8230c6" />
          <text
            x="32"
            y="40"
            textAnchor="middle"
            fontSize="19"
            fontWeight="800"
            fill="#fff"
            fontFamily="system-ui"
          >
            Z5
          </text>
        </svg>
      );
    case "chorki":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#ff3b5c" />
          <circle cx="32" cy="32" r="11" fill="#fff" />
          <path d="M32 3v12M32 49v12M3 32h12M49 32h12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "canva-pro":
      return (
        <svg {...common} fill="none">
          <circle cx="32" cy="32" r="29" fill="#00c4cc" />
          <text
            x="32"
            y="41"
            textAnchor="middle"
            fontSize="24"
            fontWeight="700"
            fill="#fff"
            fontFamily="Georgia, serif"
          >
            C
          </text>
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none">
          <rect width="64" height="64" rx="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <path d="M32 20v24M20 32h24" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
  }
}

export default PlatformLogo;
