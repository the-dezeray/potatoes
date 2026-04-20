"use client"

import * as React from "react"
import Link from "next/link"

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"

import { useAuth } from "@/components/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { batchAudit } from "@/lib/audit"
import { stripUndefinedDeep } from "@/lib/firestore-clean"
import type {
  CertificateEventRow,
  CertificateRow,
  UserRow,
  CertificateStatus,
} from "@/lib/firestore-types"
import { CertificateArtwork } from "@/components/certificate-artwork"

function safeOrigin() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

function shouldSkipFontEmbedding() {
  if (typeof navigator === "undefined") return false
  return /firefox/i.test(navigator.userAgent)
}

function formatCertificateDate(value: any) {
  try {
    const d = value?.toDate?.() ? value.toDate() : value instanceof Date ? value : null
    return d
      ? new Date(d)
          .toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
          .toUpperCase()
      : "APRIL 18, 2026"
  } catch {
    return "APRIL 18, 2026"
  }
}

function formatDate(ts: any) {
  try {
    const d = ts?.toDate?.() ? ts.toDate() : null
    return d ? new Date(d).toLocaleDateString() : "—"
  } catch {
    return "—"
  }
}

const STATUS_VARIANT: Record<CertificateStatus, "secondary" | "outline" | "destructive" | "default"> = {
  issued: "secondary",
  revoked: "destructive",
}

export default function AdminCertificatesPage() {
  const { user: adminUser } = useAuth()

  const [users, setUsers] = React.useState<UserRow[]>([])
  const [events, setEvents] = React.useState<CertificateEventRow[]>([])
  const [certificates, setCertificates] = React.useState<CertificateRow[]>([])

  const [busy, setBusy] = React.useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = React.useState<string>("")

  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)
  const downloadRef = React.useRef<HTMLDivElement | null>(null)
  const [downloadPayload, setDownloadPayload] = React.useState<
    | null
    | {
        certificate: CertificateRow
        event: CertificateEventRow | null
        qrDataUrl: string | null
        certificateUrl: string
      }
  >(null)

  const [lastIssuedId, setLastIssuedId] = React.useState<string | null>(null)

  // create event
  const [eventTitle, setEventTitle] = React.useState("")
  const [eventDate, setEventDate] = React.useState("") // yyyy-mm-dd
  const [eventDescription, setEventDescription] = React.useState("")

  // issue certificate
  const [recipientName, setRecipientName] = React.useState("")
  const [recipientEmail, setRecipientEmail] = React.useState("")
  const [recipientUserId, setRecipientUserId] = React.useState("")

  React.useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const next: UserRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return {
          id: d.id,
          email: data.email,
          role: data.role,
          name: data.name,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      })
      next.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))
      setUsers(next)
    })

    const unsubEvents = onSnapshot(
      query(collection(db, "certificateEvents"), orderBy("createdAt", "desc")),
      (snap) => {
        const next: CertificateEventRow[] = snap.docs.map((d) => {
          const data = d.data() as any
          return {
            id: d.id,
            title: data.title ?? "(untitled)",
            description: data.description,
            date: data.date,
            createdAt: data.createdAt,
            createdBy: data.createdBy ?? null,
          }
        })
        setEvents(next)
        setSelectedEventId((current) => (current || (next[0]?.id ?? "")))
      }
    )

    const unsubCertificates = onSnapshot(
      query(collection(db, "certificates"), orderBy("createdAt", "desc")),
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
      }
    )

    return () => {
      unsubUsers()
      unsubEvents()
      unsubCertificates()
    }
  }, [])

  const filteredCertificates = React.useMemo(() => {
    if (!selectedEventId) return certificates
    return certificates.filter((c) => c.eventId === selectedEventId)
  }, [certificates, selectedEventId])

  const eventsById = React.useMemo(() => {
    return new Map(events.map((ev) => [ev.id, ev]))
  }, [events])

  React.useEffect(() => {
    let cancelled = false

    async function run() {
      if (!downloadPayload) return
      if (!downloadRef.current) return

      try {
        const [{ toPng }] = await Promise.all([import("html-to-image")])
        const dataUrl = await toPng(downloadRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          skipFonts: shouldSkipFontEmbedding(),
        })

        if (cancelled) return
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `certificate-${downloadPayload.certificate.id}.png`
        a.click()
      } finally {
        if (!cancelled) {
          setDownloadPayload(null)
          setDownloadingId(null)
        }
      }
    }

    run().catch(() => {
      if (!cancelled) {
        setDownloadPayload(null)
        setDownloadingId(null)
      }
    })

    return () => {
      cancelled = true
    }
  }, [downloadPayload])

  async function downloadCertificatePng(certificate: CertificateRow) {
    const status = (certificate.status ?? "issued") as CertificateStatus
    if (status !== "issued") return
    if (downloadingId) return

    setDownloadingId(certificate.id)
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
      const origin = siteUrl && siteUrl.length ? siteUrl.replace(/\/$/, "") : safeOrigin()
      const certificateUrl = origin
        ? `${origin}/certificates/${encodeURIComponent(certificate.id)}`
        : ""

      let qrDataUrl: string | null = null
      if (certificateUrl) {
        const [{ default: QRCode }] = await Promise.all([import("qrcode")])
        qrDataUrl = await QRCode.toDataURL(certificateUrl, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 200,
        })
      }

      const event = certificate.eventId ? eventsById.get(certificate.eventId) ?? null : null

      setDownloadPayload({
        certificate,
        event,
        qrDataUrl,
        certificateUrl,
      })
    } catch {
      setDownloadingId(null)
    }
  }

  async function createEvent() {
    if (!adminUser) return
    const title = eventTitle.trim()
    if (!title) return

    setBusy("createEvent")
    try {
      const ref = doc(collection(db, "certificateEvents"))
      const batch = writeBatch(db)

      batch.set(
        ref,
        stripUndefinedDeep({
          title,
          description: eventDescription.trim() || undefined,
          date: eventDate ? new Date(`${eventDate}T00:00:00`) : undefined,
          createdAt: serverTimestamp(),
          createdBy: adminUser.uid,
        })
      )

      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: "certificateEvent.created",
        targetType: "certificateEvent",
        targetId: ref.id,
        targetLabel: title,
        metadata: { title },
      })

      await batch.commit()
      setEventTitle("")
      setEventDate("")
      setEventDescription("")
      setSelectedEventId(ref.id)
    } finally {
      setBusy(null)
    }
  }

  async function issueCertificate() {
    if (!adminUser) return
    if (!selectedEventId) return
    const name = recipientName.trim()
    if (!name) return

    setBusy("issue")
    try {
      const ref = doc(collection(db, "certificates"))
      const batch = writeBatch(db)

      batch.set(
        ref,
        stripUndefinedDeep({
          eventId: selectedEventId,
          recipientName: name,
          recipientEmail: recipientEmail.trim() || undefined,
          recipientUserId: recipientUserId.trim() || undefined,
          status: "issued",
          issuedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          createdBy: adminUser.uid,
        })
      )

      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: "certificate.issued",
        targetType: "user",
        targetId: recipientUserId.trim() || ref.id,
        targetLabel: recipientEmail.trim() || name,
        metadata: {
          certificateId: ref.id,
          eventId: selectedEventId,
          recipientName: name,
          recipientEmail: recipientEmail.trim() || undefined,
          recipientUserId: recipientUserId.trim() || undefined,
        },
      })

      await batch.commit()
      setRecipientName("")
      setRecipientEmail("")
      setRecipientUserId("")
      setLastIssuedId(ref.id)
    } finally {
      setBusy(null)
    }
  }

  async function revokeCertificate(certificate: CertificateRow) {
    if (!adminUser) return
    setBusy(`revoke:${certificate.id}`)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "certificates", certificate.id), {
        status: "revoked",
        revokedAt: serverTimestamp(),
      })

      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: "certificate.revoked",
        targetType: "user",
        targetId: certificate.recipientUserId ?? certificate.id,
        targetLabel: certificate.recipientEmail ?? certificate.recipientName,
        metadata: {
          certificateId: certificate.id,
          eventId: certificate.eventId,
        },
      })

      await batch.commit()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="fixed top-0" style={{ left: -99999 }} aria-hidden>
        {downloadPayload ? (
          <CertificateArtwork
            ref={downloadRef}
            recipientName={downloadPayload.certificate.recipientName || "—"}
            eventTitle={downloadPayload.event?.title || "Club Event"}
            eventDescription={downloadPayload.event?.description}
            dateText={formatCertificateDate(downloadPayload.event?.date)}
            certificateIdText={`BIUST-AI-2026-${downloadPayload.certificate.id}`}
            qrDataUrl={downloadPayload.qrDataUrl}
            status={downloadPayload.certificate.status === "revoked" ? "revoked" : "issued"}
            variant="fixed"
          />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>Create events and issue certificates.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create event</CardTitle>
            <CardDescription>Events group certificates (e.g., a workshop).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title"
            />
            <Input
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Event date (YYYY-MM-DD)"
            />
            <Textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Optional description"
            />
            <Button onClick={createEvent} disabled={!adminUser || busy === "createEvent" || !eventTitle.trim()}>
              Create event
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue certificate</CardTitle>
            <CardDescription>Supports external recipients by name/email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Event</div>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Select an event
                </option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>

            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Recipient name"
            />
            <Input
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Recipient email (optional)"
            />

            <div className="space-y-1">
              <div className="text-sm font-medium">Link to member (optional)</div>
              <Input
                list="member-users"
                value={recipientUserId}
                onChange={(e) => setRecipientUserId(e.target.value)}
                placeholder="Paste user UID or pick by email"
              />
              <datalist id="member-users">
                {users
                  .filter((u) => u.role === "member" || u.role === "admin")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email ?? u.id}
                    </option>
                  ))}
              </datalist>
              <p className="text-xs text-slate-500">
                Linking enables “My Certificates” in the portal.
              </p>
            </div>

            <Button
              onClick={issueCertificate}
              disabled={!adminUser || busy === "issue" || !selectedEventId || !recipientName.trim()}
            >
              Issue certificate
            </Button>

            {lastIssuedId && (
              <div className="rounded-md border bg-white p-3 text-sm">
                <div className="font-medium">Last issued</div>
                <div className="text-xs text-muted-foreground">ID: {lastIssuedId}</div>
                <Link
                  href={`/certificates/${lastIssuedId}`}
                  className="text-sm underline underline-offset-4"
                >
                  Open verification link
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Select an event to see its certificates.</CardDescription>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No events yet.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell className="font-medium">{ev.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(ev.date)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(ev.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issued certificates</CardTitle>
          <CardDescription>Each certificate has a public verification link.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No certificates yet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCertificates.map((c) => {
                  const isBusy = busy === `revoke:${c.id}`
                  const status = (c.status ?? "issued") as CertificateStatus
                  const isDownloading = downloadingId === c.id
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-medium">{c.recipientName}</div>
                        {(c.recipientEmail || c.recipientUserId) && (
                          <div className="text-xs text-muted-foreground">
                            {c.recipientEmail ? c.recipientEmail : null}
                            {c.recipientEmail && c.recipientUserId ? " • " : null}
                            {c.recipientUserId ? `UID: ${c.recipientUserId}` : null}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(c.issuedAt)}</TableCell>
                      <TableCell className="text-sm">
                        <Link href={`/certificates/${c.id}`} className="underline underline-offset-4">
                          View
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "issued" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!adminUser || isBusy || isDownloading}
                              onClick={() => downloadCertificatePng(c)}
                            >
                              Download PNG
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={!adminUser || isBusy || isDownloading}
                              onClick={() => revokeCertificate(c)}
                            >
                              Revoke
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
