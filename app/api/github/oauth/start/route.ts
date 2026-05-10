import { NextResponse } from "next/server"
import crypto from "crypto"

import { adminAuth, adminDb } from "@/lib/firebase-admin"

export const runtime = "nodejs"

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
const OAUTH_SCOPE = "read:user repo"

function isValidUsername(username: string) {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)
}

export async function POST(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("authorization") ?? ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const decoded = await adminAuth.verifyIdToken(token)
    const uid = decoded.uid

    const { githubUsername, returnTo } = await request.json()
    const username = (githubUsername ?? "").trim()
    const safeReturnTo =
      typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/leaderboard"

    if (!username || !isValidUsername(username)) {
      return NextResponse.json({ error: "A valid GitHub username is required." }, { status: 400 })
    }

    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
    const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI
    const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET

    const missing = [
      !clientId ? "GITHUB_OAUTH_CLIENT_ID" : null,
      !clientSecret ? "GITHUB_OAUTH_CLIENT_SECRET" : null,
      !redirectUri ? "GITHUB_OAUTH_REDIRECT_URI" : null,
    ].filter(Boolean)

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `GitHub OAuth is not configured. Missing: ${missing.join(", ")}.` },
        { status: 500 }
      )
    }

    const resolvedClientId = clientId as string
    const resolvedRedirectUri = redirectUri as string

    const state = crypto.randomBytes(32).toString("hex")

    await adminDb.collection("github_oauth_states").doc(state).set({
      uid,
      githubUsername: username,
      returnTo: safeReturnTo,
      createdAt: new Date().toISOString(),
    })

    const url = new URL(GITHUB_OAUTH_URL)
    url.searchParams.set("client_id", resolvedClientId)
    url.searchParams.set("redirect_uri", resolvedRedirectUri)
    url.searchParams.set("scope", OAUTH_SCOPE)
    url.searchParams.set("state", state)

    return NextResponse.json({ url: url.toString() })
  } catch (error) {
    console.error("GitHub OAuth start failed:", error)
    return NextResponse.json({ error: "Unable to start GitHub OAuth." }, { status: 500 })
  }
}
