"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Mail,
  UserPlus,
  LayoutDashboard,
  LogIn
} from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  if (pathname?.startsWith('/portal') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="bg-[#FAF6EF] border-2 border-[#1c1c1c] rounded-xl h-12 flex items-center justify-between px-4 shadow-[4px_4px_0px_0px_#1c1c1c] transition-all">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-sm font-extrabold font-pixel-triangle text-orange-500 hidden sm:inline-block tracking-widest italic group-hover:text-orange-600 transition-colors">
            BIC
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">

          <Link
            href="/contact"
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold text-[#1c1c1c] border border-transparent hover:border-[#1c1c1c] hover:bg-[#fbd35a] hover:shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </Link>

          <Link
            href="/apply"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold text-[#1c1c1c] border border-transparent hover:border-[#1c1c1c] hover:bg-[#fbd35a] hover:shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Apply</span>
          </Link>

          <Link
            href="/portal"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-bold text-[#1c1c1c] border border-transparent hover:border-[#1c1c1c] hover:bg-[#fbd35a] hover:shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>

          <div className="w-px h-4 bg-[#1c1c1c]/20 mx-1 hidden sm:block" />

          {/* Login — punchy CTA */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-xs font-bold text-[#1c1c1c] bg-[#fbd35a] border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c] hover:bg-[#f2c744] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}