import { collection, doc, getDoc, getDocs, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/db"
import { decryptSecret } from "@/lib/crypto"
import { LEADERBOARD_USERS } from "@/lib/leaderboard-users"

export const revalidate = 3600 // 1 hour
export const runtime = "nodejs"

const GITHUB_GRAPHQL = "https://api.github.com/graphql"
const DEFAULT_ORG = "INNOVATION-CLUB-BIUST"

const PUBLIC_CONTRIBUTIONS_QUERY = `
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

const SEARCH_QUERY = `
  query Search($query: String!, $type: SearchType!) {
    search(query: $query, type: $type) {
      issueCount
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

type PrivateToken = {
  githubUsername: string
  tokenEnc: string
  tokenIv: string
  tokenTag: string
}

type SearchType = "ISSUE" | "COMMITS"

function formatSearchDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

async function searchCount(accessToken: string, query: string, type: SearchType): Promise<number> {
  if (type === "COMMITS") {
    const res = await fetch(`https://api.github.com/search/commits?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`)

    const json = await res.json()
    return Number(json.total_count ?? 0)
  }

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: { query, type },
    }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`GitHub API returned HTTP ${res.status}`)

  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GitHub GraphQL error")

  return Number(json.data?.search?.issueCount ?? 0)
}

async function fetchPublicContributions(
  accessToken: string,
  username: string,
  from: string,
  to: string
): Promise<LeaderboardEntry> {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PUBLIC_CONTRIBUTIONS_QUERY,
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

  return { username, name: username, commits, pullRequests, issues, total: commits + pullRequests + issues }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | null = null
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("timeout")), ms)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

async function loadCachedResults(cacheKey: string): Promise<LeaderboardResponse | null> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin")
    const snap = await adminDb.collection("leaderboard_cache").doc(cacheKey).get()
    if (!snap.exists) return null
    return snap.data() as LeaderboardResponse
  } catch (error) {
    console.warn("Leaderboard cache unavailable.", error)
    return null
  }
}

async function saveCachedResults(cacheKey: string, payload: LeaderboardResponse): Promise<void> {
  try {
    const { adminDb } = await import("@/lib/firebase-admin")
    await adminDb.collection("leaderboard_cache").doc(cacheKey).set(payload, { merge: true })
  } catch (error) {
    console.warn("Failed to save leaderboard cache.", error)
  }
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
  const fromDate = formatSearchDate(new Date(from))
  const toDate = formatSearchDate(new Date(to))

  const org = process.env.LEADERBOARD_ORG || DEFAULT_ORG
  const cacheKey = `${org}:${fromDate}:${toDate}`

  // ── Load any opted-in private tokens ─────────────────────────────────────
  const tokenMap = new Map<string, PrivateToken>()
  try {
    const { adminDb } = await import("@/lib/firebase-admin")
    const tokenSnapshot = await adminDb.collection("leaderboard_private_tokens").get()
    tokenSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as PrivateToken
      if (data?.githubUsername && data?.tokenEnc && data?.tokenIv && data?.tokenTag) {
        tokenMap.set(data.githubUsername.toLowerCase(), data)
      }
    })
  } catch (error) {
    console.warn("Private token lookup skipped; falling back to public-only data.", error)
  }

  // ── Fetch contributions for every member in parallel ──────────────────────
  const publicResultsPromise = Promise.all(
    allUsers.map(async ({ username, name }): Promise<LeaderboardEntry> => {
      try {
        const publicEntry = await fetchPublicContributions(token, username, from, to)
        return { ...publicEntry, name }
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

  const fullResultsPromise = Promise.all(
    allUsers.map(async ({ username, name }): Promise<LeaderboardEntry> => {
      const privateToken = tokenMap.get(username.toLowerCase())
      let accessToken = token
      if (privateToken) {
        try {
          accessToken = decryptSecret({
            cipherText: privateToken.tokenEnc,
            iv: privateToken.tokenIv,
            tag: privateToken.tokenTag,
          })
        } catch (error) {
          console.warn(`Failed to decrypt token for ${username}:`, error)
        }
      }

      try {
        if (!privateToken) {
          const publicEntry = await fetchPublicContributions(accessToken, username, from, to)
          return { ...publicEntry, name }
        }

        const commitOrgQuery = `author:${username} org:${org} author-date:${fromDate}..${toDate}`
        const commitUserQuery = `author:${username} user:${username} author-date:${fromDate}..${toDate}`
        const prOrgQuery = `type:pr author:${username} org:${org} created:${fromDate}..${toDate}`
        const prUserQuery = `type:pr author:${username} user:${username} created:${fromDate}..${toDate}`
        const issueOrgQuery = `type:issue author:${username} org:${org} created:${fromDate}..${toDate}`
        const issueUserQuery = `type:issue author:${username} user:${username} created:${fromDate}..${toDate}`

        const [
          commitOrg,
          commitUser,
          prOrg,
          prUser,
          issueOrg,
          issueUser,
        ] = await Promise.all([
          searchCount(accessToken, commitOrgQuery, "COMMITS"),
          searchCount(accessToken, commitUserQuery, "COMMITS"),
          searchCount(accessToken, prOrgQuery, "ISSUE"),
          searchCount(accessToken, prUserQuery, "ISSUE"),
          searchCount(accessToken, issueOrgQuery, "ISSUE"),
          searchCount(accessToken, issueUserQuery, "ISSUE"),
        ])

        const commits = commitOrg + commitUser
        const pullRequests = prOrg + prUser
        const issues = issueOrg + issueUser

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

  fullResultsPromise
    .then((results) => {
      const payload: LeaderboardResponse = {
        window: { from, to },
        generatedAt: new Date().toISOString(),
        results: results.slice().sort((a, b) => b.total - a.total || b.commits - a.commits),
      }
      return saveCachedResults(cacheKey, payload)
    })
    .catch((error) => {
      console.warn("Failed to compute full leaderboard results.", error)
    })

  let results: LeaderboardEntry[]
  try {
    results = await withTimeout(fullResultsPromise, 5000)
  } catch (error) {
    console.warn("Leaderboard timed out; returning public-only results.", error)
    const cached = await loadCachedResults(cacheKey)
    results = cached?.results ?? (await publicResultsPromise)
  }

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
