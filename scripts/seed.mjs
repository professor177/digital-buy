// Usage: node --env-file=.env.local scripts/seed.mjs you@example.com
// Creates starter categories/platforms/Ubisoft product and marks the given (already registered) email as admin.
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
initializeApp({ credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") }) });
const db = getFirestore();
const cats = { gaming: "Gaming", ott: "OTT" }; let i = 1;
for (const [id, name] of Object.entries(cats)) await db.doc(`categories/${id}`).set({ name, sortOrder: i++, isActive: true }, { merge: true });
const plats = [["steam", "Steam", "gaming"], ["xbox", "Xbox", "gaming"], ["ubisoft", "Ubisoft", "gaming"], ["netflix", "Netflix", "ott"], ["spotify", "Spotify", "ott"], ["hbo", "HBO", "ott"], ["youtube-premium", "YouTube Premium", "ott"], ["chatgpt", "ChatGPT", "ott"]];
for (const [id, name, categoryId] of plats) await db.doc(`platforms/${id}`).set({ name, categoryId, brandColor: null, isActive: true }, { merge: true });
await db.doc("products/ubisoft-full-library").set({ platformId: "ubisoft", platformName: "Ubisoft", categoryId: "gaming", name: "Ubisoft Full Library", kind: "library_rental", accountType: "shared",
  description: "Access to the entire Ubisoft account library on a shared monthly rental.", genre: "", priceBdt: 150, durationDays: 30, stock: 0, isAvailable: true, imageUrl: null, bannerUrl: null, trailerUrl: null,
  instructions: "Login details are delivered to My Orders after payment is verified.", updatedAt: Timestamp.now() }, { merge: true });
if (process.argv[2]) { const u = await getAuth().getUserByEmail(process.argv[2]); await db.doc(`admins/${u.uid}`).set({ email: u.email }); console.log("Admin set:", u.email); }
console.log("Seed complete. Ubisoft stock is 0: set it in /admin.");
