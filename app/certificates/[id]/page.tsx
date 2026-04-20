"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"

import { doc, getDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"
import type { CertificateDoc, CertificateEventDoc } from "@/lib/firestore-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CertificateArtwork } from "@/components/certificate-artwork"

type ViewerState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "revoked"; certificate: CertificateDoc; event: CertificateEventDoc | null }
  | { kind: "issued"; certificate: CertificateDoc; event: CertificateEventDoc | null }

function safeOrigin() {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

function formatEventDate(value: any) {
  try {
    const d = value?.toDate?.() ? value.toDate() : value instanceof Date ? value : null
    return d
      ? new Date(d)
          .toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
          .toUpperCase()
      : null
  } catch {
    return null
  }
}

function shouldSkipFontEmbedding() {
  if (typeof navigator === "undefined") return false
  return /firefox/i.test(navigator.userAgent)
}

export default function CertificateViewerPage() {
  const params = useParams<{ id: string }>()
  const certificateId = decodeURIComponent(params.id)

  const [state, setState] = useState<ViewerState>({ kind: "loading" })
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const exportRef = useRef<HTMLDivElement | null>(null)

  const certificateUrl = useMemo(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    const origin = siteUrl && siteUrl.length ? siteUrl.replace(/\/$/, "") : safeOrigin()
    return origin ? `${origin}/certificates/${encodeURIComponent(certificateId)}` : ""
  }, [certificateId])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ kind: "loading" })
      const certSnap = await getDoc(doc(db, "certificates", certificateId))
      if (!certSnap.exists()) {
        if (!cancelled) setState({ kind: "not_found" })
        return
      }

      const certificate = certSnap.data() as CertificateDoc
      let event: CertificateEventDoc | null = null
      if (certificate.eventId) {
        const eventSnap = await getDoc(doc(db, "certificateEvents", certificate.eventId))
        if (eventSnap.exists()) event = eventSnap.data() as CertificateEventDoc
      }

      const status = certificate.status ?? "issued"
      if (!cancelled) {
        if (status === "revoked") setState({ kind: "revoked", certificate, event })
        else setState({ kind: "issued", certificate, event })
      }
    }

    load().catch(() => {
      if (!cancelled) setState({ kind: "not_found" })
    })

    return () => {
      cancelled = true
    }
  }, [certificateId])

  useEffect(() => {
    let cancelled = false

    async function makeQr() {
      if (!certificateUrl) return
      const [{ default: QRCode }] = await Promise.all([import("qrcode")])
      const dataUrl = await QRCode.toDataURL(certificateUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 200,
      })
      if (!cancelled) setQrDataUrl(dataUrl)
    }

    makeQr().catch(() => {
      if (!cancelled) setQrDataUrl(null)
    })

    return () => {
      cancelled = true
    }
  }, [certificateUrl])

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
    a.download = `certificate-${certificateId}.png`
    a.click()
  }

  async function downloadPdf() {
    if (!exportRef.current) return
    const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")])
    const png = await toPng(exportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      skipFonts: shouldSkipFontEmbedding(),
    })

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    pdf.addImage(png, "PNG", 0, 0, pageWidth, pageHeight)
    pdf.save(`certificate-${certificateId}.pdf`)
  }

  const title =
    state.kind === "issued" || state.kind === "revoked"
      ? state.event?.title || "Certificate"
      : "Certificate"

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-slate-600">ID: {certificateId}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPng} disabled={state.kind !== "issued"}>
              Download PNG
            </Button>
            <Button onClick={downloadPdf} disabled={state.kind !== "issued"}>
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.kind === "loading" && (
            <p className="text-sm text-slate-600">Loading certificate…</p>
          )}
          {state.kind === "not_found" && (
            <p className="text-sm text-slate-600">Certificate not found.</p>
          )}
          {state.kind === "revoked" && (
            <div className="space-y-2">
              <p className="text-sm text-red-700 font-semibold">This certificate has been revoked.</p>
              <p className="text-sm text-slate-600">Contact the club admins if you believe this is a mistake.</p>
            </div>
          )}

          {(state.kind === "issued" || state.kind === "revoked") && (
            <>
              <Separator />
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <CertificateArtwork
                    recipientName={state.certificate.recipientName || "—"}
                    eventTitle={state.event?.title || "Club Event"}
                    eventDescription={state.event?.description}
                    dateText={formatEventDate(state.event?.date) || "APRIL 18, 2026"}
                    certificateIdText={`BIUST-AI-2026-${certificateId}`}
                    qrDataUrl={qrDataUrl}
                    status={state.kind === "revoked" ? "revoked" : "issued"}
                    variant="responsive"
                    className="w-full"
                  />

                  <div className="fixed top-0" style={{ left: -99999 }} aria-hidden>
                    <CertificateArtwork
                      ref={exportRef}
                      recipientName={state.certificate.recipientName || "—"}
                      eventTitle={state.event?.title || "Club Event"}
                      eventDescription={state.event?.description}
                      dateText={formatEventDate(state.event?.date) || "APRIL 18, 2026"}
                      certificateIdText={`BIUST-AI-2026-${certificateId}`}
                      qrDataUrl={qrDataUrl}
                      status={state.kind === "revoked" ? "revoked" : "issued"}
                      variant="fixed"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-72 space-y-2">
                  <div className="text-sm font-semibold">Verify</div>
                  <p className="text-xs text-slate-600 wrap-break-word">{certificateUrl || ""}</p>
                  <p className="text-xs text-slate-500">
                    This page is the official verification record.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
