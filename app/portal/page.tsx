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

const STATUS_VARIANT: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  planned: "outline",
  active: "default",
  done: "secondary",
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
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Member Portal</CardTitle>
              <CardDescription>
                Signed in as {user?.email ?? ""} ({role})
              </CardDescription>
            </div>
          </div>
          {role === "admin" && (
            <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2 bg-white border-primary/20 hover:bg-primary/5 text-primary">
              <Link href="/admin">
                <Terminal className="w-3.5 h-3.5" />
                Go to Admin Panel
              </Link>
            </Button>
          )}
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
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center gap-3">
              <Terminal className="w-5 h-5 text-slate-400" />
              <div>
                <CardTitle>Available Projects</CardTitle>
                <CardDescription>Join a project to get involved.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>GitHub</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-muted-foreground">
                        No projects yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projects.map((p) => {
                      const isMember = !!user && p.members.includes(user.uid)
                      const isOwner = !!user && p.ownerUid === user.uid
                      return (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="font-medium">{p.name}</div>
                            {p.description && (
                              <div className="max-w-[14rem] truncate text-xs text-muted-foreground">
                                {p.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={STATUS_VARIANT[p.status ?? "planned"]}>
                              {p.status ?? "planned"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {isOwner ? (
                              <Badge variant="secondary">You</Badge>
                            ) : p.ownerUid ? (
                              <span className="text-muted-foreground text-xs">
                                {p.ownerUid.slice(0, 8)}…
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{p.members.length}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {p.deadline
                              ? new Date((p.deadline as any).toDate()).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {p.githubUrl ? (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline underline-offset-2"
                              >
                                GitHub
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              size="sm"
                              variant={isMember ? "secondary" : "default"}
                              disabled={isMember || joiningId === p.id}
                              onClick={() => joinProject(p.id)}
                            >
                              {isMember
                                ? "Joined"
                                : joiningId === p.id
                                  ? "Joining…"
                                  : "Join"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

