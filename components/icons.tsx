import type { SVGProps } from "react";

const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
export function SearchIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>; }
export function LockIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>; }
export function ArrowIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><path d="M5 12h14M14 7l5 5-5 5"/></svg>; }
export function GameIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><path d="M7 8h10a4 4 0 0 1 3.7 5.5l-1.2 3A2.5 2.5 0 0 1 15 17l-1-2h-4l-1 2a2.5 2.5 0 0 1-4.5-.5l-1.2-3A4 4 0 0 1 7 8Z"/><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01"/></svg>; }
export function PlayIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><path d="m8 5 11 7-11 7V5Z"/></svg>; }
export function EyeIcon(p: SVGProps<SVGSVGElement>) { return <svg {...base} {...p}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>; }
