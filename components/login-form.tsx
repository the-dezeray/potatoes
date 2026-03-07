"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Mail, 
  Lock,
  Loader2,
  LogIn,
  Chrome,
  AlertCircle
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db, googleProvider } from "@/lib/firebase"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function ensureUserDoc(uid: string, nextEmail?: string | null) {
    const userDocRef = doc(db, "users", uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        email: nextEmail ?? undefined,
        role: "pending",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
      return "pending"
    } else {
      await setDoc(
        userDocRef,
        { email: nextEmail ?? undefined, updatedAt: serverTimestamp() },
        { merge: true }
      )
      const data = userDocSnap.data()
      return (data?.role as string) ?? "pending"
    }
  }

  function redirectForRole(role: string, applicationSubmitted?: boolean) {
    if (role === "admin") return "/admin"
    if (role === "member") return "/portal"
    if (applicationSubmitted) return "/apply/status"
    return "/apply"
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const role = await ensureUserDoc(cred.user.uid, cred.user.email)
      const snap = await getDoc(doc(db, "users", auth.currentUser!.uid))
      const appSubmitted = snap.exists() ? !!snap.data()?.applicationSubmitted : false
      router.replace(redirectForRole(role, appSubmitted))
    } catch (e: any) {
      setError(e?.message ?? "Authentication failed")
    } finally {
      setSubmitting(false)
    }
  }

  async function onGoogle() {
    setSubmitting(true)
    setError(null)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const role = await ensureUserDoc(cred.user.uid, cred.user.email)
      const snap = await getDoc(doc(db, "users", cred.user.uid))
      const appSubmitted = snap.exists() ? !!snap.data()?.applicationSubmitted : false
      router.replace(redirectForRole(role, appSubmitted))
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("w-full max-w-md font-pixel-circle", className)} {...props}>
      {/* Peach card with yellow drop shadow — matches CTA banner style */}
      <div
        className="bg-[#f4c3b3] border-2 border-[#1c1c1c] rounded-2xl p-10 md:p-12"
        style={{ boxShadow: "8px 8px 0px 0px #fbd35a" }}
      >
        {/* Logo */}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#5a2e26] tracking-wider uppercase leading-none">
            Login
          </h1>
          <p className="text-[#844b3e] text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Enter your credentials
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#fbd35a] border border-[#1c1c1c] rounded-xl text-[#5a2e26] text-[10px] font-bold uppercase tracking-wider"
              style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#844b3e] ml-1"
            >
              <Mail className="w-3 h-3" /> Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/60 text-[#1c1c1c] placeholder-[#c4917f] border-2 border-[#1c1c1c] focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none font-medium"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#844b3e] ml-1"
            >
              <Lock className="w-3 h-3" /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/60 text-[#1c1c1c] placeholder-[#c4917f] border-2 border-[#1c1c1c] focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            {/* Primary: Yellow */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 h-14 bg-[#fbd35a] text-[#1c1c1c] border border-[#1c1c1c] hover:bg-[#f2c744] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg group"
              style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <LogIn className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {/* Secondary: Dark */}
            <button
              type="button"
              onClick={onGoogle}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 h-14 bg-[#363636] text-white border border-[#1c1c1c] hover:bg-[#444] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg group"
              style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Google Sign-In</span>
            </button>
          </div>
        </form>

        {/* Footer link */}
        <div className="mt-8 pt-6 border-t-2 border-[#1c1c1c]/20 text-center">
          <Link
            href="/register"
            className="text-[11px] text-[#844b3e] hover:text-[#5a2e26] transition-colors uppercase tracking-widest font-bold"
          >
            No account?{" "}
            <span className="border-b border-[#844b3e] ml-1">Register instead</span>
          </Link>
        </div>
      </div>
    </div>
  )
}