import Link from "next/link"
import { 
  Users, 
  FolderKanban, 
  FileCheck, 
  Megaphone, 
  BarChart3,
  Award,
  LucideIcon 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface QuickLink {
  href: string
  label: string
  description: string
  icon: LucideIcon
  // Tailwind classes for the specific theme
  styles: string
}

const QUICK_LINKS: QuickLink[] = [
  { 
    href: "/admin/users", 
    label: "Manage users", 
    description: "Roles & assignments",
    icon: Users,
    styles: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 " 
  },
  { 
    href: "/admin/projects", 
    label: "Manage projects", 
    description: "Create, edit, delete",
    icon: FolderKanban,
    styles: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 " 
  },
  { 
    href: "/admin/applications", 
    label: "Review applications", 
    description: "Approve or reject",
    icon: FileCheck,
    styles: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 " 
  },
  { 
    href: "/admin/announcements", 
    label: "Announcements", 
    description: "Publish updates",
    icon: Megaphone,
    styles: "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 " 
  },
  {
    href: "/admin/certificates",
    label: "Certificates",
    description: "Create & issue",
    icon: Award,
    styles: "bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 ",
  },
  { 
    href: "/admin/reports", 
    label: "System reports", 
    description: "Audit & live counts",
    icon: BarChart3,
    styles: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 " 
  },
]

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>Select a module to manage the system.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className={`h-auto flex-row items-center justify-start gap-4 p-6 border transition-all duration-200 ${link.styles}`}
                >
                  <Link href={link.href}>
                    <div className="p-2 bg-background/50 rounded-lg shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-bold text-sm tracking-tight leading-none">
                        {link.label}
                      </span>
                      <span className="text-xs opacity-80 font-medium line-clamp-1">
                        {link.description}
                      </span>
                    </div>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}