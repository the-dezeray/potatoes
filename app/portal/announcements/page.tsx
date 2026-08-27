"use client"

import * as React from "react"
import Link from "next/link"
import {
  Megaphone,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Bell,
  Info,
  Filter,
} from "lucide-react"
import { db } from "@/lib/firebase"
import type { AnnouncementRow, AnnouncementType } from "@/lib/firestore-types"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

// ── Type config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AnnouncementType,
  { label: string; icon: React.ElementType; bg: string; border: string; badge: string; text: string }
> = {
  general: {
    label: "General",
    icon: Info,
    bg: "bg-slate-50",
    border: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-300",
    text: "text-slate-700",
  },
  meeting: {
    label: "Meeting",
    icon: CalendarDays,
    bg: "bg-blue-50",
    border: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
    text: "text-blue-700",
  },
  payment: {
    label: "Payment",
    icon: CreditCard,
    bg: "bg-emerald-50",
    border: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-300",
    text: "text-emerald-700",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    text: "text-amber-700",
  },
  link: {
    label: "Resource",
    icon: ExternalLink,
    bg: "bg-violet-50",
    border: "border-l-violet-500",
    badge: "bg-violet-100 text-violet-700 border-violet-300",
    text: "text-violet-700",
  },
}

function getConfig(type?: AnnouncementType) {
  return TYPE_CONFIG[type ?? "general"]
}

function monthKey(ts: any): string {
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

const ALL_TYPES: ("all" | AnnouncementType)[] = ["all", "meeting", "payment", "warning", "link", "general"]

export default function MemberAnnouncementsPage() {
  const [announcements, setAnnouncements] = React.useState<AnnouncementRow[]>([])
  const [filter, setFilter] = React.useState<"all" | AnnouncementType>("all")

  React.useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"))
    return onSnapshot(q, (snap) => {
      const next: AnnouncementRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          title: data.title ?? "(untitled)",
          body: data.body,
          type: data.type,
          link: data.link,
          isUrgent: data.isUrgent ?? false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy,
        }
      })
      setAnnouncements(next)
    })
  }, [])

  const filtered = React.useMemo(
    () => (filter === "all" ? announcements : announcements.filter((a) => (a.type ?? "general") === filter)),
    [announcements, filter]
  )

  const urgent = filtered.filter((a) => a.isUrgent)

  // Group non-urgent by month
  const grouped = React.useMemo(() => {
    const nonUrgent = filtered.filter((a) => !a.isUrgent)
    const map = new Map<string, AnnouncementRow[]>()
    for (const a of nonUrgent) {
      const key = a.createdAt ? monthKey(a.createdAt) : "Undated"
      const list = map.get(key) ?? []
      list.push(a)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
            Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">Club updates and notices, grouped by month.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {ALL_TYPES.map((t) => {
            const cfg = t === "all" ? null : TYPE_CONFIG[t]
            const active = filter === t
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                {t === "all" ? "All" : cfg!.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Urgent Banner */}
      {urgent.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Urgent
          </h2>
          {urgent.map((a) => (
            <AnnouncementCard key={a.id} a={a} urgent />
          ))}
        </div>
      )}

      {/* Grouped announcements */}
      {grouped.length === 0 && urgent.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No announcements yet.</div>
      ) : (
        grouped.map(([month, items]) => (
          <div key={month}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{month}</h2>
            <div className="flex flex-col gap-3">
              {items.map((a) => (
                <AnnouncementCard key={a.id} a={a} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ── Single Card ───────────────────────────────────────────────────────────────

function AnnouncementCard({ a, urgent }: { a: AnnouncementRow; urgent?: boolean }) {
  const cfg = getConfig(a.type)
  const Icon = cfg.icon

  return (
    <div
      className={`rounded-xl border-2 border-l-4 ${cfg.border} border-slate-200 ${cfg.bg} p-4 transition-all ${
        urgent ? "ring-2 ring-red-400 ring-offset-1" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}
          >
            <Icon className="w-3 h-3" strokeWidth={2} />
            {cfg.label}
          </span>
          {urgent && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border bg-red-100 text-red-700 border-red-300">
              <Bell className="w-3 h-3" strokeWidth={2} />
              Urgent
            </span>
          )}
        </div>
        {/* Date */}
        <span className="text-xs text-slate-400 shrink-0">
          {a.createdAt
            ? new Date((a.createdAt as any).toDate()).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""}
        </span>
      </div>

      <h3 className="mt-2 font-bold text-slate-900 text-base leading-snug">{a.title}</h3>

      {a.body && (
        <p className="mt-1.5 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{a.body}</p>
      )}

      {a.link && (
        <div className="mt-3">
          <Link
            href={a.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#fbd35a] text-[#1c1c1c] border border-[#1c1c1c] hover:bg-[#f2c744] transition-colors shadow-[2px_2px_0px_0px_#1c1c1c] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            Take Action
          </Link>
        </div>
      )}
    </div>
  )
}
