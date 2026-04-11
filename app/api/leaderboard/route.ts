import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/db"
import { LEADERBOARD_USERS } from "@/lib/leaderboard-users"

export const revalidate = 3600 // 1 hour

const GITHUB_GRAPHQL = "https://api.github.com/graphql"

const CONTRIBUTIONS_QUERY = `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }
`

export interface LeaderboardEntry {
  username: string
  name: string
  commits: number
  pullRequests: number
  issues: number
  /** commits + pullRequests + issues */
  total: number
  /** Present only when the individual GitHub lookup failed */
  error?: string
}

export interface LeaderboardResponse {
  window: { from: string; to: string }
  generatedAt: string
  results: LeaderboardEntry[]
}

export async function GET(): Promise<Response> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return Response.json(
      { error: "GITHUB_TOKEN is not configured. Add it to your environment variables." },
      { status: 500 }
    )
  }

  // ── Merge static members with anyone who self-registered via Firestore ─────
  let allUsers = [...LEADERBOARD_USERS]
  try {
    const snapshot = await getDocs(collection(db, "leaderboard_users"))
    const staticSet = new Set(LEADERBOARD_USERS.map((u) => u.username.toLowerCase()))
    snapshot.docs.forEach((d) => {
      const { username, name } = d.data() as { username: string; name: string }
      if (!staticSet.has(username.toLowerCase())) {
        allUsers.push({ username, name })
      }
    })
  } catch {
    // Firestore unavailable — fall back to the static list silently
  }

  // ── Build the current-month window in UTC ─────────────────────────────────
  const now = new Date()
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
  const to = now.toISOString()

  // ── Fetch contributions for every member in parallel ──────────────────────
  const results = await Promise.all(
    allUsers.map(async ({ username, name }): Promise<LeaderboardEntry> => {
      try {
        const res = await fetch(GITHUB_GRAPHQL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: CONTRIBUTIONS_QUERY,
            variables: { login: username, from, to },
          }),
          next: { revalidate: 3600 },
        })

        if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`)

        const json = await res.json()
        if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GitHub GraphQL error")
        if (!json.data?.user) throw new Error(`GitHub user "${username}" not found`)

        const c = json.data.user.contributionsCollection
        const commits: number = c.totalCommitContributions ?? 0
        const pullRequests: number = c.totalPullRequestContributions ?? 0
        const issues: number = c.totalIssueContributions ?? 0

        return { username, name, commits, pullRequests, issues, total: commits + pullRequests + issues }
      } catch (err) {
        return {
          username,
          name,
          commits: 0,
          pullRequests: 0,
          issues: 0,
          total: 0,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    })
  )

  results.sort((a, b) => b.total - a.total || b.commits - a.commits)

  return Response.json({
    window: { from, to },
    generatedAt: new Date().toISOString(),
    results,
  } satisfies LeaderboardResponse)
}

// ── Self-registration ──────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json()
    const username: string = (body.username ?? "").trim()
    const name: string = (body.name ?? "").trim()

    if (!username || !name) {
      return Response.json({ error: "GitHub username and display name are required." }, { status: 400 })
    }

    // Basic GitHub username validation
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
      return Response.json({ error: "That doesn't look like a valid GitHub username." }, { status: 400 })
    }

    // Check for duplicates in Firestore
    const docRef = doc(db, "leaderboard_users", username.toLowerCase())
    const existing = await getDoc(docRef)
    if (existing.exists()) {
      return Response.json({ error: "That username is already on the leaderboard." }, { status: 409 })
    }

    // Also check the static list
    const inStatic = LEADERBOARD_USERS.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )
    if (inStatic) {
      return Response.json({ error: "That username is already on the leaderboard." }, { status: 409 })
    }

    // Verify the GitHub user actually exists
    const ghRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    })
    if (!ghRes.ok) {
      return Response.json({ error: "GitHub user not found. Double-check your username." }, { status: 400 })
    }

    await setDoc(docRef, { username, name, addedAt: serverTimestamp() })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
