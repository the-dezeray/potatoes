"use client"

import * as React from "react"
import { Trophy, Github, RefreshCw, AlertCircle, Lock } from "lucide-react"
import type { LeaderboardResponse, LeaderboardEntry } from "@/app/api/leaderboard/route"
import { useAuth } from "@/components/AuthContext"

// ── Helpers ───────────────────────────────────────────────────────────────────

const MEDALS = ["🥇", "🥈", "🥉"]
const MEDAL_LABELS = ["1st Place", "2nd Place", "3rd Place"]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function GitHubAvatar({
  username,
  size = 36,
  rank,
}: {
  username: string
  size?: number
  rank: number
}) {
  const [errored, setErrored] = React.useState(false)

  const ringColor =
    rank === 0
      ? "ring-[#fbd35a] ring-offset-[#fef9ed]"
      : rank === 1
      ? "ring-slate-300 ring-offset-white"
      : rank === 2
      ? "ring-orange-300 ring-offset-white"
      : "ring-slate-200 ring-offset-white"

  return (
    <div
      className={`relative shrink-0 rounded-full ring-2 ring-offset-2 overflow-hidden ${ringColor}`}
      style={{ width: size, height: size }}
    >
      {!errored ? (
        <img
          src={`https://github.com/${username}.png?size=${size * 2}`}
          alt={username}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        /* Fallback: initials */
        <div
          className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-bold text-xs"
        >
          {username.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { user, userDoc } = useAuth()
  const [data, setData] = React.useState<LeaderboardResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)

  const [joinUsername, setJoinUsername] = React.useState("")
  const [joinName, setJoinName] = React.useState("")
  const [joinStatus, setJoinStatus] = React.useState<{ ok: boolean; msg: string } | null>(null)
  const [joining, setJoining] = React.useState(false)

  const [privateUsername, setPrivateUsername] = React.useState("")
  const [privateStatus, setPrivateStatus] = React.useState<{ ok: boolean; msg: string } | null>(null)
  const [privateConnected, setPrivateConnected] = React.useState(false)
  const [privateLoading, setPrivateLoading] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d: LeaderboardResponse & { error?: string }) => {
        if (d.error) setError(d.error)
        else setData(d)
      })
      .catch(() => setError("Failed to load leaderboard data."))
      .finally(() => setLoading(false))
  }, [])

  React.useEffect(() => {
    if (userDoc?.githubUsername && !privateUsername) {
      setPrivateUsername(userDoc.githubUsername)
    }
  }, [userDoc, privateUsername])

  React.useEffect(() => {
    let cancelled = false

    async function loadStatus() {
      if (!user) {
        setPrivateConnected(false)
        setPrivateStatus(null)
        return
      }

      try {
        const idToken = await user.getIdToken()
        const res = await fetch("/api/github/oauth/status", {
          headers: { Authorization: `Bearer ${idToken}` },
        })
        const json = await res.json()
        if (cancelled) return
        if (res.ok) {
          setPrivateConnected(Boolean(json.connected))
          if (json.githubUsername && !privateUsername) {
            setPrivateUsername(json.githubUsername)
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err)
        }
      }
    }

    loadStatus()
    return () => {
      cancelled = true
    }
  }, [user, privateUsername])

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setJoining(true)
    setJoinStatus(null)
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: joinUsername.trim(), name: joinName.trim() }),
      })
      const json = await res.json()
      if (res.ok) {
        setJoinStatus({ ok: true, msg: "You're on the board! You'll appear within the hour." })
        setJoinUsername("")
        setJoinName("")
      } else {
        setJoinStatus({ ok: false, msg: json.error ?? "Something went wrong." })
      }
    } catch {
      setJoinStatus({ ok: false, msg: "Network error. Please try again." })
    } finally {
      setJoining(false)
    }
  }

  async function handlePrivateConnect() {
    if (!user) {
      setPrivateStatus({ ok: false, msg: "Please sign in to connect GitHub." })
      return
    }

    if (!privateUsername.trim()) {
      setPrivateStatus({ ok: false, msg: "Enter your GitHub username first." })
      return
    }

    setPrivateLoading(true)
    setPrivateStatus(null)
    try {
      const idToken = await user.getIdToken()
      const res = await fetch("/api/github/oauth/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          githubUsername: privateUsername.trim(),
          returnTo: "/leaderboard",
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setPrivateStatus({ ok: false, msg: json.error ?? "Unable to start GitHub OAuth." })
        return
      }

      if (json.url) {
        window.location.href = json.url
      }
    } catch (err) {
      console.error(err)
      setPrivateStatus({ ok: false, msg: "Network error. Please try again." })
    } finally {
      setPrivateLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 211, 90, 0.5), 4px 4px 0px 0px #1c1c1c; }
          50%       { box-shadow: 0 0 20px 6px rgba(251, 211, 90, 0.35), 4px 4px 0px 0px #1c1c1c; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes crown-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-5px) scale(1.15); }
          60%      { transform: translateY(-3px) scale(1.1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50%       { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        @keyframes rank-pop {
          0%   { opacity: 0; transform: scale(0.4); }
          70%  { transform: scale(1.15); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-float       { animation: float 3.2s ease-in-out infinite; }
        .animate-crown       { animation: crown-bounce 2.4s ease-in-out infinite; }
        .animate-pulse-glow  { animation: pulse-glow 2.5s ease-in-out infinite; }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #92400e 0%, #fbd35a 40%, #d97706 60%, #92400e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.8s linear infinite;
        }
        .sparkle-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #fbd35a;
          animation: sparkle 2s ease-in-out infinite;
        }

        .row-enter { animation: slide-in 0.4s ease both; }
        .rank-pop  { animation: rank-pop 0.5s cubic-bezier(.34,1.56,.64,1) both; }
        .fade-up   { animation: fade-up 0.5s ease both; }

        .silver-shimmer {
          background: linear-gradient(90deg, #475569 0%, #94a3b8 40%, #64748b 60%, #475569 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.4s linear infinite;
        }
        .bronze-shimmer {
          background: linear-gradient(90deg, #92400e 0%, #fb923c 40%, #c2410c 60%, #92400e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="force-light min-h-screen py-12 pt-30 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_left,#fff8e8_0%,#f9fcff_38%,#f5fbf9_62%,#fff7f1_100%)] text-slate-900">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className={mounted ? "fade-up" : "opacity-0"} style={{ animationDelay: "0ms" }}>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl bg-[#fbd35a] border-2 border-[#1c1c1c] flex items-center justify-center shrink-0 animate-pulse-glow"
                >
                  <Trophy className="w-5 h-5 text-[#1c1c1c]" strokeWidth={2} />
                </span>
                BIUST GitHub Leaderboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {data
                  ? `Top contributors · ${formatDate(data.window.from)} – ${formatDate(data.window.to)}`
                  : "Top contributors this month"}
                <span className="mx-2 text-slate-300">·</span>
                <span className="text-slate-400">by the BIUST Innovation Club</span>
              </p>
            </div>

            {data && (
              <p className="text-xs text-slate-400 shrink-0 fade-up" style={{ animationDelay: "100ms" }}>
                Updated {formatDate(data.generatedAt)}
              </p>
            )}
          </div>

          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-start">
            {/* ── Join Form ─────────────────────────────────────────────────── */}
            <div className="flex-1 rounded-xl border-2 border-[#1c1c1c] bg-white/90 shadow-[4px_4px_0px_0px_#1c1c1c] p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Add yourself to the leaderboard</h2>
              <form onSubmit={handleJoin} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:flex-nowrap">
                <input
                  type="text"
                  placeholder="GitHub username"
                  value={joinUsername}
                  onChange={(e) => setJoinUsername(e.target.value)}
                  required
                  className="min-w-0 flex-1 rounded-lg border-2 border-[#1c1c1c] px-3 py-2 text-sm outline-none focus:border-[#fbd35a] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Display name"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  required
                  className="min-w-0 flex-1 rounded-lg border-2 border-[#1c1c1c] px-3 py-2 text-sm outline-none focus:border-[#fbd35a] transition-colors"
                />
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full shrink-0 rounded-lg border-2 border-[#1c1c1c] bg-[#fbd35a] px-5 py-2 text-sm font-bold shadow-[2px_2px_0px_0px_#1c1c1c] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {joining ? "Adding…" : "Add me"}
                </button>
              </form>
              {joinStatus && (
                <p className={`mt-2 text-xs font-medium ${joinStatus.ok ? "text-green-700" : "text-red-600"}`}>
                  {joinStatus.msg}
                </p>
              )}
            </div>

            {/* ── Private Contributions Opt-in ─────────────────────────────── */}
            <div className="w-full max-w-xs rounded-lg border-2 border-[#1c1c1c] bg-white/90 shadow-[3px_3px_0px_0px_#1c1c1c] p-3 lg:ml-3 lg:mt-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#fbd35a] border-2 border-[#1c1c1c] flex items-center justify-center">
                    <Lock className="w-3 h-3 text-[#1c1c1c]" />
                  </div>
                  <h2 className="text-[11px] font-bold text-slate-900">Private contributions</h2>
                </div>
                <span className={`text-[10px] ${privateConnected ? "text-emerald-700" : "text-slate-500"}`}>
                  {privateConnected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="GitHub username"
                  value={privateUsername}
                  onChange={(e) => setPrivateUsername(e.target.value)}
                  className="min-w-0 flex-1 rounded-md border-2 border-[#1c1c1c] px-2 py-1.5 text-[11px] outline-none focus:border-[#fbd35a] transition-colors"
                />
                <button
                  type="button"
                  onClick={handlePrivateConnect}
                  disabled={privateLoading}
                  className="shrink-0 rounded-md border-2 border-[#1c1c1c] bg-[#1c1c1c] px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-[#2c2c2c] transition-colors disabled:opacity-60"
                >
                  {privateLoading ? "..." : privateConnected ? "Reconnect" : "Connect"}
                </button>
              </div>

              {privateStatus && (
                <p className={`mt-2 text-[10px] ${privateStatus.ok ? "text-emerald-700" : "text-red-600"}`}>
                  {privateStatus.msg}
                </p>
              )}
            </div>
          </div>

          {/* ── Top 3 Podium ────────────────────────────────────────────────── */}
          {data && data.results.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 0, 2].map((podiumRank) => {
                const entry = data.results[podiumRank]
                if (!entry) return null
                const isFirst = podiumRank === 0
                return (
                  <PodiumCard
                    key={entry.username}
                    entry={entry}
                    rank={podiumRank}
                    mounted={mounted}
                  />
                )
              })}
            </div>
          )}

          {/* ── Loading ─────────────────────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-24 text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading contributions…</span>
            </div>
          )}

          {/* ── Error ───────────────────────────────────────────────────────── */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2} />
              {error}
            </div>
          )}

          {/* ── Table ───────────────────────────────────────────────────────── */}
          {data && (
            <div className="rounded-xl border-2 border-[#1c1c1c] overflow-hidden shadow-[4px_4px_0px_0px_#1c1c1c] bg-white/90 backdrop-blur-sm">

              {/* Column headers */}
              <div className="hidden sm:grid sm:grid-cols-[3rem_2.5rem_1fr_6rem_5rem_5rem_6rem] items-center gap-3 px-5 py-3 bg-[#fbd35a] border-b-2 border-[#1c1c1c]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c] text-center">#</span>
                <span />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c]">Member</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c] text-center">Commits</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c] text-center">PRs</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c] text-center">Issues</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1c1c1c] text-center">Total</span>
              </div>

              {/* Rows */}
              {data.results.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-400">
                  No contributions found for this period.
                </div>
              ) : (
                data.results.map((entry, i) => (
                  <Row key={entry.username} entry={entry} rank={i} mounted={mounted} />
                ))
              )}
            </div>
          )}

          {/* ── Legend ──────────────────────────────────────────────────────── */}
          {data && data.results.length > 0 && (
            <p className="mt-4 text-xs text-slate-500 text-center">
              Contributions tracked via the GitHub GraphQL API · refreshed hourly
            </p>
          )}
        </div>
      </div>
    </>
  )
}

// ── Podium Card ───────────────────────────────────────────────────────────────

function PodiumCard({
  entry,
  rank,
  mounted,
}: {
  entry: LeaderboardEntry
  rank: number
  mounted: boolean
}) {
  const isFirst = rank === 0

  const cardStyles = {
    0: "bg-gradient-to-b from-[#fef9ed] to-[#fdf3d0] border-[#fbd35a] shadow-[3px_3px_0px_0px_#b45309]",
    1: "bg-gradient-to-b from-slate-50 to-slate-100 border-slate-300 shadow-[3px_3px_0px_0px_#64748b]",
    2: "bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200 shadow-[3px_3px_0px_0px_#c2410c]",
  }[rank] ?? "bg-white border-slate-200"

  const nameClass = {
    0: "animate-shimmer-text",
    1: "silver-shimmer",
    2: "bronze-shimmer",
  }[rank] ?? "text-slate-700"

  const delays = { 0: "200ms", 1: "100ms", 2: "300ms" }
  const delay = delays[rank as keyof typeof delays] ?? "0ms"

  return (
    <div
      className={`
        relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2
        ${cardStyles}
        ${mounted ? "fade-up" : "opacity-0"}
        ${isFirst ? "sm:-mt-3 pb-5" : "mt-2"}
      `}
      style={{ animationDelay: delay }}
    >
      {/* Floating crown for 1st */}
      {isFirst && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl animate-crown select-none">
          👑
        </div>
      )}

      {/* Sparkle dots for top 3 */}
      {rank < 3 && (
        <>
          <span className="sparkle-dot" style={{ top: "10%", left: "8%", animationDelay: "0s" }} />
          <span className="sparkle-dot" style={{ top: "15%", right: "10%", animationDelay: "0.7s" }} />
          <span className="sparkle-dot" style={{ bottom: "12%", left: "12%", animationDelay: "1.4s", width: 4, height: 4 }} />
        </>
      )}

      {/* Avatar */}
      <div className={`mt-2 ${isFirst ? "animate-float" : ""}`}>
        <GitHubAvatar username={entry.username} size={isFirst ? 64 : 52} rank={rank} />
      </div>

      {/* Medal */}
      <span className="text-xl leading-none rank-pop" style={{ animationDelay: delay }}>
        {MEDALS[rank]}
      </span>

      {/* Name */}
      <div className="text-center">
        <p className={`text-xs sm:text-sm font-bold leading-tight ${nameClass}`}>
          {entry.name}
        </p>
        <a
          href={`https://github.com/${entry.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-0.5 mt-0.5 transition-colors"
        >
          <Github className="w-2.5 h-2.5" />
          {entry.username}
        </a>
      </div>

      {/* Score */}
      <div
        className={`
          text-lg font-black tabular-nums
          ${rank === 0 ? "text-amber-700" : rank === 1 ? "text-slate-600" : "text-orange-700"}
        `}
      >
        {entry.total}
        <span className="text-[10px] font-normal ml-0.5 opacity-60">pts</span>
      </div>

      {/* Mini breakdown */}
      <div className="flex gap-2 text-[10px] text-slate-500 flex-wrap justify-center">
        <span><b className="text-slate-700">{entry.commits}</b> commits</span>
        <span><b className="text-[#134E8E]">{entry.pullRequests}</b> PRs</span>
        <span><b className="text-[#FF4400]">{entry.issues}</b> issues</span>
      </div>
    </div>
  )
}

// ── Row component ─────────────────────────────────────────────────────────────

function Row({
  entry,
  rank,
  mounted,
}: {
  entry: LeaderboardEntry
  rank: number
  mounted: boolean
}) {
  const isFirst = rank === 0
  // Stagger rows slightly
  const delay = `${Math.min(rank * 40 + 200, 800)}ms`

  return (
    <div
      className={[
        "grid grid-cols-[3rem_2.5rem_1fr] sm:grid-cols-[3rem_2.5rem_1fr_6rem_5rem_5rem_6rem]",
        "items-center gap-3 px-5 py-4",
        "border-b border-slate-100 last:border-0",
        "transition-colors hover:bg-slate-50",
        isFirst ? "bg-amber-50 hover:bg-amber-100/60" : "",
        mounted ? "row-enter" : "opacity-0",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ animationDelay: delay }}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-8">
        {rank < 3 ? (
          <span className="text-xl leading-none" role="img" aria-label={`Rank ${rank + 1}`}>
            {MEDALS[rank]}
          </span>
        ) : (
          <span className="text-sm font-bold text-slate-400">{rank + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <GitHubAvatar username={entry.username} size={32} rank={rank} />

      {/* Name + GitHub link */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-900 text-sm truncate">{entry.name}</span>
          {entry.error && (
            <span
              title={entry.error}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 shrink-0"
            >
              error
            </span>
          )}
        </div>
        <a
          href={`https://github.com/${entry.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors w-fit"
        >
          <Github className="w-3 h-3 shrink-0" strokeWidth={2} />
          {entry.username}
        </a>
        {/* Mobile stats */}
        <div className="flex items-center gap-3 mt-1.5 sm:hidden text-xs text-slate-500">
          <span><span className="font-semibold text-slate-800">{entry.commits}</span> commits</span>
          <span><span className="font-semibold text-[#134E8E]">{entry.pullRequests}</span> PRs</span>
          <span><span className="font-semibold text-[#FF4400]">{entry.issues}</span> issues</span>
          <span className="font-bold text-slate-900">{entry.total} total</span>
        </div>
      </div>

      {/* Commits — desktop */}
      <div className="hidden sm:flex justify-center">
        <span className="inline-block text-sm font-bold text-slate-800 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 tabular-nums">
          {entry.commits}
        </span>
      </div>

      {/* PRs — desktop */}
      <div className="hidden sm:flex justify-center">
        <span className="text-sm font-semibold text-[#134E8E] tabular-nums">
          {entry.pullRequests}
        </span>
      </div>

      {/* Issues — desktop */}
      <div className="hidden sm:flex justify-center">
        <span className="text-sm font-semibold text-[#FF4400] tabular-nums">
          {entry.issues}
        </span>
      </div>

      {/* Total — desktop */}
      <div className="hidden sm:flex justify-center">
        <span
          className={[
            "inline-block text-sm font-bold px-2.5 py-0.5 rounded-lg border tabular-nums",
            rank === 0 ? "bg-amber-100 border-amber-300 text-amber-800" :
            rank === 1 ? "bg-slate-100 border-slate-300 text-slate-700" :
            rank === 2 ? "bg-orange-50 border-orange-200 text-orange-700" :
                        "bg-white border-slate-200 text-slate-600",
          ].join(" ")}
        >
          {entry.total}
        </span>
      </div>
    </div>
  )
}