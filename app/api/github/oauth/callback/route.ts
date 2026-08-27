import { NextResponse } from "next/server"

import { adminDb } from "@/lib/firebase-admin"
import { encryptSecret } from "@/lib/crypto"

export const runtime = "nodejs"

const TOKEN_URL = "https://github.com/login/oauth/access_token"
const MAX_STATE_AGE_MS = 10 * 60 * 1000

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code || !state) {
    return NextResponse.json({ error: "Missing OAuth parameters." }, { status: 400 })
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
  const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 500 })
  }

  const stateRef = adminDb.collection("github_oauth_states").doc(state)
  const stateSnap = await stateRef.get()

  if (!stateSnap.exists) {
    return NextResponse.json({ error: "OAuth state not found." }, { status: 400 })
  }

  const stateData = stateSnap.data() as {
    uid: string
    githubUsername: string
    returnTo?: string
    createdAt?: string
  }

  const createdAt = stateData.createdAt ? new Date(stateData.createdAt).getTime() : 0
  if (!createdAt || Date.now() - createdAt > MAX_STATE_AGE_MS) {
    await stateRef.delete()
    return NextResponse.json({ error: "OAuth state expired." }, { status: 400 })
  }

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  })

  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok || !tokenJson.access_token) {
    return NextResponse.json({ error: "Failed to fetch GitHub access token." }, { status: 400 })
  }

  const encrypted = encryptSecret(tokenJson.access_token)

  await adminDb.collection("leaderboard_private_tokens").doc(stateData.uid).set(
    {
      uid: stateData.uid,
      githubUsername: stateData.githubUsername,
      tokenEnc: encrypted.cipherText,
      tokenIv: encrypted.iv,
      tokenTag: encrypted.tag,
      scope: tokenJson.scope ?? null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  )

  await adminDb.collection("users").doc(stateData.uid).set(
    {
      githubUsername: stateData.githubUsername,
      leaderboardPrivateOptIn: true,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  await stateRef.delete()

  const redirect = stateData.returnTo ?? "/leaderboard"
  return NextResponse.redirect(new URL(redirect, request.url))
}
