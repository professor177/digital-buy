"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessagesSquare, RotateCcw, TriangleAlert } from "lucide-react";
import { SUPPORT_URL } from "@/lib/shared";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap flex min-h-[52vh] items-center justify-center py-20">
      <div className="w-full max-w-md rounded-lg border border-line bg-panel p-8 text-center">
        <TriangleAlert size={28} className="mx-auto text-amber-400" />
        <h1 className="mt-4 text-xl font-extrabold tracking-tight text-white">
          This page could not load
        </h1>
        <p className="mt-3 text-sm leading-6 text-fog">
          Something on our side failed while preparing this page. It is usually
          temporary. The full error is recorded in the server logs for the
          team to inspect.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-fog/60">
            Error ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn btn-brand px-5 py-2.5 text-sm">
            <RotateCcw size={15} /> Try again
          </button>
          <Link href="/" className="btn btn-dark px-5 py-2.5 text-sm">
            Go home
          </Link>
        </div>
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-fog hover:text-white"
        >
          <MessagesSquare size={13} /> Still broken? Message support
        </a>
      </div>
    </div>
  );
}
