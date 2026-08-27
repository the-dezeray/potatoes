"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Megaphone, 
  BarChart,
  Award,
  Home,
  LogOut
} from "lucide-react"

import { RequireRole } from "@/components/require-role"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/AuthContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut } = useAuth()

  return (
    <RequireRole allowed={["admin"]}>
      <div className="min-h-screen bg-white force-light text-slate-900 pt-8">
        <div className="mx-auto flex w-full max-w-6xl gap-6 p-4 md:p-6 lg:p-8">
          <aside className="w-64 shrink-0 pt-2 sticky top-8 h-fit">
            <div className="flex items-center gap-3 px-2 mb-6">
              <Image 
                src="/biust-logo.webp" 
                alt="BIUST Logo" 
                width={32} 
                height={32} 
                className="object-contain" 
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight italic">Club.</span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Admin</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/users">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Members</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/projects">
                  <FolderKanban className="w-4 h-4 text-slate-500" />
                  <span>Projects</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/applications">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Applications</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/announcements">
                  <Megaphone className="w-4 h-4 text-slate-500" />
                  <span>Announcements</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/certificates">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Certificates</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="justify-start hover:bg-slate-100 gap-3 px-4">
                <Link href="/admin/reports">
                  <BarChart className="w-4 h-4 text-slate-500" />
                  <span>Reports</span>
                </Link>
              </Button>

  {/* ... previous nav items ... */}

<div className="mt-auto pt-4">
  <Separator className="my-4 opacity-50" />
  
  <div className="flex flex-col gap-1">
    {/* Home Button */}
    <Button 
      asChild 
      variant="ghost" 
      className="justify-start hover:bg-slate-100 gap-3 px-4 text-slate-600"
    >
      <Link href="/">
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>
    </Button>

    {/* Sign Out Button */}
    <Button
      onClick={() => signOut()}
      variant="ghost"
      className="justify-start gap-3 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </Button>
  </div>
</div>
            </nav>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </RequireRole>
  )
}
