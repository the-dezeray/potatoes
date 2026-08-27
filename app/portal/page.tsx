"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Megaphone, 
  FolderKanban, 
  UserCircle, 
  User, 
  Terminal,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserPlus,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  Bell,
  Info,
  Github,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react"

import { useAuth } from "@/components/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { Facehash } from "facehash"
import type { ProjectRow, AnnouncementRow, ProjectStatus, AnnouncementType } from "@/lib/firestore-types"
import {
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"

const STATUS_STYLE: Record<
  ProjectStatus,
  { label: string; bg: string; border: string; text: string; stripe: string; icon: React.ElementType }
> = {
  planned: {
    label: "Planned",
    bg: "#f0f9ff",
    border: "#0369a1",
    text: "#0c4a6e",
    stripe: "#0ea5e9",
    icon: Circle,
  },
  active: {
    label: "Active",
    bg: "#f0fdf4",
    border: "#15803d",
    text: "#14532d",
    stripe: "#22c55e",
    icon: Zap,
  },
  done: {
    label: "Done",
    bg: "#f5f3ff",
    border: "#6d28d9",
    text: "#3b0764",
    stripe: "#8b5cf6",
    icon: CheckCircle2,
  },
}

// ── Retro type config ────────────────────────────────────────────────────────
const RETRO_TYPE: Record<
  AnnouncementType,
  { label: string; icon: React.ElementType; bg: string; border: string; shadow: string; tag: string; tagText: string }
> = {
  general: {
    label: "GENERAL",
    icon: Info,
    bg: "#f5f5f0",
    border: "#374151",
    shadow: "#374151",
    tag: "#374151",
    tagText: "#f5f5f0",
  },
  meeting: {
    label: "MEETING",
    icon: CalendarDays,
    bg: "#dbeafe",
    border: "#1d4ed8",
    shadow: "#1e3a8a",
    tag: "#1d4ed8",
    tagText: "#ffffff",
  },
  payment: {
    label: "PAYMENT",
    icon: CreditCard,
    bg: "#dcfce7",
    border: "#15803d",
    shadow: "#14532d",
    tag: "#15803d",
    tagText: "#ffffff",
  },
  warning: {
    label: "WARNING",
    icon: AlertTriangle,
    bg: "#fef9c3",
    border: "#b45309",
    shadow: "#78350f",
    tag: "#b45309",
    tagText: "#ffffff",
  },
  link: {
    label: "RESOURCE",
    icon: ExternalLink,
    bg: "#ede9fe",
    border: "#6d28d9",
    shadow: "#4c1d95",
    tag: "#6d28d9",
    tagText: "#ffffff",
  },
}

export default function PortalPage() {
  const { user, role, userDoc } = useAuth()

  const [projects, setProjects] = React.useState<ProjectRow[]>([])
  const [announcements, setAnnouncements] = React.useState<AnnouncementRow[]>([])
  const [joiningId, setJoiningId] = React.useState<string | null>(null)

  const [name, setName] = React.useState("")
  const [skills, setSkills] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [savingProfile, setSavingProfile] = React.useState(false)

  React.useEffect(() => {
    setName(userDoc?.name ?? "")
    setSkills(userDoc?.skills ?? "")
    setBio(userDoc?.bio ?? "")
  }, [userDoc?.bio, userDoc?.name, userDoc?.skills])

  React.useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const next: ProjectRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          name: data.name ?? "(untitled)",
          description: data.description,
          members: Array.isArray(data.members) ? data.members : [],
          ownerUid: data.ownerUid ?? null,
          status: data.status ?? "planned",
          deadline: data.deadline ?? null,
          githubUrl: data.githubUrl,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      setProjects(next)
    })

    const announcementsQ = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(5)
    )

    const unsubAnnouncements = onSnapshot(announcementsQ, (snap) => {
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
        }
      })
      setAnnouncements(next)
    })

    return () => {
      unsubProjects()
      unsubAnnouncements()
    }
  }, [])

  async function joinProject(projectId: string) {
    if (!user) return
    setJoiningId(projectId)
    try {
      await updateDoc(doc(db, "projects", projectId), {
        members: arrayUnion(user.uid),
        updatedAt: serverTimestamp(),
      })
    } finally {
      setJoiningId(null)
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSavingProfile(true)
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          skills,
          bio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-none shadow-none bg-slate-50">
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl border shadow-sm">
             <Facehash name={user?.email || "User"} size={48} />
          
            </div>
            <div>
              <CardTitle className="text-xl">Member Portal</CardTitle>
              <CardDescription>
                Signed in as {user?.email ?? ""} ({role})
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="hidden md:flex gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 text-white border-none shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all duration-500 hover:scale-110 active:scale-95 animate-pulse hover:animate-none font-bold italic tracking-wider uppercase items-center"
            >
              <Link href="/leaderboard">
                <Users className="w-4 h-4 animate-bounce" />
                <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Leaderboard</span>
              </Link>
            </Button>
            {role === "admin" && (
              <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2 bg-white border-primary/20 hover:bg-primary/5 text-primary">
                <Link href="/admin">
                  <Terminal className="w-3.5 h-3.5" />
                  Go to Admin Panel
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Latest announcements preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-slate-500" />
              <div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest club updates.</CardDescription>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portal/announcements" className="gap-2">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          ) : (
            announcements.map((a) => {
              const type: AnnouncementType = (a as any).type ?? "general"
              const isUrgent = (a as any).isUrgent ?? false
              const link = (a as any).link as string | undefined
              const cfg = RETRO_TYPE[type] ?? RETRO_TYPE.general
              const Icon = cfg.icon
              return (
                <div
                  key={a.id}
                  style={{
                    background: isUrgent ? "#fff1f2" : cfg.bg,
                    border: `2px solid ${isUrgent ? "#e11d48" : cfg.border}`,
                    boxShadow: `4px 4px 0px 0px ${isUrgent ? "#9f1239" : cfg.shadow}`,
                    borderRadius: "6px",
                    padding: "12px 14px",
                  }}
                  className="transition-transform hover:-translate-y-px"
                >
                  {/* Top row: badges + date */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Type tag */}
                      <span
                        style={{
                          background: isUrgent ? "#e11d48" : cfg.tag,
                          color: isUrgent ? "#ffffff" : cfg.tagText,
                          border: `1.5px solid ${isUrgent ? "#9f1239" : cfg.border}`,
                          fontFamily: "var(--font-pixel-square, monospace)",
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          padding: "2px 6px",
                          borderRadius: "3px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {isUrgent ? (
                          <Bell style={{ width: 9, height: 9, strokeWidth: 2.5 }} />
                        ) : (
                          <Icon style={{ width: 9, height: 9, strokeWidth: 2.5 }} />
                        )}
                        {isUrgent ? "URGENT" : cfg.label}
                      </span>
                    </div>
                    {a.createdAt && (
                      <span
                        style={{
                          fontFamily: "var(--font-pixel-square, monospace)",
                          fontSize: "9px",
                          color: isUrgent ? "#be123c" : cfg.border,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {new Date((a.createdAt as any).toDate()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p
                    style={{
                      fontFamily: "var(--font-pixel-square, monospace)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isUrgent ? "#9f1239" : cfg.border,
                      letterSpacing: "0.03em",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {a.title}
                  </p>

                  {/* Body */}
                  {a.body && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed"
                      style={{ color: isUrgent ? "#e11d48" : cfg.shadow }}
                    >
                      {a.body}
                    </p>
                  )}

                  {/* Link button */}
                  {link && (
                    <div className="mt-2">
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          background: cfg.tag,
                          color: cfg.tagText,
                          border: `1.5px solid ${cfg.border}`,
                          boxShadow: `2px 2px 0px 0px ${cfg.shadow}`,
                          fontFamily: "var(--font-pixel-square, monospace)",
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          padding: "3px 8px",
                          borderRadius: "3px",
                          textDecoration: "none",
                        }}
                        className="active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-transform"
                      >
                        <ExternalLink style={{ width: 9, height: 9, strokeWidth: 2.5 }} />
                        OPEN
                      </Link>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="projects">
        <TabsList className="bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
            <FolderKanban className="w-4 h-4" />
            <span>Active Projects</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
            <UserCircle className="w-4 h-4" />
            <span>My Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="mt-4 flex flex-col gap-4">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-[#1c1c1c] text-base tracking-tight">Available Projects</h2>
                <p className="text-xs text-slate-500 mt-0.5">Join a project to get involved.</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 tabular-nums">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-14 flex flex-col items-center gap-2">
                <FolderKanban className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm text-slate-400 font-medium">No projects yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => {
                  const isMember = !!user && p.members.includes(user.uid)
                  const isOwner = !!user && p.ownerUid === user.uid
                  const status = p.status ?? "planned"
                  const st = STATUS_STYLE[status]
                  const StatusIcon = st.icon
                  return (
                    <div
                      key={p.id}
                      className="rounded-2xl border-2 border-[#1c1c1c] bg-white shadow-[4px_4px_0px_0px_#1c1c1c] overflow-hidden flex flex-col"
                    >
                      {/* Colored top stripe */}
                      <div style={{ height: 4, background: st.stripe }} />

                      {/* Body */}
                      <div className="flex flex-col gap-3 p-4 flex-1">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-black text-[#1c1c1c] text-sm leading-snug tracking-tight flex-1">
                            {p.name}
                          </h3>
                          {/* Status pill */}
                          <span
                            style={{
                              background: st.bg,
                              border: `1.5px solid ${st.border}`,
                              color: st.text,
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          >
                            <StatusIcon className="w-2.5 h-2.5" strokeWidth={2.5} />
                            {st.label}
                          </span>
                        </div>

                        {/* Description */}
                        {p.description && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {p.description}
                          </p>
                        )}

                        {/* Meta pills */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                            <Users className="w-3 h-3" strokeWidth={2} />
                            {p.members.length} member{p.members.length !== 1 ? "s" : ""}
                          </span>
                          {p.deadline && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                              <Clock className="w-3 h-3" strokeWidth={2} />
                              {new Date((p.deadline as any).toDate()).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          {isOwner && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fbd35a] border border-[#1c1c1c] text-[#1c1c1c]">
                              Owner
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t-2 border-[#1c1c1c] px-4 py-3 flex items-center justify-between gap-3 bg-slate-50">
                        {p.githubUrl ? (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" strokeWidth={2} />
                            GitHub
                            <ExternalLink className="w-2.5 h-2.5 opacity-50" strokeWidth={2} />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300 font-medium">No repo linked</span>
                        )}
                        <button
                          type="button"
                          disabled={isMember || joiningId === p.id}
                          onClick={() => joinProject(p.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-lg border-2 border-[#1c1c1c] transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                            enabled:bg-[#1c1c1c] enabled:text-white enabled:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]
                            enabled:hover:-translate-x-px enabled:hover:-translate-y-px enabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]
                            enabled:active:translate-x-px enabled:active:translate-y-px enabled:active:shadow-none
                            disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                        >
                          {isMember ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Joined</>
                          ) : joiningId === p.id ? (
                            "Joining…"
                          ) : (
                            <><UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} /> Join</>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center gap-3">
              <UserCircle className="w-5 h-5 text-slate-400" />
              <div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your club member profile.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="flex flex-col gap-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="skills">Skills</FieldLabel>
                    <Input
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, design, CAD…"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? "Saving…" : "Save"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

