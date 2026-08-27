"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facehash} from "facehash";
import {
  User,
  Mail,
  Lock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Star,
  BookOpen,
  Loader2,
  SendHorizontal,
  GraduationCap,
  Phone,
  Github,
  Chrome,
  AlertCircle,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react"
import { useAuth } from "@/components/AuthContext"
import { auth, db, googleProvider } from "@/lib/firebase"
import { sendApplicationEmail } from "@/lib/actions/email"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { TextLoop } from "@/components/motion-primitives/text-loop"

export default function ApplyPage() {
  const { user, userDoc, signOut } = useAuth()
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState("Basics")
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    level: "",
    course: "",
    githubUsername: "",
    why: "",
    skills: "",
  })

  // If the user already submitted an application, show the success screen
  React.useEffect(() => {
    if (userDoc?.applicationSubmitted) setSubmitted(true)
  }, [userDoc])

  // Pre-fill email from signed-in user
  React.useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: user.email! }))
    }
  }, [user, formData.email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const isSignedIn = !!user

  const steps = [
    { label: "Account", fields: isSignedIn ? ["fullName", "email"] : ["fullName", "email", "password"] },
    { label: "Details", fields: ["phoneNumber", "githubUsername", "level", "course"] },
    { label: "Skills", fields: ["skills"] },
    { label: "Final", fields: ["why"] }
  ]

  const getStepStatus = (stepLabel: string, index: number) => {
    const step = steps.find(s => s.label === stepLabel)
    if (!step) return "waiting"

    const isCompleted = step.fields.every(field => formData[field as keyof typeof formData]?.trim() !== "")
    
    if (isCompleted) return "completed"
    
    const firstIncompleteIndex = steps.findIndex(s => !s.fields.every(f => formData[f as keyof typeof formData]?.trim() !== ""))
    
    if (stepLabel === activeStep || index === firstIncompleteIndex) return "active"
    
    return "waiting"
  }

  /** Write application data onto users/{uid} */
  async function writeUserApplication(uid: string, email: string | null) {
    const userRef = doc(db, "users", uid)
    await setDoc(
      userRef,
      {
        email: email ?? formData.email,
        name: formData.fullName,
        phoneNumber: formData.phoneNumber,
        level: formData.level,
        course: formData.course,
        githubUsername: formData.githubUsername,
        bio: formData.why,
        skills: formData.skills,
        role: "pending",
        applicationSubmitted: true,
        applicationSubmittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      let uid: string
      let email: string | null

      if (user) {
        // Already signed in — just save application data
        uid = user.uid
        email = user.email
      } else {
        // Create a new account with email + password
        const cred = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        )
        uid = cred.user.uid
        email = cred.user.email
      }

      await writeUserApplication(uid, email)
      
      // Notify applicant (Server Action)
      if (email) {
        await sendApplicationEmail(email, formData.fullName || "Applicant")
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error("Error submitting application:", err)
      if (err?.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Try logging in first, then come back to apply.")
      } else {
        setError(err?.message ?? "Something went wrong. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function onGoogle() {
    setSubmitting(true)
    setError(null)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      // Pre-fill name from Google profile if available
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || cred.user.displayName || "",
        email: cred.user.email || prev.email,
      }))
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Google sign-in failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-6">
        <div className="bg-[#8ecfc8] border-2 border-[#1c1c1c] rounded-xl p-12 shadow-[8px_8px_0px_0px_#1c1c1c] w-full max-w-sm text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#fbd35a] border-2 border-[#1c1c1c] text-[#1c1c1c] mb-2">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1c]">Application sent.</h1>
          <p className="text-[#555] text-sm leading-relaxed">
            We'll review your profile shortly.
          </p>
          <Link href="/apply/status" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1c1c1c] hover:gap-3 transition-all">
            View Status <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={async () => { await signOut(); setSubmitted(false) }}
            className="w-full mt-2 py-2.5 px-4 rounded-lg border-2 border-[#1c1c1c] bg-[#FAF6EF] text-[#1c1c1c] text-xs font-semibold hover:bg-[#fbd35a] transition-colors"
          >
            Make another application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans text-[#2d2d2d] selection:bg-[#8ecfc8] selection:text-[#1c1c1c]">

      {/* ── TOP: CREAM SECTION ── */}
      <div className="bg-[#FAF6EF] min-h-screen px-6 pt-16 pb-10 md:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">

            {/* Left: Info */}
            <div>
              <TextEffect
                per="char"
                preset="fade-in-blur"
                className="font-pixel-circle text-4xl md:text-5xl font-bold mb-3 text-[#1c1c1c] leading-tight block"
              >
                Apply Now
              </TextEffect>

              <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-7">
                <span>We're looking for</span>
                <TextLoop className="text-[#1c1c1c] font-semibold underline underline-offset-2 decoration-black/30">
                  <span>Developers</span>
                  <span>Designers</span>
                  <span>Creators</span>
                </TextLoop>
              </div>

              <div className="mb-7">
                <h3 className="font-pixel-circle text-lg font-bold mb-3 text-[#1c1c1c]">Why join Potato Club?</h3>
                <ol className="text-[#555] space-y-3 list-decimal list-inside text-sm">
                  <li>Collaborate on real projects with passionate people</li>
                  <li>Build a portfolio while contributing to the community</li>
                  <li>Grow your skills alongside driven peers</li>
                </ol>
              </div>

              <div>
                <h3 className="font-pixel-circle text-lg font-bold mb-3 text-[#1c1c1c]">What we value</h3>
                <div className="space-y-3">
                  {[
                    { icon: Shield,   label: "Authenticity — genuine work and identity" },
                    { icon: Zap,      label: "Innovation — fresh, creative perspectives" },
                    { icon: Star,     label: "Commitment — active participation" },
                    { icon: BookOpen, label: "Portfolio — showcase your best work" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-[#fbd35a] p-2.5 rounded-lg border border-[#2d2d2d] shrink-0">
                        <Icon className="w-4 h-4 text-[#1c1c1c]" />
                      </div>
                      <span className="text-sm text-[#555]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Form Card */}
            <div>
              <div className="bg-[#8ecfc8] border-2 border-[#1c1c1c] rounded-xl p-6 shadow-[6px_6px_0px_0px_#1c1c1c]">
                <header className="mb-4">
                  <h2 className="font-pixel-circle text-xl font-bold text-[#1c1c1c]">Join the team</h2>
                  <p className="text-xs text-[#555] mt-1">Fill in the details below to apply.</p>
                </header>

                <form onSubmit={onSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Google Sign-In shortcut */}
                  {!isSignedIn && (
                    <div className="pb-2">
                      <button
                        type="button"
                        onClick={onGoogle}
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 h-11 bg-[#FAF6EF] text-[#1c1c1c] border border-[#1c1c1c] hover:bg-[#f0ece5] text-xs font-bold uppercase tracking-widest transition-all rounded-lg shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                      >
                        <Chrome className="w-3.5 h-3.5" />
                        <span>Continue with Google</span>
                      </button>
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-[#1c1c1c]/20" />
                        <span className="text-[10px] text-[#555] uppercase tracking-widest font-bold">or fill manually</span>
                        <div className="flex-1 h-px bg-[#1c1c1c]/20" />
                      </div>
                    </div>
                  )}

                  {isSignedIn && (
                    <div className="flex items-center gap-2 p-3 bg-[#FAF6EF] border border-[#1c1c1c] rounded-lg text-[#1c1c1c] text-xs font-medium">
                      <Facehash name={user.email|| "User"} size={12} />
                      {/* <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> */}
                      <span>Signed in as {user?.email}. Complete the form below.</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-[#1c1c1c]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="Your name"
                        value={formData.fullName}
                        onFocus={() => setActiveStep("Account")}
                        onChange={handleChange}
                        required
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-[#1c1c1c]">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onFocus={() => setActiveStep("Account")}
                        onChange={handleChange}
                        readOnly={isSignedIn}
                        required
                        className={`p-3 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all ${isSignedIn ? "opacity-60 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  {!isSignedIn && (
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="password" className="text-xs font-bold text-[#1c1c1c]">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onFocus={() => setActiveStep("Account")}
                        onChange={handleChange}
                        required={!isSignedIn}
                        minLength={6}
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                      />
                      <p className="text-[10px] text-[#555]">Minimum 6 characters. This creates your account.</p>
                    </div>
                  )}

                  {/* Phone & GitHub */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phoneNumber" className="text-xs font-bold text-[#1c1c1c]">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+234..."
                        value={formData.phoneNumber}
                        onFocus={() => setActiveStep("Details")}
                        onChange={handleChange}
                        required
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="githubUsername" className="text-xs font-bold text-[#1c1c1c]">
                        GitHub <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="githubUsername"
                        type="text"
                        placeholder="username"
                        value={formData.githubUsername}
                        onFocus={() => setActiveStep("Details")}
                        onChange={handleChange}
                        required
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                      />
                    </div>
                  </div>

                  {/* Level & Course */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="level" className="text-xs font-bold text-[#1c1c1c]">
                        Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="level"
                        value={formData.level}
                        onFocus={() => setActiveStep("Details")}
                        onChange={handleChange}
                        required
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all appearance-none"
                      >
                        <option value="">Select Level</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="Masters">Masters</option>
                        <option value="Not a student">Not a student</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="course" className="text-xs font-bold text-[#1c1c1c]">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="course"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={formData.course}
                        onFocus={() => setActiveStep("Details")}
                        onChange={handleChange}
                        required
                        className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                      />
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="why" className="text-xs font-bold text-[#1c1c1c]">
                      Statement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="why"
                      placeholder="How can you contribute?"
                      value={formData.why}
                      onFocus={() => setActiveStep("Final")}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all resize-none"
                    />
                  </div>

                  {/* Expertise */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="skills" className="text-xs font-bold text-[#1c1c1c]">
                      Expertise
                    </label>
                    <input
                      id="skills"
                      placeholder="e.g. Design, React, Writing"
                      value={formData.skills}
                      onFocus={() => setActiveStep("Skills")}
                      onChange={handleChange}
                      className="p-2.5 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-xs focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-[#fbd35a] text-[#1c1c1c] font-bold py-2.5 px-8 rounded-lg border border-[#1c1c1c] hover:bg-[#f2c744] disabled:opacity-50 transition-colors shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting…</span>
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-4 h-4" strokeWidth={1.5} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-[#1c1c1c]/20 text-center">
                  <Link href="/apply/status" className="text-xs font-semibold text-[#555] hover:text-[#1c1c1c] transition-colors">
                    Already applied? Check your status →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM: DARK SECTION ── */}
      <div className="bg-[#363636] px-6 py-12 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">

          {/* CTA Banner */}
          <div className="max-w-4xl mx-auto relative mb-20">
            <div className="bg-[#f4c3b3] border-2 border-[#1c1c1c] rounded-2xl p-8 md:p-12 text-center relative z-10 shadow-[8px_8px_0px_0px_#fbd35a]">
              <h2 className="font-pixel-circle text-3xl md:text-4xl font-bold text-[#5a2e26] mb-3">
                Have Questions?
              </h2>
              <p className="text-[#844b3e] max-w-md mx-auto mb-8 font-medium">
                Reach out to our team before you apply — we're happy to help.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#fbd35a] text-[#1c1c1c] font-bold py-3 px-10 rounded-lg border border-[#1c1c1c] hover:bg-[#f2c744] transition-colors shadow-[2px_2px_0px_0px_#1c1c1c]"
              >
                Contact Us
              </Link>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden lg:block" style={{ zIndex: 1 }}>
              <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="black" strokeWidth="1" />
              <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="black" strokeWidth="1" />
            </svg>
          </div>

          {/* Footer */}
          <footer className="text-center text-white">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src="/aw.webp" alt="Potato Club" width={80} height={26} className="brightness-0 invert opacity-80" />
            </Link>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">
              A student-run club building projects, fostering community, and shipping real work.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>

            <div className="flex items-center justify-center gap-4 mb-12">
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-gray-700 transition-colors">
                <Github className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="p-2 border border-gray-500 rounded-full hover:bg-gray-700 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-300" />
              </a>
            </div>

            <p className="text-gray-500 text-xs">
              Copyright © 2026 Potato Club
            </p>
          </footer>
        </div>
      </div>

    </div>
  )
}