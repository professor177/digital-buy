"use client";
export default function Err({ reset }: { reset: () => void }) {
  return <main><h1>Something went wrong</h1><p className="mu">The request failed. Try again in a moment.</p><button onClick={reset}>Try again</button></main>;
}
