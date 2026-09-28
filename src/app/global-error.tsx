"use client";

/**
 * Last-resort boundary: catches failures in the root layout itself (before
 * the page shell can stream). Renders its own html/body with inline styles
 * so it works even if stylesheets or other chunks failed to load.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0c0b",
          color: "#c9d4cd",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "26rem",
            width: "100%",
            border: "1px solid #202724",
            borderRadius: 10,
            background: "#101413",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              margin: "0 auto",
              borderRadius: 8,
              background: "#35e27f",
              color: "#06140c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            db
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "1.2rem",
              fontWeight: 800,
              margin: "1rem 0 0",
              letterSpacing: "-0.01em",
            }}
          >
            This page could not load
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#94a39b" }}>
            Something failed before the page could render. This is on our side
            and is usually temporary.
          </p>
          {error.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.7rem",
                color: "#5d6a63",
              }}
            >
              Error ref: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: "1.25rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                border: "none",
                borderRadius: 6,
                background: "#35e27f",
                color: "#06140c",
                fontWeight: 700,
                fontSize: "0.875rem",
                padding: "0.65rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                borderRadius: 6,
                border: "1px solid #202724",
                background: "#1c2320",
                color: "#c9d4cd",
                fontWeight: 700,
                fontSize: "0.875rem",
                padding: "0.65rem 1.25rem",
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
