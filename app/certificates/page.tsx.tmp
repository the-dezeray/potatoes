"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CertificatesLandingPage() {
  const router = useRouter()
  const [certificateId, setCertificateId] = useState("")

  const normalizedId = useMemo(() => certificateId.trim(), [certificateId])

  function onOpen() {
    if (!normalizedId) return
    router.push(`/certificates/${encodeURIComponent(normalizedId)}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Scan a QR code or paste a certificate ID to view it.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Paste certificate ID"
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpen()
              }}
            />
            <Button onClick={onOpen} disabled={!normalizedId}>
              Open
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
