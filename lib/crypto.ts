import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function key() {
  const raw = process.env.CREDENTIAL_ENCRYPTION_KEY;
  if (!raw) throw new Error("CREDENTIAL_ENCRYPTION_KEY is missing");
  const decoded = Buffer.from(raw, "base64");
  if (decoded.length !== 32) throw new Error("CREDENTIAL_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return decoded;
}

export function encryptSecret(value: string | null | undefined) {
  if (!value) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptSecret(value: string | null | undefined) {
  if (!value) return null;
  const [ivB64, tagB64, encryptedB64] = value.split(".");
  if (!ivB64 || !tagB64 || !encryptedB64) throw new Error("Invalid encrypted payload");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}
