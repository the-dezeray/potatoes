"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image" // Import Next.js Image component
import { 
  User, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/components/AuthContext"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export default function ApplyPage() {
  const { user } = useAuth()
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    why: "",
    skills: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, "applications"), {
        uid: user?.uid ?? null,
        ...formData,
        status: "submitted",
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fdfdfd] flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
          {/* Logo also appears on success screen for branding consistency */}
          <div className="mb-6 flex justify-center">
             <Image   
                src="/aw.png" 
                alt="Logo" 
                width={1000} 
                height={40} 
                className="opacity-20 grayscale"
              />
          </div>
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold text-gray-900">Application Sent</h1>
          <p className="mt-2 text-sm text-gray-500 font-light">We'll review your profile shortly.</p>
          <Link href="/apply/status" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-all">
            View Status <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-gray-900 pt-28 pb-12 px-6 border" >
      <div className="max-w-xl mx-auto">
        
        <div className="bg-white p-6 md:p-10 rounded-[1.8rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-black">
          <header className="mb-8">
            {/* --- LOGO PLACEMENT --- */}
            <div className="mb-6">
              <Image 
                src="/club-logo.png" 
                alt="Club Logo" 
                width={80} 
                height={80} 
                priority // Ensures logo loads fast
                className="object-contain scale-150" 
              />
            </div>
            {/* ----------------------- */}
            
            <h1 className="text-2xl font-bold font-pixel tracking-tight">Apply</h1>
            <p className="text-sm text-black mt-1 font-pixel">Join our creative community.</p>
          </header>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  <User className="w-3 h-3" /> Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50/50 border-gray-100 focus:border-black focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none border"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-50/50 border-gray-100 focus:border-black focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="why" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                <MessageSquare className="w-3 h-3" /> Statement
              </label>
              <textarea
                id="why"
                placeholder="How can you contribute?"
                value={formData.why}
                onChange={handleChange}
                required
                className="w-full bg-gray-50/50 border-gray-100 focus:border-black focus:bg-white rounded-xl px-4 py-3 text-sm min-h-[100px] transition-all outline-none resize-none border"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skills" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                <Sparkles className="w-3 h-3" /> Expertise
              </label>
              <input
                id="skills"
                placeholder="e.g. Design, React, Writing"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border-gray-100 focus:border-black focus:bg-white rounded-xl px-4 py-3 text-sm transition-all outline-none border"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 h-12 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:bg-gray-100 disabled:text-gray-400 shadow-lg shadow-black/5"
              >
                {submitting ? "Sending..." : "Submit Application"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <Link href="/apply/status" className="text-[11px] text-gray-400 hover:text-black transition-colors uppercase tracking-tighter">
              Already applied? <span className="font-bold border-b border-gray-200 ml-1">Check Status</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}