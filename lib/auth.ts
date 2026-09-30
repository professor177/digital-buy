import { cookies } from "next/headers";
import { adminAuth, db } from "./firebase-admin";
export const COOKIE = "__session";

// Verified session cookie and a verified email are both required.
export async function getUser() {
  const c = (await cookies()).get(COOKIE)?.value; if (!c) return null;
  try {
    const d = await adminAuth().verifySessionCookie(c, true);
    return d.email_verified ? { uid: d.uid, email: d.email ?? "" } : null;
  } catch { return null; }
}
export const requireUser = getUser;

// Admin status lives in the admins collection, which only the server can read.
export async function requireAdmin() {
  const u = await getUser(); if (!u) return null;
  return (await db().doc(`admins/${u.uid}`).get()).exists ? u : null;
}
