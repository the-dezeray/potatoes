"use client"

import * as React from "react"
import Link from "next/link"

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"

import { useAuth } from "@/components/AuthContext"
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
import { Badge } from "@/components/ui/badge"

import { db } from "@/lib/firebase"
import type { CertificateRow, CertificateStatus } from "@/lib/firestore-types"

function formatDate(ts: any) {
  try {
    const d = ts?.toDate?.() ? ts.toDate() : null
    return d ? new Date(d).toLocaleDateString() : "—"
  } catch {
    return "—"
  }
}

export default function PortalCertificatesPage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = React.useState<CertificateRow[]>([])
  const [eventTitles, setEventTitles] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user) return

    const unsubEvents = onSnapshot(collection(db, "certificateEvents"), (snap) => {
      const next: Record<string, string> = {}
      for (const d of snap.docs) {
        const data = d.data() as any
        next[d.id] = data.title ?? "(untitled)"
      }
      setEventTitles(next)
    })

    const q = query(
      collection(db, "certificates"),
      where("recipientUserId", "==", user.uid),
      orderBy("issuedAt", "desc")
    )

    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: CertificateRow[] = snap.docs.map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            eventId: data.eventId,
            recipientName: data.recipientName ?? "(unnamed)",
            recipientEmail: data.recipientEmail,
            recipientUserId: data.recipientUserId,
            status: data.status ?? "issued",
            issuedAt: data.issuedAt,
            revokedAt: data.revokedAt,
            createdAt: data.createdAt,
            createdBy: data.createdBy ?? null,
          }
        })
        setCertificates(next)
        setLoading(false)
      },
      () => {
        setCertificates([])
        setLoading(false)
      }
    )

    return () => {
      unsubEvents()
      unsub()
    }
  }, [user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Certificates</CardTitle>
        <CardDescription>Certificates issued to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No certificates yet.
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((c) => {
                const status = (c.status ?? "issued") as CertificateStatus
                const eventTitle = c.eventId ? eventTitles[c.eventId] : null
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{eventTitle || "Certificate"}</div>
                      <div className="text-xs text-muted-foreground">ID: {c.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status === "issued" ? "secondary" : "destructive"}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(c.issuedAt)}</TableCell>
                    <TableCell>
                      <Link href={`/certificates/${c.id}`} className="underline underline-offset-4">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
