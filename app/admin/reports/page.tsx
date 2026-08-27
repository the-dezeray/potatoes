"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/firebase"
import type { AuditLogRow, UserRow, ApplicationRow, ProjectRow } from "@/lib/firestore-types"
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"

type Counts = {
  totalUsers: number
  pendingUsers: number
  memberUsers: number
  adminUsers: number
  totalProjects: number
  activeProjects: number
  totalApplications: number
  submittedApplications: number
  approvedApplications: number
  rejectedApplications: number
  totalAnnouncements: number
}

const ACTION_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "user.role_changed": "secondary",
  "user.removed": "destructive",
  "user.project_assigned": "default",
  "user.project_removed": "outline",
  "project.created": "default",
  "project.updated": "secondary",
  "project.deleted": "destructive",
  "application.approved": "default",
  "application.rejected": "destructive",
  "announcement.created": "default",
  "announcement.updated": "secondary",
  "announcement.deleted": "destructive",
}

export default function AdminReportsPage() {
  const [logs, setLogs] = React.useState<AuditLogRow[]>([])
  const [counts, setCounts] = React.useState<Counts>({
    totalUsers: 0,
    pendingUsers: 0,
    memberUsers: 0,
    adminUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalApplications: 0,
    submittedApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalAnnouncements: 0,
  })

  React.useEffect(() => {
    const q = query(
      collection(db, "auditLogs"),
      orderBy("createdAt", "desc"),
      limit(200)
    )
    return onSnapshot(q, (snap) => {
      const next: AuditLogRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          actorUid: data.actorUid,
          actorEmail: data.actorEmail,
          action: data.action,
          targetType: data.targetType,
          targetId: data.targetId,
          targetLabel: data.targetLabel,
          metadata: data.metadata,
          createdAt: data.createdAt,
        }
      })
      setLogs(next)
    })
  }, [])

  React.useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const rows = snap.docs.map((d) => d.data() as UserRow)
      setCounts((c) => ({
        ...c,
        totalUsers: rows.length,
        pendingUsers: rows.filter((u) => u.role === "pending").length,
        memberUsers: rows.filter((u) => u.role === "member").length,
        adminUsers: rows.filter((u) => u.role === "admin").length,
      }))
    })

    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const rows = snap.docs.map((d) => d.data() as ProjectRow)
      setCounts((c) => ({
        ...c,
        totalProjects: rows.length,
        activeProjects: rows.filter((p) => p.status === "active").length,
      }))
    })

    const unsubApps = onSnapshot(collection(db, "applications"), (snap) => {
      const rows = snap.docs.map((d) => d.data() as ApplicationRow)
      setCounts((c) => ({
        ...c,
        totalApplications: rows.length,
        submittedApplications: rows.filter((a) => a.status === "submitted").length,
        approvedApplications: rows.filter((a) => a.status === "approved").length,
        rejectedApplications: rows.filter((a) => a.status === "rejected").length,
      }))
    })

    const unsubAnn = onSnapshot(collection(db, "announcements"), (snap) => {
      setCounts((c) => ({ ...c, totalAnnouncements: snap.size }))
    })

    return () => {
      unsubUsers()
      unsubProjects()
      unsubApps()
      unsubAnn()
    }
  }, [])

  const statCards = [
    { label: "Total Users", value: counts.totalUsers },
    { label: "Pending", value: counts.pendingUsers },
    { label: "Members", value: counts.memberUsers },
    { label: "Admins", value: counts.adminUsers },
    { label: "Projects", value: counts.totalProjects },
    { label: "Active Projects", value: counts.activeProjects },
    { label: "Applications", value: counts.totalApplications },
    { label: "Pending Apps", value: counts.submittedApplications },
    { label: "Approved Apps", value: counts.approvedApplications },
    { label: "Rejec. Apps", value: counts.rejectedApplications },
    { label: "Announcements", value: counts.totalAnnouncements },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Live counts across all Firestore collections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-lg border p-3">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Last 200 admin actions, newest first.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No audit log entries yet. Admin actions will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {log.createdAt
                        ? new Date((log.createdAt as any).toDate()).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.actorEmail ?? log.actorUid}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ACTION_VARIANT[log.action] ?? "outline"}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="text-muted-foreground capitalize">{log.targetType}:</span>{" "}
                      {log.targetLabel ?? log.targetId}
                    </TableCell>
                    <TableCell className="max-w-[16rem] truncate text-xs text-muted-foreground">
                      {log.metadata ? JSON.stringify(log.metadata) : ""}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
