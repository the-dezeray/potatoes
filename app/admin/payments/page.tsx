"use client"

import * as React from "react"
import Link from "next/link"

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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReceiptArtwork, formatPula } from "@/components/receipt-artwork"
import { db } from "@/lib/firebase"
import { batchAudit } from "@/lib/audit"
import {
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
  type PaymentRow,
  type PaymentStatus,
  type UserRow,
} from "@/lib/firestore-types"
import { formatPaidDate, makeQrDataUrl, receiptUrlFor, recordPayment } from "@/lib/receipts"

const METHODS: PaymentMethod[] = ["cash", "orange_money"]

const STATUS_VARIANT: Record<PaymentStatus, "secondary" | "destructive"> = {
  paid: "secondary",
  voided: "destructive",
}

function shouldSkipFontEmbedding() {
  if (typeof navigator === "undefined") return false
  return /firefox/i.test(navigator.userAgent)
}

export default function AdminPaymentsPage() {
  const { user: adminUser } = useAuth()

  const [users, setUsers] = React.useState<UserRow[]>([])
  const [payments, setPayments] = React.useState<PaymentRow[]>([])

  const [labelFilter, setLabelFilter] = React.useState("")
  const [methodFilter, setMethodFilter] = React.useState<"" | PaymentMethod>("")
  const [search, setSearch] = React.useState("")

  const [busy, setBusy] = React.useState<string | null>(null)
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)
  const downloadRef = React.useRef<HTMLDivElement | null>(null)
  const [downloadPayload, setDownloadPayload] = React.useState<{
    payment: PaymentRow
    qrDataUrl: string | null
    receiptUrl: string
  } | null>(null)

  // record-payment form
  const [memberQuery, setMemberQuery] = React.useState("")
  const [selectedUserId, setSelectedUserId] = React.useState("")
  const [memberName, setMemberName] = React.useState("")
  const [memberEmail, setMemberEmail] = React.useState("")
  const [label, setLabel] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [method, setMethod] = React.useState<PaymentMethod>("cash")
  const [reference, setReference] = React.useState("")
  const [paidDate, setPaidDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [lastReceiptId, setLastReceiptId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const next: UserRow[] = snap.docs.map((d) => {
        const data = d.data() as any
        return { id: d.id, email: data.email, role: data.role, name: data.name }
      })
      next.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))
      setUsers(next)
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
            notes: data.notes,
            receiptNo: data.receiptNo ?? d.id,
            status: data.status ?? "paid",
            paidAt: data.paidAt,
            createdAt: data.createdAt,
            createdBy: data.createdBy ?? null,
            voidedAt: data.voidedAt,
          }
        })
        setPayments(next)
      }
    )
    return () => {
      unsubUsers()
      unsubPayments()
    }
  }, [])

  // offscreen PNG export (same pattern as certificates page)
  React.useEffect(() => {
    let cancelled = false
    async function run() {
      if (!downloadPayload || !downloadRef.current) return
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
        a.download = `receipt-${downloadPayload.payment.receiptNo}.png`
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

  const labels = React.useMemo(
    () => Array.from(new Set(payments.map((p) => p.label).filter(Boolean))).sort(),
    [payments]
  )

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return payments.filter((p) => {
      if (labelFilter && p.label !== labelFilter) return false
      if (methodFilter && p.method !== methodFilter) return false
      if (!q) return true
      return (
        p.memberName.toLowerCase().includes(q) ||
        (p.memberEmail ?? "").toLowerCase().includes(q) ||
        p.receiptNo.toLowerCase().includes(q) ||
        (p.reference ?? "").toLowerCase().includes(q)
      )
    })
  }, [payments, labelFilter, methodFilter, search])

  const totals = React.useMemo(() => {
    const paid = filtered.filter((p) => (p.status ?? "paid") === "paid")
    return {
      count: paid.length,
      total: paid.reduce((s, p) => s + (Number(p.amount) || 0), 0),
    }
  }, [filtered])

  const memberMatches = React.useMemo(() => {
    const q = memberQuery.trim().toLowerCase()
    const pool = users.filter((u) => u.role === "member" || u.role === "admin")
    if (!q) return pool.slice(0, 8)
    return pool
      .filter(
        (u) =>
          (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q)
      )
      .slice(0, 8)
  }, [users, memberQuery])

  function pickMember(u: UserRow) {
    setSelectedUserId(u.id)
    setMemberQuery(u.email ?? u.name ?? u.id)
    setMemberName(u.name ?? "")
    setMemberEmail(u.email ?? "")
  }

  async function downloadPng(payment: PaymentRow) {
    if (downloadingId) return
    setDownloadingId(payment.id)
    try {
      const receiptUrl = receiptUrlFor(payment.id)
      const qrDataUrl = await makeQrDataUrl(receiptUrl)
      setDownloadPayload({ payment, qrDataUrl, receiptUrl })
    } catch {
      setDownloadingId(null)
    }
  }

  async function handleRecord() {
    if (!adminUser || busy) return
    const name = (selectedUserId
      ? users.find((u) => u.id === selectedUserId)?.name || memberName
      : memberName
    ).trim()
    const email = (selectedUserId
      ? users.find((u) => u.id === selectedUserId)?.email || memberEmail
      : memberEmail
    ).trim()
    const cleanLabel = label.trim()
    const cleanAmount = Number(amount)
    const cleanRef = reference.trim()

    if (!name || !cleanLabel || !Number.isFinite(cleanAmount) || cleanAmount <= 0) return
    if (method === "orange_money" && !cleanRef) return

    setBusy("record")
    try {
      const { id } = await recordPayment({
        userId: selectedUserId || undefined,
        memberName: name,
        memberEmail: email || undefined,
        label: cleanLabel,
        amount: Math.round(cleanAmount * 100) / 100,
        method,
        reference: cleanRef || undefined,
        paidAt: paidDate ? new Date(`${paidDate}T00:00:00`) : new Date(),
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
      })
      setLastReceiptId(id)
      setSelectedUserId("")
      setMemberQuery("")
      setMemberName("")
      setMemberEmail("")
      setAmount("")
      setReference("")
    } catch (e) {
      console.error("record payment failed", e)
    } finally {
      setBusy(null)
    }
  }

  async function deletePayment(payment: PaymentRow) {
    if (!adminUser || busy) return
    if (
      !confirm(
        `Permanently delete receipt ${payment.receiptNo}? This cannot be undone. Void instead if you just want to invalidate it.`
      )
    )
      return
    setBusy(`delete:${payment.id}`)
    try {
      const batch = writeBatch(db)
      batch.delete(doc(db, "payments", payment.id))
      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: "payment.deleted",
        targetType: "payment",
        targetId: payment.id,
        targetLabel: `${payment.receiptNo} — ${payment.memberName}`,
        metadata: { receiptNo: payment.receiptNo, label: payment.label, amount: payment.amount },
      })
      await batch.commit()
    } finally {
      setBusy(null)
    }
  }

  async function voidPayment(payment: PaymentRow) {
    if (!adminUser || busy) return
    if (!confirm(`Void receipt ${payment.receiptNo}? The QR will verify as VOIDED.`)) return
    setBusy(`void:${payment.id}`)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, "payments", payment.id), {
        status: "voided",
        voidedAt: serverTimestamp(),
      })
      batchAudit(batch, {
        actorUid: adminUser.uid,
        actorEmail: adminUser.email ?? undefined,
        action: "payment.voided",
        targetType: "payment",
        targetId: payment.id,
        targetLabel: `${payment.receiptNo} — ${payment.memberName}`,
        metadata: { receiptNo: payment.receiptNo, label: payment.label, amount: payment.amount },
      })
      await batch.commit()
    } finally {
      setBusy(null)
    }
  }

  const formValid =
    (selectedUserId || memberName.trim()) &&
    label.trim() &&
    Number(amount) > 0 &&
    (method === "cash" || reference.trim())

  return (
    <div className="space-y-6">
      {/* offscreen render target for PNG export */}
      <div className="fixed top-0" style={{ left: -99999 }} aria-hidden>
        {downloadPayload ? (
          <ReceiptArtwork
            ref={downloadRef}
            receiptNo={downloadPayload.payment.receiptNo}
            memberName={downloadPayload.payment.memberName}
            memberEmail={downloadPayload.payment.memberEmail}
            label={downloadPayload.payment.label}
            amount={Number(downloadPayload.payment.amount) || 0}
            currency={downloadPayload.payment.currency ?? "BWP"}
            method={downloadPayload.payment.method}
            reference={downloadPayload.payment.reference}
            paidDateText={formatPaidDate(downloadPayload.payment.paidAt)}
            receiptUrl={downloadPayload.receiptUrl}
            qrDataUrl={downloadPayload.qrDataUrl}
            status={downloadPayload.payment.status ?? "paid"}
            variant="fixed"
          />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments &amp; Receipts</CardTitle>
          <CardDescription>
            Record cash or Orange Money payments. Each record issues a verifiable receipt — the QR
            links to a public verification page, so a forged PDF won&apos;t verify.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
            <CardDescription>Admin records money received offline, then shares the receipt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Member</div>
              <Input
                value={memberQuery}
                onChange={(e) => {
                  setMemberQuery(e.target.value)
                  setSelectedUserId("")
                }}
                placeholder="Search members by name or email"
              />
              {memberQuery.trim() && !selectedUserId && memberMatches.length > 0 && (
                <div className="rounded-md border max-h-40 overflow-y-auto">
                  {memberMatches.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => pickMember(u)}
                      className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-medium">{u.name ?? u.email ?? u.id}</span>
                      {u.email && u.name && <span className="text-xs text-muted-foreground">{u.email}</span>}
                    </button>
                  ))}
                </div>
              )}
              {!selectedUserId && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input value={memberName} onChange={(e) => setMemberName(e.target.value)} placeholder="Name (if not a member)" />
                  <Input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="Email (optional)" />
                </div>
              )}
              {selectedUserId && (
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span>
                    {users.find((u) => u.id === selectedUserId)?.name ?? memberName} —{" "}
                    <span className="text-muted-foreground">
                      {users.find((u) => u.id === selectedUserId)?.email ?? memberEmail}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => {
                      setSelectedUserId("")
                      setMemberQuery("")
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium">Payment for (fee label)</div>
                <Input
                  list="payment-labels"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder='e.g. "2026 Membership"'
                />
                <datalist id="payment-labels">
                  {labels.map((l) => (
                    <option key={l} value={l} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Amount (Pula)</div>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100" inputMode="decimal" />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="text-sm font-medium">Method</div>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {PAYMENT_METHOD_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {method === "orange_money" ? "Orange Money TxID (required)" : "Reference (optional)"}
                </div>
                <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder={method === "orange_money" ? "e.g. OM12345678" : "e.g. cash received by …"} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Date paid</div>
              <Input type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
            </div>

            <Button onClick={handleRecord} disabled={!adminUser || busy === "record" || !formValid}>
              {busy === "record" ? "Recording…" : "Record & issue receipt"}
            </Button>
            {!formValid && (
              <p className="text-xs text-muted-foreground">
                Fill member, fee label, amount{method === "orange_money" ? ", and Orange Money TxID" : ""}.
              </p>
            )}

            {lastReceiptId && (
              <div className="rounded-md border bg-white p-3 text-sm">
                <div className="font-medium">Receipt issued</div>
                <Link href={`/receipts/${encodeURIComponent(lastReceiptId)}`} className="text-sm underline underline-offset-4">
                  Open verification link
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Totals</CardTitle>
            <CardDescription>Reflects the current filters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Receipts</span>
              <span className="text-2xl font-bold">{totals.count}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Collected</span>
              <span className="text-2xl font-bold">{formatPula(totals.total)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, receipt no, TxID" />
              <div className="flex gap-2">
                <select
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                  className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">All fees</option>
                  {labels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value as "" | PaymentMethod)}
                  className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Cash + Orange</option>
                  {METHODS.map((m) => (
                    <option key={m} value={m}>
                      {PAYMENT_METHOD_LABELS[m]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipts</CardTitle>
          <CardDescription>Each receipt has a public verification link via QR.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    No receipts yet. Record the first payment above.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const status = (p.status ?? "paid") as PaymentStatus
                  const voidBusy = busy === `void:${p.id}`
                  const deleteBusy = busy === `delete:${p.id}`
                  const isDownloading = downloadingId === p.id
                  const rowBusy = voidBusy || deleteBusy
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-mono text-sm font-medium">{p.receiptNo}</div>
                        <div className="text-xs text-muted-foreground">{formatPaidDate(p.paidAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{p.memberName}</div>
                        {(p.memberEmail || p.reference) && (
                          <div className="text-xs text-muted-foreground">
                            {p.memberEmail}
                            {p.memberEmail && p.reference ? " • " : ""}
                            {p.reference ? `Tx: ${p.reference}` : ""}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{p.label}</TableCell>
                      <TableCell className="text-sm font-medium whitespace-nowrap">
                        {formatPula(Number(p.amount) || 0, p.currency ?? "BWP")}
                      </TableCell>
                      <TableCell className="text-sm">{PAYMENT_METHOD_LABELS[p.method] ?? p.method}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex justify-end gap-2">
                          <Button asChild size="sm" variant="ghost" className="h-8">
                            <Link href={`/receipts/${encodeURIComponent(p.id)}`}>Verify</Link>
                          </Button>
                          {status === "paid" && (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-8"
                                disabled={!adminUser || rowBusy || isDownloading}
                                onClick={() => downloadPng(p)}
                              >
                                {isDownloading ? "…" : "PNG"}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="h-8"
                                disabled={!adminUser || rowBusy || isDownloading}
                                onClick={() => voidPayment(p)}
                              >
                                Void
                              </Button>
                            </>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={!adminUser || rowBusy || isDownloading}
                            onClick={() => deletePayment(p)}
                            title="Permanently delete this receipt"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
          <p className="pt-3 text-xs text-muted-foreground">
            Security rules needed: public <span className="font-mono">get</span> on{" "}
            <span className="font-mono">payments/{"{id}"}</span> for verification,{" "}
            <span className="font-mono">list/create/update</span> admin-only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
