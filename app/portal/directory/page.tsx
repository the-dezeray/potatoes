"use client"

import * as React from "react"
import { Users, Search, Github, Mail } from "lucide-react"
import { db } from "@/lib/firebase"
import type { UserRow } from "@/lib/firestore-types"
import { collection, onSnapshot, query, where } from "firebase/firestore"

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const AVATAR_COLORS = [
  "bg-[#fbd35a] text-[#1c1c1c]",
  "bg-[#8ecfc8] text-[#1c1c1c]",
  "bg-[#f4c3b3] text-[#5a2e26]",
  "bg-violet-100 text-violet-800",
  "bg-slate-200 text-slate-800",
]

function avatarColor(name?: string) {
  const idx = (name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

const LEVEL_LABELS: Record<string, string> = {
  "1": "Year 1",
  "2": "Year 2",
  "3": "Year 3",
  "4": "Year 4",
  "5": "Year 5",
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DirectoryPage() {
  const [members, setMembers] = React.useState<UserRow[]>([])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "in", ["member", "admin"])
    )
    return onSnapshot(q, (snap) => {
      const next: UserRow[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
      // Sort alphabetically by name
      next.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
      setMembers(next)
    })
  }, [])

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return members
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.course?.toLowerCase().includes(q) ||
        m.skills?.toLowerCase().includes(q)
    )
  }, [members, search])

  const admins = filtered.filter((m) => m.role === "admin")
  const regularMembers = filtered.filter((m) => m.role === "member")

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-600" strokeWidth={1.5} />
            Member Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} in the club.
          </p>
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search by name, course, skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#fbd35a] transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No members found.</div>
      ) : (
        <>
          {/* Executives / Admins */}
          {admins.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Executives
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </section>
          )}

          {/* Members */}
          {regularMembers.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Members
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularMembers.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

function MemberCard({ member }: { member: UserRow }) {
  const color = avatarColor(member.name)
  const isAdmin = member.role === "admin"

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all p-4 flex gap-3">
      {/* Avatar */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border-2 border-[#1c1c1c] shadow-[2px_2px_0px_0px_#1c1c1c] shrink-0 ${color}`}
      >
        {initials(member.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900 text-sm truncate">{member.name ?? "Unknown"}</span>
          {isAdmin && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-300 shrink-0">
              Admin
            </span>
          )}
        </div>

        {(member.course || member.level) && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {[member.course, member.level ? LEVEL_LABELS[member.level] ?? `Year ${member.level}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {member.bio && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{member.bio}</p>
        )}

        {member.skills && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.skills
              .split(/[,;]+/)
              .slice(0, 4)
              .map((s) => s.trim())
              .filter(Boolean)
              .map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 mt-2">
          {member.githubUsername && (
            <a
              href={`https://github.com/${member.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title={`GitHub: ${member.githubUsername}`}
            >
              <Github className="w-3.5 h-3.5" strokeWidth={1.75} />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title={member.email}
            >
              <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
