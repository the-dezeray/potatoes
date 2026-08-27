"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  Instagram,
  Twitter,
  Github,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  MessageSquare,
} from "lucide-react"

import { useAuth } from "@/components/AuthContext"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import { TextLoop } from "@/components/motion-primitives/text-loop"

export default function ContactPage() {
  const { user } = useAuth()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "sent" | "error">("idle")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, "messages"), {
        name, email, message,
        uid: user?.uid ?? null,
        createdAt: serverTimestamp(),
      })
      setStatus("sent")
    } catch {
      setStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-6">
        <div className="bg-[#8ecfc8] border-2 border-[#1c1c1c] rounded-xl p-12 shadow-[8px_8px_0px_0px_#1c1c1c] w-full max-w-sm text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#fbd35a] border-2 border-[#1c1c1c] text-[#1c1c1c] mb-2">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1c]">Message received.</h1>
          <p className="text-[#555] text-sm leading-relaxed">
            We'll get back to you within one business day.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1c1c1c] hover:gap-3 transition-all">
            Back to home <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans text-[#2d2d2d] selection:bg-[#8ecfc8] selection:text-[#1c1c1c]">

      {/* ── TOP: CREAM SECTION ── */}
      <div className="bg-[#FAF6EF] min-h-screen px-6 pt-24 pb-16 md:px-16 lg:px-24 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-16">

          {/* Left: Info */}
          <div>
            <TextEffect
              per="char"
              preset="fade-in-blur"
              className="font-pixel-circle text-5xl md:text-6xl font-bold mb-4 text-[#1c1c1c] leading-tight block"
            >
              Contact Us
            </TextEffect>

            <div className="flex items-center gap-2 text-sm text-[#6b6b6b] mb-10">
              <span>Available for</span>
              <TextLoop className="text-[#1c1c1c] font-semibold underline underline-offset-2 decoration-black/30">
                <span>Partnerships</span>
                <span>Support</span>
                <span>Collabs</span>
              </TextLoop>
            </div>

            <div className="mb-10">
              <h3 className="font-pixel-circle text-xl font-bold mb-4 text-[#1c1c1c]">Talk to our team today</h3>
              <ol className="text-[#555] space-y-3 list-decimal list-inside text-sm">
                <li>Learn how Potato Club can work with your goals</li>
                <li>Discover our projects and get answers to your questions</li>
                <li>Connect with the right people on our team</li>
              </ol>
            </div>

            <div>
              <h3 className="font-pixel-circle text-xl font-bold mb-5 text-[#1c1c1c]">Find Potato Club</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[#fbd35a] p-2.5 rounded-lg border border-[#2d2d2d] shrink-0">
                    <MapPin className="w-4 h-4 text-[#1c1c1c]" />
                  </div>
                  <span className="text-sm text-[#555]">University Campus, Building 4, Room 202</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#fbd35a] p-2.5 rounded-lg border border-[#2d2d2d] shrink-0">
                    <Phone className="w-4 h-4 text-[#1c1c1c]" />
                  </div>
                  <span className="text-sm text-[#555]">(555) 010-9090</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#fbd35a] p-2.5 rounded-lg border border-[#2d2d2d] shrink-0">
                    <Mail className="w-4 h-4 text-[#1c1c1c]" />
                  </div>
                  <span className="text-sm text-[#555]">hello@potatoclub.dev</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div>
            <div className="bg-[#8ecfc8] border-2 border-[#1c1c1c] rounded-xl p-8 shadow-[8px_8px_0px_0px_#1c1c1c]">
              <form onSubmit={onSubmit} className="space-y-5">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#1c1c1c]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="p-3 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#1c1c1c]">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="p-3 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#1c1c1c]">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What's on your mind?"
                    className="p-3 rounded-lg border border-[#1c1c1c] bg-[#FAF6EF] text-sm focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-600 font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#fbd35a] text-[#1c1c1c] font-bold py-2.5 px-8 rounded-lg border border-[#1c1c1c] hover:bg-[#f2c744] disabled:opacity-50 transition-colors shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* ── BOTTOM: DARK SECTION ── */}
      <div className="bg-[#363636] px-6 py-20 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">

        {/* CTA Banner */}
        <div className="max-w-5xl mx-auto relative mb-32">
          <div className="bg-[#f4c3b3] border-2 border-[#1c1c1c] rounded-2xl p-12 md:p-20 text-center relative z-10 shadow-[8px_8px_0px_0px_#fbd35a]">
            <h2 className="font-pixel-circle text-4xl md:text-5xl font-bold text-[#5a2e26] mb-4">
              Build Something Great
            </h2>
            <p className="text-[#844b3e] max-w-md mx-auto mb-8 font-medium">
              Join Potato Club and collaborate with passionate developers, designers, and creators.
            </p>
            <Link
              href="/apply"
              className="inline-block bg-[#fbd35a] text-[#1c1c1c] font-bold py-3 px-10 rounded-lg border border-[#1c1c1c] hover:bg-[#f2c744] transition-colors shadow-[2px_2px_0px_0px_#1c1c1c]"
            >
              Apply Now
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
            <Link href="/apply" className="hover:text-white transition-colors">Apply</Link>
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