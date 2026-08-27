"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  User,
  Mail,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react"

import { useAuth } from "@/components/AuthContext"

const ROLE_LABEL: Record<string, string> = {
  pending: "Pending Review",
  member: "Approved",
  admin: "Approved (Admin)",
}

export default function ApplicationStatusPage() {
  const { user, role, userDoc, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6 font-pixel-circle">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm uppercase tracking-widest font-bold">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center p-6 font-pixel-circle">
        <div className="max-w-md w-full bg-white p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-black rounded-xl text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Authentication Required</h1>
          <p className="mt-2 text-sm text-gray-400 font-light">Sign in to view your application status.</p>
          <Link 
            href="/login" 
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
          >
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  const hasSubmitted = !!userDoc?.applicationSubmitted
  const isApproved = role === "member" || role === "admin"

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-gray-900 py-20 px-6 font-pixel-circle">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-black rounded-xl">
          <header className="mb-8">
            <div className="mb-4 -ml-4 flex justify-start">
              <div className="relative w-40 h-16 overflow-hidden flex items-center justify-start">
                <Image 
                  src="/aw.webp" 
                  alt="Club Logo" 
                  width={200} 
                  height={80}
                  priority 
                  className="object-contain scale-[1.0] origin-left" 
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-black tracking-tight uppercase">STATUS</h1>
            <p className="text-xs text-gray-400 mt-2 uppercase tracking-[0.2em] font-bold">
              Track your membership application
            </p>
          </header>

          {!hasSubmitted ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                  No application found
                </p>
              </div>
              
              <p className="text-sm text-gray-500 font-light">
                You haven&apos;t submitted an application yet. Complete the application form to join our community.
              </p>
              
              <Link 
                href="/apply" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
              >
                Apply for Membership <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all" 
                style={{
                  borderColor: isApproved ? '#10b981' : '#f59e0b',
                  backgroundColor: isApproved ? '#f0fdf4' : '#fffbeb'
                }}
              >
                {isApproved ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" strokeWidth={2} />
                ) : (
                  <Clock className="w-6 h-6 text-amber-600 shrink-0" strokeWidth={2} />
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold" 
                    style={{ color: isApproved ? '#059669' : '#d97706' }}
                  >
                    Application Status
                  </p>
                  <p className="text-sm font-bold" 
                    style={{ color: isApproved ? '#065f46' : '#92400e' }}
                  >
                    {ROLE_LABEL[role ?? "pending"] ?? role}
                  </p>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-4 pt-2">
                {userDoc?.name && (
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Name</p>
                      <p className="text-sm font-medium text-gray-900">{userDoc.name}</p>
                    </div>
                  </div>
                )}

                {userDoc?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900">{userDoc.email}</p>
                    </div>
                  </div>
                )}

                {userDoc?.skills && (
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Expertise</p>
                      <p className="text-sm font-medium text-gray-900">{userDoc.skills}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action based on status */}
              <div className="pt-4 border-t border-gray-100">
                {isApproved ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                        Welcome to the team!
                      </p>
                    </div>
                    <Link 
                      href="/portal" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                    >
                      Go to Portal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    Your application is under review. We&apos;ll notify you once it&apos;s been processed. 
                    Check back soon or wait for an email update.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between">
          <Link 
            href="/apply" 
            className="text-[11px] text-gray-400 hover:text-black transition-colors uppercase tracking-widest font-bold"
          >
            ← Back to application
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-[11px] text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest font-bold"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
