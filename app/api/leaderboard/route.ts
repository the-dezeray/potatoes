import { LEADERBOARD_USERS } from "@/lib/leaderboard-users"

/**
 * Cache the GitHub API response for one week so GitHub's 5 000 req/hr rate
 * limit is never a concern, regardless of how many visitors load the page.
 */
export const revalidate = 604800 // 7 days in seconds

const GITHUB_GRAPHQL = "https://api.github.com/graphql"

/**
 * GraphQL query — variables keep login values out of the query string,
 * preventing any risk of query injection from future dynamic sources.
 */
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
      {
        error:
          "GITHUB_TOKEN is not configured. Add it to your environment variables.",
      },
      { status: 500 }
    )
  }

  // ── Build the current-month window in UTC ─────────────────────────────────
  const now = new Date()
  const from = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  ).toISOString()
  const to = now.toISOString()

  // ── Fetch contributions for each member in parallel ───────────────────────
  const results = await Promise.all(
    LEADERBOARD_USERS.map(async ({ username, name }): Promise<LeaderboardEntry> => {
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
          // Honour the module-level `revalidate` setting explicitly on the
          // individual fetch so Next.js caches each response accordingly.
          next: { revalidate: 604800 },
        })

        if (!res.ok) {
          throw new Error(`GitHub API returned HTTP ${res.status}`)
        }

        const json = await res.json()

        if (json.errors?.length) {
          throw new Error(json.errors[0]?.message ?? "GitHub GraphQL error")
        }

        if (!json.data?.user) {
          throw new Error(`GitHub user "${username}" not found`)
        }

        const c = json.data.user.contributionsCollection
        const commits: number = c.totalCommitContributions ?? 0
        const pullRequests: number = c.totalPullRequestContributions ?? 0
        const issues: number = c.totalIssueContributions ?? 0

        return {
          username,
          name,
          commits,
          pullRequests,
          issues,
          total: commits + pullRequests + issues,
        }
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

  // ── Sort: highest total first; break ties by commits ─────────────────────
  results.sort((a, b) => b.total - a.total || b.commits - a.commits)

  const body: LeaderboardResponse = {
    window: { from, to },
    generatedAt: new Date().toISOString(),
    results,
  }

  return Response.json(body)
}
