"use client"

import * as React from "react"
import Link from "next/link"

import { useAuth } from "@/components/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Mail, Phone, Shield, User, XCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { batchAudit } from "@/lib/audit"
import { PAYMENT_METHOD_LABELS } from "@/lib/firestore-types"
import type { UserRole, UserRow, ProjectRow, PaymentRow } from "@/lib/firestore-types"
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"

const ROLES: UserRole[] = ["pending", "member", "admin", "rejected"]

const ROLE_VARIANT: Record<UserRole, "outline" | "default" | "secondary" | "destructive"> = {
  pending: "outline",
  member: "secondary",
  admin: "default",
  rejected: "destructive",
}

export default function AdminUsersPage() {
  const { user: adminUser } = useAuth()
  const [users, setUsers] = React.useState<UserRow[]>([])
  const [projects, setProjects] = React.useState<ProjectRow[]>([])
  const [payments, setPayments] = React.useState<PaymentRow[]>([])
  const [busyUid, setBusyUid] = React.useState<string | null>(null)

  // detail modal (overview + projects + payments merged)
  const [detailTarget, setDetailTarget] = React.useState<UserRow | null>(null)
  const [assignBusy, setAssignBusy] = React.useState<string | null>(null)

  // condensed-table filters
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<"" | UserRole>("")
  const [feeFilter, setFeeFilter] = React.useState("")
  const [paidFilter, setPaidFilter] = React.useState<"" | "paid" | "unpaid">("")

  React.useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const next: UserRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          email: data.email,
          role: data.role ?? "pending",
          name: data.name,
          bio: data.bio,
          skills: data.skills,
          phoneNumber: data.phoneNumber,
          level: data.level,
          course: data.course,
          githubUsername: data.githubUsername,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      // Applicants live in this same collection as role "pending", so keep them
      // off this page. They are reviewed on /admin/applications instead.
      const members = next.filter(
        (u) => u.role === "member" || u.role === "admin"
      )
      members.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))
      setUsers(members)
    })

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
        }
      })
      setProjects(next)
    })

    const unsubPayments = onSnapshot(
      query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(500)),
      (snap) => {
        const next: PaymentRow[] = snap.docs.map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            userId: data.userId,
            memberName: data.memberName ?? "(unnamed)",
            memberEmail: data.memberEmail,
            label: data.label ?? "",
            amount: data.amount ?? 0,
            currency: data.currency ?? "BWP",
            method: data.method ?? "cash",
            reference: data.reference,
            receiptNo: data.receiptNo ?? d.id,
            status: data.status ?? "paid",
            paidAt: data.paidAt,
            createdAt: data.createdAt,
            createdBy: data.createdBy ?? null,
          }
        })
        setPayments(next)
      },
      () => setPayments([])
    )

    return () => {
      unsubUsers()
      unsubProjects()
      unsubPayments()
    }
  }, [])

  async function changeRole(targetUser: UserRow, newRole: UserRole) {
    if (!adminUser) return
    setBusyUid(targetUser.id)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "users", targetUser.id), {
        role: newRole,
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: newRole === "pending" ? "user.removed" : "user.role_changed",
        targetType: "user",
        targetId: targetUser.id,
        targetLabel: targetUser.email ?? targetUser.id,
        metadata: { previousRole: targetUser.role, newRole },
      })
      await batch.commit()
      // keep the open modal in sync
      setDetailTarget((cur) => (cur?.id === targetUser.id ? { ...cur, role: newRole } : cur))
    } finally {
      setBusyUid(null)
    }
  }

  async function toggleProjectMembership(
    target: UserRow,
    projectId: string,
    projectName: string,
    isMember: boolean
  ) {
    if (!adminUser) return
    setAssignBusy(projectId)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "projects", projectId), {
        members: isMember ? arrayRemove(target.id) : arrayUnion(target.id),
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: isMember ? "user.project_removed" : "user.project_assigned",
        targetType: "user",
        targetId: target.id,
        targetLabel: target.email ?? target.id,
        metadata: { projectId, projectName },
      })
      await batch.commit()
    } finally {
      setAssignBusy(null)
    }
  }

  const feeLabels = React.useMemo(
    () => Array.from(new Set(payments.map((p) => p.label).filter(Boolean))).sort(),
    [payments]
  )

  // latest paid receipt per user for the selected fee label (empty fee = any fee)
  const paidByUser = React.useMemo(() => {
    const map = new Map<string, PaymentRow>()
    for (const p of payments) {
      if ((p.status ?? "paid") !== "paid") continue
      if (feeFilter && p.label !== feeFilter) continue
      if (!p.userId || map.has(p.userId)) continue
      map.set(p.userId, p)
    }
    return map
  }, [payments, feeFilter])

  const filteredUsers = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false
      const paid = paidByUser.has(u.id)
      if (paidFilter === "paid" && !paid) return false
      if (paidFilter === "unpaid" && paid) return false
      if (!q) return true
      return (
        (u.name ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.course ?? "").toLowerCase().includes(q)
      )
    })
  }, [users, search, roleFilter, paidFilter, paidByUser])

  const detailProjects = React.useMemo(() => {
    if (!detailTarget) return []
    return projects.map((p) => ({ ...p, isMember: p.members.includes(detailTarget.id) }))
  }, [detailTarget, projects])

  const detailPayments = React.useMemo(() => {
    if (!detailTarget) return []
    return payments.filter((p) => p.userId === detailTarget.id)
  }, [detailTarget, payments])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>
            Approved members and admins. Click a row for contact details, projects and payment
            history. Pending applicants are reviewed on the Applications page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, course"
              className="sm:max-w-xs"
            />
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as "" | UserRole)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by role"
              >
                <option value="">All roles</option>
                <option value="member">member</option>
                <option value="admin">admin</option>
              </select>
              <select
                value={feeFilter}
                onChange={(e) => setFeeFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Fee to check payment against"
                title="Fee to check payment against"
              >
                <option value="">Any fee</option>
                {feeLabels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={paidFilter}
                onChange={(e) => setPaidFilter(e.target.value as "" | "paid" | "unpaid")}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                aria-label="Filter by payment status"
              >
                <option value="">Paid + unpaid</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Paid{feeFilter ? ` — ${feeFilter}` : ""}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No members match these filters. Pending applications are reviewed on the
                    Applications page.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => {
                  const receipt = paidByUser.get(u.id)
                  const isBusy = busyUid === u.id
                  return (
                    <TableRow
                      key={u.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setDetailTarget(u)}
                    >
                      <TableCell>
                        <div className="font-medium">{u.name ?? u.email ?? u.id}</div>
                        {u.name && u.email && (
                          <div className="text-xs text-muted-foreground truncate max-w-56">{u.email}</div>
                        )}
                        {(u.level || u.course) && (
                          <div className="text-[11px] text-muted-foreground leading-tight">
                            {[u.level, u.course].filter(Boolean).join(" · ")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ROLE_VARIANT[u.role ?? "pending"]}>
                          {u.role ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {receipt ? (
                          <Badge variant="secondary" title={`${receipt.receiptNo} · ${receipt.label}`}>
                            Paid
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unpaid</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={isBusy}
                          onClick={() => setDetailTarget(u)}
                          className="h-8"
                        >
                          View
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

      {/* Member detail dialog: contact + role actions + projects + payments */}
      <Dialog open={!!detailTarget} onOpenChange={(v) => !v && setDetailTarget(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detailTarget?.name ?? detailTarget?.email ?? detailTarget?.id}
            </DialogTitle>
          </DialogHeader>
          {detailTarget && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={ROLE_VARIANT[detailTarget.role ?? "pending"]}>
                  {detailTarget.role ?? "pending"}
                </Badge>
                {(() => {
                  const r = paidByUser.get(detailTarget.id)
                  return r ? (
                    <Badge variant="secondary" title={`${r.receiptNo} · ${r.label}`}>
                      Paid{feeFilter ? ` — ${feeFilter}` : ""}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Unpaid{feeFilter ? ` — ${feeFilter}` : ""}</Badge>
                  )
                })()}
                {(detailTarget.level || detailTarget.course) && (
                  <span className="text-xs text-muted-foreground">
                    {[detailTarget.level, detailTarget.course].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>

              {/* contact */}
              <section className="space-y-1">
                <h3 className="text-sm font-semibold">Contact</h3>
                <div className="flex flex-col gap-1 text-sm">
                  {detailTarget.email ? (
                    <a
                      href={`mailto:${detailTarget.email}`}
                      className="flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      {detailTarget.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No email</span>
                  )}
                  {detailTarget.phoneNumber ? (
                    <a
                      href={`tel:${detailTarget.phoneNumber}`}
                      className="flex items-center gap-1 text-sky-600 hover:underline"
                    >
                      <Phone className="w-3 h-3 shrink-0" />
                      {detailTarget.phoneNumber}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No phone</span>
                  )}
                  {detailTarget.githubUsername && (
                    <a
                      href={`https://github.com/${detailTarget.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-sky-600 font-mono hover:underline"
                    >
                      <Github className="w-3 h-3 shrink-0" />
                      {detailTarget.githubUsername}
                    </a>
                  )}
                </div>
                {(detailTarget.bio || detailTarget.skills) && (
                  <div className="pt-1 text-sm">
                    {detailTarget.bio && <p className="text-slate-700">{detailTarget.bio}</p>}
                    {detailTarget.skills && (
                      <p className="text-xs text-muted-foreground mt-1">Skills: {detailTarget.skills}</p>
                    )}
                  </div>
                )}
              </section>

              {/* role actions */}
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Role</h3>
                <div className="flex flex-wrap gap-2">
                  {detailTarget.role === "member" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyUid === detailTarget.id}
                      onClick={() => changeRole(detailTarget, "admin")}
                      className="h-8"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Make Admin
                    </Button>
                  )}
                  {detailTarget.role === "admin" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyUid === detailTarget.id}
                      onClick={() => changeRole(detailTarget, "member")}
                      className="h-8"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Demote
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={busyUid === detailTarget.id}
                    onClick={() => changeRole(detailTarget, "rejected")}
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </section>

              {/* projects */}
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Projects</h3>
                {projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No projects yet.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {detailProjects.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <div className="text-sm font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{p.status}</div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={p.isMember ? "destructive" : "default"}
                          disabled={assignBusy === p.id}
                          onClick={() =>
                            toggleProjectMembership(detailTarget, p.id, p.name, p.isMember)
                          }
                        >
                          {assignBusy === p.id ? "Saving…" : p.isMember ? "Remove" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* payments */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Payments</h3>
                  <Button asChild size="sm" variant="outline" className="h-8">
                    <Link href="/admin/payments">Record payment</Link>
                  </Button>
                </div>
                {detailPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments recorded.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {detailPayments.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      >
                        <div>
                          <div className="font-mono font-medium">{p.receiptNo}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.label} · {PAYMENT_METHOD_LABELS[p.method] ?? p.method}
                            {p.reference ? ` · Tx: ${p.reference}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={(p.status ?? "paid") === "paid" ? "secondary" : "destructive"}>
                            {p.status ?? "paid"}
                          </Badge>
                          <Button asChild size="sm" variant="ghost" className="h-8">
                            <Link href={`/receipts/${encodeURIComponent(p.id)}`}>Verify</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
