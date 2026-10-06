"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"

import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { PaymentDoc } from "@/lib/firestore-types"
import { PAYMENT_METHOD_LABELS } from "@/lib/firestore-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptArtwork, formatPula } from "@/components/receipt-artwork"
import { formatPaidDate } from "@/lib/receipts"

type ViewerState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "voided"; payment: PaymentDoc }
  | { kind: "paid"; payment: PaymentDoc }

function shouldSkipFontEmbedding() {
  if (typeof navigator === "undefined") return false
  return /firefox/i.test(navigator.userAgent)
}

export default function ReceiptViewerPage() {
  const params = useParams<{ id: string }>()
  const receiptId = decodeURIComponent(params.id)

  const [state, setState] = useState<ViewerState>({ kind: "loading" })
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const exportRef = useRef<HTMLDivElement | null>(null)

  const receiptUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    const origin =
      siteUrl && siteUrl.length ? siteUrl.replace(/\/$/, "") : window.location.origin
    return origin ? `${origin}/receipts/${encodeURIComponent(receiptId)}` : ""
  }, [receiptId])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setState({ kind: "loading" })
      try {
        const snap = await getDoc(doc(db, "payments", receiptId))
        if (!snap.exists()) {
          if (!cancelled) setState({ kind: "not_found" })
          return
        }
        const payment = snap.data() as PaymentDoc
        if (!cancelled) {
          setState(
            payment.status === "voided"
              ? { kind: "voided", payment }
              : { kind: "paid", payment }
          )
        }
      } catch {
        if (!cancelled) setState({ kind: "not_found" })
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [receiptId])

  useEffect(() => {
    let cancelled = false
    async function makeQr() {
      if (!receiptUrl) return
      try {
        const { default: QRCode } = await import("qrcode")
        const dataUrl = await QRCode.toDataURL(receiptUrl, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 200,
        })
        if (!cancelled) setQrDataUrl(dataUrl)
      } catch {
        if (!cancelled) setQrDataUrl(null)
      }
    }
    makeQr()
    return () => {
      cancelled = true
    }
  }, [receiptUrl])

  async function downloadPng() {
    if (!exportRef.current) return
    const [{ toPng }] = await Promise.all([import("html-to-image")])
    const dataUrl = await toPng(exportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      skipFonts: shouldSkipFontEmbedding(),
    })
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `receipt-${receiptId}.png`
    a.click()
  }

  const payment =
    state.kind === "paid" || state.kind === "voided" ? state.payment : null

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1c1c1c] pb-16 pt-24 px-4 md:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#6b6b6b] mb-4">
            Receipt verification
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
            Official <span className="text-black/50 uppercase text-3xl">Record.</span>
          </h1>
        </div>

        <Card className="bg-white border-2 border-[#1c1c1c] shadow-[8px_8px_0_#1c1c1c] rounded-[2rem] overflow-hidden p-0 gap-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#1c1c1c] bg-[#EDF9F7] px-6 py-6 md:px-8">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {payment ? `Receipt ${payment.receiptNo ?? receiptId}` : "Receipt"}
              </CardTitle>
              <p className="text-sm font-medium text-slate-800 mt-1 break-all">ID: {receiptId}</p>
            </div>
            <Button
              variant="outline"
              onClick={downloadPng}
              disabled={state.kind !== "paid"}
              className="bg-white border-2 border-[#1c1c1c] font-bold"
            >
              Download PNG
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            {state.kind === "loading" && <p className="text-sm font-medium">Loading receipt…</p>}
            {state.kind === "not_found" && (
              <div className="space-y-2 bg-[#FDF0EC] border-2 border-[#C00707] p-4 rounded-xl">
                <p className="text-sm text-[#C00707] font-bold">Receipt not found.</p>
                <p className="text-sm">This receipt ID does not exist in official records — treat any PDF with this ID as forged.</p>
              </div>
            )}
            {state.kind === "voided" && (
              <div className="space-y-2 bg-[#FDF0EC] border-2 border-[#C00707] p-4 rounded-xl">
                <p className="text-sm text-[#C00707] font-bold">This receipt has been VOIDED.</p>
                <p className="text-sm">It is no longer valid proof of payment. Contact club admins if this is a mistake.</p>
              </div>
            )}
            {state.kind === "paid" && (
              <div className="rounded-xl bg-emerald-50 border-2 border-emerald-600 p-4">
                <p className="text-sm text-emerald-800 font-bold">✓ VALID — this receipt is genuine.</p>
              </div>
            )}

            {payment && (
              <>
                <ReceiptArtwork
                  receiptNo={payment.receiptNo ?? receiptId}
                  memberName={payment.memberName}
                  memberEmail={payment.memberEmail}
                  label={payment.label}
                  amount={Number(payment.amount) || 0}
                  currency={payment.currency ?? "BWP"}
                  method={payment.method}
                  reference={payment.reference}
                  paidDateText={formatPaidDate(payment.paidAt)}
                  receiptUrl={receiptUrl}
                  qrDataUrl={qrDataUrl}
                  status={state.kind === "voided" ? "voided" : "paid"}
                  variant="responsive"
                />
                <div className="fixed top-0" style={{ left: -99999 }} aria-hidden>
                  <ReceiptArtwork
                    ref={exportRef}
                    receiptNo={payment.receiptNo ?? receiptId}
                    memberName={payment.memberName}
                    memberEmail={payment.memberEmail}
                    label={payment.label}
                    amount={Number(payment.amount) || 0}
                    currency={payment.currency ?? "BWP"}
                    method={payment.method}
                    reference={payment.reference}
                    paidDateText={formatPaidDate(payment.paidAt)}
                    receiptUrl={receiptUrl}
                    qrDataUrl={qrDataUrl}
                    status={state.kind === "voided" ? "voided" : "paid"}
                    variant="fixed"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs uppercase tracking-widest text-slate-500">Amount</div>
                    <div className="font-bold">{formatPula(Number(payment.amount) || 0, payment.currency ?? "BWP")}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs uppercase tracking-widest text-slate-500">Method</div>
                    <div className="font-bold">{PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}</div>
                    {payment.reference && <div className="text-xs font-mono">Tx: {payment.reference}</div>}
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs uppercase tracking-widest text-slate-500">Fee</div>
                    <div className="font-bold">{payment.label}</div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">
                  This page is the official verification record. A PDF or screenshot alone is not proof.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
