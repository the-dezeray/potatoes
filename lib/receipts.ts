import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore"

import { db } from "@/lib/firebase"
import { stripUndefinedDeep } from "@/lib/firestore-clean"
import type { PaymentMethod } from "@/lib/firestore-types"

export function safeOrigin() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

export function receiptUrlFor(id: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const origin = siteUrl && siteUrl.length ? siteUrl.replace(/\/$/, "") : safeOrigin()
  return origin ? `${origin}/receipts/${encodeURIComponent(id)}` : ""
}

export function formatPaidDate(value: any) {
  try {
    const d = value?.toDate?.() ? value.toDate() : value instanceof Date ? value : null
    return d ? new Date(d).toLocaleDateString() : "—"
  } catch {
    return "—"
  }
}

export async function makeQrDataUrl(text: string): Promise<string | null> {
  if (!text) return null
  const { default: QRCode } = await import("qrcode")
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 1, width: 200 })
}

export type RecordPaymentInput = {
  userId?: string
  memberName: string
  memberEmail?: string
  label: string
  amount: number
  method: PaymentMethod
  reference?: string
  notes?: string
  paidAt: Date
  actorUid: string
  actorEmail?: string
}

/** Allocate next receipt number (R-YYYY-NNNN) and write the payment + audit atomically. */
export async function recordPayment(input: RecordPaymentInput): Promise<{ id: string; receiptNo: string }> {
  const year = input.paidAt.getFullYear()
  const counterRef = doc(db, "counters", "receipts")

  return runTransaction(db, async (tx) => {
    const counterSnap = await tx.get(counterRef)
    const lastSeq = (counterSnap.data()?.lastSeq as number) ?? 0
    const nextSeq = lastSeq + 1
    const receiptNo = `R-${year}-${String(nextSeq).padStart(4, "0")}`

    const paymentRef = doc(db, "payments", `${receiptNo}`)
    const existing = await tx.get(paymentRef)
    if (existing.exists()) {
      throw new Error(`Receipt ${receiptNo} already exists. Please retry.`)
    }

    tx.set(counterRef, { lastSeq: nextSeq, updatedAt: serverTimestamp() }, { merge: true })
    tx.set(
      paymentRef,
      stripUndefinedDeep({
        userId: input.userId || undefined,
        memberName: input.memberName,
        memberEmail: input.memberEmail || undefined,
        label: input.label,
        amount: input.amount,
        currency: "BWP",
        method: input.method,
        reference: input.reference || undefined,
        notes: input.notes || undefined,
        receiptNo,
        status: "paid",
        paidAt: input.paidAt,
        createdAt: serverTimestamp(),
        createdBy: input.actorUid,
      })
    )

    // audit inside the same transaction (manual set — batchAudit needs a WriteBatch)
    const auditRef = doc(db, "auditLogs", `${Date.now()}-${receiptNo}`)
    tx.set(
      auditRef,
      stripUndefinedDeep({
        actorUid: input.actorUid,
        actorEmail: input.actorEmail ?? undefined,
        action: "payment.recorded",
        targetType: "payment",
        targetId: paymentRef.id,
        targetLabel: `${receiptNo} — ${input.memberName}`,
        metadata: { receiptNo, label: input.label, amount: input.amount, method: input.method },
        createdAt: serverTimestamp(),
      })
    )

    return { id: paymentRef.id, receiptNo }
  })
}

export async function getPaymentOnce(id: string) {
  const snap = await getDoc(doc(db, "payments", id))
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null
}
