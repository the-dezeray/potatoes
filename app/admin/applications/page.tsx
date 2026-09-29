"use client"

import * as React from "react"

import { useAuth } from "@/components/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
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
import { batchAudit } from "@/lib/audit"
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/actions/email"
import type { UserRow } from "@/lib/firestore-types"
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore"

type PendingUser = UserRow & {
  phoneNumber?: string
  level?: string
  course?: string
  githubUsername?: string
  bio?: string
  applicationSubmittedAt?: any
}

export default function AdminApplicationsPage() {
  const { user } = useAuth()
  const [apps, setApps] = React.useState<PendingUser[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "pending"),
      where("applicationSubmitted", "==", true),
      orderBy("applicationSubmittedAt", "desc"),
      limit(100)
    )
    return onSnapshot(q, (snap) => {
      const next: PendingUser[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          email: data.email ?? "",
          role: data.role ?? "pending",
          name: data.name ?? "",
          bio: data.bio,
          skills: data.skills,
          phoneNumber: data.phoneNumber,
          level: data.level,
          course: data.course,
          githubUsername: data.githubUsername,
          applicationSubmittedAt: data.applicationSubmittedAt,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      setApps(next)
    })
  }, [])

  async function approve(applicant: PendingUser) {
    if (!user) return
    setBusyId(applicant.id)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "users", applicant.id), {
        role: "member",
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        action: "application.approved",
        targetType: "user",
        targetId: applicant.id,
        targetLabel: applicant.name ?? applicant.email ?? applicant.id,
        metadata: { applicantEmail: applicant.email },
      })
      await batch.commit()
      setApps((prev) => prev.filter((a) => a.id !== applicant.id))

      // Notify user via email (non-blocking)
      if (applicant.email) {
        sendApprovalEmail(applicant.email, applicant.name || "Member")
      }
    } finally {
      setBusyId(null)
    }
  }

  async function reject(applicant: PendingUser) {
    if (!user) return
    setBusyId(applicant.id)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "users", applicant.id), {
        role: "rejected",
        applicationSubmitted: false, // Prevents them from showing in pending lists
        applicationRejected: true,
        applicationRejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        action: "application.rejected",
        targetType: "user",
        targetId: applicant.id,
        targetLabel: applicant.name ?? applicant.email ?? applicant.id,
        metadata: { applicantEmail: applicant.email },
      })
      await batch.commit()
      setApps((prev) => prev.filter((a) => a.id !== applicant.id))

      // Notify user via email (non-blocking)
      if (applicant.email) {
        sendRejectionEmail(applicant.email, applicant.name || "User")
      }
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Applications</CardTitle>
        <CardDescription>Approve or reject pending membership requests. Only users who have submitted the application form appear here.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <colgroup>
            <col className="w-[35%]" />
            <col className="w-[15%]" />
            <col className="w-[25%]" />
            <col className="w-[10%]" />
            <col className="w-[15%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Education</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No pending applications.
                </TableCell>
              </TableRow>
            ) : (
              apps.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="max-w-0">
                    <div className="font-medium truncate">{a.name || a.email}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.skills ?? "No expertise listed"}</div>
                    {a.bio && (
                      <div className="mt-1 line-clamp-2 text-[10px] text-muted-foreground italic border-l-2 border-slate-100 pl-2">
                        &quot;{a.bio}&quot;
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-0">
                    <div className="text-sm font-bold truncate">{a.level ?? "—"}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{a.course ?? "—"}</div>
                  </TableCell>
                  <TableCell className="max-w-0">
                    <div className="text-sm font-medium truncate">{a.email}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.phoneNumber ?? "—"}</div>
                    {a.githubUsername && (
                      <div className="flex items-center gap-1 text-[11px] text-sky-600 font-mono truncate">
                        <Github className="w-2.5 h-2.5 shrink-0" /> {a.githubUsername}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {a.applicationSubmittedAt
                      ? new Date((a.applicationSubmittedAt as any).toDate()).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2 justify-end">
                      <Button
                        type="button"
                        size="sm"
                        disabled={busyId === a.id}
                        onClick={() => approve(a)}
                      >
                        {busyId === a.id ? "Working…" : "Approve"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busyId === a.id}
                        onClick={() => reject(a)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
