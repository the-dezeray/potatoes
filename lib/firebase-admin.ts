import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function normalizePrivateKey(rawKey: string) {
  const unwrapped = rawKey.replace(/^"|"$/g, "").replace(/^'|'$/g, "").trim()
  return unwrapped
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
}

function getPrivateKey() {
  const key = process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY
  if (!key) return null
  return normalizePrivateKey(key)
}

function getAdminApp() {
  if (getApps().length) return getApps()[0]

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.NEXT_FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = getPrivateKey()

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials.")
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

const adminApp = getAdminApp()

export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
