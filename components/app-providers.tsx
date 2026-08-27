"use client"

import * as React from "react"
import { AuthProvider } from "@/components/AuthContext"
import { ThemeProvider } from "next-themes"
import { ViewTransitions } from "next-view-transitions"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ViewTransitions>
  )
}
