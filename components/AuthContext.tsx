"use client"

import * as React from "react"
import type { User as FirebaseUser } from "firebase/auth"
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore"

import { auth, db } from "@/lib/firebase"

export type UserRole = "pending" | "member" | "admin" | "rejected"

export type UserDoc = {
  email?: string
  role?: UserRole
  name?: string
  bio?: string
  skills?: string
  phoneNumber?: string
  level?: string
  course?: string
  githubUsername?: string
  applicationSubmitted?: boolean
  applicationSubmittedAt?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

type AuthContextValue = {
  user: FirebaseUser | null
  role: UserRole | null
  userDoc: UserDoc | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null)
  const [role, setRole] = React.useState<UserRole | null>(null)
  const [userDoc, setUserDoc] = React.useState<UserDoc | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let unsubscribeUserDoc: null | (() => void) = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      setUser(firebaseUser)
      setLoading(true)

      if (!firebaseUser) {
        setRole(null)
        setUserDoc(null)
        setLoading(false)
        return
      }

      const userRef = doc(db, "users", firebaseUser.uid)

      unsubscribeUserDoc = onSnapshot(userRef, async (snap) => {
        if (!snap.exists()) {
          await setDoc(
            userRef,
            {
              email: firebaseUser.email ?? undefined,
              role: "pending" satisfies UserRole,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          )
          return
        }

        const data = snap.data() as DocumentData
        const nextDoc: UserDoc = {
          email: data.email,
          role: data.role,
          name: data.name,
          bio: data.bio,
          skills: data.skills,
          phoneNumber: data.phoneNumber,
          level: data.level,
          course: data.course,
          githubUsername: data.githubUsername,
          applicationSubmitted: data.applicationSubmitted,
          applicationSubmittedAt: data.applicationSubmittedAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }

        setUserDoc(nextDoc)
        setRole((nextDoc.role as UserRole) ?? "pending")
        setLoading(false)
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeUserDoc) unsubscribeUserDoc()
    }
  }, [])

  const signOut = React.useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, role, userDoc, loading, signOut }),
    [user, role, userDoc, loading, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />")
  }
  return ctx
}
