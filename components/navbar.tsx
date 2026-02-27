import Link from "next/link"
import Image from "next/image"
import { 
  Mail, 
  UserPlus, 
  LayoutDashboard, 
  LogIn 
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    // Reduced top margin from top-6 to top-4
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      {/* Reduced height from h-16 to h-12 and horizontal padding from px-6 to px-4 */}
      <div className="bg-white/90 backdrop-blur-md border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl h-12 flex items-center justify-between px-4">
        
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full"></div>
              {/* Scaled logo down from 32 to 24 */}
              <Image 
                src="/biust-logo.png" 
                alt="BIUST Logo" 
                width={24} 
                height={24} 
                className="object-contain relative" 
              />
            </div>
            {/* Reduced separator height */}
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            {/* Reduced text size to text-sm */}
            <span className="text-sm font-bold text-slate-900 hidden sm:inline-block tracking-tight italic">
              Club.
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-0.5">
          {/* Reduced button padding and font size */}
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full px-3 font-medium transition-all gap-1.5">
            <Link href="/contact">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden sm:flex h-8 text-xs text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full px-3 font-medium transition-all gap-1.5">
            <Link href="/apply">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Apply</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full px-3 font-medium transition-all gap-1.5">
            <Link href="/portal">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Portal</span>
            </Link>
          </Button>
          
          <div className="w-px h-3 bg-slate-200 mx-1.5 hidden sm:block"></div>
          
          {/* Scaled down the Login button height and padding */}
          <Button asChild size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 shadow-sm text-xs transition-all hover:scale-[1.02] active:scale-95 font-bold gap-1.5">
            <Link href="/login">
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}