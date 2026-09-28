"use client";
import { useEffect } from "react";
import { useToast } from "@/components/toast";
export type ActionState = { ok?: boolean; message?: string; fieldErrors?: Record<string, string[] | undefined> };
export function ActionFeedback({ state }: { state: ActionState }) {
  const { push } = useToast();
  useEffect(() => { if (state.message) push(state.message, state.ok ? "success" : "error"); }, [state.message, state.ok, push]);
  return null;
}
