"use client"

import * as React from "react"

import { Montserrat, Playfair_Display, Great_Vibes } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
})

export type CertificateArtworkVariant = "responsive" | "fixed"

export type CertificateArtworkProps = {
  recipientName: string
  eventTitle: string
  eventDescription?: string
  dateText: string
  certificateIdText: string
  qrDataUrl?: string | null
  status?: "issued" | "revoked"
  variant?: CertificateArtworkVariant
  className?: string
}

const BACKGROUND_SVG_DATA_URL =
  "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54-24c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM57 75c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-18-1c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm17-8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM45 53c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM31 20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm40 5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM21 39c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm50 48c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM25 80c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm59-17c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM48 6c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM16 59c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM79 27c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM95 43c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM53 95c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM69 52c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM7 71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM10 32c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm57-12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 10c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm80 2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM95 22c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM44 80c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM25 23c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm71 59c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM9 93c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm60-61c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%23b8860b' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"

const PRIMARY_COLOR = "#0d1b3e"
const SECONDARY_COLOR = "#b8860b"
const TEXT_COLOR = "#2c3e50"

export const CertificateArtwork = React.forwardRef<HTMLDivElement, CertificateArtworkProps>(
  function CertificateArtwork(
    {
      recipientName,
      eventTitle,
      eventDescription,
      dateText,
      certificateIdText,
      qrDataUrl,
      status = "issued",
      variant = "responsive",
      className,
    },
    ref
  ) {
    const recipientNameRef = React.useRef<HTMLDivElement | null>(null)
    const [recipientFontSize, setRecipientFontSize] = React.useState(48)

    const fitRecipientName = React.useCallback(() => {
      const element = recipientNameRef.current
      if (!element) return

      const maxFontSize = 48
      const minFontSize = 18

      // Reset before measuring so we can shrink from a known baseline.
      element.style.fontSize = `${maxFontSize}px`

      // scrollWidth accounts for the actual rendered width of the text.
      const availableWidth = element.clientWidth
      const contentWidth = element.scrollWidth

      if (!availableWidth || !contentWidth) {
        setRecipientFontSize(maxFontSize)
        return
      }

      if (contentWidth <= availableWidth) {
        setRecipientFontSize(maxFontSize)
        return
      }

      const ratio = availableWidth / contentWidth
      const nextSize = Math.max(minFontSize, Math.floor(maxFontSize * ratio * 0.98))
      setRecipientFontSize(nextSize)
    }, [])

    React.useLayoutEffect(() => {
      fitRecipientName()

      const handleResize = () => fitRecipientName()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [fitRecipientName, recipientName, variant])

    const sizeStyle: React.CSSProperties =
      variant === "fixed"
        ? { width: "11.2in", height: "7.9in" }
        : { width: "100%", aspectRatio: "11.2 / 7.9" }

    return (
      <div
        ref={ref}
        className={className}
        style={{
          ...sizeStyle,
          backgroundColor: "white",
          position: "relative",
          boxSizing: "border-box",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          border: `20px solid ${PRIMARY_COLOR}`,
          backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%), url(\"${BACKGROUND_SVG_DATA_URL}\")`,
          overflow: "hidden",
        }}
      >
        <div
          className={montserrat.className}
          style={{
            border: `2px solid ${SECONDARY_COLOR}`,
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: 10,
              left: 10,
              right: 10,
              bottom: 10,
              border: `1px solid ${SECONDARY_COLOR}`,
            }}
          />

          <div style={{ marginBottom: 20 }}>
            <img
              src="/certificates/club-logo2.png"
              alt="BIUST Innovation Club Logo"
              style={{ height: 140, width: "auto", display: "block" }}
            />
          </div>

          <div>
            <h1
              className={playfair.className}
              style={{
                fontSize: 60,
                fontWeight: 700,
                color: PRIMARY_COLOR,
                margin: 0,
                lineHeight: 1,
              }}
            >
              Certificate
            </h1>
            <div
              style={{
                fontSize: 18,
                textTransform: "uppercase",
                letterSpacing: 6,
                color: SECONDARY_COLOR,
                marginTop: 5,
                fontWeight: 400,
              }}
            >
              of Participation
            </div>
          </div>

          <p
            className={playfair.className}
            style={{
              margin: "25px 0 10px 0",
              fontSize: 18,
              fontStyle: "italic",
              color: TEXT_COLOR,
            }}
          >
            This recognition is officially conferred upon
          </p>

          <div
            className={greatVibes.className}
            ref={recipientNameRef}
            style={{
              fontSize: recipientFontSize,
              color: PRIMARY_COLOR,
              marginBottom: 10,
              padding: "0 50px",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "visible",
              lineHeight: 1.1,
              background: `linear-gradient(to right, transparent, ${SECONDARY_COLOR}, transparent)`,
              backgroundSize: "100% 2px",
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
            }}
          >
            {recipientName || "—"}
          </div>

          <div
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: "80%",
              margin: "15px auto",
              color: TEXT_COLOR,
              fontWeight: 400,
            }}
          >
            <span>
              for demonstrating exceptional dedication and successfully participating in the
            </span>
            <span
              style={{
                fontWeight: 700,
                color: PRIMARY_COLOR,
                display: "block",
                fontSize: 20,
                marginTop: 5,
              }}
            >
              {eventTitle || "Club Event"}
            </span>
            <div
              style={{
                fontSize: 14,
                opacity: 0.8,
                marginTop: 6,
              }}
            >
              {eventDescription ||
                "Mastering AI-assisted development, workflow automation, and professional portfolio engineering."}
            </div>
          </div>

          <div style={{ position: "relative", width: "100%" }}>
            <p
              style={{
                marginTop: 5,
                fontWeight: 700,
                color: PRIMARY_COLOR,
                letterSpacing: 2,
                fontSize: 16,
                textTransform: "uppercase",
              }}
            >
              {dateText}
            </p>
            <div
              className="pointer-events-none"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: "calc(100% + 10px)",
                margin: 0,
                zIndex: 6,
              }}
            >
              <img
                src="/certificates/seal.webp"
                alt="BIUST Seal"
                style={{ width: 105, height: "auto", display: "block" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "90%",
              marginTop: "auto",
              paddingBottom: 20,
            }}
          >
            <div style={{ width: 250, textAlign: "center" }}>
              <div style={{ height: 60, position: "relative" }}>
                <img
                  src="/certificates/president-signature.webp"
                  alt="President Signature"
                  style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", maxHeight: 80, width: "auto" }}
                />
              </div>
              <div style={{ borderTop: `2px solid ${PRIMARY_COLOR}`, marginBottom: 10, position: "relative", zIndex: 2 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: PRIMARY_COLOR }}>Phemelo Moloi</div>
              <div style={{ fontSize: 11, color: SECONDARY_COLOR }}>Club President</div>
            </div>

            <div style={{ width: 250, textAlign: "center" }}>
              <div style={{ height: 60, position: "relative" }}>
                <img
                  src="/certificates/workshop-lead-signature.webp"
                  alt="Workshop Lead Signature"
                  style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", maxHeight: 80, width: "auto" }}
                />
              </div>
              <div style={{ borderTop: `2px solid ${PRIMARY_COLOR}`, marginBottom: 10, position: "relative", zIndex: 2 }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: PRIMARY_COLOR }}>
                Desiree Chingwraru
              </div>
              <div style={{ fontSize: 11, color: SECONDARY_COLOR }}>Workshop Lead</div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              width: 80,
              height: 80,
              backgroundColor: "white",
              padding: 5,
              border: "1px solid #ddd",
            }}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "#f8f8f8" }} />
            )}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 40,
              fontSize: 10,
              color: "#999",
              letterSpacing: 1,
            }}
          >
            ID: {certificateIdText}
          </div>

          {status === "revoked" && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(127, 29, 29, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  border: "8px solid #dc2626",
                  padding: "16px 32px",
                  color: "#dc2626",
                  fontWeight: 900,
                  fontSize: 64,
                  transform: "rotate(-12deg)",
                  opacity: 0.35,
                  textTransform: "uppercase",
                }}
              >
                Revoked
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
