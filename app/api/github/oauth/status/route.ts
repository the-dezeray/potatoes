import { NextResponse } from "next/server"

import { adminAuth, adminDb } from "@/lib/firebase-admin"

export const runtime = "nodejs"

export async function GET(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization") ?? ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    const docSnap = await adminDb.collection("leaderboard_private_tokens").doc(uid).get()
    if (!docSnap.exists) {
      return NextResponse.json({ connected: false })
    }

    const data = docSnap.data() as { githubUsername?: string }
    return NextResponse.json({
      connected: true,
      githubUsername: data.githubUsername ?? null,
    })
  } catch (error) {
    console.error("GitHub OAuth status failed:", error)
    return NextResponse.json({ error: "Unable to read OAuth status." }, { status: 500 })
  }
}
