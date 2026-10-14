import type { Metadata } from "next";
import { Footer } from "@/components/footer"
import { executives, formerExecutives, members } from "@/lib/members-data"

export const metadata: Metadata = {
  title: "Meet the Team — BIUST Innovation Club Executives & Members",
  description:
    "Meet the BIUST Innovation Club team: President Desiree Chingwaru, Vice President Simeon Uden, Secretary Esabel, plus former executives and student members in Palapye, Botswana.",
  alternates: { canonical: "https://biustinnovation.com/members-view" },
  openGraph: {
    title: "Meet the Team — BIUST Innovation Club",
    description: "Current executives, former leaders, and student builders at BIUST, Botswana.",
    url: "https://biustinnovation.com/members-view",
  },
  robots: { index: true, follow: true },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1c1c1c] selection:bg-[#8ecfc8] font-sans">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-24 pb-12">
        <nav aria-label="Breadcrumb" className="text-xs text-[#6b6b6b] mb-4">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#1c1c1c] font-semibold">Team</li>
          </ol>
        </nav>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
          01. Our People
        </span>
        <h1 className="mt-2 text-4xl md:text-5xl font-medium tracking-tight leading-tight">
          Meet the team.
        </h1>
        <p className="mt-4 text-sm text-[#6b6b6b] max-w-md leading-relaxed">
          A collective of builders, designers, and problem-solvers pushing technology
          forward at BIUST, Palapye Botswana — led by President Desiree Chingwaru,
          Vice President Simeon Uden, and Secretary Esabel.
        </p>

        {/* count pill */}
        <div className="mt-6 inline-flex items-center gap-2 border-2 border-[#1c1c1c] bg-[#fbd35a] shadow-[4px_4px_0px_0px_#1c1c1c] rounded-full px-4 py-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0">
          <span className="text-xs font-bold font-mono">
            {executives.length + members.length} Total Members
          </span>
        </div>
      </section>

      {/* ── Executives ───────────────────────────────────────────────────── */}
      <section aria-labelledby="exec-board" className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 id="exec-board" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] whitespace-nowrap">
            Current Executive Board
          </h2>
          <div className="flex-1 h-[1px] bg-[#1c1c1c]/10" />
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 list-none">
          {executives.map((exec) => (
            <li
              key={exec.name}
              className="group relative overflow-hidden rounded-2xl border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c] bg-gray-200 aspect-square transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1c1c1c]"
            >
              <article className="w-full h-full">
                <img
                  src={exec.image}
                  alt={`${exec.name}, ${exec.role} of the BIUST Innovation Club`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#fbd35a] mb-0.5">
                    {exec.role}
                  </span>
                  <h3 className="text-sm font-bold leading-tight uppercase tracking-tight">{exec.name}</h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Former Executives ────────────────────────────────────────────── */}
      <section aria-labelledby="former-board" className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="flex items-center gap-4 mb-4">
          <h2 id="former-board" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] whitespace-nowrap">
            Former Executives
          </h2>
          <div className="flex-1 h-[1px] bg-[#1c1c1c]/10" />
        </div>
        <p className="text-xs text-[#6b6b6b] mb-6 max-w-xl">
          Past leaders who built the club — roles prefixed with “Former” for history.
          Full story on our <a href="/about" className="underline font-semibold">about page</a>.
        </p>

        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 list-none">
          {formerExecutives.map((exec) => (
            <li
              key={exec.name}
              className="relative overflow-hidden rounded-2xl border-2 border-[#1c1c1c]/20 bg-white aspect-square"
            >
              <article className="w-full h-full">
                <img
                  src={exec.image}
                  alt={`${exec.name}, ${exec.role} of the BIUST Innovation Club`}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#f4c3b3] mb-0.5">
                    {exec.role}
                  </span>
                  <h3 className="text-sm font-bold leading-tight uppercase tracking-tight">{exec.name}</h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Brutalist Separator ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8" aria-hidden="true">
        <div className="relative flex items-center">
          <div className="h-[2px] w-full bg-[#1c1c1c]/10"></div>
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-1">
             <div className="w-2 h-2 bg-[#1c1c1c] rotate-45"></div>
             <div className="w-2 h-2 bg-[#fbd35a] border border-[#1c1c1c] rotate-45"></div>
             <div className="w-2 h-2 bg-[#1c1c1c] rotate-45"></div>
          </div>
        </div>
      </div>

      {/* ── Members ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="general-assembly" className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="flex items-center gap-4 mb-8">
          <h2 id="general-assembly" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] whitespace-nowrap">
            General Assembly
          </h2>
          <div className="flex-1 h-[1px] bg-[#1c1c1c]/10" />
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 list-none">
          {members.map((m) => (
            <li
              key={m.name}
              className="group relative overflow-hidden rounded-xl border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] bg-gray-200 aspect-square transition-all hover:rotate-1 hover:scale-[1.02]"
            >
              <article className="w-full h-full">
                <img
                  src={m.image}
                  alt={`${m.name}, ${m.role} at BIUST Innovation Club`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/20 to-transparent flex flex-col justify-end p-3 text-white transition-all duration-300">
                  <h3 className="text-xs font-bold leading-tight">{m.name}</h3>
                  <span className="text-[9px] font-mono text-[#8ecfc8] mt-0.5 uppercase tracking-tighter">{m.role}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  )
}
