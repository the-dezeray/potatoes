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
      <div className="relative rounded-2xl border-2 border-[#1c1c1c] bg-[#fbd35a] shadow-[5px_5px_0px_0px_#1c1c1c] overflow-hidden">
        {/* decorative dot-grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1c1c1c 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8">
          {/* Left: icon + copy */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Notion "N" badge */}
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1c1c1c] border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] flex items-center justify-center">
              <span className="text-[#fbd35a] font-black text-xl leading-none select-none">N</span>
            </div>

            <div className="min-w-0">
              <p className="font-black text-[#1c1c1c] text-lg sm:text-xl leading-tight tracking-tight">
                Club Notion Workspace
              </p>
              <p className="text-[#3a3a3a] text-sm mt-1 leading-snug">
                All club documents, plans, and notes — in one place.
              </p>

              {/* stat pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { label: "4 sections", icon: BookOpen },
                  { label: "Meeting notes", icon: CalendarDays },
                  { label: "Live docs", icon: FileText },
                ].map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1c1c1c]/10 border border-[#1c1c1c]/20 text-[#1c1c1c]"
                  >
                    <Icon className="w-3 h-3" strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            href="https://notion.so/placeholder-workspace"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-black px-5 py-3 rounded-xl bg-[#1c1c1c] text-[#fbd35a] border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.35)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.35)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
          >
            Open Workspace
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Resource Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESOURCES.map((section, idx) => {
          const SectionIcon = section.icon
          return (
            <div
              key={section.id}
              className="rounded-2xl border-2 border-[#1c1c1c] bg-white shadow-[4px_4px_0px_0px_#1c1c1c] overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className={`${section.accent} border-b-2 border-[#1c1c1c] px-5 py-4 flex items-center gap-3`}>
                <div className={`shrink-0 p-2.5 rounded-xl border-2 border-[#1c1c1c] ${section.badge} shadow-[2px_2px_0px_0px_#1c1c1c]`}>
                  <SectionIcon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-[#1c1c1c] text-sm tracking-tight leading-tight">{section.title}</h2>
                  <p className="text-[11px] text-[#3a3a3a] mt-0.5 leading-snug">{section.description}</p>
                </div>
                <span className="text-3xl font-black text-[#1c1c1c]/10 select-none tabular-nums leading-none shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1.5 p-3">
                {section.links.map((link) => {
                  const LinkIcon = link.icon ?? ExternalLink
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-3 py-3 rounded-xl border-2 border-transparent hover:border-[#1c1c1c] hover:bg-slate-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1c1c1c] transition-all"
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-lg border border-[#1c1c1c]/15 ${section.badge} flex items-center justify-center`}>
                        <LinkIcon className="w-4 h-4" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 leading-tight">{link.label}</p>
                        {link.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate leading-snug">{link.description}</p>
                        )}
                      </div>
                      <ExternalLink
                        className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2}
                      />
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
