"use client"

import Link from "next/link"
import {
  BookOpen,
  ExternalLink,
  FileText,
  CalendarDays,
  Zap,
  Globe,
  Code2,
  Lightbulb,
  Shield,
  GraduationCap,
} from "lucide-react"

// ── Resource Data ─────────────────────────────────────────────────────────────

type ResourceLink = {
  label: string
  description?: string
  href: string
  icon?: React.ElementType
}

type ResourceSection = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  accent: string
  border: string
  badge: string
  links: ResourceLink[]
}

const RESOURCES: ResourceSection[] = [
  {
    id: "policies",
    title: "Policies & Guidelines",
    description: "Club rules, codes of conduct, and membership guidelines.",
    icon: Shield,
    accent: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    links: [
      {
        label: "Club Constitution",
        description: "Official rules and structure of the club.",
        href: "https://notion.so/placeholder-constitution",
        icon: FileText,
      },
      {
        label: "Code of Conduct",
        description: "Expected behavior for all members.",
        href: "https://notion.so/placeholder-conduct",
        icon: Shield,
      },
      {
        label: "Membership Policy",
        description: "Joining requirements, roles and responsibilities.",
        href: "https://notion.so/placeholder-membership",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "meetings",
    title: "Meeting Notes",
    description: "Weekly and monthly meeting minutes and action items.",
    icon: CalendarDays,
    accent: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
    links: [
      {
        label: "General Meeting Notes",
        description: "Archives of all general meeting minutes.",
        href: "https://notion.so/placeholder-meetings",
        icon: CalendarDays,
      },
      {
        label: "Executive Meeting Notes",
        description: "Notes from leadership team meetings.",
        href: "https://notion.so/placeholder-exec-meetings",
        icon: CalendarDays,
      },
      {
        label: "Action Items Tracker",
        description: "Outstanding tasks and assigned owners.",
        href: "https://notion.so/placeholder-action-items",
        icon: Zap,
      },
    ],
  },
  {
    id: "hackathons",
    title: "Hackathons",
    description: "Upcoming events, past hackathon archives, and team formation.",
    icon: Zap,
    accent: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    links: [
      {
        label: "Upcoming Hackathons",
        description: "Events we're planning to attend or host.",
        href: "https://notion.so/placeholder-upcoming",
        icon: CalendarDays,
      },
      {
        label: "Past Projects & Writeups",
        description: "Submissions and retrospectives from previous events.",
        href: "https://notion.so/placeholder-past-hackathons",
        icon: FileText,
      },
      {
        label: "Team Formation Board",
        description: "Find teammates and list your skills.",
        href: "https://notion.so/placeholder-team-formation",
        icon: Globe,
      },
    ],
  },
  {
    id: "learning",
    title: "Learning Resources",
    description: "Curated tutorials, workshops, and skill-building materials.",
    icon: GraduationCap,
    accent: "bg-violet-50",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    links: [
      {
        label: "Workshop Slides",
        description: "Slide decks from internal workshops.",
        href: "https://notion.so/placeholder-workshops",
        icon: Lightbulb,
      },
      {
        label: "Tech Stack Guides",
        description: "Opinionated guides for our common tools.",
        href: "https://notion.so/placeholder-tech-guides",
        icon: Code2,
      },
      {
        label: "External Resources Hub",
        description: "Links to courses, docs, and articles we recommend.",
        href: "https://notion.so/placeholder-external",
        icon: Globe,
      },
    ],
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
          Resources
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Helpful links, docs, and materials for club members.
        </p>
      </div>

      {/* Quick Access Banner */}
      <div className="rounded-xl border-2 border-[#1c1c1c] bg-[#fbd35a] p-5 shadow-[4px_4px_0px_0px_#1c1c1c] flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="font-bold text-[#1c1c1c] text-sm">Club Notion Workspace</p>
          <p className="text-[#3a3a3a] text-xs mt-0.5">All club documents, plans, and notes in one place.</p>
        </div>
        <Link
          href="https://notion.so/placeholder-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-[#1c1c1c] text-white border border-[#1c1c1c] hover:bg-[#363636] transition-colors shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Notion
        </Link>
      </div>

      {/* Resource Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESOURCES.map((section) => {
          const SectionIcon = section.icon
          return (
            <div
              key={section.id}
              className={`rounded-xl border-2 ${section.border} ${section.accent} p-5 flex flex-col gap-4`}
            >
              {/* Section Header */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border border-current/20 ${section.badge} shrink-0`}>
                  <SectionIcon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">{section.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                {section.links.map((link) => {
                  const LinkIcon = link.icon ?? ExternalLink
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all group"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors" strokeWidth={1.75} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">{link.label}</p>
                        {link.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{link.description}</p>
                        )}
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" strokeWidth={2} />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
