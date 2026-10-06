"use client"

import * as React from "react"

import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/firestore-types"

export type ReceiptArtworkVariant = "responsive" | "fixed"

export type ReceiptArtworkProps = {
  receiptNo: string
  memberName: string
  memberEmail?: string
  label: string
  amount: number
  currency?: string
  method: PaymentMethod
  reference?: string
  paidDateText: string
  receiptUrl?: string
  qrDataUrl?: string | null
  status?: "paid" | "voided"
  variant?: ReceiptArtworkVariant
  className?: string
}

export function formatPula(amount: number, currency = "BWP") {
  try {
    return `${currency === "BWP" ? "P" : currency + " "}${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  } catch {
    return `P${amount}`
  }
}

export const ReceiptArtwork = React.forwardRef<HTMLDivElement, ReceiptArtworkProps>(
  function ReceiptArtwork(
    {
      receiptNo,
      memberName,
      memberEmail,
      label,
      amount,
      currency = "BWP",
      method,
      reference,
      paidDateText,
      receiptUrl,
      qrDataUrl,
      status = "paid",
      variant = "responsive",
      className,
    },
    ref
  ) {
    const sizeStyle: React.CSSProperties =
      variant === "fixed" ? { width: "8.5in", height: "5.5in" } : { width: "100%", aspectRatio: "8.5 / 5.5" }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...sizeStyle,
          backgroundColor: "white",
          position: "relative",
          boxSizing: "border-box",
          border: "2px solid #1c1c1c",
          overflow: "hidden",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 32 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/mini-logo.png" alt="Club logo" style={{ height: 48, width: "auto" }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.5 }}>Club Payment Receipt</div>
                <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 2 }}>
                  Official record — verify by QR
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Receipt No</div>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "monospace" }}>{receiptNo}</div>
              </div>
              <img src="/biust-logo.webp" alt="BIUST logo" style={{ height: 48, width: "auto" }} />
            </div>
          </div>

          <div style={{ borderTop: "2px dashed #1c1c1c", margin: "16px 0" }} />

          {/* body */}
          <div style={{ display: "flex", gap: 24, flex: 1 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Received from</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{memberName || "—"}</div>
                {memberEmail && <div style={{ fontSize: 12, color: "#555" }}>{memberEmail}</div>}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Payment for</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Method</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{PAYMENT_METHOD_LABELS[method] ?? method}</div>
                  {reference && <div style={{ fontSize: 12, color: "#333", fontFamily: "monospace" }}>Tx: {reference}</div>}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Date paid</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{paidDateText}</div>
                </div>
              </div>
              {receiptUrl && (
                <div style={{ fontSize: 10, color: "#888", wordBreak: "break-all", marginTop: "auto" }}>
                  Verify: {receiptUrl}
                </div>
              )}
            </div>

            <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Amount received</div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  background: "#1c1c1c",
                  color: "white",
                  padding: "6px 18px",
                  borderRadius: 10,
                }}
              >
                {formatPula(amount, currency)}
              </div>
              <div style={{ width: 130, height: 130, border: "1px solid #ddd", padding: 6, background: "white" }}>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Receipt verification QR" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#f5f5f5" }} />
                )}
              </div>
              <div style={{ fontSize: 10, color: "#666" }}>Scan to verify</div>
            </div>
          </div>

          {status === "voided" && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(127,29,29,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  border: "8px solid #dc2626",
                  padding: "12px 28px",
                  color: "#dc2626",
                  fontWeight: 900,
                  fontSize: 56,
                  transform: "rotate(-12deg)",
                  opacity: 0.35,
                  textTransform: "uppercase",
                }}
              >
                Voided
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
