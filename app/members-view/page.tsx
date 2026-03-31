import { Footer } from "@/components/footer"
import { executives, members } from "@/lib/members-data"

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1c1c1c] selection:bg-[#8ecfc8] font-sans">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pt-24 pb-12">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b]">
          01. Our People
        </span>
        <h1 className="mt-2 text-4xl md:text-5xl font-medium tracking-tight leading-tight">
          Meet the team.
        </h1>
        <p className="mt-4 text-sm text-[#6b6b6b] max-w-md leading-relaxed">
          A collective of builders, designers, and problem-solvers pushing technology
          forward at BIUST.
        </p>

        {/* count pill */}
        <div className="mt-6 inline-flex items-center gap-2 border-2 border-[#1c1c1c] bg-[#fbd35a] shadow-[4px_4px_0px_0px_#1c1c1c] rounded-full px-4 py-1.5 transition-transform hover:-translate-y-0.5 active:translate-y-0">
          <span className="text-xs font-bold font-mono">
            {executives.length + members.length} Total Members
          </span>
        </div>
      </section>

      {/* ── Executives ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] whitespace-nowrap">
            Executive Board
          </span>
          <div className="flex-1 h-[1px] bg-[#1c1c1c]/10" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {executives.map((exec) => (
            <div
              key={exec.name}
              className="group relative overflow-hidden rounded-2xl border-2 border-[#1c1c1c] shadow-[4px_4px_0px_0px_#1c1c1c] bg-gray-200 aspect-square transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1c1c1c]"
            >
              <img
                src={exec.image}
                alt={exec.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#fbd35a] mb-0.5">
                  {exec.role}
                </span>
                <h4 className="text-sm font-bold leading-tight uppercase tracking-tight">{exec.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Brutalist Separator ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
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
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-24">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6b6b6b] whitespace-nowrap">
            General Assembly
          </span>
          <div className="flex-1 h-[1px] bg-[#1c1c1c]/10" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {members.map((m) => (
            <div
              key={m.name}
              className="group relative overflow-hidden rounded-xl border-2 border-[#1c1c1c] shadow-[3px_3px_0px_0px_#1c1c1c] bg-gray-200 aspect-square transition-all hover:rotate-1 hover:scale-[1.02]"
            >
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/20 to-transparent flex flex-col justify-end p-3 text-white transition-all duration-300">
                <h4 className="text-xs font-bold leading-tight">{m.name}</h4>
                <span className="text-[9px] font-mono text-[#8ecfc8] mt-0.5 uppercase tracking-tighter">{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}