"use client"

import * as React from "react"

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
import type {
  EnrollmentRow,
  EnrollmentStatus,
} from "@/lib/firestore-types"
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"

const STATUS_VARIANT: Record<EnrollmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "default",
  rejected: "destructive",
}

export default function AdminEnrollmentsPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = React.useState<EnrollmentRow[]>([])
  const [busyId, setBusyId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const q = query(
      collection(db, "enrollments"),
      orderBy("enrolledAt", "desc"),
      limit(200)
    )
    return onSnapshot(q, (snap) => {
      const next: EnrollmentRow[] = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          courseTitle: data.courseTitle ?? "",
          userId: data.userId ?? undefined,
          fullName: data.fullName ?? undefined,
          email: data.email ?? undefined,
          phone: data.phone ?? undefined,
          isMember: data.isMember ?? undefined,
          price: data.price ?? undefined,
          status: data.status ?? "pending",
          enrolledAt: data.enrolledAt,
          reviewedAt: data.reviewedAt,
          reviewedBy: data.reviewedBy ?? null,
          updatedAt: data.updatedAt,
        }
      })
      setEnrollments(next)
    })
  }, [])

  async function setStatus(item: EnrollmentRow, status: EnrollmentStatus) {
    if (!user) return
    setBusyId(item.id)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "enrollments", item.id), {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: user.uid,
        updatedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: user.uid,
        actorEmail: user.email ?? undefined,
        action: "enrollment.status_changed",
        targetType: "enrollment",
        targetId: item.id,
        targetLabel: item.fullName ?? item.email ?? item.id,
        metadata: {
          from: item.status,
          to: status,
          courseTitle: item.courseTitle,
          enrollmentEmail: item.email,
        },
      })
      await batch.commit()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
        <CardDescription>
          Everyone who has enrolled in a course. Confirm or reject pending
          registrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollee</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  No course enrollments yet.
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="font-medium">{e.fullName || e.email || "—"}</div>
                    {e.email && <div className="text-xs text-muted-foreground">{e.email}</div>}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{e.courseTitle}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {e.isMember ? (
                      <Badge variant="secondary">FREE</Badge>
                    ) : (
                      <span>P {(e.price ?? 150).toLocaleString()}.00</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {e.phone ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {e.enrolledAt
                      ? new Date((e.enrolledAt as any).toDate()).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[e.status] ?? "outline"}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {e.status === "pending" ? (
                      <div className="inline-flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyId === e.id}
                          onClick={() => setStatus(e, "confirmed")}
                        >
                          {busyId === e.id ? "Working…" : "Confirm"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busyId === e.id}
                          onClick={() => setStatus(e, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
