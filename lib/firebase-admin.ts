import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getPrivateKey() {
  const key =
    process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY ??
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  if (!key) return null
  return key.replace(/\\n/g, "\n")
}

function getAdminApp() {
  if (getApps().length) return getApps()[0]

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail =
    process.env.NEXT_FIREBASE_ADMIN_CLIENT_EMAIL ??
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL
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
