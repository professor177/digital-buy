"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({ children, pendingText = "Working...", className = "btn btn-primary", disabled = false }: { children: React.ReactNode; pendingText?: string; className?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button className={className} type="submit" disabled={pending || disabled}>{pending ? pendingText : children}</button>;
}
