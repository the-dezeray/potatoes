"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth, type UserRole } from "@/components/AuthContext"

function redirectTarget(role: UserRole | null, applicationSubmitted?: boolean) {
  if (!role) return "/login"
  if (role === "pending") {
    return applicationSubmitted ? "/apply/status" : "/apply"
  }
  if (role === "member") return "/portal"
  return "/admin"
}

export function RequireRole({
  allowed,
  children,
}: {
  allowed: UserRole[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, role, userDoc, loading } = useAuth()

  React.useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    const effectiveRole: UserRole = role ?? "pending"
    if (!allowed.includes(effectiveRole)) {
      const target = redirectTarget(effectiveRole, !!userDoc?.applicationSubmitted)
      if (pathname !== target) router.replace(target)
    }
  }, [allowed, loading, pathname, role, router, user, userDoc])

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>
  }

  if (!user) return null

  const effectiveRole: UserRole = role ?? "pending"
  if (!allowed.includes(effectiveRole)) return null

  return <>{children}</>
}
