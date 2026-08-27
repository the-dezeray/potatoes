"use client"

import * as React from "react"

import { useAuth } from "@/components/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Shield, User, UserMinus, UserPlus, XCircle } from "lucide-react"
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
import type { UserRole, UserRow, ProjectRow } from "@/lib/firestore-types"
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
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
  const [busyUid, setBusyUid] = React.useState<string | null>(null)

  // project-assign dialog state
  const [assignTarget, setAssignTarget] = React.useState<UserRow | null>(null)
  const [assignBusy, setAssignBusy] = React.useState<string | null>(null)

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
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      next.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))
      setUsers(next)
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

    return () => {
      unsubUsers()
      unsubProjects()
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
    } finally {
      setBusyUid(null)
    }
  }

  async function toggleProjectMembership(projectId: string, projectName: string, isMember: boolean) {
    if (!adminUser || !assignTarget) return
    setAssignBusy(projectId)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "projects", projectId), {
        members: isMember
          ? arrayRemove(assignTarget.id)
          : arrayUnion(assignTarget.id),
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: isMember ? "user.project_removed" : "user.project_assigned",
        targetType: "user",
        targetId: assignTarget.id,
        targetLabel: assignTarget.email ?? assignTarget.id,
        metadata: { projectId, projectName },
      })
      await batch.commit()
    } finally {
      setAssignBusy(null)
    }
  }

  const userProjects = React.useMemo(() => {
    if (!assignTarget) return []
    return projects.map((p) => ({
      ...p,
      isMember: p.members.includes(assignTarget.id),
    }))
  }, [assignTarget, projects])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>
            Manage roles and project assignments for all registered users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email / Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No users yet.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const memberOfCount = projects.filter((p) =>
                    p.members.includes(u.id)
                  ).length
                  const isBusy = busyUid === u.id

                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium">{u.email ?? u.id}</div>
                        {u.name && (
                          <div className="text-xs text-muted-foreground">{u.name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={ROLE_VARIANT[u.role ?? "pending"]}>
                          {u.role ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{memberOfCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.createdAt
                          ? new Date((u.createdAt as any).toDate()).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex justify-end gap-2">
                          {/* Main Role Actions */}
                          {u.role === "pending" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="default"
                              disabled={isBusy}
                              onClick={() => changeRole(u, "member")}
                              className="h-8"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          )}

                          {u.role === "member" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => changeRole(u, "admin")}
                              className="h-8"
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Make Admin
                            </Button>
                          )}

                          {u.role === "admin" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => changeRole(u, "member")}
                              className="h-8"
                            >
                              <User className="w-4 h-4 mr-1" />
                              Demote
                            </Button>
                          )}

                          {u.role !== "rejected" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={isBusy}
                              onClick={() => changeRole(u, "rejected")}
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          )}

                          {u.role === "rejected" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => changeRole(u, "pending")}
                              className="h-8"
                            >
                              Restore
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={isBusy}
                            onClick={() => setAssignTarget(u)}
                            className="h-8"
                          >
                            Projects
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project assignment dialog */}
      <Dialog open={!!assignTarget} onOpenChange={(v) => !v && setAssignTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Assign Projects — {assignTarget?.email ?? assignTarget?.id}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-3">
            Toggle project membership. Users can belong to multiple projects.
          </p>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {userProjects.map((p) => (
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
                    onClick={() => toggleProjectMembership(p.id, p.name, p.isMember)}
                  >
                    {assignBusy === p.id
                      ? "Saving…"
                      : p.isMember
                        ? "Remove"
                        : "Add"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
