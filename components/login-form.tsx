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
  AlertCircle,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  X
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
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

  const [showReset, setShowReset] = React.useState(false)
  const [resetEmail, setResetEmail] = React.useState("")
  const [resetSending, setResetSending] = React.useState(false)
  const [resetSent, setResetSent] = React.useState(false)
  const [resetError, setResetError] = React.useState<string | null>(null)

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

  function openReset() {
    setResetEmail(email.trim())
    setResetError(null)
    setResetSent(false)
    setShowReset(true)
  }

  function closeReset() {
    if (resetSending) return
    setShowReset(false)
    setResetError(null)
  }

  function getResetErrorMessage(e: any) {
    const code: string = e?.code ?? ""
    if (code === "auth/invalid-email" || code === "auth/missing-email")
      return "Enter a valid email address."
    if (code === "auth/too-many-requests")
      return "Too many attempts. Try again later."
    if (code === "auth/network-request-failed")
      return "Network error. Check your connection and try again."
    return "Could not send reset email. Try again."
  }

  async function onResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    const target = resetEmail.trim()
    if (!target) {
      setResetError("Enter a valid email address.")
      return
    }
    setResetSending(true)
    setResetError(null)
    try {
      await sendPasswordResetEmail(auth, target)
      // Show generic success even if account doesn't exist (prevents enumeration).
      // Firebase intentionally throws user-not-found in some configs, so swallow it.
      setResetSent(true)
    } catch (e: any) {
      if (e?.code === "auth/user-not-found") {
        setResetSent(true)
      } else {
        setResetError(getResetErrorMessage(e))
      }
    } finally {
      setResetSending(false)
    }
  }

  return (
    <div className={cn("w-full max-w-md font-pixel-circle", className)} {...props}>
      {/* Peach card with yellow drop shadow — matches CTA banner style */}
      <div
        className="bg-[#f4c3b3] border-2 border-[#1c1c1c] rounded-2xl p-7 md:p-9"
        style={{ boxShadow: "8px 8px 0px 0px #fbd35a" }}
      >
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-black text-[#5a2e26] tracking-wider uppercase leading-none">
            Login
          </h1>
          <p className="text-[#844b3e] text-xs font-bold uppercase tracking-[0.2em] mt-1.5">
            Enter your credentials
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
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
              className="w-full bg-white/60 text-[#1c1c1c] placeholder-[#c4917f] border-2 border-[#1c1c1c] focus:bg-white rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium"
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
              className="w-full bg-white/60 text-[#1c1c1c] placeholder-[#c4917f] border-2 border-[#1c1c1c] focus:bg-white rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium"
            />
            <div className="flex justify-end pr-1">
              <button
                type="button"
                onClick={openReset}
                className="text-[10px] text-[#844b3e] hover:text-[#5a2e26] uppercase tracking-widest font-bold border-b border-transparent hover:border-[#5a2e26] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-1 space-y-2.5">
            {/* Primary: Yellow */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 h-11 bg-[#fbd35a] text-[#1c1c1c] border border-[#1c1c1c] hover:bg-[#f2c744] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg group"
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
              className="w-full flex items-center justify-center gap-2 h-11 bg-[#363636] text-white border border-[#1c1c1c] hover:bg-[#444] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg group"
              style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>Google Sign-In</span>
            </button>
          </div>
        </form>

        {/* Footer link */}
        <div className="mt-5 pt-4 border-t-2 border-[#1c1c1c]/20 text-center">
          <Link
            href="/register"
            className="text-[11px] text-[#844b3e] hover:text-[#5a2e26] transition-colors uppercase tracking-widest font-bold"
          >
            No account?{" "}
            <span className="border-b border-[#844b3e] ml-1">Register instead</span>
          </Link>
        </div>
      </div>

      {/* Forgot password dialog */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1c1c1c]/60"
          onClick={closeReset}
          role="dialog"
          aria-modal="true"
          aria-label="Forgot password"
        >
          <div
            className="w-full max-w-md bg-[#f4c3b3] border-2 border-[#1c1c1c] rounded-2xl p-7"
            style={{ boxShadow: "8px 8px 0px 0px #fbd35a" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black text-[#5a2e26] tracking-wider uppercase leading-none">
                  <KeyRound className="w-5 h-5" /> Reset password
                </h2>
                <p className="text-[#844b3e] text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  We&apos;ll email you a reset link
                </p>
              </div>
              <button
                type="button"
                onClick={closeReset}
                aria-label="Close"
                className="p-1.5 bg-white/60 border-2 border-[#1c1c1c] rounded-lg text-[#5a2e26] hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="space-y-4">
                <div
                  className="flex items-center gap-2 p-3 bg-[#fbd35a] border border-[#1c1c1c] rounded-xl text-[#5a2e26] text-[10px] font-bold uppercase tracking-wider"
                  style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    If an account exists for {resetEmail.trim()}, a reset link is on its way. Check spam too.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeReset}
                  className="w-full flex items-center justify-center gap-2 h-11 bg-[#363636] text-white border border-[#1c1c1c] hover:bg-[#444] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] rounded-lg"
                  style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </button>
              </div>
            ) : (
              <form onSubmit={onResetSubmit} className="space-y-4">
                {resetError && (
                  <div
                    className="flex items-center gap-2 p-3 bg-[#fbd35a] border border-[#1c1c1c] rounded-xl text-[#5a2e26] text-[10px] font-bold uppercase tracking-wider"
                    style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-email"
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#844b3e] ml-1"
                  >
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-white/60 text-[#1c1c1c] placeholder-[#c4917f] border-2 border-[#1c1c1c] focus:bg-white rounded-xl px-3 py-2.5 text-sm transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2.5">
                  <button
                    type="submit"
                    disabled={resetSending}
                    className="w-full flex items-center justify-center gap-2 h-11 bg-[#fbd35a] text-[#1c1c1c] border border-[#1c1c1c] hover:bg-[#f2c744] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg"
                    style={{ boxShadow: "2px 2px 0px 0px #1c1c1c" }}
                  >
                    {resetSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send reset link</span>
                        <Mail className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeReset}
                    disabled={resetSending}
                    className="w-full flex items-center justify-center gap-2 h-11 bg-transparent text-[#5a2e26] border-2 border-[#5a2e26]/30 hover:border-[#5a2e26] text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 rounded-lg"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}